const mongoose = require('mongoose');

// The homepage hero carousel always has these 5 fixed slides. A document
// here is an admin-uploaded override of a slide's image; a slide with no
// document just uses the site's bundled default artwork.
const HERO_SLIDE_KEYS = ['zafora', 'eclipse', 'signature', 'midnight', 'essence'];

const heroSlideSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, enum: HERO_SLIDE_KEYS },
    image: { type: String, required: [true, 'image is required'] },
  },
  { timestamps: true }
);

const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);
HeroSlide.KEYS = HERO_SLIDE_KEYS;

module.exports = HeroSlide;
