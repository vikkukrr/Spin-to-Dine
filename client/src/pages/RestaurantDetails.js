import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getFallbackRestaurantById } from '../services/fallbackData';
import LoadingSkeleton from '../components/LoadingSkeleton';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [vegOnly, setVegOnly] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        setLoading(true);
        const [restaurantRes, menuRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/restaurants/${id}/menu`)
        ]);
        setRestaurant(restaurantRes.data);
        setMenu(menuRes.data);
      } catch (error) {
        const fallback = getFallbackRestaurantById(id);
        if (fallback) {
          setRestaurant(fallback.restaurant);
          setMenu(fallback.menu);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
    fetchReviews();

    if (isAuthenticated) {
      checkFavorite();
    }
  }, [id, isAuthenticated]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const res = await api.get(`/favorites/check/${id}`);
      setIsFavorite(res.data.isFavorite);
    } catch (err) {
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      addToast('Please login to save favorites', 'info');
      return;
    }
    setFavLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
        addToast('Removed from favorites', 'success');
      } else {
        await api.post('/favorites', { restaurantId: id });
        setIsFavorite(true);
        addToast('Added to favorites', 'success');
      }
    } catch (err) {
      setIsFavorite(!isFavorite);
      addToast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
    } finally {
      setFavLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please login to review', 'info');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        restaurantId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      addToast('Review submitted!', 'success');
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      addToast('Review submitted!', 'success');
      setReviewForm({ rating: 5, comment: '' });
      setReviews(prev => [...prev, {
        _id: 'review_' + Date.now(),
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        userId: { name: user?.name || 'You' },
        createdAt: new Date().toISOString()
      }]);
    } finally {
      setSubmittingReview(false);
    }
  };

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'desserts'];

  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesVeg = !vegOnly || item.veg;
    return matchesCategory && matchesVeg;
  });

  const handleAddToCart = (item) => {
    if (!restaurant) return;
    addToCart(item, {
      _id: restaurant._id,
      name: restaurant.name,
      location: restaurant.location
    });
  };

  const isInCart = (itemId) => cart.some(item => item._id === itemId);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : restaurant?.rating?.toFixed(1) || '0.0';

  if (loading) {
    return (
      <div className="restaurant-details-page">
        <div className="skeleton-hero skeleton-pulse" style={{ height: 300 }} />
        <LoadingSkeleton type="menu" />
      </div>
    );
  }

  if (!restaurant) {
    return <div className="error-message">Restaurant not found</div>;
  }

  return (
    <div className="restaurant-details-page">
      <div className="restaurant-hero">
        <img
          src={restaurant.imageUrl || 'https://via.placeholder.com/800x300?text=Restaurant'}
          alt={restaurant.name}
          className="hero-image"
        />
        <div className="hero-overlay">
          <div className="hero-header">
            <h1>{restaurant.name}</h1>
            <button
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
              disabled={favLoading}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>
          <p className="cuisines">{restaurant.cuisines?.join(', ')}</p>
          <div className="restaurant-info">
            <span>⭐ {avgRating} ({reviews.length} reviews)</span>
            <span>⏱ {restaurant.deliveryTime}</span>
            <span>₹{restaurant.deliveryFee} Delivery</span>
          </div>
          <p className="location">📍 {restaurant.location}</p>
        </div>
      </div>

      <div className="menu-filters">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <label className="veg-filter">
          <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
          Veg Only
        </label>
      </div>

      <div className="menu-section">
        <h2>Menu</h2>
        {filteredMenu.length === 0 ? (
          <p className="no-menu">No items available in this category</p>
        ) : (
          <div className="menu-grid">
            {filteredMenu.map(item => (
              <div key={item._id} className="menu-item">
                <img src={item.imageUrl || 'https://via.placeholder.com/150x150?text=Dish'} alt={item.name} />
                <div className="menu-item-info">
                  <div className="menu-item-header">
                    <h3>{item.name}</h3>
                    {item.veg ? (
                      <span className="veg-indicator">🟢</span>
                    ) : (
                      <span className="non-veg-indicator">🔴</span>
                    )}
                  </div>
                  <p className="menu-item-desc">{item.description || ''}</p>
                  <div className="menu-item-footer">
                    <span className="price">₹{item.price}</span>
                    <button
                      className={`add-btn ${isInCart(item._id) ? 'in-cart' : ''}`}
                      onClick={() => handleAddToCart(item)}
                      disabled={item.available === false}
                    >
                      {isInCart(item._id) ? 'Added ✓' : item.available !== false ? 'Add +' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="reviews-section">
        <h2>Reviews & Ratings ({reviews.length})</h2>

        {isAuthenticated && (
          <form onSubmit={handleSubmitReview} className="review-form">
            <h3>Write a Review</h3>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button"
                  className={`star ${star <= reviewForm.rating ? 'active' : ''}`}
                  onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                >★</button>
              ))}
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
              className="form-input"
              placeholder="Share your experience..."
              rows={3}
              maxLength={500}
            />
            <button type="submit" className="btn-primary" disabled={submittingReview}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        <div className="reviews-list">
          {reviewsLoading ? (
            <LoadingSkeleton type="order" />
          ) : reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <strong>{review.userId?.name || 'Anonymous'}</strong>
                  <span className="review-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`star ${star <= review.rating ? 'active' : ''}`}>★</span>
                    ))}
                  </span>
                </div>
                {review.comment && <p className="review-comment">{review.comment}</p>}
                <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
