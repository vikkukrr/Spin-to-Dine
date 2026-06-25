import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    _id, name, location, rating, cuisines,
    deliveryTime, deliveryFee, imageUrl, vegOnly, ratingCount
  } = restaurant;

  const getPriceRange = () => {
    const avg = restaurant.minOrder || 200;
    if (avg < 150) return '₹';
    if (avg < 300) return '₹₹';
    return '₹₹₹';
  };

  return (
    <Link to={`/restaurant/${_id}`} className="restaurant-card">
      <div className="restaurant-card-image">
        {!imgLoaded && <div className="card-image-placeholder" />}
        <img
          src={restaurant.imageUrl?.startsWith('http')
            ? restaurant.imageUrl
            : `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop`}
          alt={name}
          className={`card-image ${imgLoaded ? 'loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => { e.target.style.display = 'none'; setImgLoaded(true); }}
        />
        <div className="card-image-overlay">
          {vegOnly && <span className="card-veg-badge">Pure Veg</span>}
          {rating >= 4.5 && <span className="card-trending">🔥 Trending</span>}
        </div>
        <button
          className={`card-favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="restaurant-card-body">
        <div className="restaurant-card-header">
          <h3 className="restaurant-card-name">{name}</h3>
          <div className="restaurant-card-rating">
            <span className="rating-star">⭐</span>
            <span className="rating-value">{rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>

        <p className="restaurant-card-cuisines">
          {cuisines?.slice(0, 3).join(' • ')}
          {cuisines?.length > 3 && <span className="cuisine-more"> +{cuisines.length - 3}</span>}
        </p>

        <div className="restaurant-card-meta">
          <div className="meta-item">
            <span className="meta-icon">⏱</span>
            <span className="meta-text">{deliveryTime}</span>
          </div>
          <div className="meta-divider" />
          <div className="meta-item">
            <span className="meta-icon">🚚</span>
            <span className="meta-text">
              {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
            </span>
          </div>
          <div className="meta-divider" />
          <div className="meta-item">
            <span className="meta-icon">💰</span>
            <span className="meta-text">{getPriceRange()}</span>
          </div>
        </div>

        <p className="restaurant-card-location">📍 {location}</p>
      </div>
    </Link>
  );
};

export default RestaurantCard;
