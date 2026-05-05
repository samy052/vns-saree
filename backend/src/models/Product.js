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
    },
    // Basic Info
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: "Stock Keeping Unit - unique product code",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    short_description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Brief description for product cards",
    },

    // Pricing
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    old_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    discount_percent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cost_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Cost price for profit calculation",
    },

    // Primary Image (legacy support)
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
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
      comment: "Alert when stock below this number",
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
    product_images_by_color: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: "Color-wise image URLs: { color_id: [url1, url2] }",
    },
    cover_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Primary cover image URL chosen from uploaded images",
    },

    // Physical Attributes
    weight: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
      comment: "Weight in grams",
    },
    length: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Saree length in meters",
    },
    width: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
      comment: "Saree width in meters",
    },

    // Relationships
    category_id: {
      type: DataTypes.INTEGER,
      references: { model: Category, key: "id" },
    },
    material_id: {
      type: DataTypes.INTEGER,
      references: { model: Material, key: "id" },
    },
    variety_id: {
      type: DataTypes.INTEGER,
      references: { model: Variety, key: "id" },
    },
    color_id: {
      type: DataTypes.INTEGER,
      references: { model: Color, key: "id" },
    },
    occasion_id: {
      type: DataTypes.INTEGER,
      references: { model: Occasion, key: "id" },
      comment: "Bridal, Party, Casual, Festival, etc.",
    },

    // Status Flags
    is_special_collection: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_new_arrival: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Mark as new arrival for homepage display",
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    // SEO
    meta_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meta_description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    blouse_piece: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Comes with blouse piece",
    },
  },
  {
    tableName: "products",
  },
);

// Associations
Product.belongsTo(Category, { foreignKey: "category_id" });
Product.belongsTo(Material, { foreignKey: "material_id" });
Product.belongsTo(Variety, { foreignKey: "variety_id" });
Product.belongsTo(Color, { foreignKey: "color_id" });
Product.belongsTo(Occasion, { foreignKey: "occasion_id" });

module.exports = Product;
