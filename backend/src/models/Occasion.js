const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Occasion = sequelize.define('Occasion', {
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
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  }
}, {
  tableName: 'occasions'
});

module.exports = Occasion;
