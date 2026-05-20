const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

class WishlistService {
  async getWishlist(customerId) {
    return await Wishlist.findAll({
      where: { customerId },
      include: [
        {
          model: Product,
          attributes: [
            "id",
            "name",
            "slug",
            "short_description",
            "selling_price",
            "mrp_price",
            "discount_percent",
            "images",
            "color_stocks",
            "stock_quantity",
            "low_stock_threshold",
            "status",
          ],
        },
      ],
    });
  }

  async toggleWishlist(customerId, productId) {
    const pId = parseInt(productId, 10);
    if (isNaN(pId)) throw new Error("Invalid Product ID");

    const existing = await Wishlist.findOne({
      where: { customerId, productId: pId },
    });

    if (existing) {
      // Use destroy on the model to remove ALL instances (just in case duplicates exist)
      await Wishlist.destroy({
        where: { customerId, productId: pId }
      });
      return { added: false };
    } else {
      await Wishlist.create({
        customerId,
        productId: pId,
      });
      return { added: true };
    }
  }

  async removeFromWishlist(customerId, productId) {
    return await Wishlist.destroy({
      where: { customerId, productId },
    });
  }
}

module.exports = new WishlistService();
