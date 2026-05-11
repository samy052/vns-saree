const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const { sequelize } = require('../config/db');
const EmailService = require('../services/EmailService');

class OrderController {
  async createOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const { 
        customer_name, customer_email, address, city, pincode, phone, 
        total_amount, items, coupon_code 
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

      const order = await Order.create({
        customer_name,
        customer_email,
        address,
        city,
        pincode,
        phone,
        total_amount: final_total,
        coupon_code,
        discount_amount
      }, { transaction: t });

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });

      await t.commit();

      // Send confirmation email (async)
      EmailService.sendOrderConfirmation(order, items);

      res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: error.message });
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [OrderItem]
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new OrderController();
