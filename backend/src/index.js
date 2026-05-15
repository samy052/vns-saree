const express = require("express");
const cors = require("cors");

const CategoryRoutes = require("./routes/CategoryRoutes");
const VarietyRoutes = require("./routes/VarietyRoutes");
const ColorRoutes = require("./routes/ColorRoutes");
const MaterialRoutes = require("./routes/MaterialRoutes");
const OccasionRoutes = require("./routes/OccasionRoutes");
const CouponRoutes = require("./routes/CouponRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
const OrderRoutes = require("./routes/OrderRoutes");
const RazorpayRoutes = require("./routes/RazorpayRoutes");
const AuthRoutes = require("./routes/AuthRoutes");
const CartRoutes = require("./routes/CartRoutes");
const WishlistRoutes = require("./routes/WishlistRoutes");
const FeedbackRoutes = require("./routes/FeedbackRoutes");
const ShipRocketRoutes = require("./routes/ShipRocketRoutes");

const parseCorsOrigins = () => {
  const origins = process.env.CORS_ORIGINS;
  if (!origins || origins === "*") return true;
  return origins.split(",").map((origin) => origin.trim()).filter(Boolean);
};

const app = express();

app.use(cors({ origin: parseCorsOrigins(), credentials: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    name: "VNS Saree API",
    status: "ok",
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Authentication APIs.
// Public: customer register/login, admin login, password reset, token refresh.
app.use("/api/auth", AuthRoutes);

// Catalog APIs.
// Public: read endpoints used by the customer storefront.
// Admin: create/update/delete endpoints inside these routers require admin auth.
app.use("/api/products", ProductRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/varieties", VarietyRoutes);
app.use("/api/colors", ColorRoutes);
app.use("/api/materials", MaterialRoutes);
app.use("/api/occasions", OccasionRoutes);
app.use("/api/coupons", CouponRoutes);

// Feedback APIs.
// Public: approved feedback list. Customer: submit feedback. Admin: moderation.
app.use("/api/feedback", FeedbackRoutes);

// Checkout APIs.
// Public from the backend perspective; checkout pages control customer access
// in the frontend and payment verification happens through Razorpay callbacks.
app.use("/api/razorpay", RazorpayRoutes);
app.use("/api/orders", OrderRoutes);

// Shipping APIs (admin-initiated).
app.use("/api/shiprocket", ShipRocketRoutes);

// Customer account APIs. Route files enforce customer authentication.
app.use("/api/cart", CartRoutes);
app.use("/api/wishlist", WishlistRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((error, req, res, next) => {
  console.error("Unhandled API error:", error);
  res.status(error.status || 500).json({
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message,
  });
});

module.exports = app;
