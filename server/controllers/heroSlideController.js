const asyncHandler = require('express-async-handler');
const HeroSlide = require('../models/HeroSlide');

// @desc    Get admin overrides (image, headline and/or description) per slide
// @route   GET /api/hero-slides
// @access  Public
const getHeroSlides = asyncHandler(async (req, res) => {
  const slides = await HeroSlide.find({});
  const map = {};
  slides.forEach((s) => {
    const override = {};
    HeroSlide.FIELDS.forEach((field) => {
      if (s[field]) override[field] = s[field];
    });
    map[s.key] = override;
  });
  res.json({ success: true, slides: map });
});

// @desc    Set (or update) the image, headline and/or description for one
//          homepage hero slide. Only the fields present in the body are
//          changed - e.g. sending just { description } leaves an existing
//          image override untouched.
// @route   PUT /api/hero-slides/:key
// @access  Private/Admin
const updateHeroSlide = asyncHandler(async (req, res) => {
  const { key } = req.params;

  if (!HeroSlide.KEYS.includes(key)) {
    res.status(400);
    throw new Error(`Invalid hero slide key. Must be one of: ${HeroSlide.KEYS.join(', ')}`);
  }

  const updates = {};
  HeroSlide.FIELDS.forEach((field) => {
    const value = req.body[field];
    if (value === undefined) return;
    if (!value || typeof value !== 'string') {
      res.status(400);
      throw new Error(`${field} must be a non-empty string`);
    }
    updates[field] = value;
  });

  if (Object.keys(updates).length === 0) {
    res.status(400);
    throw new Error(`At least one of ${HeroSlide.FIELDS.join(', ')} is required`);
  }

  const slide = await HeroSlide.findOneAndUpdate(
    { key },
    { $set: updates },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true, slide });
});

// @desc    Remove one field (image, headline or description) of a slide's
//          override, reverting just that field to the site default. If the
//          slide has no override left afterwards, its document is removed.
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

  if (slide && HeroSlide.FIELDS.every((f) => !slide[f])) {
    await HeroSlide.deleteOne({ key });
  }

  res.json({ success: true, message: `Reverted ${field} to the default` });
});

module.exports = { getHeroSlides, updateHeroSlide, deleteHeroSlideField };
