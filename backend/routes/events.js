const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const authenticateToken = require('../middleware/auth');
const { upload } = require('../config/multer');
const fs = require('fs');

// Events API
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log(`GET /api/events - Fetching events for user ${req.userId}`);
    const folderId = req.query.folderId;
    let query = { userId: req.userId };
    if (folderId) {
      query.folderId = folderId;
    }
    const events = await Event.find(query).sort({ date: 1 });
    console.log(`Found ${events.length} events`);
    // Normalize plannerFiles to ensure it's an array of strings
    events.forEach(event => {
      if (!Array.isArray(event.plannerFiles)) {
        event.plannerFiles = [];
      } else {
        event.plannerFiles = event.plannerFiles.filter(item => typeof item === 'string' && item.trim() !== '');
      }
    });
    // Format date to 'YYYY-MM-DD' for frontend compatibility
    const formattedEvents = events.map(event => {
      const obj = event.toObject();
      obj.date = event.date.toISOString().split('T')[0];
      return obj;
    });
    res.json(formattedEvents);
  } catch (err) {
    console.error('Error fetching events:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const eventData = req.body;
    console.log(`POST /api/events - Creating event: ${eventData.title} for user ${req.userId}`);
    if (!eventData.date || !eventData.title) {
      return res.status(400).json({ error: 'Date and title are required' });
    }
    const newEvent = new Event({ ...eventData, userId: req.userId });
    await newEvent.save();
    console.log(`Event created with ID: ${newEvent._id}`);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Error creating event:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticateToken, upload.array('files'), async (req, res) => {
  const id = req.params.id;
  const newFiles = req.files || [];
  let eventData;

  try {
    if (req.body.data) {
      eventData = JSON.parse(req.body.data);
    } else {
      eventData = req.body;
    }
  } catch (e) {
    newFiles.forEach(file => fs.unlinkSync(file.path));
    return res.status(400).json({ error: 'Invalid data format.' });
  }

  try {
    console.log(`PUT /api/events/${id} - Updating event (new files: ${newFiles.length}) for user ${req.userId}`);

    // Prepare new file URLs
    const newFileUrls = newFiles.map(file => `/uploads/${file.filename}`);

    // Combine retained and new files
    let retainedFiles = eventData.plannerFiles;
    if (!Array.isArray(retainedFiles)) {
      retainedFiles = [];
    } else {
      retainedFiles = retainedFiles.filter(item => typeof item === 'string' && item.trim() !== '');
    }
    const finalPlannerFiles = [...retainedFiles, ...newFileUrls];

    // Construct update object
    const updateObject = { ...eventData, plannerFiles: finalPlannerFiles };
    delete updateObject.id;
    delete updateObject._id;

    // Update
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updateObject,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      newFiles.forEach(file => fs.unlinkSync(file.path));
      return res.status(404).json({ error: 'Event not found' });
    }

    console.log(`Event updated: ${updatedEvent._id}. Total files: ${finalPlannerFiles.length}`);
    res.json(updatedEvent);

  } catch (err) {
    console.error('Error updating event:', err.message);
    newFiles.forEach(file => fs.unlinkSync(file.path));
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`DELETE /api/events/${id} - Deleting event for user ${req.userId}`);
    const deletedEvent = await Event.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    console.log(`Event deleted: ${id}`);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
