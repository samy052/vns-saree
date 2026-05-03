const express = require('express');
const router = express.Router();
const VarietyController = require('../controllers/VarietyController');

router.get('/', VarietyController.getAll);
router.get('/:id', VarietyController.getById);
router.post('/', VarietyController.create);
router.put('/:id', VarietyController.update);
router.delete('/:id', VarietyController.delete);

module.exports = router;
