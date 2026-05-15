const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  coupon_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: 'Uttar Pradesh'
  },
  shiprocket_order_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shiprocket_awb: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'orders',
  schema: 'vns_saree',
  timestamps: true,
  underscored: true
});

module.exports = Order;
