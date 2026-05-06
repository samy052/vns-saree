const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");

// Import Routes
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

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/categories", CategoryRoutes);
app.use("/api/varieties", VarietyRoutes);
app.use("/api/colors", ColorRoutes);
app.use("/api/materials", MaterialRoutes);
app.use("/api/occasions", OccasionRoutes);
app.use("/api/coupons", CouponRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/razorpay", RazorpayRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/wishlist", WishlistRoutes);

app.get("/", (req, res) => {
  res.send("VNS Saree API is running...");
});

// Database Connection & Server Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch(err => {
  console.error("Failed to start server due to database connection error:", err);
  process.exit(1);
});
