const asyncHandler = require('express-async-handler');
const HeroSlide = require('../models/HeroSlide');

// @desc    Get admin-uploaded hero image overrides, keyed by slide
// @route   GET /api/hero-slides
// @access  Public
const getHeroSlides = asyncHandler(async (req, res) => {
  const slides = await HeroSlide.find({});
  const map = {};
  slides.forEach((s) => {
    map[s.key] = s.image;
  });
  res.json({ success: true, slides: map });
});

// @desc    Set (or replace) the image for one homepage hero slide
// @route   PUT /api/hero-slides/:key
// @access  Private/Admin
const updateHeroSlide = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { image } = req.body;

  if (!HeroSlide.KEYS.includes(key)) {
    res.status(400);
    throw new Error(`Invalid hero slide key. Must be one of: ${HeroSlide.KEYS.join(', ')}`);
  }

  if (!image || typeof image !== 'string') {
    res.status(400);
    throw new Error('image is required');
  }

  const slide = await HeroSlide.findOneAndUpdate(
    { key },
    { key, image },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true, slide });
});

// @desc    Remove a slide's custom image, reverting it to the site default
// @route   DELETE /api/hero-slides/:key
// @access  Private/Admin
const deleteHeroSlide = asyncHandler(async (req, res) => {
  const { key } = req.params;

  if (!HeroSlide.KEYS.includes(key)) {
    res.status(400);
    throw new Error(`Invalid hero slide key. Must be one of: ${HeroSlide.KEYS.join(', ')}`);
  }

  await HeroSlide.deleteOne({ key });
  res.json({ success: true, message: 'Reverted to the default image' });
});

module.exports = { getHeroSlides, updateHeroSlide, deleteHeroSlide };
