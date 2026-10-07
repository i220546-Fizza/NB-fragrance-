const asyncHandler = require('express-async-handler');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const useCloudinary = Boolean(process.env.CLOUDINARY_CLOUD_NAME);

// @desc    Upload product images
// @route   POST /api/uploads
// @access  Private/Admin
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files were uploaded');
  }

  let paths;
  if (useCloudinary) {
    const results = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer, {
          folder: 'nb-classic-scents',
          filename: file.originalname,
          mimeType: file.mimetype,
        })
      )
    );
    paths = results.map((result) => result.secure_url);
  } else {
    paths = req.files.map((file) => `/uploads/products/${file.filename}`);
  }

  res.status(201).json({ success: true, paths });
});

module.exports = { uploadImages };
