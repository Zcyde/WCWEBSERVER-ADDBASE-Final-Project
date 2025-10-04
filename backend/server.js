
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const serv = process.env.serv || 3000;

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

const folderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, default: 'bg-gray-400' },
});
const Folder = mongoose.model('Folder', folderSchema);

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

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: String,
  gender: String,
  address: String,
  birthDate: Date,
  avatar: { type: String, default: 'https://placehold.co/200x200?text=User' },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
}, { timestamps: true });
const File = mongoose.model('File', fileSchema);

// multer storage setup
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

// Ensure a single user document exists or create one
async function getUser() {
  let user = await User.findOne();
  if (!user) {
    user = new User();
    await user.save();
  }
  return user;
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// routes
app.get('/', (req, res) => {
  console.log('GET / - Serving index.html');
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/api/status', (req, res) => {
  console.log('GET /api/status - Status check');
  res.json({ status: 'ok' });
});

// Folders API
app.get('/api/folders', authenticateToken, async (req, res) => {
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

app.post('/api/folders', authenticateToken, async (req, res) => {
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

// Events API
app.get('/api/events', authenticateToken, async (req, res) => {
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

app.post('/api/events', authenticateToken, async (req, res) => {
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

app.put('/api/events/:id', authenticateToken, upload.array('files'), async (req, res) => {
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

// Portfolio file API
app.post('/api/files', authenticateToken, upload.array('files'), async (req, res) => {
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

app.get('/api/files', authenticateToken, async (req, res) => {
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

// User routes
app.get('/api/user', authenticateToken, async (req, res) => {
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

app.put('/api/user', authenticateToken, async (req, res) => {
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

app.post('/api/user/avatar', authenticateToken, uploadAvatar.single('avatar'), async (req, res) => {
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

// Auth routes
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, contact, gender, address, birthDate } = req.body;
    console.log(`POST /api/signup - Attempting to sign up user: ${username} (${email})`);

    // Validate required fields
    if (!firstName || !lastName || !email || !username || !password) {
      console.log('Signup failed: Missing required fields');
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log(`Signup failed: User already exists - ${username} or ${email}`);
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      contact,
      gender,
      address,
      birthDate: birthDate ? new Date(birthDate) : undefined,
    });

    await newUser.save();
    console.log(`User signed up successfully: ${newUser.username} (ID: ${newUser._id})`);

    // Generate JWT
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    // Return user and token
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Error during signup:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`POST /api/login - Attempting login for: ${username}`);

    if (!username || !password) {
      console.log('Login failed: Missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by username or email
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!user) {
      console.log(`Login failed: User not found - ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`Login failed: Invalid password for user - ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`User logged in successfully: ${user.username} (ID: ${user._id})`);

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Return user and token
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// host
app.listen(serv, () => {
  console.log(`Server running on http://localhost:${serv}`);
});
