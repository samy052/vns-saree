const express = require('express');
const router = express.Router();
const ColorController = require('../controllers/ColorController');

router.get('/', ColorController.getAll);
router.get('/:id', ColorController.getById);
router.post('/', ColorController.create);
router.put('/:id', ColorController.update);
router.delete('/:id', ColorController.delete);

module.exports = router;
