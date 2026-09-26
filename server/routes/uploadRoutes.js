const express = require('express');
const router = express.Router();
const { uploadImages } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, admin, upload.array('images', 6), uploadImages);

module.exports = router;
