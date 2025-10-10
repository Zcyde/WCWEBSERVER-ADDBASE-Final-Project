const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: String,
  color: { type: String, default: 'bg-indigo-500' },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  // 🔑 NEW: Add plannerFiles array to store file URLs
  plannerFiles: [String]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
