const axios = require('axios');

const generateRecipe = async (req, res) => {
  try {
    const { ingredients, cuisine, dietary, mealType, cookingTime, difficulty, servings } = req.body;

    if (!ingredients || ingredients.length < 2) {
      return res.status(400).json({ message: 'Please add at least 2 ingredients' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      const fallback = getFallbackRecipe({ ingredients, cuisine, mealType });
      return res.json(fallback);
    }

    const prompt = `You are a professional chef and nutritionist. Generate a detailed recipe with these requirements:
- Ingredients available: ${ingredients.join(', ')}
- Cuisine: ${cuisine || 'Any'}
- Dietary: ${(dietary || []).join(', ')}
- Meal type: ${mealType || 'Any'}
- Cooking time: ${cookingTime || 'Any'}
- Difficulty: ${difficulty || 'Any'}
- Servings: ${servings || 2}

Respond ONLY in this exact JSON format, no markdown, no code fences:
{
  "name": "Recipe Name",
  "emoji": "🍛",
  "imageQuery": "recipe name for image search",
  "cookTime": "25 mins",
  "calories": 450,
  "difficulty": "Beginner",
  "ingredients": [
    {"item": "Chicken breast", "quantity": "200g", "available": true}
  ],
  "instructions": [
    {"step": 1, "text": "Description of step", "timer": 0}
  ],
  "nutrition": {
    "calories": 450, "protein": "32g", "carbs": "28g", "fats": "12g", "fiber": "4g"
  },
  "tips": ["Chef tip 1", "Chef tip 2", "Chef tip 3"],
  "storage": "Store in fridge for up to 3 days",
  "variations": ["Variation 1", "Variation 2"]
}`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        timeout: 30000
      }
    );

    const content = response.data.content[0].text;
    const recipe = JSON.parse(content);
    recipe.imageUrl = getUnsplashUrl(recipe.imageQuery || recipe.name);
    res.json(recipe);
  } catch (error) {
    console.error('Recipe generation error:', error.message);
    if (error.response) {
      console.error('Claude API error:', error.response.data);
    }
    const fallback = getFallbackRecipe({ ingredients: req.body.ingredients || ['chicken', 'rice'], cuisine: req.body.cuisine, mealType: req.body.mealType });
    res.json(fallback);
  }
};

const getUnsplashUrl = (query) => {
  const q = encodeURIComponent(query.split(' ').slice(0, 3).join(' '));
  return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80`;
};

const getFallbackRecipe = ({ ingredients, cuisine, mealType }) => {
  const recipes = [
    {
      name: 'Spiced Herb Chicken',
      emoji: '🍗',
      imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74f8e547ff?w=600&h=400&fit=crop',
      cookTime: '30 mins',
      calories: 420,
      difficulty: 'Intermediate',
      ingredients: [
        { item: 'Chicken breast', quantity: '300g', available: true },
        { item: 'Garlic', quantity: '4 cloves', available: true },
        { item: 'Olive oil', quantity: '2 tbsp', available: false },
        { item: 'Mixed herbs', quantity: '1 tsp', available: false },
        { item: 'Salt', quantity: 'to taste', available: true },
        { item: 'Black pepper', quantity: 'to taste', available: true }
      ],
      instructions: [
        { step: 1, text: 'Season chicken breasts with salt, pepper, and mixed herbs on both sides.', timer: 0 },
        { step: 2, text: 'Heat olive oil in a pan over medium-high heat.', timer: 60 },
        { step: 3, text: 'Sear chicken for 5-6 minutes each side until golden brown and cooked through.', timer: 360 },
        { step: 4, text: 'Crush garlic and add to the pan in the last 2 minutes for flavor.', timer: 120 },
        { step: 5, text: 'Rest the chicken for 5 minutes before slicing and serving.', timer: 300 }
      ],
      nutrition: { calories: 420, protein: '46g', carbs: '2g', fats: '18g', fiber: '0g' },
      tips: ['Let the chicken rest at room temperature for 15 minutes before cooking for even results.', 'Use a meat thermometer — internal temp should reach 74°C/165°F.', 'Pat the chicken dry with paper towels for a better sear.'],
      storage: 'Refrigerate in an airtight container for up to 4 days.',
      variations: ['Add lemon juice and zest for a citrus twist.', 'Substitute chicken with tofu or paneer for a vegetarian version.', 'Add chili flakes for a spicy kick.']
    },
    {
      name: 'Garden Pasta Primavera',
      emoji: '🍝',
      imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&h=400&fit=crop',
      cookTime: '25 mins',
      calories: 380,
      difficulty: 'Beginner',
      ingredients: [
        { item: 'Pasta', quantity: '200g', available: true },
        { item: 'Mixed vegetables', quantity: '2 cups', available: true },
        { item: 'Garlic', quantity: '3 cloves', available: true },
        { item: 'Olive oil', quantity: '2 tbsp', available: false },
        { item: 'Parmesan cheese', quantity: '30g', available: false },
        { item: 'Salt', quantity: 'to taste', available: true }
      ],
      instructions: [
        { step: 1, text: 'Bring a large pot of salted water to boil and cook pasta according to package directions.', timer: 480 },
        { step: 2, text: 'While pasta cooks, heat olive oil in a large pan over medium heat.', timer: 60 },
        { step: 3, text: 'Add minced garlic and sauté for 30 seconds until fragrant.', timer: 30 },
        { step: 4, text: 'Add mixed vegetables and cook for 5-7 minutes until tender-crisp.', timer: 360 },
        { step: 5, text: 'Drain pasta, reserve 1/2 cup pasta water. Toss pasta with vegetables.', timer: 0 },
        { step: 6, text: 'Add Parmesan and a splash of pasta water, toss well. Serve hot.', timer: 0 }
      ],
      nutrition: { calories: 380, protein: '14g', carbs: '52g', fats: '12g', fiber: '6g' },
      tips: ['Cut vegetables uniformly for even cooking.', 'Reserve pasta water — the starch helps the sauce cling to the pasta.', 'Add a pinch of red pepper flakes for gentle heat.'],
      storage: 'Refrigerate for up to 3 days. Reheat with a splash of water.',
      variations: ['Add grilled chicken or shrimp for extra protein.', 'Use whole wheat or gluten-free pasta as needed.', 'Swap Parmesan for nutritional yeast for a vegan version.']
    },
    {
      name: 'Creamy Garlic Mushroom Rice',
      emoji: '🍚',
      imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop',
      cookTime: '35 mins',
      calories: 450,
      difficulty: 'Beginner',
      ingredients: [
        { item: 'Rice', quantity: '1 cup', available: true },
        { item: 'Mushrooms', quantity: '200g', available: true },
        { item: 'Garlic', quantity: '4 cloves', available: true },
        { item: 'Onion', quantity: '1 medium', available: true },
        { item: 'Butter', quantity: '2 tbsp', available: false },
        { item: 'Cream', quantity: '1/2 cup', available: false }
      ],
      instructions: [
        { step: 1, text: 'Cook rice according to package directions and set aside.', timer: 600 },
        { step: 2, text: 'Melt butter in a large pan over medium heat.', timer: 60 },
        { step: 3, text: 'Sauté diced onion for 3 minutes until translucent.', timer: 180 },
        { step: 4, text: 'Add sliced mushrooms and minced garlic, cook for 5-6 minutes until golden.', timer: 360 },
        { step: 5, text: 'Pour in cream, stir well and let simmer for 2 minutes.', timer: 120 },
        { step: 6, text: 'Fold in cooked rice, season with salt and pepper. Serve garnished with parsley.', timer: 0 }
      ],
      nutrition: { calories: 450, protein: '10g', carbs: '58g', fats: '18g', fiber: '2g' },
      tips: ['Use a mix of mushroom varieties for deeper flavor.', 'Toast the rice in butter before cooking for a nutty taste.', 'Add thyme or rosemary for an aromatic touch.'],
      storage: 'Refrigerate for up to 3 days. Add a splash of milk when reheating.',
      variations: ['Add cooked chicken or bacon for extra protein.', 'Use brown rice for a healthier version.', 'Make it vegan with coconut cream and plant butter.']
    }
  ];

  let selected = recipes[Math.floor(Math.random() * recipes.length)];
  selected.ingredients = selected.ingredients.map(ing => ({
    ...ing,
    available: ingredients ? ingredients.some(i => i.toLowerCase().includes(ing.item.toLowerCase().split(' ')[0].toLowerCase())) : ing.available
  }));
  return selected;
};

const saveRecipe = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.savedRecipes) user.savedRecipes = [];
    user.savedRecipes.push({ ...req.body, savedAt: new Date() });
    await user.save();
    res.json({ message: 'Recipe saved!', savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSavedRecipes = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.savedRecipes || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSavedRecipe = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.savedRecipes = (user.savedRecipes || []).filter((_, i) => i.toString() !== req.params.index);
    await user.save();
    res.json({ message: 'Recipe removed', savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateRecipe, saveRecipe, getSavedRecipes, deleteSavedRecipe };