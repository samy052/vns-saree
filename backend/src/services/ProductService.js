const Product = require('../models/Product');
const Category = require('../models/Category');
const Color = require('../models/Color');
const Material = require('../models/Material');
const Variety = require('../models/Variety');

class ProductService {
  async getAllProducts(filters = {}) {
    const { category, color, material, variety } = filters;
    const queryOptions = {
      include: [Category, Color, Material, Variety],
      where: {}
    };

    // Simple filtering logic if needed later
    if (category) queryOptions.where.category_id = category;
    
    return await Product.findAll(queryOptions);
  }

  async getProductById(id) {
    return await Product.findByPk(id, {
      include: [Category, Color, Material, Variety]
    });
  }

  async getProductBySlug(slug) {
    return await Product.findOne({
      where: { slug },
      include: [Category, Color, Material, Variety]
    });
  }

  async createProduct(data) {
    return await Product.create(data);
  }

  async updateProduct(id, data) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    return await product.update(data);
  }

  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');
    return await product.destroy();
  }
}

module.exports = new ProductService();
