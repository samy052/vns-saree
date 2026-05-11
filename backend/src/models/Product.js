const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Category = require("./Category");
const Material = require("./Material");
const Variety = require("./Variety");
const Color = require("./Color");
const Occasion = require("./Occasion");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    short_description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    store_front_visibility: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // Pricing & Financials
    selling_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mrp_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    cost_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    discount_percent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    profit_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    profit_percent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Inventory
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    low_stock_threshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    track_inventory: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    color_stocks: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: "Color-wise stock: { color_id: quantity }",
    },

    // Physical Attributes
    weight: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
    length: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    width: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },

    // Media
    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },

    // Foreign Keys
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Category, key: "id" },
    },
    material_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Material, key: "id" },
    },
    variety_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Variety, key: "id" },
    },
    occasion_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Occasion, key: "id" },
    },

    // Boolean Statuses
    is_special_collection: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    special_collection: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_new_arrival: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    blouse_piece: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    product_images_by_color: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    cover_image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    badge: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "New Arrival",
    },
  },
  {
    tableName: "products",
    timestamps: false,
  },
);

// Associations
Product.belongsTo(Category, { foreignKey: "category_id" });
Product.belongsTo(Material, { foreignKey: "material_id" });
Product.belongsTo(Variety, { foreignKey: "variety_id" });
Product.belongsTo(Occasion, { foreignKey: "occasion_id" });

module.exports = Product;
