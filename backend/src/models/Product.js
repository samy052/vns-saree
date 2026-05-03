const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Category = require('./Category');
const Material = require('./Material');
const Variety = require('./Variety');
const Color = require('./Color');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  old_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  discount_percent: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: { model: Category, key: 'id' }
  },
  material_id: {
    type: DataTypes.INTEGER,
    references: { model: Material, key: 'id' }
  },
  variety_id: {
    type: DataTypes.INTEGER,
    references: { model: Variety, key: 'id' }
  },
  color_id: {
    type: DataTypes.INTEGER,
    references: { model: Color, key: 'id' }
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'products'
});

// Associations
Product.belongsTo(Category, { foreignKey: 'category_id' });
Product.belongsTo(Material, { foreignKey: 'material_id' });
Product.belongsTo(Variety, { foreignKey: 'variety_id' });
Product.belongsTo(Color, { foreignKey: 'color_id' });

module.exports = Product;
