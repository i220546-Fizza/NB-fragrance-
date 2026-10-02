const express = require('express');
const router = express.Router();
const { getHeroSlides, updateHeroSlide, deleteHeroSlideField } = require('../controllers/heroSlideController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getHeroSlides);
router.put('/:key', protect, admin, updateHeroSlide);
router.delete('/:key/:field', protect, admin, deleteHeroSlideField);

module.exports = router;
