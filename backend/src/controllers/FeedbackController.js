const Feedback = require('../models/Feedback');
const Customer = require('../models/Customer');

exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const customer_id = req.user.id; // From auth middleware

    const feedback = await Feedback.create({
      customer_id,
      rating,
      comment,
      is_approved: false
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. It will be visible after admin approval.',
      data: feedback
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit feedback' });
  }
};

exports.getApprovedFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      where: { is_approved: true },
      include: [{
        model: Customer,
        attributes: ['name']
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
};

exports.getPendingFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      where: { is_approved: false },
      include: [{
        model: Customer,
        attributes: ['name', 'email']
      }],
      order: [['created_at', 'ASC']]
    });

    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    console.error('Get pending feedback error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending feedback' });
  }
};

exports.approveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByPk(id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    feedback.is_approved = true;
    await feedback.save();

    res.status(200).json({ success: true, message: 'Feedback approved successfully' });
  } catch (error) {
    console.error('Approve feedback error:', error);
    res.status(500).json({ success: false, message: 'Failed to approve feedback' });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByPk(id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    await feedback.destroy();

    res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete feedback' });
  }
};
