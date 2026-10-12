const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function isText(...values) {
  return values.every(v => typeof v === 'string' && v.trim() !== '');
}

function sendToken(res, status, user) {
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(status).json({ token, user: { id: user._id, username: user.username, email: user.email } });
}

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body || {};
  if (!isText(username, email, password)) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  const exists = await User.findOne({ $or: [{ email: email.trim().toLowerCase() }, { username: username.trim() }] });
  if (exists) return res.status(400).json({ message: 'Username or email is already taken' });
  const user = await User.create({ username, email, password: await bcrypt.hash(password, 10) });
  sendToken(res, 201, user);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!isText(email, password)) return res.status(400).json({ message: 'Email and password are required' });
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  sendToken(res, 200, user);
});

module.exports = router;
