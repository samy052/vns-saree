const express = require('express');
const router = express.Router();
const MaterialController = require('../controllers/MaterialController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', MaterialController.getAll);
router.get('/:id', MaterialController.getById);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), MaterialController.create);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), MaterialController.update);
router.delete('/:id', authMiddleware, adminMiddleware, MaterialController.delete);

module.exports = router;
