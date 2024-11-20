const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');

const router = express.Router();

// Search for users
router.get('/users', async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.find({ username: new RegExp(query, 'i') });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search for posts
router.get('/posts', async (req, res) => {
  const { query } = req.query;

  try {
    const posts = await Post.find({ content: new RegExp(query, 'i') });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search for hashtags
router.get('/hashtags', async (req, res) => {
  const { query } = req.query;

  try {
    const posts = await Post.find({ content: new RegExp(`#${query}`, 'i') });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
