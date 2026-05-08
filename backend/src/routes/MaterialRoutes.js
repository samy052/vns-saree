const express = require('express');
const router = express.Router();
const MaterialController = require('../controllers/MaterialController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', MaterialController.getAll);
router.get('/:id', MaterialController.getById);
router.post('/', authMiddleware, adminMiddleware, MaterialController.create);
router.put('/:id', authMiddleware, adminMiddleware, MaterialController.update);
router.delete('/:id', authMiddleware, adminMiddleware, MaterialController.delete);

module.exports = router;
