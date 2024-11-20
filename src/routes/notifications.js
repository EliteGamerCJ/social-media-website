const express = require('express');
const Notification = require('../models/notification');
const { authenticate } = require('./auth');

const router = express.Router();

// Fetch user notifications
router.get('/', authenticate, async (req, res) => {
  const userId = req.userId;

  try {
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
