const express = require('express');
const router = express.Router();
const multer = require("multer");
const VarietyController = require('../controllers/VarietyController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', VarietyController.getAll);
router.get('/:id', VarietyController.getById);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), VarietyController.create);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), VarietyController.update);
router.delete('/:id', authMiddleware, adminMiddleware, VarietyController.delete);

module.exports = router;
