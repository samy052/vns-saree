const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/FeedbackController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public route to get approved feedback
router.get('/approved', FeedbackController.getApprovedFeedback);

// Protected route to submit feedback
router.post('/submit', authMiddleware, FeedbackController.submitFeedback);

// Admin routes
router.get('/pending', authMiddleware, adminMiddleware, FeedbackController.getPendingFeedback);
router.put('/approve/:id', authMiddleware, adminMiddleware, FeedbackController.approveFeedback);
router.delete('/:id', authMiddleware, adminMiddleware, FeedbackController.deleteFeedback);

module.exports = router;
