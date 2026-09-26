const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const GENDERS = ['Men', 'Women', 'Unisex'];
const CATEGORIES = ['Men', 'Women', 'Unisex', 'Premium', 'Gift Sets'];
const FRAGRANCE_FAMILIES = ['Fresh', 'Floral', 'Woody', 'Oud', 'Musky', 'Sweet', 'Citrus', 'Oriental'];
const COLLECTIONS = ['Eclipse', 'Signature', 'Midnight', 'Essence'];
const LONGEVITY = ['Weak', 'Moderate', 'Long Lasting', 'Very Long Lasting'];
const SILLAGE = ['Intimate', 'Moderate', 'Strong', 'Enormous'];

// @desc    Get all products with filters, search, sort, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    gender,
    fragranceFamily,
    category,
    collectionName,
    minPrice,
    maxPrice,
    featured,
    bestseller,
    newArrival,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};

  if (search) {
    query.$text = { $search: search };
  }

  if (gender) {
    if (!GENDERS.includes(gender)) {
      res.status(400);
      throw new Error(`Invalid gender filter. Must be one of: ${GENDERS.join(', ')}`);
    }
    query.gender = gender;
  }

  if (fragranceFamily) {
    const families = fragranceFamily.split(',').map((f) => f.trim()).filter(Boolean);
    const invalid = families.filter((f) => !FRAGRANCE_FAMILIES.includes(f));
    if (invalid.length) {
      res.status(400);
      throw new Error(`Invalid fragranceFamily values: ${invalid.join(', ')}`);
    }
    query.fragranceFamily = { $in: families };
  }

  if (category) {
    if (!CATEGORIES.includes(category)) {
      res.status(400);
      throw new Error(`Invalid category filter. Must be one of: ${CATEGORIES.join(', ')}`);
    }
    query.category = category;
  }

  if (collectionName) {
    if (!COLLECTIONS.includes(collectionName)) {
      res.status(400);
      throw new Error(`Invalid collectionName filter. Must be one of: ${COLLECTIONS.join(', ')}`);
    }
    query.collectionName = collectionName;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (featured !== undefined) query.featured = featured === 'true';
  if (bestseller !== undefined) query.bestseller = bestseller === 'true';
  if (newArrival !== undefined) query.isNewArrival = newArrival === 'true';

  let sortOption = { createdAt: -1 };
  switch (sort) {
    case 'price-asc':
      sortOption = { price: 1 };
      break;
    case 'price-desc':
      sortOption = { price: -1 };
      break;
    case 'featured':
      sortOption = { featured: -1, createdAt: -1 };
      break;
    case 'rating':
      sortOption = { rating: -1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 12);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortOption).skip(skip).limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    total,
  });
});

// @desc    Discovery / "Find Your Signature Scent" quiz results
// @route   GET /api/products/discovery
// @access  Public
const getDiscoveryProducts = asyncHandler(async (req, res) => {
  const { families } = req.query;

  if (!families) {
    res.status(400);
    throw new Error('families query parameter is required (comma-separated fragranceFamily values)');
  }

  const familyList = families.split(',').map((f) => f.trim()).filter(Boolean);
  const invalid = familyList.filter((f) => !FRAGRANCE_FAMILIES.includes(f));
  if (invalid.length) {
    res.status(400);
    throw new Error(`Invalid fragranceFamily values: ${invalid.join(', ')}`);
  }

  const products = await Product.find({ fragranceFamily: { $in: familyList } })
    .sort({ rating: -1, featured: -1 })
    .limit(12);

  res.json({ success: true, products });
});

// helper to find product by ObjectId or slug
const findByIdOrSlug = async (idOrSlug) => {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const byId = await Product.findById(idOrSlug).populate('reviews.user', 'name');
    if (byId) return byId;
  }
  return Product.findOne({ slug: idOrSlug }).populate('reviews.user', 'name');
};

// @desc    Get single product by id or slug
// @route   GET /api/products/:idOrSlug
// @access  Public
const getProductByIdOrSlug = asyncHandler(async (req, res) => {
  const product = await findByIdOrSlug(req.params.idOrSlug);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

const validateProductPayload = (body, isUpdate = false) => {
  const errors = [];
  const required = ['name', 'description', 'price', 'gender', 'fragranceFamily'];

  if (!isUpdate) {
    required.forEach((field) => {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        errors.push(`${field} is required`);
      }
    });
  }

  if (body.gender !== undefined && !GENDERS.includes(body.gender)) {
    errors.push(`gender must be one of: ${GENDERS.join(', ')}`);
  }
  if (body.category !== undefined && body.category !== '' && !CATEGORIES.includes(body.category)) {
    errors.push(`category must be one of: ${CATEGORIES.join(', ')}`);
  }
  if (body.collectionName !== undefined && body.collectionName !== '' && !COLLECTIONS.includes(body.collectionName)) {
    errors.push(`collectionName must be one of: ${COLLECTIONS.join(', ')}`);
  }
  if (body.fragranceFamily !== undefined && !FRAGRANCE_FAMILIES.includes(body.fragranceFamily)) {
    errors.push(`fragranceFamily must be one of: ${FRAGRANCE_FAMILIES.join(', ')}`);
  }
  if (body.longevity !== undefined && body.longevity !== '' && !LONGEVITY.includes(body.longevity)) {
    errors.push(`longevity must be one of: ${LONGEVITY.join(', ')}`);
  }
  if (body.sillage !== undefined && body.sillage !== '' && !SILLAGE.includes(body.sillage)) {
    errors.push(`sillage must be one of: ${SILLAGE.join(', ')}`);
  }
  if (body.price !== undefined && Number.isNaN(Number(body.price))) {
    errors.push('price must be a number');
  }
  if (body.stock !== undefined && Number.isNaN(Number(body.stock))) {
    errors.push('stock must be a number');
  }

  return errors;
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const errors = validateProductPayload(req.body, false);
  if (errors.length) {
    res.status(400);
    throw new Error(errors.join('; '));
  }

  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product id');
  }

  const errors = validateProductPayload(req.body, true);
  if (errors.length) {
    res.status(400);
    throw new Error(errors.join('; '));
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  Object.assign(product, req.body);
  const updated = await product.save();

  res.json({ success: true, product: updated });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product id');
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product removed' });
});

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product id');
  }

  if (!rating || !comment) {
    res.status(400);
    throw new Error('Rating and comment are required');
  }

  const numericRating = Number(rating);
  if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    res.status(400);
    throw new Error('Rating must be a number between 1 and 5');
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: numericRating,
    comment,
    createdAt: new Date(),
  };

  product.reviews.push(review);
  product.recomputeRating();

  await product.save();

  res.status(201).json({ success: true, message: 'Review added', product });
});

// @desc    Get related products (same fragrance family or category)
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product id');
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const related = await Product.find({
    _id: { $ne: product._id },
    $or: [
      { fragranceFamily: product.fragranceFamily },
      { category: product.category },
    ],
  }).limit(4);

  res.json({ success: true, products: related });
});

module.exports = {
  getProducts,
  getDiscoveryProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getRelatedProducts,
};
