const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Category = require("./Category");

const Variety = sequelize.define(
  "Variety",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Category,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "varieties",
  },
);

Category.hasMany(Variety, { foreignKey: "category_id" });
Variety.belongsTo(Category, { foreignKey: "category_id" });

module.exports = Variety;
