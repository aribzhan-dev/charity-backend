const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const getFolder = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype.startsWith('video/')) return 'videos';
  if (mimetype.startsWith('audio/')) return 'audios';
  return 'files';
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getFolder(file.mimetype);
    cb(null, `uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);      
    const uniqueName = `${uuidv4()}${ext}`;           
    cb(null, uniqueName);
  }
});


const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/mkv',
    'audio/mpeg', 'audio/wav',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Ruxsat etilmagan fayl turi: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024  
  }
});

module.exports = upload;