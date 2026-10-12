const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const auth = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

async function postExists(req, res) {
  if (mongoose.isValidObjectId(req.params.id) && (await Post.exists({ _id: req.params.id }))) return true;
  res.status(404).json({ message: 'Post not found' });
  return false;
}

router.get('/', async (req, res) => {
  if (!(await postExists(req, res))) return;
  const comments = await Comment.find({ post: req.params.id }).populate('author', 'username').sort({ createdAt: 1 });
  res.json(comments);
});

router.post('/', auth, async (req, res) => {
  if (!(await postExists(req, res))) return;
  const comment = await Comment.create({ text: req.body?.text, post: req.params.id, author: req.user.id });
  await comment.populate('author', 'username');
  res.status(201).json(comment);
});

module.exports = router;
