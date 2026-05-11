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
}

module.exports = new CouponService();
