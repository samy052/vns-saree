const express = require('express');
const router = express.Router();
const OccasionController = require('../controllers/OccasionController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', OccasionController.getAll);
router.get('/:id', OccasionController.getById);
router.get('/slug/:slug', OccasionController.getBySlug);
router.post('/', authMiddleware, adminMiddleware, OccasionController.create);
router.put('/:id', authMiddleware, adminMiddleware, OccasionController.update);
router.delete('/:id', authMiddleware, adminMiddleware, OccasionController.delete);

module.exports = router;
