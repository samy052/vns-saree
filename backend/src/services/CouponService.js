const Coupon = require('../models/Coupon');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Variety = require('../models/Variety');
const Color = require('../models/Color');
const Occasion = require('../models/Occasion');

class CouponService {
  async getAllCoupons() {
    return await Coupon.findAll();
  }

  async getHomepageCoupons() {
    return await Coupon.findAll({
      where: {
        is_active: true,
        display_on_homepage: true
      }
    });
  }

  async getCouponById(id) {
    return await Coupon.findByPk(id);
  }

  async getCouponByCode(code) {
    return await Coupon.findOne({ where: { code, is_active: true } });
  }

  async createCoupon(data) {
    return await Coupon.create(data);
  }

  async updateCoupon(id, data) {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) throw new Error('Coupon not found');
    return await coupon.update(data);
  }

  async deleteCoupon(id) {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) throw new Error('Coupon not found');
    return await coupon.destroy();
  }

  async validateCoupon(code, amount, customerEmail) {
    const coupon = await Coupon.findOne({ where: { code, is_active: true } });
    if (!coupon) throw new Error('Invalid coupon code');

    // Check expiry
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) throw new Error('Coupon not yet active');
    if (coupon.valid_until && new Date(coupon.valid_until) < now) throw new Error('Coupon expired');

    // Check usage limit
    if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
      throw new Error('Coupon usage limit reached');
    }

    // Check minimum purchase
    if (amount < coupon.min_purchase_amount) {
      throw new Error(`Minimum purchase amount of ₹${coupon.min_purchase_amount} required`);
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (amount * coupon.discount_percent) / 100;
      if (coupon.max_discount_amount) {
        discount = Math.min(discount, coupon.max_discount_amount);
      }
    } else {
      discount = coupon.discount_amount;
    }

    return {
      couponId: coupon.id,
      code: coupon.code,
      discount: parseFloat(discount.toFixed(2)),
      discount_type: coupon.discount_type
    };
  }
}

module.exports = new CouponService();
