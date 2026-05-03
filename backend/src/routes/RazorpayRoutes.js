const express = require('express');
const router = express.Router();
const RazorpayController = require('../controllers/RazorpayController');

router.post('/create-order', RazorpayController.createOrder);
router.post('/verify-payment', RazorpayController.verifyPayment);

module.exports = router;
