const express = require("express");
const router = express.Router();
const GeoController = require("../controllers/GeoController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Reverse geocoding (lat/lng -> pincode/city/state/address)
router.get("/reverse", authMiddleware, GeoController.reverse);

module.exports = router;

