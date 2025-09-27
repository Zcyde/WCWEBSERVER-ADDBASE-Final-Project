
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const serv = process.env.serv || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// In-memory data storage
let folders = [];
let events = [];
let nextFolderId = 1;
let nextEventId = 1;

// placeholder routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes for folders
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

// API routes for events
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

app.listen(serv, () => {
  console.log(`Server running on http://localhost:${serv}`);
});
