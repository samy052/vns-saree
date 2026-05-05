const express = require('express');
const router = express.Router();
const OccasionController = require('../controllers/OccasionController');

router.get('/', OccasionController.getAll);
router.get('/:id', OccasionController.getById);
router.get('/slug/:slug', OccasionController.getBySlug);
router.post('/', OccasionController.create);
router.put('/:id', OccasionController.update);
router.delete('/:id', OccasionController.delete);

module.exports = router;
