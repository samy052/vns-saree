const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Wishlist = sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "customers",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
  },
  {
    tableName: "wishlists",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['customerId', 'productId']
      }
    ]
  }
);

const Product = require("./Product");
Wishlist.belongsTo(Product, { foreignKey: "productId" });
module.exports = Wishlist;
