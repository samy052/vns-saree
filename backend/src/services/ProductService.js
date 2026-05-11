const Product = require('../models/Product');
const Category = require('../models/Category');
const Color = require('../models/Color');
const Material = require('../models/Material');
const Variety = require('../models/Variety');
const Occasion = require("../models/Occasion");
const ProductImage = require("../models/ProductImage");
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
  const selling_price = toFloatOrNull(data.selling_price || data.price) ?? 0;
  const mrp_price = toFloatOrNull(data.mrp_price || data.old_price);
  const cost_price = toFloatOrNull(data.cost_price);

  // Calculate Discount Percent
  let discount_percent = null;
  if (mrp_price && selling_price < mrp_price) {
    discount_percent = Math.round(((mrp_price - selling_price) / mrp_price) * 100);
  }

  // Calculate Profit Amount and Profit Percent
  const profit_amount = cost_price !== null ? (selling_price - cost_price) : null;
  let profit_percent = null;
  if (cost_price && cost_price > 0) {
    profit_percent = Math.round(((selling_price - cost_price) / cost_price) * 100);
  }

  const sanitized = {
    ...data,
    selling_price,
    mrp_price,
    cost_price,
    profit_amount,
    profit_percent,
    discount_percent: discount_percent ?? toIntOrNull(data.discount_percent),
    weight: toFloatOrNull(data.weight),
    length: toFloatOrNull(data.length),
    width: toFloatOrNull(data.width),
    stock_quantity: toIntOrZero(data.stock_quantity),
    low_stock_threshold: toIntOrZero(data.low_stock_threshold),
    category_id: toIntOrNull(data.category_id),
    material_id: toIntOrNull(data.material_id),
    variety_id: toIntOrNull(data.variety_id),
    occasion_id: toIntOrNull(data.occasion_id),
    color_stocks: typeof data.color_stocks === "object" ? data.color_stocks : {},
    product_images_by_color: typeof data.product_images_by_color === "object" ? data.product_images_by_color : {},
    cover_image_url: data.cover_image_url || null,
    badge: data.badge || "New Arrival",
    images: Array.isArray(data.images) ? data.images : [],
  };

  // Automatic SKU generation if not present
  if (!sanitized.sku || String(sanitized.sku).trim() === "") {
    const namePrefix = sanitized.name ? String(sanitized.name).substring(0, 3).toUpperCase() : "PROD";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(100 + Math.random() * 900);
    sanitized.sku = `${namePrefix}-${timestamp}-${random}`;
  }

  // Automatic Slug generation if not present
  if (!sanitized.slug || String(sanitized.slug).trim() === "") {
    sanitized.slug = (sanitized.name || "product")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now();
  }

  // Final field cleanup
  delete sanitized.price;
  delete sanitized.old_price;
  delete sanitized.cover_image_selection;
  delete sanitized.image_url;

  // Cleanup nested objects that might be present from Sequelize includes
  delete sanitized.id;
  delete sanitized.Category;
  delete sanitized.Material;
  delete sanitized.Variety;
  delete sanitized.Occasion;
  delete sanitized.productImages;
  delete sanitized.product_images;
  delete sanitized.createdAt;
  delete sanitized.updatedAt;

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
      minPrice,
      maxPrice,
      sortBy = "newest",
      specialCollection,
      storeFrontVisibility,
    } = filters;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(pageSize, 10) || 10));
    const offset = (pageNum - 1) * limit;

    const queryOptions = {
      include: [
        Category, 
        Material, 
        Variety, 
        Occasion,
        { model: ProductImage, as: 'productImages' }
      ],
      where: {},
      order: [],
    };

    // Sorting Logic
    console.log("ProductService: sortBy =", sortBy);
    if (sortBy === "price_asc") {
      queryOptions.order.push(["selling_price", "ASC"]);
    } else if (sortBy === "price_desc") {
      queryOptions.order.push(["selling_price", "DESC"]);
    } else if (sortBy === "special") {
      queryOptions.order.push(["is_special_collection", "DESC"]);
      queryOptions.order.push(["id", "DESC"]);
    } else if (sortBy === "newest") {
      // Prioritize New Arrivals, then newest by ID
      queryOptions.order.push(["is_new_arrival", "DESC"]);
      queryOptions.order.push(["id", "DESC"]);
    } else {
      // Default / popularity / other
      queryOptions.order.push(["id", "DESC"]);
    }

    // Array filtering helper
    const parseCommaSeparated = (val) => {
      if (!val) return null;
      const arr = String(val).split(",").map((v) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v));
      return arr.length > 0 ? arr : null;
    };

    const categories = parseCommaSeparated(category);
    if (categories) queryOptions.where.category_id = { [Op.in]: categories };

    const materials = parseCommaSeparated(material);
    if (materials) queryOptions.where.material_id = { [Op.in]: materials };

    const varieties = parseCommaSeparated(variety);
    if (varieties) queryOptions.where.variety_id = { [Op.in]: varieties };

    const occasions = parseCommaSeparated(occasion);
    if (occasions) queryOptions.where.occasion_id = { [Op.in]: occasions };

    // Price Filtering
    if (minPrice || maxPrice) {
      const priceFilter = {};
      let hasPrice = false;
      if (minPrice && !isNaN(parseInt(minPrice))) {
        priceFilter[Op.gte] = parseInt(minPrice);
        hasPrice = true;
      }
      if (maxPrice && !isNaN(parseInt(maxPrice))) {
        priceFilter[Op.lte] = parseInt(maxPrice);
        hasPrice = true;
      }
      if (hasPrice) {
        queryOptions.where.selling_price = priceFilter;
      }
    }

    if (isAvailable === "true" || isAvailable === "false") {
      queryOptions.where.is_available = isAvailable === "true";
    }

    if (specialCollection === "true" || specialCollection === "false") {
      queryOptions.where.special_collection = specialCollection === "true";
    }

    if (storeFrontVisibility === "true" || storeFrontVisibility === "false") {
      queryOptions.where.store_front_visibility = storeFrontVisibility === "true";
    }

    if (search && String(search).trim()) {
      const text = String(search).trim();
      const words = text.split(/\s+/).filter(w => w.length >= 1);

      const { literal } = require('sequelize');

      const buildWordConditions = (word) => {
        const escaped = word.replace(/'/g, "''");
        return [
          // Standard partial match (fast, catches substrings)
          { name: { [Op.iLike]: `%${word}%` } },
          { short_description: { [Op.iLike]: `%${word}%` } },
          { description: { [Op.iLike]: `%${word}%` } },
          { '$Material.name$': { [Op.iLike]: `%${word}%` } },
          { '$Category.name$': { [Op.iLike]: `%${word}%` } },
          { '$Variety.name$': { [Op.iLike]: `%${word}%` } },
          { '$Occasion.name$': { [Op.iLike]: `%${word}%` } },
          // pg_trgm fuzzy match on product name (handles typos like "banarsi" → "Banarasi")
          literal(`similarity("Product"."name", '${escaped}') > 0.1`),
          literal(`similarity("Product"."short_description", '${escaped}') > 0.1`),
        ];
      };

      const allConditions = words.flatMap(buildWordConditions);
      // Also match on the full phrase
      buildWordConditions(text).forEach(c => allConditions.push(c));

      queryOptions.where[Op.or] = allConditions;
      queryOptions.subQuery = false;
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

    const targetColors = parseCommaSeparated(color);
    const allRows = await Product.findAll(queryOptions);
    
    // Filter by color JSONB (if any colors selected)
    const filteredRows = targetColors 
      ? allRows.filter((p) => {
          if (!p.color_stocks) return false;
          // Product matches if it has stock > 0 for ANY of the selected colors
          return targetColors.some(cId => (parseInt(p.color_stocks[String(cId)], 10) || 0) > 0);
        })
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
      include: [
        Category, 
        Material, 
        Variety, 
        Occasion,
        { model: ProductImage, as: 'productImages' }
      ]
    });
  }

  async getProductBySlug(slug) {
    return await Product.findOne({
      where: { slug },
      include: [
        Category, 
        Material, 
        Variety, 
        Occasion,
        { model: ProductImage, as: 'productImages' }
      ]
    });
  }

  async createProduct(data) {
    const cleaned = sanitizeProductPayload(data);
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
