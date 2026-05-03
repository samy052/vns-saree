const Coupon = require('../models/Coupon');
const Category = require('../models/Category');

class CouponService {
  async getAllCoupons() {
    return await Coupon.findAll({ include: Category });
  }

  async getCouponById(id) {
    return await Coupon.findByPk(id, { include: Category });
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
