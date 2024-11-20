const express = require('express');
const { authenticate } = require('./auth');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

const router = express.Router();

// API route to get user details
router.get('/users/:userId', authenticate, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API route to get post details
router.get('/posts/:postId', authenticate, async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate('author', 'username').populate('comments');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API route to get comment details
router.get('/comments/:commentId', authenticate, async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId).populate('author', 'username');
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
