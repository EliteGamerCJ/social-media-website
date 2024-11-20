const express = require('express');
const User = require('../models/user');
const { authenticate } = require('./auth');

const router = express.Router();

// Follow a user
router.post('/:userId/follow', authenticate, async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.userId;

  try {
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userToFollow.followers.includes(currentUserId)) {
      return res.status(400).json({ error: 'You are already following this user' });
    }

    userToFollow.followers.push(currentUserId);
    await userToFollow.save();

    const currentUser = await User.findById(currentUserId);
    currentUser.following.push(userId);
    await currentUser.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unfollow a user
router.post('/:userId/unfollow', authenticate, async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.userId;

  try {
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!userToUnfollow.followers.includes(currentUserId)) {
      return res.status(400).json({ error: 'You are not following this user' });
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(follower => follower.toString() !== currentUserId);
    await userToUnfollow.save();

    const currentUser = await User.findById(currentUserId);
    currentUser.following = currentUser.following.filter(following => following.toString() !== userId);
    await currentUser.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
