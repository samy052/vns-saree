const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");

class WishlistService {
  async getWishlist(customerId) {
    return await Wishlist.findAll({
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
