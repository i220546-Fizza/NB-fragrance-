const mongoose = require('mongoose');
const crypto = require('crypto');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    images: {
      type: [String],
      default: [],
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex'],
      required: [true, 'Gender is required'],
    },
    collectionName: {
      type: String,
      enum: ['Eclipse', 'Signature', 'Midnight', 'Essence'],
    },
    category: {
      type: String,
      enum: ['Men', 'Women', 'Unisex', 'Premium', 'Gift Sets'],
    },
    fragranceFamily: {
      type: String,
      enum: ['Fresh', 'Floral', 'Woody', 'Oud', 'Musky', 'Sweet', 'Citrus', 'Oriental'],
      required: [true, 'Fragrance family is required'],
    },
    topNotes: { type: [String], default: [] },
    heartNotes: { type: [String], default: [] },
    baseNotes: { type: [String], default: [] },
    longevity: {
      type: String,
      enum: ['Weak', 'Moderate', 'Long Lasting', 'Very Long Lasting'],
    },
    sillage: {
      type: String,
      enum: ['Intimate', 'Moderate', 'Strong', 'Enormous'],
    },
    occasion: { type: [String], default: [] },
    season: { type: [String], default: [] },
    size: { type: String, default: '50ml' },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    reviews: { type: [reviewSchema], default: [] },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text', fragranceFamily: 'text' });

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Auto-generate a unique slug from the name before saving
productSchema.pre('save', async function (next) {
  if (!this.isModified('name') && this.slug) {
    return next();
  }

  const base = slugify(this.name);
  let candidate = base;
  const Product = mongoose.model('Product');

  // Ensure uniqueness; append a short random suffix on collision
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await Product.findOne({ slug: candidate, _id: { $ne: this._id } });
    if (!existing) break;
    candidate = `${base}-${crypto.randomBytes(3).toString('hex')}`;
  }

  this.slug = candidate;
  next();
});

// Recompute average rating & review count
productSchema.methods.recomputeRating = function () {
  const numReviews = this.reviews.length;
  const rating = numReviews
    ? this.reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
    : 0;
  this.numReviews = numReviews;
  this.rating = Math.round(rating * 10) / 10;
};

module.exports = mongoose.model('Product', productSchema);
