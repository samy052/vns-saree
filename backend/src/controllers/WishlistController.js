const WishlistService = require("../services/WishlistService");

class WishlistController {
  async getWishlist(req, res) {
    try {
      const items = await WishlistService.getWishlist(req.customer.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async toggleWishlist(req, res) {
    try {
      const { productId } = req.body;
      const result = await WishlistService.toggleWishlist(req.customer.id, productId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeFromWishlist(req, res) {
    try {
      const { productId } = req.params;
      await WishlistService.removeFromWishlist(req.customer.id, productId);
      res.json({ message: "Item removed from wishlist" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new WishlistController();
