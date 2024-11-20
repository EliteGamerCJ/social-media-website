const express = require('express');
const Post = require('../models/post');
const { authenticate } = require('./auth');

const router = express.Router();

// Create a new post
router.post('/', authenticate, async (req, res) => {
  const { content } = req.body;
  const author = req.userId;

  try {
    const post = new Post({ content, author });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Edit a post
router.put('/:postId', authenticate, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    post.content = content;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a post
router.delete('/:postId', authenticate, async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// View a post
router.get('/:postId', async (req, res) => {
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

// Like a post
router.post('/:postId/like', authenticate, async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.likes.includes(req.userId)) {
      return res.status(400).json({ error: 'You have already liked this post' });
    }

    post.likes.push(req.userId);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add a comment to a post
router.post('/:postId/comments', authenticate, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const author = req.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = new Comment({ content, author, post: postId });
    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
