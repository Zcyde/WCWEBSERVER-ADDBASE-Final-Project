const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const { uploadAvatar } = require('../config/multer');

// User routes
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log(`GET /api/user - Fetching user data for ${req.userId}`);
    const user = await User.findById(req.userId);
    if (!user) {
      console.log(`User not found: ${req.userId}`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`User data retrieved for ${user.username}`);
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/', authenticateToken, async (req, res) => {
  try {
    console.log(`PUT /api/user - Updating user data for ${req.userId}`);
    const user = await User.findById(req.userId);
    if (!user) {
      console.log(`User not found: ${req.userId}`);
      return res.status(404).json({ error: 'User not found' });
    }
    const { firstName, lastName, email, username, contact, gender, address, birthDate } = req.body;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (username !== undefined) user.username = username;
    if (contact !== undefined) user.contact = contact;
    if (gender !== undefined) user.gender = gender;
    if (address !== undefined) user.address = address;
    if (birthDate !== undefined) user.birthDate = birthDate ? new Date(birthDate) : undefined;
    await user.save();
    console.log(`User updated: ${user.username}`);
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/avatar', authenticateToken, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    console.log(`POST /api/user/avatar - Uploading avatar for user ${req.userId}`);
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const user = await User.findById(req.userId);
    if (!user) {
      console.log(`User not found: ${req.userId}`);
      return res.status(404).json({ error: 'User not found' });
    }
    user.avatar = `/avatars/${req.file.filename}`;
    await user.save();
    console.log(`Avatar updated for user: ${user.username}`);
    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error('Error uploading avatar:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
