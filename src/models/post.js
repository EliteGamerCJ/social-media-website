const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
}, {
  timestamps: true,
});

postSchema.methods.createPost = async function () {
  return this.save();
};

postSchema.methods.editPost = async function (newContent) {
  this.content = newContent;
  return this.save();
};

postSchema.methods.deletePost = async function () {
  return this.remove();
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
