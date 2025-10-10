const multer = require('multer');
const path = require('path');

// General file storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Avatar storage setup
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
  }
});
const uploadAvatar = multer({ storage: avatarStorage });

module.exports = { upload, uploadAvatar };
