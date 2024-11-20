const express = require('express');
const Comment = require('../models/comment');
const { authenticate } = require('./auth');

const router = express.Router();

// Create a new comment
router.post('/', authenticate, async (req, res) => {
  const { content, postId } = req.body;
  const author = req.userId;

  try {
    const comment = new Comment({ content, author, post: postId });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Edit a comment
router.put('/:commentId', authenticate, async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a comment
router.delete('/:commentId', authenticate, async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await comment.remove();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reply to a comment
router.post('/:commentId/reply', authenticate, async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const author = req.userId;

  try {
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const reply = new Comment({ content, author, post: parentComment.post });
    await reply.save();

    parentComment.replies.push(reply._id);
    await parentComment.save();

    res.status(201).json(reply);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
