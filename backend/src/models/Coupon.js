const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Category = require('./Category');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  discount_percent: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  min_purchase_amount: {
    type: DataTypes.DECIMAL,
    allowNull: true,
    defaultValue: 0
  },
  applicable_category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Category,
      key: 'id'
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'coupons'
});

Coupon.belongsTo(Category, { foreignKey: 'applicable_category_id' });

module.exports = Coupon;
