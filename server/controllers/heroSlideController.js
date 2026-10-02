const asyncHandler = require('express-async-handler');
const HeroSlide = require('../models/HeroSlide');

// @desc    Get admin overrides (image and/or description) per slide
// @route   GET /api/hero-slides
// @access  Public
const getHeroSlides = asyncHandler(async (req, res) => {
  const slides = await HeroSlide.find({});
  const map = {};
  slides.forEach((s) => {
    map[s.key] = {
      ...(s.image ? { image: s.image } : {}),
      ...(s.description ? { description: s.description } : {}),
    };
  });
  res.json({ success: true, slides: map });
});

// @desc    Set (or update) the image and/or description for one homepage
//          hero slide. Only the fields present in the body are changed -
//          e.g. sending just { description } leaves an existing image
//          override untouched.
// @route   PUT /api/hero-slides/:key
// @access  Private/Admin
const updateHeroSlide = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { image, description } = req.body;

  if (!HeroSlide.KEYS.includes(key)) {
    res.status(400);
    throw new Error(`Invalid hero slide key. Must be one of: ${HeroSlide.KEYS.join(', ')}`);
  }

  const updates = {};
  if (image !== undefined) {
    if (!image || typeof image !== 'string') {
      res.status(400);
      throw new Error('image must be a non-empty string');
    }
    updates.image = image;
  }
  if (description !== undefined) {
    if (!description || typeof description !== 'string') {
      res.status(400);
      throw new Error('description must be a non-empty string');
    }
    updates.description = description;
  }

  if (Object.keys(updates).length === 0) {
    res.status(400);
    throw new Error('At least one of image or description is required');
  }

  const slide = await HeroSlide.findOneAndUpdate(
    { key },
    { $set: updates },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true, slide });
});

// @desc    Remove one field (image or description) of a slide's override,
//          reverting just that field to the site default. If the slide has
//          no override left afterwards, its document is removed entirely.
// @route   DELETE /api/hero-slides/:key/:field
// @access  Private/Admin
const deleteHeroSlideField = asyncHandler(async (req, res) => {
  const { key, field } = req.params;

  if (!HeroSlide.KEYS.includes(key)) {
    res.status(400);
    throw new Error(`Invalid hero slide key. Must be one of: ${HeroSlide.KEYS.join(', ')}`);
  }
  if (!HeroSlide.FIELDS.includes(field)) {
    res.status(400);
    throw new Error(`Invalid field. Must be one of: ${HeroSlide.FIELDS.join(', ')}`);
  }

  const slide = await HeroSlide.findOneAndUpdate({ key }, { $unset: { [field]: 1 } }, { new: true });

  if (slide && !slide.image && !slide.description) {
    await HeroSlide.deleteOne({ key });
  }

  res.json({ success: true, message: `Reverted ${field} to the default` });
});

module.exports = { getHeroSlides, updateHeroSlide, deleteHeroSlideField };
