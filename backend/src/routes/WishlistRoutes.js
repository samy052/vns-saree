const express = require("express");
const router = express.Router();
const WishlistController = require("../controllers/WishlistController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", WishlistController.getWishlist);
router.post("/toggle", WishlistController.toggleWishlist);
router.delete("/:productId", WishlistController.removeFromWishlist);

module.exports = router;
