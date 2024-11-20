const express = require('express');
const Post = require('../models/post');

const router = express.Router();

// Route to fetch trending topics
router.get('/topics', async (req, res) => {
  try {
    const trendingTopics = await Post.aggregate([
      { $unwind: '$content' },
      { $match: { content: { $regex: /#\w+/ } } },
      { $group: { _id: '$content', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json(trendingTopics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch popular posts
router.get('/posts', async (req, res) => {
  try {
    const popularPosts = await Post.find().sort({ likes: -1 }).limit(10).populate('author', 'username');

    res.json(popularPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
