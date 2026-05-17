const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const { sequelize } = require('../config/db');
const EmailService = require('../services/EmailService');
const ShipRocketService = require('../services/ShipRocketService');

class OrderController {
  async createOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const { 
        customer_name, customer_email, address, city, state, pincode, phone, 
        total_amount, items, coupon_code, wallet_discount 
      } = req.body;

      let discount_amount = 0;
      let final_total = total_amount;

      if (coupon_code) {
        const Coupon = require('../models/Coupon');
        const coupon = await Coupon.findOne({ where: { code: coupon_code, is_active: true } });
        if (coupon) {
          // Double check validity (simple check here)
          if (coupon.discount_type === 'percentage') {
            discount_amount = (total_amount * coupon.discount_percent) / 100;
            if (coupon.max_discount_amount) {
              discount_amount = Math.min(discount_amount, coupon.max_discount_amount);
            }
          } else {
            discount_amount = coupon.discount_amount;
          }
          final_total = total_amount - discount_amount;
          
          // Increment usage
          await coupon.increment('usage_count', { by: 1, transaction: t });
        }
      }

      // Check if this is the customer's first order for referral reward
      const previousOrderCount = await Order.count({ where: { customer_email }, transaction: t });

      const final_wallet_discount = Number(wallet_discount || 0);
      if (final_wallet_discount > 0) {
        const Customer = require('../models/Customer');
        const customer = await Customer.findOne({ where: { email: customer_email }, transaction: t });
        if (!customer) {
          throw new Error("Customer not found for wallet discount");
        }
        if (Number(customer.wallet_balance) < final_wallet_discount) {
          throw new Error("Insufficient wallet balance");
        }
        await customer.decrement('wallet_balance', { by: final_wallet_discount, transaction: t });
      }

      const order = await Order.create({
        customer_name,
        customer_email,
        address,
        city,
        state: state || 'Uttar Pradesh',
        pincode,
        phone,
        total_amount: final_total - final_wallet_discount,
        coupon_code,
        discount_amount,
        wallet_discount: final_wallet_discount
      }, { transaction: t });

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        product_name: item.name || item.product_name
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });

      // Referral Reward Logic (Reward User A 100rs on User B's first order)
      if (previousOrderCount === 0) {
        const Customer = require('../models/Customer');
        const customer = await Customer.findOne({ where: { email: customer_email }, transaction: t });
        if (customer && customer.referred_by) {
          // Give 100rs to the referrer
          await Customer.increment('wallet_balance', { 
            by: 100, 
            where: { id: customer.referred_by }, 
            transaction: t 
          });
        }
      }

      await t.commit();

      // ── Fire & forget: email confirmation ────────────────────────────────────
      EmailService.sendOrderConfirmation(order, items);

      // ── Fire & forget: push to ShipRocket (never blocks customer response) ──
      (async () => {
        try {
          const srItems = items.map((item, idx) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name || item.product_name || `Product ${idx + 1}`,
          }));

          const srResult = await ShipRocketService.createOrder({
            order: { ...order.toJSON(), state: state || 'Uttar Pradesh' },
            items: srItems,
          });

          console.log(`[ShipRocket] ✅ Order #${order.id} pushed → SR Order: ${srResult.order_id}, Shipment: ${srResult.shipment_id}`);
        } catch (srErr) {
          // Log but never crash the main order flow
          console.error(`[ShipRocket] ⚠️  Order #${order.id} push failed:`, srErr?.response?.data || srErr.message);
        }
      })();

      res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: error.message });
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await Order.findAll({ include: [OrderItem] });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ── Get all orders for a customer email ─────────────────────────────────────
  async getOrdersByEmail(req, res) {
    try {
      const { email } = req.params;
      const orders = await Order.findAll({
        where: { customer_email: email },
        include: [OrderItem],
        order: [['createdAt', 'DESC']],
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ── Live tracking via ShipRocket AWB / SR Order ID ──────────────────────────
  async trackOrder(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findByPk(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      // Try AWB first, fall back to SR order ID
      if (order.shiprocket_awb) {
        const data = await ShipRocketService.trackByAWB(order.shiprocket_awb);
        return res.status(200).json({ source: 'awb', tracking: data });
      }

      if (order.shiprocket_order_id) {
        const data = await ShipRocketService.trackByOrderId(order.shiprocket_order_id);
        return res.status(200).json({ source: 'order_id', tracking: data });
      }

      return res.status(200).json({ source: 'none', message: 'Shipment not yet dispatched' });
    } catch (error) {
      console.error('[Track] Error:', error?.response?.data || error.message);
      res.status(500).json({ message: 'Tracking unavailable', detail: error.message });
    }
  }
}

module.exports = new OrderController();