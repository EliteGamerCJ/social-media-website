const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
}, {
  timestamps: true,
});

commentSchema.methods.createComment = async function () {
  return this.save();
};

commentSchema.methods.editComment = async function (newContent) {
  this.content = newContent;
  return this.save();
};

commentSchema.methods.deleteComment = async function () {
  return this.remove();
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
