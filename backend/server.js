
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const serv = process.env.serv || 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadAvatar = multer({ storage: avatarStorage });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));

// in-memory data storage
let folders = [];
let events = [];
let nextFolderId = 1;
let nextEventId = 1;

// user profile
let user = {
  username: 'user',
  contact: '',
  gender: '',
  address: '',
  avatar: 'https://placehold.co/200x200?text=User' // placeholder
};

// placeholder routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' });
});

// api routes
app.get('/api/folders', (req, res) => {
  res.json(folders);
});

app.post('/api/folders', (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const newFolder = { id: nextFolderId++, name, color: color || 'bg-gray-400' };
  folders.push(newFolder);
  res.status(201).json(newFolder);
});

app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const eventData = req.body;
  const newEvent = { id: nextEventId++, ...eventData, color: eventData.color || 'bg-indigo-500' };
  events.push(newEvent);
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  res.status(201).json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ error: 'Event not found' });
  events[index] = { ...events[index], ...req.body };
  res.json(events[index]);
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ error: 'Event not found' });
  events.splice(index, 1);
  res.status(204).send();
});

// portfolio routes
app.post('/api/files', upload.array('files'), (req, res) => {
  const files = req.files.map(file => ({
    name: file.originalname,
    filename: file.filename,
    path: `/uploads/${file.filename}`,
    size: file.size
  }));
  res.json(files);
});

app.get('/api/files', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const fileList = files.map(filename => {
      const stats = fs.statSync(path.join(__dirname, 'uploads', filename));
      return {
        name: filename.split('-').slice(1).join('-'), // remove timestamp prefix
        filename,
        path: `/uploads/${filename}`,
        size: stats.size
      };
    });
    res.json(fileList);
  });
});

// user routes
app.get('/api/user', (req, res) => {
  res.json(user);
});

app.put('/api/user', (req, res) => {
  const { username, contact, gender, address } = req.body;
  if (username !== undefined) user.username = username;
  if (contact !== undefined) user.contact = contact;
  if (gender !== undefined) user.gender = gender;
  if (address !== undefined) user.address = address;
  res.json(user);
});

app.post('/api/user/avatar', uploadAvatar.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  user.avatar = `/avatars/${req.file.filename}`;
  res.json({ avatar: user.avatar });
});

// host
app.listen(serv, () => {
  console.log(`Server running on http://localhost:${serv}`);
});
