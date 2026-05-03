const express = require('express');
const router = express.Router();
const CouponController = require('../controllers/CouponController');

router.get('/', CouponController.getAll);
router.get('/:id', CouponController.getById);
router.post('/', CouponController.create);
router.put('/:id', CouponController.update);
router.delete('/:id', CouponController.delete);

module.exports = router;
