const express = require('express');
const router = express.Router();
const OccasionController = require('../controllers/OccasionController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public storefront routes
router.get('/', OccasionController.getAll);
router.get('/slug/:slug', OccasionController.getBySlug);

// Public admin/storefront lookup route
router.get('/:id', OccasionController.getById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, OccasionController.create);
router.put('/:id', authMiddleware, adminMiddleware, OccasionController.update);
router.delete('/:id', authMiddleware, adminMiddleware, OccasionController.delete);

module.exports = router;
