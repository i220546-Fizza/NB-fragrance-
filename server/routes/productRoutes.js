const express = require('express');
const router = express.Router();
const {
  getProducts,
  getDiscoveryProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getRelatedProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Specific routes before the generic /:idOrSlug catch-all
router.get('/discovery', getDiscoveryProducts);

router.route('/').get(getProducts).post(protect, admin, createProduct);

router.get('/:id/related', getRelatedProducts);
router.post('/:id/reviews', protect, addProductReview);

router
  .route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Generic id-or-slug lookup last so it doesn't shadow the routes above
router.get('/:idOrSlug', getProductByIdOrSlug);

module.exports = router;
