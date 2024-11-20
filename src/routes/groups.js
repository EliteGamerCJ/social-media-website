const express = require('express');
const Group = require('../models/group');
const { authenticate } = require('./auth');

const router = express.Router();

// Create a new group
router.post('/', authenticate, async (req, res) => {
  const { name, description } = req.body;
  const creator = req.userId;

  try {
    const group = new Group({ name, description, creator });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Join a group
router.post('/:groupId/join', authenticate, async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (group.members.includes(req.userId)) {
      return res.status(400).json({ error: 'You are already a member of this group' });
    }

    group.members.push(req.userId);
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Leave a group
router.post('/:groupId/leave', authenticate, async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const memberIndex = group.members.indexOf(req.userId);
    if (memberIndex === -1) {
      return res.status(400).json({ error: 'You are not a member of this group' });
    }

    group.members.splice(memberIndex, 1);
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get group details
router.get('/:groupId', async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate('creator', 'username').populate('members', 'username');
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
