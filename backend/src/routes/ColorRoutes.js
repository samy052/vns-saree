const express = require('express');
const router = express.Router();
const ColorController = require('../controllers/ColorController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', ColorController.getAll);
router.get('/:id', ColorController.getById);
router.post('/', authMiddleware, adminMiddleware, ColorController.create);
router.put('/:id', authMiddleware, adminMiddleware, ColorController.update);
router.delete('/:id', authMiddleware, adminMiddleware, ColorController.delete);

module.exports = router;
