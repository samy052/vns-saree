const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");

class CartService {
  async getCart(customerId) {
    return await Cart.findAll({
      where: { customerId },
      include: [
        {
          model: Product,
          include: [
            {
              model: ProductImage,
              as: "productImages",
            },
          ],
        },
      ],
    });
  }

  async addToCart(customerId, productId, quantity = 1, colorId = null) {
    const product = await Product.findByPk(productId);
    if (!product) throw new Error("Product not found");

    // Stock Validation
    const colorStock = product.color_stocks?.[colorId] ?? product.stock_quantity;
    
    let cartItem = await Cart.findOne({
      where: { customerId, productId, colorId },
    });

    const newQuantity = (cartItem ? cartItem.quantity : 0) + quantity;
    if (newQuantity > colorStock) {
      throw new Error(`Insufficient stock. Only ${colorStock} items available.`);
    }

    if (cartItem) {
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        customerId,
        productId,
        quantity,
        colorId
      });
    }

    return cartItem;
  }

  async updateQuantity(customerId, productId, quantity, colorId = null) {
    const product = await Product.findByPk(productId);
    const colorStock = product.color_stocks?.[colorId] ?? product.stock_quantity;

    if (quantity > colorStock) {
      throw new Error(`Insufficient stock. Only ${colorStock} items available.`);
    }

    const cartItem = await Cart.findOne({
      where: { customerId, productId, colorId },
    });

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    cartItem.quantity = quantity;
    if (cartItem.quantity <= 0) {
      await cartItem.destroy();
      return null;
    }

    await cartItem.save();
    return cartItem;
  }

  async removeFromCart(customerId, productId) {
    return await Cart.destroy({
      where: { customerId, productId },
    });
  }

  async clearCart(customerId) {
    return await Cart.destroy({
      where: { customerId },
    });
  }
}

module.exports = new CartService();
