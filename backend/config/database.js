const mongoose = require('mongoose');

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/domoredb';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;
