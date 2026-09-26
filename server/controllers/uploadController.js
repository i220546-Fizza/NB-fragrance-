const asyncHandler = require('express-async-handler');

// @desc    Upload product images
// @route   POST /api/uploads
// @access  Private/Admin
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files were uploaded');
  }

  const paths = req.files.map((file) => `/uploads/products/${file.filename}`);

  res.status(201).json({ success: true, paths });
});

module.exports = { uploadImages };
