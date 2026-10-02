const express = require('express');
const router = express.Router();
const { getHeroSlides, updateHeroSlide, deleteHeroSlide } = require('../controllers/heroSlideController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getHeroSlides);
router.put('/:key', protect, admin, updateHeroSlide);
router.delete('/:key', protect, admin, deleteHeroSlide);

module.exports = router;
