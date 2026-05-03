const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

router.get('/', ProductController.getAll);
router.get('/:id(\\d+)', ProductController.getById); // Only match digits for ID
router.get('/:slug', ProductController.getBySlug);
router.post('/', ProductController.create);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;
