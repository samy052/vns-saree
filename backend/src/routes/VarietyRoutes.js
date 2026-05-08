const express = require('express');
const router = express.Router();
const VarietyController = require('../controllers/VarietyController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', VarietyController.getAll);
router.get('/:id', VarietyController.getById);
router.post('/', authMiddleware, adminMiddleware, VarietyController.create);
router.put('/:id', authMiddleware, adminMiddleware, VarietyController.update);
router.delete('/:id', authMiddleware, adminMiddleware, VarietyController.delete);

module.exports = router;
