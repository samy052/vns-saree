const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Product = require('./Product');

const ProductImage = sequelize.define('ProductImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alt_text: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'product_images'
});

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'productImages' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = ProductImage;
