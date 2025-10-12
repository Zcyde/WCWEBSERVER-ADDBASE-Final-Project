const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const Event = require('../models/Event');
const authenticateToken = require('../middleware/auth');

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

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const folderId = req.params.id;
        console.log(`DELETE /api/folders/${folderId} - Deleting folder and events for user ${req.userId}`);
        
        const eventResult = await Event.deleteMany({ 
            folderId: folderId, 
            userId: req.userId 
        });
        console.log(`[Manual Cascade] Deleted ${eventResult.deletedCount} associated events.`);
        
        const folderResult = await Folder.findOneAndDelete({ 
            _id: folderId, 
            userId: req.userId 
        }); 

        if (!folderResult) {
            return res.status(404).json({ error: 'Planner not found' });
        }

        console.log(`Folder deleted: ${folderId}`);
        return res.status(204).send(); 

    } catch (err) {
        console.error(`FATAL SERVER ERROR during delete of folder ${req.params.id}:`, err);
        res.status(500).json({ error: 'Server failed to delete the planner and its contents.' });
    }
});

module.exports = router;