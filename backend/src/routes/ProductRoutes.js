const express = require('express');
const router = express.Router();
const multer = require("multer");
const ProductController = require('../controllers/ProductController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
});

router.get('/', ProductController.getAll);
router.get('/summary', ProductController.getSummary);
router.get('/:id(\\d+)', ProductController.getById); // Only match digits for ID
router.get('/:slug', ProductController.getBySlug);
router.post('/', ProductController.create);
router.put('/:id', ProductController.update);
router.post('/with-images', upload.any(), ProductController.createWithImages);
router.put('/:id/with-images', upload.any(), ProductController.updateWithImages);
router.delete('/:id', ProductController.delete);

module.exports = router;
