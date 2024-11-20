const express = require('express');
const Event = require('../models/event');
const { authenticate } = require('./auth');

const router = express.Router();

// Create a new event
router.post('/', authenticate, async (req, res) => {
  const { title, description, date, location } = req.body;
  const creator = req.userId;

  try {
    const event = new Event({ title, description, date, location, creator });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Join an event
router.post('/:eventId/join', authenticate, async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.participants.includes(req.userId)) {
      return res.status(400).json({ error: 'You are already a participant of this event' });
    }

    event.participants.push(req.userId);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Leave an event
router.post('/:eventId/leave', authenticate, async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const participantIndex = event.participants.indexOf(req.userId);
    if (participantIndex === -1) {
      return res.status(400).json({ error: 'You are not a participant of this event' });
    }

    event.participants.splice(participantIndex, 1);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get event details
router.get('/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId).populate('creator', 'username').populate('participants', 'username');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
