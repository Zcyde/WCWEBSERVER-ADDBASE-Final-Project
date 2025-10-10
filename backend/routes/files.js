const express = require('express');
const router = express.Router();
const File = require('../models/File');
const authenticateToken = require('../middleware/auth');
const { upload } = require('../config/multer');

// Portfolio file API
router.post('/', authenticateToken, upload.array('files'), async (req, res) => {
  try {
    console.log(`POST /api/files - Uploading ${req.files.length} files for user ${req.userId}`);
    const fileDocs = req.files.map(file => ({
      userId: req.userId,
      name: file.originalname,
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      size: file.size
    }));
    const savedFiles = await File.insertMany(fileDocs);
    console.log(`Files uploaded: ${savedFiles.length} files saved`);
    res.json(savedFiles);
  } catch (err) {
    console.error('Error uploading files:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log(`GET /api/files - Fetching files for user ${req.userId}`);
    const files = await File.find({ userId: req.userId });
    console.log(`Found ${files.length} files`);
    res.json(files);
  } catch (err) {
    console.error('Error fetching files:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
