const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateRecipe, saveRecipe, getSavedRecipes, deleteSavedRecipe } = require('../controllers/recipeController');

router.post('/generate', generateRecipe);
router.post('/save', protect, saveRecipe);
router.get('/saved', protect, getSavedRecipes);
router.delete('/saved/:index', protect, deleteSavedRecipe);

module.exports = router;