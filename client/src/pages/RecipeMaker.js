import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import recipeService from '../services/recipeService';
import '../styles/recipeMaker.css';

const CUISINES = ['Indian', 'Italian', 'Chinese', 'Mexican', 'Continental', 'Any'];
const DIETARY = ['Vegetarian', 'Vegan', 'Gluten-Free', 'High Protein', 'Low Calorie'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
const COOK_TIMES = ['Under 15 min', '15-30 min', '30-60 min', '60+ min'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Chef Level'];

const LOADING_MESSAGES = [
  'Our AI chef is cooking up something special...',
  'Adding the perfect spices...',
  'Just a few more seconds...',
  'Plating your dish...',
  'Taste-testing for quality...'
];

const RecipeMaker = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [cuisine, setCuisine] = useState('Any');
  const [dietary, setDietary] = useState([]);
  const [mealType, setMealType] = useState('Dinner');
  const [cookingTime, setCookingTime] = useState('15-30 min');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [servings, setServings] = useState(2);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ingredients');
  const [checkedItems, setCheckedItems] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [timers, setTimers] = useState({});
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedMessage, setSavedMessage] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const inputRef = useRef(null);
  const timerRefs = useRef({});

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (isAuthenticated) {
      recipeService.getSaved().then(setSavedRecipes).catch(() => {});
    }
  }, [isAuthenticated]);

  const addIngredient = useCallback(() => {
    const val = ingredientInput.trim().toLowerCase();
    if (val && !ingredients.includes(val)) {
      setIngredients(prev => [...prev, val]);
      setIngredientInput('');
    }
  }, [ingredientInput, ingredients]);

  const removeIngredient = (idx) => {
    setIngredients(prev => prev.filter((_, i) => i !== idx));
  };

  const handleIngredientKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addIngredient();
    }
  };

  const toggleDietary = (value) => {
    setDietary(prev => prev.includes(value) ? prev.filter(d => d !== value) : [...prev, value]);
  };

  const generateRecipe = async () => {
    if (ingredients.length < 2) {
      setError('Please add at least 2 ingredients');
      return;
    }
    setError('');
    setRecipe(null);
    setActiveTab('ingredients');
    setCheckedItems({});
    setCurrentStep(0);
    setTimers({});
    setLoading(true);

    try {
      const result = await recipeService.generate({
        ingredients, cuisine, dietary, mealType, cookingTime, difficulty, servings
      });
      setRecipe(result);
      const initialChecked = {};
      result.ingredients?.forEach((_, i) => { initialChecked[i] = false; });
      setCheckedItems(initialChecked);
    } catch (err) {
      setError('Our chef needs a break, try again!');
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const startTimer = (stepIdx, seconds) => {
    if (timers[stepIdx]?.active) {
      clearInterval(timerRefs.current[stepIdx]);
      setTimers(prev => ({ ...prev, [stepIdx]: { ...prev[stepIdx], active: false, remaining: seconds } }));
      return;
    }
    setTimers(prev => ({ ...prev, [stepIdx]: { active: true, remaining: seconds, total: seconds } }));
    timerRefs.current[stepIdx] = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev };
        if (updated[stepIdx] && updated[stepIdx].remaining > 0) {
          updated[stepIdx] = { ...updated[stepIdx], remaining: updated[stepIdx].remaining - 1 };
          if (updated[stepIdx].remaining <= 0) {
            clearInterval(timerRefs.current[stepIdx]);
            updated[stepIdx] = { ...updated[stepIdx], active: false, remaining: 0 };
          }
        }
        return updated;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const saveRecipe = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await recipeService.save(recipe);
      setSavedMessage('Recipe saved!');
      setTimeout(() => setSavedMessage(''), 3000);
      const saved = await recipeService.getSaved();
      setSavedRecipes(saved);
    } catch (err) {
      setSavedMessage('Failed to save. Try again.');
      setTimeout(() => setSavedMessage(''), 3000);
    }
  };

  const loadSavedRecipe = (saved) => {
    setRecipe(saved);
    setActiveTab('ingredients');
    const initialChecked = {};
    saved.ingredients?.forEach((_, i) => { initialChecked[i] = false; });
    setCheckedItems(initialChecked);
    setCurrentStep(0);
    setTimers({});
    setShowSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeSaved = async (idx) => {
    try {
      await recipeService.deleteSaved(idx);
      setSavedRecipes(prev => prev.filter((_, i) => i !== idx));
    } catch (err) {
      console.error('Failed to remove saved recipe');
    }
  };

  if (loading) {
    return (
      <div className="recipe-maker-page">
        <div className="recipe-loading">
          <div className="recipe-loading-glow" />
          <div className="recipe-loading-icon">🍳</div>
          <div className="recipe-loading-message">{LOADING_MESSAGES[loadingMsgIdx]}</div>
          <div className="recipe-loading-sub">Using AI to craft the perfect recipe for you...</div>
        </div>
      </div>
    );
  }

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalIngredients = recipe?.ingredients?.length || 0;
  const progressPct = totalIngredients > 0 ? (currentStep / (recipe?.instructions?.length || 1)) * 100 : 0;
  const availableCount = recipe?.ingredients?.filter(i => i.available)?.length || 0;

  const macroTotal = recipe?.nutrition
    ? parseInt(recipe.nutrition.protein) + parseInt(recipe.nutrition.carbs) + parseInt(recipe.nutrition.fats)
    : 1;

  return (
    <div className="recipe-maker-page">
      <div className="recipe-input-panel">
        <h1>AI Recipe Generator</h1>
        <p className="panel-subtitle">Tell us what you have, we'll make something delicious!</p>

        <div className="recipe-form-grid">
          <div className="recipe-form-full">
            <div className="recipe-form-group">
              <label>Ingredients you have</label>
              <div className="tag-input-wrapper" onClick={() => inputRef.current?.focus()}>
                {ingredients.map((ing, i) => (
                  <span key={i} className="ingredient-tag">
                    {ing}
                    <button onClick={() => removeIngredient(i)} type="button">✕</button>
                  </span>
                ))}
                <input
                  ref={inputRef}
                  className="tag-input"
                  placeholder={ingredients.length === 0 ? 'e.g. chicken, tomato, garlic...' : 'Add more...'}
                  value={ingredientInput}
                  onChange={e => setIngredientInput(e.target.value)}
                  onKeyDown={handleIngredientKey}
                  onBlur={addIngredient}
                />
              </div>
            </div>
          </div>

          <div className="recipe-form-group">
            <label>Cuisine Preference</label>
            <div className="pill-group">
              {CUISINES.map(c => (
                <button key={c} className={`pill-option ${cuisine === c ? 'active' : ''}`} onClick={() => setCuisine(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="recipe-form-group">
            <label>Meal Type</label>
            <div className="pill-group">
              {MEAL_TYPES.map(m => (
                <button key={m} className={`pill-option ${mealType === m ? 'active-orange' : ''}`} onClick={() => setMealType(m)}>{m}</button>
              ))}
            </div>
          </div>

          <div className="recipe-form-group">
            <label>Dietary Preference</label>
            <div className="pill-group">
              {DIETARY.map(d => (
                <button key={d} className={`pill-option ${dietary.includes(d) ? 'active' : ''}`} onClick={() => toggleDietary(d)}>{d}</button>
              ))}
            </div>
          </div>

          <div className="recipe-form-group">
            <label>Cooking Time</label>
            <div className="pill-group">
              {COOK_TIMES.map(t => (
                <button key={t} className={`pill-option ${cookingTime === t ? 'active-orange' : ''}`} onClick={() => setCookingTime(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="recipe-form-group">
            <label>Difficulty</label>
            <div className="pill-group">
              {DIFFICULTIES.map(d => (
                <button key={d} className={`pill-option ${difficulty === d ? 'active' : ''}`} onClick={() => setDifficulty(d)}>{d}</button>
              ))}
            </div>
          </div>

          <div className="recipe-form-group">
            <label>Servings</label>
            <input type="number" min={1} max={20} value={servings} onChange={e => setServings(Math.max(1, parseInt(e.target.value) || 1))} className="servings-input" />
          </div>
        </div>

        {error && (
          <div className="recipe-error">
            <div className="error-icon">😅</div>
            <h3>Oops!</h3>
            <p>{error}</p>
          </div>
        )}

        <button className="generate-btn" onClick={generateRecipe} disabled={ingredients.length < 2}>
          Generate Recipe
        </button>
      </div>

      {recipe && !loading && (
        <div className="recipe-result-card">
          <div className="recipe-result-image" style={{ backgroundImage: `url(${recipe.imageUrl})` }}>
            <div className="recipe-name-overlay">{recipe.emoji} {recipe.name}</div>
          </div>

          <div className="recipe-result-body">
            <div className="recipe-badges">
              <span className="recipe-badge">⏱️ {recipe.cookTime}</span>
              <span className="recipe-badge">👥 {servings} servings</span>
              <span className="recipe-badge">🔥 {recipe.calories} cal</span>
              <span className="recipe-badge">📊 {recipe.difficulty}</span>
            </div>

            <div className="recipe-tabs">
              {['ingredients', 'instructions', 'nutrition', 'tips'].map(tab => (
                <button key={tab} className={`recipe-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab === 'ingredients' && '📝 '}{tab === 'instructions' && '👨‍🍳 '}{tab === 'nutrition' && '🥗 '}{tab === 'tips' && '💡 '}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'ingredients' && (
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  {checkedCount}/{totalIngredients} collected · {availableCount} available from your pantry
                </div>
                <div className="ingredient-list">
                  {recipe.ingredients?.map((ing, i) => (
                    <div key={i} className={`ingredient-item ${ing.available ? 'available' : 'missing'} ${checkedItems[i] ? 'checked' : ''}`} onClick={() => toggleCheck(i)}>
                      <input type="checkbox" className="ingredient-checkbox" checked={checkedItems[i] || false} onChange={() => toggleCheck(i)} />
                      <span className="ingredient-name">{ing.item}</span>
                      <span className="ingredient-qty">{ing.quantity}</span>
                      {checkedItems[i] && <span className="checked-label">✓</span>}
                      {ing.available && !checkedItems[i] && <span style={{ fontSize: '0.7rem', color: '#22C55E', fontWeight: 600 }}>You have this</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div>
                <div className="instructions-progress">
                  <div className="instructions-progress-bar" style={{ width: `${progressPct}%` }} />
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  Step {Math.min(currentStep + 1, recipe.instructions?.length || 0)} of {recipe.instructions?.length || 0}
                </div>
                <div className="instructions-list">
                  {recipe.instructions?.map((inst, i) => (
                    <div key={i} className={`instruction-step ${i < currentStep ? 'completed' : i === currentStep ? 'active' : ''}`}
                      onClick={() => setCurrentStep(i)}>
                      <div className="step-number">{i < currentStep ? '✓' : inst.step}</div>
                      <div className="step-content">
                        <div className="step-text">{inst.text}</div>
                        {inst.timer > 0 && (
                          <button className={`timer-btn ${timers[i]?.active ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); startTimer(i, inst.timer); }}>
                            {timers[i]?.active ? '⏹ Stop' : timers[i]?.remaining > 0 && !timers[i]?.active ? `⏱ ${formatTime(timers[i].remaining)}` : `⏱ Start ${formatTime(inst.timer)}`}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <div className="nutrition-grid">
                  {recipe.nutrition && [
                    { label: 'Calories', value: recipe.nutrition.calories, unit: 'kcal' },
                    { label: 'Protein', value: recipe.nutrition.protein, unit: '' },
                    { label: 'Carbs', value: recipe.nutrition.carbs, unit: '' },
                    { label: 'Fats', value: recipe.nutrition.fats, unit: '' },
                    { label: 'Fiber', value: recipe.nutrition.fiber, unit: '' }
                  ].map((n, i) => (
                    <div key={i} className="nutrition-item">
                      <div className="nutrition-value">{n.value}{n.unit}</div>
                      <div className="nutrition-label">{n.label}</div>
                    </div>
                  ))}
                </div>
                <div className="nutrition-donut">
                  <h4>Macro Breakdown</h4>
                  <div className="macro-bars">
                    {recipe.nutrition && [
                      { label: 'Protein', value: parseInt(recipe.nutrition.protein), color: '#22C55E' },
                      { label: 'Carbs', value: parseInt(recipe.nutrition.carbs), color: '#FF8C42' },
                      { label: 'Fats', value: parseInt(recipe.nutrition.fats), color: '#8B5CF6' }
                    ].map((m, i) => {
                      const pct = Math.round((m.value / macroTotal) * 100);
                      return (
                        <div key={i} className="macro-bar">
                          <span className="macro-label">{m.label}</span>
                          <div className="macro-track">
                            <div className="macro-fill" style={{ width: `${pct}%`, background: m.color }} />
                          </div>
                          <span className="macro-pct">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="tips-section">
                {recipe.tips?.map((tip, i) => (
                  <div key={i} className="tip-card">
                    <span className="tip-icon">👨‍🍳</span>
                    <span className="tip-text">{tip}</span>
                  </div>
                ))}
                {recipe.storage && (
                  <div className="tip-card storage">
                    <span className="tip-icon">🧊</span>
                    <span className="tip-text"><strong>Storage:</strong> {recipe.storage}</span>
                  </div>
                )}
                {recipe.variations?.map((v, i) => (
                  <div key={i} className="tip-card substitution">
                    <span className="tip-icon">🔄</span>
                    <span className="tip-text"><strong>Variation:</strong> {v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="recipe-actions">
            <button className="recipe-action-btn primary-action" onClick={saveRecipe}>💾 Save Recipe</button>
            <button className="recipe-action-btn orange-action" onClick={generateRecipe}>🔄 Generate Another</button>
            <button className="recipe-action-btn secondary-action" onClick={() => {
              if (navigator.share) {
                navigator.share({ title: recipe.name, text: `Check out this recipe: ${recipe.name}\n\nIngredients: ${recipe.ingredients?.map(i => i.item).join(', ')}` });
              } else {
                navigator.clipboard?.writeText(`Recipe: ${recipe.name}\nCook time: ${recipe.cookTime}\n\nIngredients: ${recipe.ingredients?.map(i => `${i.item} - ${i.quantity}`).join('\n')}`);
                setSavedMessage('Recipe copied to clipboard!');
                setTimeout(() => setSavedMessage(''), 2000);
              }
            }}>📤 Share Recipe</button>
            {savedMessage && <span style={{ fontSize: '0.82rem', color: '#22C55E', fontWeight: 600, alignSelf: 'center' }}>{savedMessage}</span>}
          </div>
        </div>
      )}

      {isAuthenticated && savedRecipes.length > 0 && (
        <div className="saved-recipes-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2>My Saved Recipes</h2>
            <button className="recipe-action-btn secondary-action" onClick={() => setShowSaved(!showSaved)} style={{ padding: '6px 14px' }}>
              {showSaved ? 'Hide' : `Show (${savedRecipes.length})`}
            </button>
          </div>
          {showSaved && (
            <div className="saved-recipes-grid">
              {savedRecipes.map((saved, i) => (
                <div key={i} className="saved-recipe-card" onClick={() => loadSavedRecipe(saved)}>
                  <div className="saved-card-image" style={{ backgroundImage: `url(${saved.imageUrl})` }}>
                    <button className="saved-card-remove" onClick={(e) => { e.stopPropagation(); removeSaved(i); }}>✕</button>
                  </div>
                  <div className="saved-card-body">
                    <h3>{saved.emoji} {saved.name}</h3>
                    <div className="saved-card-meta">
                      <span>⏱️ {saved.cookTime}</span>
                      <span>🔥 {saved.calories} cal</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeMaker;