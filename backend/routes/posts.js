const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

function parseTags(tags) {
  const list = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',') : [];
  return [...new Set(list.map(tag => String(tag).trim().toLowerCase()).filter(Boolean))];
}

async function findPost(req, res) {
  const post = mongoose.isValidObjectId(req.params.id)
    ? await Post.findById(req.params.id).populate('author', 'username')
    : null;
  if (!post) res.status(404).json({ message: 'Post not found' });
  return post;
}

function isAuthor(post, req) {
  return post.author._id.toString() === req.user.id;
}

router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
  res.json(posts);
});

router.get('/:id', async (req, res) => {
  const post = await findPost(req, res);
  if (post) res.json(post);
});

router.post('/', auth, async (req, res) => {
  const { title, content, tags } = req.body || {};
  const post = await Post.create({ title, content, tags: parseTags(tags), author: req.user.id });
  await post.populate('author', 'username');
  res.status(201).json(post);
});

router.put('/:id', auth, async (req, res) => {
  const post = await findPost(req, res);
  if (!post) return;
  if (!isAuthor(post, req)) return res.status(403).json({ message: 'You can only edit your own posts' });
  const { title, content, tags } = req.body || {};
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (tags !== undefined) post.tags = parseTags(tags);
  await post.save();
  res.json(post);
});

router.delete('/:id', auth, async (req, res) => {
  const post = await findPost(req, res);
  if (!post) return;
  if (!isAuthor(post, req)) return res.status(403).json({ message: 'You can only delete your own posts' });
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
});

module.exports = router;
