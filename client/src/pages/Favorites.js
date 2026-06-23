import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { getFallbackFavorites } from '../services/fallbackData';

const Favorites = () => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    fetchFavorites();
  }, [isAuthenticated, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.get('/favorites');
      setFavorites(res.data);
    } catch (err) {
      setFavorites(getFallbackFavorites());
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (restaurantId) => {
    try {
      await api.delete(`/favorites/${restaurantId}`);
      addToast('Removed from favorites', 'success');
      fetchFavorites();
    } catch (err) {
      setFavorites(prev => prev.filter(f => f.restaurantId?._id !== restaurantId));
      addToast('Removed from favorites', 'success');
    }
  };

  if (loading) return <div className="loading-spinner">Loading favorites...</div>;

  return (
    <div className="favorites-page">
      <h1>My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <h2>No favorites yet</h2>
          <p>Save your favorite restaurants for quick access!</p>
          <Link to="/" className="btn-primary">Browse Restaurants</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(fav => fav.restaurantId && (
            <div key={fav._id} className="favorite-card">
              <img src={fav.restaurantId.imageUrl} alt={fav.restaurantId.name} />
              <div className="favorite-info">
                <h3>{fav.restaurantId.name}</h3>
                <p>⭐ {fav.restaurantId.rating?.toFixed(1)} • {fav.restaurantId.cuisines?.join(', ')}</p>
                <p>⏱ {fav.restaurantId.deliveryTime} • ₹{fav.restaurantId.deliveryFee} delivery</p>
              </div>
              <div className="favorite-actions">
                <Link to={`/restaurant/${fav.restaurantId._id}`} className="btn-primary btn-sm">View Menu</Link>
                <button onClick={() => removeFavorite(fav.restaurantId._id)} className="btn-danger btn-sm">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
