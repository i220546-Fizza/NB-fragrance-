const path = require('path');
const fs = require('fs');
const multer = require('multer');

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, webp, svg) are allowed'), false);
  }
};

// When Cloudinary credentials are configured, uploads are streamed straight to
// Cloudinary (see uploadController.js) so they survive host restarts/redeploys -
// keep files in memory rather than writing them to local disk first. Without
// Cloudinary configured (e.g. local dev with nothing set up), fall back to
// saving on local disk exactly as before, so `npm run dev` keeps working with
// zero extra setup.
const useCloudinary = Boolean(process.env.CLOUDINARY_CLOUD_NAME);

let storage;
if (useCloudinary) {
  storage = multer.memoryStorage();
} else {
  const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const sanitized = file.originalname
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9.\-_]/g, '');
      cb(null, `${Date.now()}-${sanitized}`);
    },
  });
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
