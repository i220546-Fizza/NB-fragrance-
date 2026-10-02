const mongoose = require('mongoose');

// The homepage hero carousel always has these 5 fixed slides. A document
// here is an admin-uploaded override of a slide's image and/or description
// text; a slide with no document (or with a field left unset) just uses the
// site's bundled default for that field.
const HERO_SLIDE_KEYS = ['zafora', 'eclipse', 'signature', 'midnight', 'essence'];
const HERO_SLIDE_FIELDS = ['image', 'description'];

const heroSlideSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, enum: HERO_SLIDE_KEYS },
    image: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

heroSlideSchema.pre('validate', function preValidate(next) {
  if (!this.image && !this.description) {
    next(new Error('At least one of image or description must be set'));
  } else {
    next();
  }
});

const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);
HeroSlide.KEYS = HERO_SLIDE_KEYS;
HeroSlide.FIELDS = HERO_SLIDE_FIELDS;

module.exports = HeroSlide;
