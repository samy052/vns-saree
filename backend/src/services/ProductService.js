const Product = require('../models/Product');
const Category = require('../models/Category');
const Color = require('../models/Color');
const Material = require('../models/Material');
const Variety = require('../models/Variety');
const Occasion = require("../models/Occasion");
const { Op } = require("sequelize");

const toIntOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const num = parseInt(value, 10);
  return Number.isNaN(num) ? null : num;
};

const toIntOrZero = (value) => {
  const num = parseInt(value, 10);
  return Number.isNaN(num) ? 0 : num;
};

const toFloatOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const num = parseFloat(value);
  return Number.isNaN(num) ? null : num;
};

const normalizeJsonObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const sanitizeProductPayload = (data = {}) => {
  const sanitized = {
    ...data,
    sku: data.sku && String(data.sku).trim() ? String(data.sku).trim().toUpperCase() : undefined,
    price: toFloatOrNull(data.price) ?? 0,
    old_price: toFloatOrNull(data.old_price),
    cost_price: toFloatOrNull(data.cost_price),
    weight: toFloatOrNull(data.weight),
    length: toFloatOrNull(data.length),
    width: toFloatOrNull(data.width),
    stock_quantity: toIntOrZero(data.stock_quantity),
    low_stock_threshold: toIntOrZero(data.low_stock_threshold),
    discount_percent: toIntOrNull(data.discount_percent),
    category_id: toIntOrNull(data.category_id),
    material_id: toIntOrNull(data.material_id),
    variety_id: toIntOrNull(data.variety_id),
    color_id: toIntOrNull(data.color_id),
    occasion_id: toIntOrNull(data.occasion_id),
    color_stocks: normalizeJsonObject(data.color_stocks),
    product_images_by_color: normalizeJsonObject(data.product_images_by_color),
  };

  delete sanitized.cover_image_selection; // UI helper field, never persisted

  // Prevent unintentionally writing undefined SKU during updates.
  if (sanitized.sku === undefined) delete sanitized.sku;

  return sanitized;
};

class ProductService {
  async getAllProducts(filters = {}) {
    const {
      category,
      color,
      material,
      variety,
      occasion,
      isAvailable,
      stockStatus,
      page = 1,
      pageSize = 10,
      paginated = false,
      search = "",
    } = filters;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(pageSize, 10) || 10));
    const offset = (pageNum - 1) * limit;

    const queryOptions = {
      include: [Category, Color, Material, Variety, Occasion],
      where: {},
      order: [["id", "DESC"]],
    };

    if (category) queryOptions.where.category_id = category;
    if (material) queryOptions.where.material_id = material;
    if (variety) queryOptions.where.variety_id = variety;
    if (occasion) queryOptions.where.occasion_id = occasion;
    if (isAvailable === "true" || isAvailable === "false") {
      queryOptions.where.is_available = isAvailable === "true";
    }

    if (search && String(search).trim()) {
      const text = String(search).trim();
      queryOptions.where[Op.or] = [
        { name: { [Op.iLike]: `%${text}%` } },
        { sku: { [Op.iLike]: `%${text}%` } },
      ];
    }

    if (stockStatus === "in_stock") {
      queryOptions.where.stock_quantity = { [Op.gt]: 0 };
    } else if (stockStatus === "out_of_stock") {
      queryOptions.where.stock_quantity = { [Op.lte]: 0 };
    } else if (stockStatus === "low_stock") {
      queryOptions.where.stock_quantity = {
        [Op.and]: [{ [Op.gt]: 0 }, { [Op.lte]: 5 }],
      };
    }

    const requiresColorFilter = Boolean(color);
    const allRows = await Product.findAll(queryOptions);
    const filteredRows = requiresColorFilter
      ? allRows.filter((p) => (parseInt(p.color_stocks?.[String(color)], 10) || 0) > 0)
      : allRows;

    if (!paginated || paginated === "false") {
      return filteredRows;
    }

    const count = filteredRows.length;
    const rows = filteredRows.slice(offset, offset + limit);
    const stockCounts = await Product.findAll({
      attributes: ["stock_quantity", "low_stock_threshold"],
    });
    const summary = stockCounts.reduce(
      (acc, p) => {
        const stock = parseInt(p.stock_quantity, 10) || 0;
        const low = parseInt(p.low_stock_threshold, 10) || 0;
        if (stock <= 0) acc.outOfStock += 1;
        else if (stock <= low) acc.lowStock += 1;
        else acc.inStock += 1;
        return acc;
      },
      { outOfStock: 0, lowStock: 0, inStock: 0 },
    );

    return {
      items: rows,
      meta: {
        totalItems: count,
        currentPage: pageNum,
        pageSize: limit,
        totalPages: Math.max(1, Math.ceil(count / limit)),
        currentPageCount: rows.length,
      },
      summary,
    };
  }

  async getProductSummary() {
    const products = await Product.findAll({
      attributes: ["stock_quantity", "low_stock_threshold", "is_available"],
    });

    const summary = products.reduce(
      (acc, p) => {
        const stock = parseInt(p.stock_quantity, 10) || 0;
        const low = parseInt(p.low_stock_threshold, 10) || 0;

        if (stock <= 0) acc.outOfStock += 1;
        else if (stock <= (low || 5)) acc.lowStock += 1;
        else acc.inStock += 1;

        return acc;
      },
      { outOfStock: 0, lowStock: 0, inStock: 0 },
    );

    summary.totalProducts = products.length;
    return summary;
  }

  async getProductById(id) {
    return await Product.findByPk(id, {
      include: [Category, Color, Material, Variety, Occasion]
    });
  }

  async getProductBySlug(slug) {
    return await Product.findOne({
      where: { slug },
      include: [Category, Color, Material, Variety, Occasion]
    });
  }

  async createProduct(data) {
    const cleaned = sanitizeProductPayload(data);
    if (!cleaned.sku) {
      const prefix = cleaned.name ? String(cleaned.name).substring(0, 3).toUpperCase() : "SKU";
      cleaned.sku = `${prefix}-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;
    }
    return await Product.create(cleaned);
  }

  async updateProduct(id, data) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    const cleaned = sanitizeProductPayload(data);
    return await product.update(cleaned);
  }

  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    return await product.destroy();
  }
}

module.exports = new ProductService();
