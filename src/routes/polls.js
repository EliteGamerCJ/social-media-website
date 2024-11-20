const express = require('express');
const Poll = require('../models/poll');
const { authenticate } = require('./auth');

const router = express.Router();

// Create a new poll
router.post('/', authenticate, async (req, res) => {
  const { question, options } = req.body;

  try {
    const poll = new Poll({ question, options, author: req.userId });
    await poll.save();
    res.status(201).json({ message: 'Poll created successfully', poll });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find().populate('author', 'username');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single poll
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate('author', 'username');
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vote on a poll
router.post('/:id/vote', authenticate, async (req, res) => {
  const { option } = req.body;

  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const voteIndex = poll.options.findIndex(opt => opt.option === option);
    if (voteIndex === -1) {
      return res.status(400).json({ error: 'Invalid option' });
    }

    poll.options[voteIndex].votes += 1;
    await poll.save();
    res.json({ message: 'Vote recorded successfully', poll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
