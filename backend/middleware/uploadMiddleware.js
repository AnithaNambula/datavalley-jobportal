const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Resume upload (PDF / DOC / DOCX)
const resumeFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents (.doc, .docx) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Avatar upload (JPG / PNG / WEBP)
const avatarFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG or WEBP images are allowed'), false);
  }
};

const uploadAvatar = multer({
  storage,
  fileFilter: avatarFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

module.exports = { upload, uploadAvatar };
