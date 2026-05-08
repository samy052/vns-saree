const express = require('express');
const router = express.Router();
const multer = require("multer");
const ProductController = require('../controllers/ProductController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
});

// Public routes
router.get('/', ProductController.getAll);
router.get('/summary', authMiddleware, adminMiddleware, ProductController.getSummary);
router.get('/:id(\\d+)', ProductController.getById);
router.get('/:slug', ProductController.getBySlug);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, ProductController.create);
router.put('/:id', authMiddleware, adminMiddleware, ProductController.update);
router.post('/with-images', authMiddleware, adminMiddleware, upload.any(), ProductController.createWithImages);
router.put('/:id/with-images', authMiddleware, adminMiddleware, upload.any(), ProductController.updateWithImages);
router.delete('/:id', authMiddleware, adminMiddleware, ProductController.delete);

module.exports = router;
