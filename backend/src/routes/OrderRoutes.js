const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

// Public checkout route. Frontend checkout is customer-protected.
router.post('/', OrderController.createOrder);

// Admin/order lookup route. Keep auth behavior unchanged for current clients.
router.get('/', OrderController.getMyOrders);

module.exports = router;
