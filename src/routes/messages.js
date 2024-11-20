const express = require('express');
const { authenticate } = require('./auth');
const Message = require('../models/message');

const router = express.Router();

// Send a direct message
router.post('/', authenticate, async (req, res) => {
  const { recipientId, content } = req.body;
  const senderId = req.userId;

  try {
    const message = new Message({ sender: senderId, recipient: recipientId, content });
    await message.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get direct messages
router.get('/', authenticate, async (req, res) => {
  const userId = req.userId;

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
