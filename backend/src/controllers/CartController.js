const CartService = require("../services/CartService");

class CartController {
  async getCart(req, res) {
    try {
      const items = await CartService.getCart(req.customer.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addToCart(req, res) {
    try {
      const { productId, quantity, colorId } = req.body;
      const item = await CartService.addToCart(req.customer.id, productId, quantity, colorId);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateQuantity(req, res) {
    try {
      const { productId, quantity, colorId } = req.body;
      const item = await CartService.updateQuantity(req.customer.id, productId, quantity, colorId);
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeFromCart(req, res) {
    try {
      const { productId } = req.params;
      await CartService.removeFromCart(req.customer.id, productId);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async clearCart(req, res) {
    try {
      await CartService.clearCart(req.customer.id);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CartController();
