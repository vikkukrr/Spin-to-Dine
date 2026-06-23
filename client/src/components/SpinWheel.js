import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import spinService from "../services/spinService";
import { getFallbackSpinSuggestions, createFallbackSpinLog } from "../services/fallbackData";

const SEGMENT_COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF922B', '#CC5DE8', '#20C997', '#F06595'];

function formatSegmentText(name) {
  if (name.length <= 12) return [name];
  const parts = name.split(' ');
  if (parts.length === 1) {
    const mid = Math.ceil(name.length / 2);
    return [name.slice(0, mid), name.slice(mid)];
  }
  const midIdx = Math.ceil(parts.length / 2);
  return [parts.slice(0, midIdx).join(' '), parts.slice(midIdx).join(' ')];
}

const SpinWheel = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [currentLogId, setCurrentLogId] = useState(null);
  const angle = 360 / (suggestions.length || 1);

  const sparklePositions = React.useMemo(() => {
    const positions = [
      { top: '8%', left: '5%' },
      { top: '85%', left: '92%' },
      { top: '12%', left: '88%' },
      { top: '80%', left: '10%' },
      { top: '50%', left: '2%' },
      { top: '45%', left: '95%' },
      { top: '5%', left: '50%' },
      { top: '90%', left: '48%' },
    ];
    return positions;
  }, []);

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await spinService.getSuggestions(user._id);
      setSuggestions(data.suggestions || []);
      setSpinCount(data.todaySpinCount || 0);
      setCurrentStreak(data.currentStreak || 0);
      setLoyaltyPoints(data.loyaltyPoints || 0);
      setError(null);
    } catch (err) {
      const fallback = getFallbackSpinSuggestions(user._id);
      setSuggestions(fallback.suggestions);
      setSpinCount(fallback.todaySpinCount);
      setCurrentStreak(fallback.currentStreak);
      setLoyaltyPoints(fallback.loyaltyPoints);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchSuggestions();
  }, [isAuthenticated, navigate, fetchSuggestions]);

  const handleSpin = () => {
    if (spinning || suggestions.length === 0 || spinCount >= 3) return;

    setSpinning(true);

    const newRotation = rotation + 1800 + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(() => {
      const segmentAngle = 360 / suggestions.length;
      const normalizedRotation = newRotation % 360;
      const selectedIndex = Math.floor(normalizedRotation / segmentAngle);
      const dish = suggestions[suggestions.length - 1 - selectedIndex];

      setSelectedDish(dish);
      setShowModal(true);
      setSpinning(false);
      setSpinCount((prev) => prev + 1);

      logSpin(dish);
    }, 3000);
  };

  const logSpin = async (dish) => {
    try {
      const res = await spinService.logSpin({
        menuItemId: dish._id,
        restaurantId: dish.restaurant?._id,
        score: dish.scores?.total,
        timeSlot: dish.timeSlot,
      });
      setCurrentLogId(res.log?._id);
      setLoyaltyPoints(res.loyaltyPoints);
      setCurrentStreak(res.currentStreak);
      setPointsEarned(res.pointsEarned || 10);
      if (res.currentStreak >= 3) {
        addToast(`🔥 ${res.currentStreak} day streak! Bonus +5 points!`, 'info');
      }
    } catch (err) {
      const fallback = createFallbackSpinLog({
        menuItemId: dish._id,
        restaurantId: dish.restaurant?._id,
        score: dish.scores?.total,
        timeSlot: dish.timeSlot,
      });
      setCurrentLogId(null);
      setLoyaltyPoints(fallback.loyaltyPoints);
      setCurrentStreak(fallback.currentStreak);
      setPointsEarned(fallback.pointsEarned);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedDish) return;

    if (currentLogId) {
      try {
        await spinService.acceptSpinLog(currentLogId);
      } catch (err) {
        console.error('Failed to mark spin as accepted');
      }
    }

    const restaurantInfo = {
      _id: selectedDish.restaurant?._id,
      name: selectedDish.restaurant?.name,
      location: selectedDish.restaurant?.location,
    };

    addToCart(
      {
        _id: selectedDish._id,
        name: selectedDish.name,
        price: selectedDish.price,
        imageUrl: selectedDish.imageUrl,
        restaurant: selectedDish.restaurant,
      },
      restaurantInfo,
    );

    setShowModal(false);
    setSelectedDish(null);
    setCurrentLogId(null);
    navigate("/cart");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDish(null);
    setCurrentLogId(null);
  };

  if (loading) {
    return (
      <div className="spin-container">
        <div className="loading-spinner">Loading your personalized recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spin-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchSuggestions} className="btn-primary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="spin-container">
      <div className="spin-header">
        <h1>🎰 Spin & Discover</h1>
        <p>Let fate decide your next meal — spin the wheel for a delicious surprise!</p>
        <div className="spin-stats">
          <div className="spin-stat">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{loyaltyPoints}</span>
            <span className="stat-label">Points</span>
          </div>
          <div className="spin-stat">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{currentStreak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="spin-stat spin-counter-stat">
            <span className="stat-label">Spins left today:</span>
            <strong>{3 - spinCount}</strong>
          </div>
        </div>
      </div>

      <div className="spin-wheel-wrapper">
        <div
          className={`spin-wheel ${spinning ? "spinning" : ""}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(${suggestions.map((_, i) => {
              const segAngle = 360 / suggestions.length;
              const start = i * segAngle;
              const colorEnd = (i + 1) * segAngle - 0.8;
              const sepEnd = (i + 1) * segAngle;
              const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
              return `${color} ${start}deg ${colorEnd}deg, rgba(255,255,255,0.4) ${colorEnd}deg ${sepEnd}deg`;
            }).join(', ')})`,
          }}
        >
          <svg
            className="wheel-text-overlay"
            viewBox="0 0 100 100"
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              zIndex: 5, pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            {suggestions.map((dish, index) => {
              const midAngle = (index + 0.5) * angle;
              const isLeftSide = midAngle > 90 && midAngle < 270;
              const textRotation = isLeftSide ? midAngle + 180 : midAngle;
              const rad = ((midAngle - 90) * Math.PI) / 180;
              const r = 35;
              const x = 50 + r * Math.cos(rad);
              const y = 50 + r * Math.sin(rad);
              const lines = formatSegmentText(dish.name);
              return (
                <text
                  key={dish._id}
                  x={x}
                  y={y}
                  transform={`rotate(${textRotation}, ${x}, ${y})`}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontWeight="800"
                  fontSize="3.8"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.4)' }}
                >
                  {lines.map((line, li) => (
                    <tspan
                      key={li}
                      x={x}
                      dy={li === 0 ? '-0.6em' : '1.2em'}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            })}
          </svg>
        </div>

        <button
          className="spin-button"
          onClick={handleSpin}
          disabled={spinning || spinCount >= 3 || suggestions.length === 0}
        >
          {spinning ? "Spinning..." : spinCount >= 3 ? "No Spins Left" : "SPIN!"}
        </button>

        <div className="spin-pointer" />

        {sparklePositions.map((pos, i) => (
          <span
            key={i}
            className="sparkle"
            style={{
              top: pos.top,
              left: pos.left,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="suggestions-list">
        <h3>Your Smart Suggestions</h3>
        <p className="suggestions-subtitle">Based on your preferences, order history, and time of day</p>
        <div className="suggestions-grid">
          {suggestions.map((dish, index) => (
            <div
              key={dish._id}
              className="suggestion-card"
              onClick={() => {
                setSelectedDish(dish);
                setShowModal(true);
              }}
            >
              <span className="suggestion-rank">#{index + 1}</span>
              <img src={dish.imageUrl || "https://via.placeholder.com/100x100?text=Dish"} alt={dish.name} />
              <h4>{dish.name}</h4>
              <p className="suggestion-restaurant">{dish.restaurant?.name}</p>
              <p className="suggestion-price">₹{dish.price}</p>
              <div className="match-score">
                <span className="score-label">Match:</span>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${(dish.scores?.total || 0) * 100}%` }}></div>
                </div>
                <span className="score-value">{Math.round((dish.scores?.total || 0) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedDish && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h2>🎉 You got: {selectedDish.name}</h2>
            <img src={selectedDish.imageUrl || "https://via.placeholder.com/200x200?text=Dish"}
              alt={selectedDish.name} className="modal-image" />
            <div className="modal-details">
              <p><strong>Restaurant:</strong> {selectedDish.restaurant?.name}</p>
              <p><strong>Price:</strong> ₹{selectedDish.price}</p>
              <p><strong>Category:</strong> {selectedDish.category}</p>
              <p><strong>Match Score:</strong> {Math.round((selectedDish.scores?.total || 0) * 100)}%</p>
              <p className="points-earned">+{pointsEarned} points earned! ⭐</p>
              {currentStreak >= 3 && <p className="streak-bonus">🔥 {currentStreak} day streak bonus!</p>}
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleAddToCart}>Add to Cart</button>
              <button className="btn-secondary" onClick={closeModal}>Spin Again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
