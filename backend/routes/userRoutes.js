const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Fetch all users (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create a user (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const { username, email, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    const user = await User.create({ username, email, role, password: 'default123' });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update a user (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  const { username, email, role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
