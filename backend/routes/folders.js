const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const authenticateToken = require('../middleware/auth');

// Folders API
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log(`GET /api/folders - Fetching folders for user ${req.userId}`);
    const folders = await Folder.find({ userId: req.userId });
    console.log(`Found ${folders.length} folders`);
    res.json(folders);
  } catch (err) {
    console.error('Error fetching folders:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, color } = req.body;
    console.log(`POST /api/folders - Creating folder: ${name} for user ${req.userId}`);
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const newFolder = new Folder({ userId: req.userId, name, color });
    await newFolder.save();
    console.log(`Folder created with ID: ${newFolder._id}`);
    res.status(201).json(newFolder);
  } catch (err) {
    console.error('Error creating folder:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
