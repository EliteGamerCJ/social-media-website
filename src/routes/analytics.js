const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');

const router = express.Router();

// Route to fetch user analytics
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ author: userId });
    const postCount = posts.length;
    const likeCount = posts.reduce((acc, post) => acc + post.likes.length, 0);
    const commentCount = posts.reduce((acc, post) => acc + post.comments.length, 0);

    res.json({
      user: {
        username: user.username,
        email: user.email,
        profile: user.profile,
      },
      analytics: {
        postCount,
        likeCount,
        commentCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch post analytics
router.get('/post/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate('author');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      post: {
        content: post.content,
        author: post.author.username,
        createdAt: post.createdAt,
      },
      analytics: {
        likeCount: post.likes.length,
        commentCount: post.comments.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
