const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);
router.post('/', authMiddleware, adminMiddleware, CategoryController.create);
router.put('/:id', authMiddleware, adminMiddleware, CategoryController.update);
router.delete('/:id', authMiddleware, adminMiddleware, CategoryController.delete);

module.exports = router;
