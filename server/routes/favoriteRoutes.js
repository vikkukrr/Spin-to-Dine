const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites, checkFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.get('/check/:restaurantId', checkFavorite);
router.delete('/:restaurantId', removeFavorite);

module.exports = router;
