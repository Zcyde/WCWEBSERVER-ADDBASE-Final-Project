const mongoose = require('mongoose');

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: String,
  color: { type: String, default: 'bg-indigo-500' },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  plannerFiles: [String]
});

eventSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.date) {
      ret.date = formatDate(ret.date);
    }
    return ret;
  }
});

eventSchema.set('toObject', {
  transform: (doc, ret) => {
    if (ret.date) {
      ret.date = formatDate(ret.date);
    }
    return ret;
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
