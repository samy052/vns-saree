const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

// Import Routes
const CategoryRoutes = require('./routes/CategoryRoutes');
const VarietyRoutes = require('./routes/VarietyRoutes');
const ColorRoutes = require('./routes/ColorRoutes');
const MaterialRoutes = require('./routes/MaterialRoutes');
const CouponRoutes = require('./routes/CouponRoutes');
const ProductRoutes = require('./routes/ProductRoutes');
const OrderRoutes = require('./routes/OrderRoutes');
const RazorpayRoutes = require('./routes/RazorpayRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/categories', CategoryRoutes);
app.use('/api/varieties', VarietyRoutes);
app.use('/api/colors', ColorRoutes);
app.use('/api/materials', MaterialRoutes);
app.use('/api/coupons', CouponRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/razorpay', RazorpayRoutes);

app.get('/', (req, res) => {
  res.send('VNS Saree API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
