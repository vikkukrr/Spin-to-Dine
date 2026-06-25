import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const CUISINE_OPTIONS = [
  'All', 'North Indian', 'South Indian', 'Chinese', 'Italian',
  'Mughlai', 'Fast Food', 'American', 'Thai', 'Asian', 'Healthy', 'Vegetarian'
];

const FEATURED_DISHES = [
  { name: 'Margherita Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop', restaurant: 'Pizza Paradise', price: 249, rating: 4.8 },
  { name: 'Butter Chicken', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&h=200&fit=crop', restaurant: 'Taste of India', price: 349, rating: 4.9 },
  { name: 'Sushi Platter', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=200&fit=crop', restaurant: 'Tokyo Bay', price: 599, rating: 4.7 },
  { name: 'Truffle Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop', restaurant: 'Burger Lab', price: 299, rating: 4.6 },
  { name: 'Greek Salad', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop', restaurant: 'Green Bowl', price: 199, rating: 4.5 },
  { name: 'Chocolate Lava', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=300&h=200&fit=crop', restaurant: 'Sweet Tooth', price: 179, rating: 4.9 },
];

const TESTIMONIALS = [
  { name: 'Rahul S.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', text: 'The spin wheel is genius! Found my new favorite restaurant.', rating: 5, role: 'Food Explorer' },
  { name: 'Priya M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', text: 'Love the loyalty points — I\'ve earned 5 badges already!', rating: 5, role: 'Loyal Foodie' },
  { name: 'Amit K.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', text: 'Fast delivery and the food is always fresh. Highly recommend!', rating: 5, role: 'Regular Customer' },
  { name: 'Neha G.', avatar: '👩‍🎤', text: 'The leaderboard makes ordering so much more fun!', rating: 5, role: 'Verified Foodie' },
  { name: 'Vikram R.', avatar: '👨‍🎤', text: 'Best food delivery app in town. The UI is gorgeous!', rating: 5, role: 'Verified Foodie' },
];

const REVIEW_STATS = [
  { value: '500+', label: 'Happy Customers' },
  { value: '4.8\u2605', label: 'Average Rating' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const RECIPES = [
  { title: '5-Minute Pasta Aglio Olio', time: '5 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=220&fit=crop' },
  { title: 'Crispy Honey Chilli Potato', time: '20 min', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=220&fit=crop' },
  { title: 'Mango Lassi Smoothie Bowl', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=220&fit=crop' },
];

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&q=80',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a893?w=1600&q=80',
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1600&q=80',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1600&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=80',
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 }
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, staggerChildren: 0.1 }
};

const LOCATIONS = ['All Locations', 'Downtown', 'Westside', 'Central', 'Eastside', 'Southtown'];

const Home = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '', rating: '', veg: false, cuisine: '', sortBy: '', location: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [stickyFilter, setStickyFilter] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const searchTimeout = useRef(null);
  const filterRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const fetchRestaurants = useCallback(async (activeFilters, pageNum = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeFilters.search) params.append('search', activeFilters.search);
      if (activeFilters.rating) params.append('rating', activeFilters.rating);
      if (activeFilters.veg) params.append('veg', 'true');
      if (activeFilters.sortBy) params.append('sortBy', activeFilters.sortBy);
      if (activeFilters.location && activeFilters.location !== 'All Locations') params.append('location', activeFilters.location);
      if (activeFilters.cuisine && activeFilters.cuisine !== 'All') params.append('search', activeFilters.cuisine);
      params.append('page', pageNum);
      params.append('limit', '12');
      const response = await api.get(`/restaurants?${params.toString()}`);
      setRestaurants(response.data.restaurants || []);
      setTotalPages(response.data.totalPages || 1);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRestaurants(filters, page); }, [page]);
  useEffect(() => {
    setPage(1);
    fetchRestaurants(filters, 1);
  }, [filters.rating, filters.veg, filters.cuisine, filters.sortBy, filters.location]);

  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current) {
        const rect = filterRef.current.getBoundingClientRect();
        setStickyFilter(rect.top <= 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchRestaurants({ ...filters, [name]: value }, 1);
    }, 400);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRestaurants(filters, 1);
  };

  const clearFilters = () => {
    const cleared = { search: '', rating: '', veg: false, cuisine: '', sortBy: '', location: '' };
    setFilters(cleared);
    setPage(1);
    fetchRestaurants(cleared, 1);
  };

  const toggleVeg = () => {
    setFilters(prev => ({ ...prev, veg: !prev.veg }));
  };

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => {
    if (k === 'search') return false;
    if (k === 'location') return v && v !== 'All Locations';
    if (k === 'cuisine') return v && v !== 'All';
    if (k === 'sortBy') return v !== '';
    if (k === 'rating') return v !== '';
    return v;
  }).length;

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <section className="hero-section" ref={heroRef}>
        <div className="hero-carousel">
          {HERO_IMAGES.map((img, i) => (
            <div
              key={img}
              className="hero-carousel-slide"
              style={{
                backgroundImage: `url(${img})`,
                opacity: currentImage === i ? 1 : 0,
                transform: `scale(${currentImage === i ? 1 : 1.08})`,
                transition: 'opacity 1.2s ease-in-out, transform 1.2s ease-in-out',
              }}
            />
          ))}
        </div>
        <div className="hero-overlay" />
        <div className="hero-container">
          <div className="hero-content-left">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="hero-badge">🔥 Trending Near You</div>
            </motion.div>
            <motion.h1 className="hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              Discover Delicious<br />
              <span className="hero-highlight">Food Near You</span>
            </motion.h1>
            <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              Fresh flavors, crafted with care — explore top restaurants or let fate decide with Spin-to-Dine!
            </motion.p>
            <motion.form onSubmit={handleSearch} className="hero-search" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="hero-search-wrapper">
                <span className="search-icon">🔍</span>
                <input type="text" name="search" placeholder="Search restaurants, cuisines, or dishes..." value={filters.search} onChange={handleSearchChange} className="hero-search-input" />
              </div>
              <button type="submit" className="hero-search-btn">Search</button>
            </motion.form>
            <motion.div className="hero-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <button className="cta-primary" onClick={() => document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Restaurants <span className="cta-arrow">→</span>
              </button>
              <button className="cta-secondary" onClick={() => navigate('/spin')}>
                🎰 Spin the Wheel
              </button>
            </motion.div>
            <motion.div className="hero-category-chips" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
              {[{ icon: '🍕', label: 'Pizza' }, { icon: '🍔', label: 'Burgers' }, { icon: '🥗', label: 'Healthy' }, { icon: '🍣', label: 'Sushi' }].map((chip) => (
                <button
                  key={chip.label}
                  className="hero-chip"
                  onClick={() => { setFilters(prev => ({ ...prev, cuisine: chip.label })); setPage(1); }}
                >
                  {chip.icon} {chip.label}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
        <div className="hero-floating-elements">
          <motion.div className="float-element float-rating" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
            <div className="float-rating-stars">⭐⭐⭐⭐⭐</div>
            <div className="float-rating-text">4.9 ★ Overall Rating</div>
          </motion.div>
          <motion.div className="float-element float-dish" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.9 }}>
            <span className="float-dish-icon">🍕</span>
            <div>
              <div className="float-dish-name">Margherita Pizza</div>
              <div className="float-dish-price">₹249</div>
            </div>
          </motion.div>
          <motion.div className="float-element float-delivery" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }}>
            🚚 Free Delivery • 25–35 min
          </motion.div>
        </div>
        <div className="hero-indicators">
          {HERO_IMAGES.map((_, i) => (
            <button key={i} className={`hero-indicator ${currentImage === i ? 'active' : ''}`} onClick={() => setCurrentImage(i)} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </section>

      <div className="quick-stats">
        <div className="quick-stat">
          <span className="quick-stat-icon">🍽️</span>
          <span className="quick-stat-value">50+</span>
          <span className="quick-stat-label">Restaurants</span>
        </div>
        <div className="quick-stat-divider" />
        <div className="quick-stat">
          <span className="quick-stat-icon">⚡</span>
          <span className="quick-stat-value">30 min</span>
          <span className="quick-stat-label">avg delivery</span>
        </div>
        <div className="quick-stat-divider" />
        <div className="quick-stat">
          <span className="quick-stat-icon">⭐</span>
          <span className="quick-stat-value">4.8</span>
          <span className="quick-stat-label">avg rating</span>
        </div>
        <div className="quick-stat-divider" />
        <button className="quick-stat quick-stat-spin" onClick={() => navigate('/spin')}>
          <span className="quick-stat-icon">🎰</span>
          <span className="quick-stat-label">Spin & Discover</span>
        </button>
        <div className="quick-stat-divider" />
        <Link to="/spin" className="quick-stat quick-stat-link">Can't decide? 🎰</Link>
      </div>

      <motion.section {...fadeUp} className="categories-section">
        <div className="categories-header">
          <h2 style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 700 }}>What are you craving?</h2>
        </div>
        <div className="categories-scroll">
          {['🍕', '🍔', '🍜', '🍰', '☕', '🥗'].map((icon, i) => (
            <button
              key={i}
              className="craving-card"
              onClick={() => { setFilters(prev => ({ ...prev, cuisine: ['Pizza', 'Burgers', 'Asian', 'Desserts', 'Cafe', 'Healthy'][i] })); setPage(1); }}
            >
              <span className="craving-card-icon">{icon}</span>
              <span className="craving-card-label">{['Pizza', 'Burgers', 'Asian', 'Desserts', 'Cafe', 'Healthy'][i]}</span>
            </button>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="most-loved-section">
        <div className="text-center mb-6">
          <h2 className="section-title">Most Loved Dishes</h2>
          <p className="section-subtitle mx-auto">Our community's top picks — tried, tested, and loved by foodies like you</p>
        </div>
        <div className="most-loved-grid">
          {FEATURED_DISHES.map((dish, i) => (
            <motion.div
              key={dish.name}
              className="dish-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="dish-card-image"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop';
                }}
              />
              <div className="dish-card-content">
                <h3 className="dish-card-name">{dish.name}</h3>
                <p className="dish-card-restaurant">{dish.restaurant}</p>
                <div className="dish-card-footer">
                  <span className="dish-card-rating">
                    <span>&#11088;</span> {dish.rating}
                  </span>
                  <span className="dish-card-price">&#x20B9;{dish.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section className="filter-bar-container" ref={filterRef}>
        <div className={`filter-bar ${stickyFilter ? 'sticky' : ''}`}>
          <div className="filter-bar-inner">
            <div className="filter-chips">
              <div className="filter-chip-group">
                <span className="filter-label">Rating</span>
                <div className="chip-row">
                  {['', '4', '3', '2'].map(r => (
                    <button key={r} className={`pill-chip ${filters.rating === r ? 'active' : ''}`} onClick={() => handleFilterChange('rating', r)}>{r ? `${r}+ ⭐` : 'All'}</button>
                  ))}
                </div>
              </div>
              <div className="filter-chip-group">
                <span className="filter-label">Cuisine</span>
                <select name="cuisine" value={filters.cuisine} onChange={e => handleFilterChange('cuisine', e.target.value)} className="pill-select">
                  {CUISINE_OPTIONS.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
                </select>
              </div>
              <div className="filter-chip-group">
                <span className="filter-label">Sort by</span>
                <select name="sortBy" value={filters.sortBy} onChange={e => handleFilterChange('sortBy', e.target.value)} className="pill-select">
                  {[{ value: '', label: 'Recommended' }, { value: 'rating', label: 'Highest Rated' }, { value: 'deliveryTime', label: 'Fastest Delivery' }, { value: 'minOrder', label: 'Lowest Min Order' }, { value: 'name', label: 'Name A-Z' }].map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="filter-chip-group">
                <span className="filter-label">Type</span>
                <button className={`veg-toggle ${filters.veg ? 'active' : ''}`} onClick={toggleVeg}>
                  <span className="veg-toggle-track">
                    <span className={`veg-toggle-thumb ${filters.veg ? 'right' : 'left'}`}>{filters.veg ? '🥬' : '🍖'}</span>
                  </span>
                  <span className="veg-toggle-label">{filters.veg ? 'Veg' : 'All'}</span>
                </button>
              </div>
            </div>
            <div className="filter-actions">
              {activeFilterCount > 0 && <span className="active-filter-badge">{activeFilterCount}</span>}
              <button onClick={clearFilters} className="clear-filters-btn">✕ Clear</button>
            </div>
          </div>
        </div>
      </section>

      <section className="restaurants-section" id="restaurants">
        <div className="restaurants-header">
          <div>
            <h2 style={{ color: '#ffffff' }}>Restaurants Near You</h2>
            {total > 0 && <span className="restaurants-count">{total} restaurants</span>}
          </div>
          <div className="restaurants-header-actions">
            {totalPages > 1 && (
              <div className="pagination-mini">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="page-btn">‹</button>
                <span className="page-indicator">{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="page-btn">›</button>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <LoadingSkeleton type="card" count={6} />
        ) : restaurants.length === 0 ? (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <h3>No restaurants found</h3>
            <p>Try adjusting your filters or search query</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="restaurants-grid">
              {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination-full">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary">Previous</button>
                <div className="pagination-pages">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    if (pageNum > totalPages) return null;
                    return <button key={pageNum} className={`page-num ${page === pageNum ? 'active' : ''}`} onClick={() => setPage(pageNum)}>{pageNum}</button>;
                  })}
                </div>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary">Next</button>
              </div>
            )}
          </>
        )}
      </section>

      <motion.section {...fadeUp} className="spin-cta-section">
        <div className="spin-cta-card">
          <div className="spin-cta-glow" />
          <div className="spin-cta-content">
            <motion.div className="spin-cta-icon" animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>🎰</motion.div>
            <h2>Can't Decide? Let Spin-to-Dine Choose For You!</h2>
            <p>Spin the wheel and let fate pick your next meal. Earn loyalty points and badges along the way!</p>
            <motion.button className="spin-cta-btn" onClick={() => navigate('/spin')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <span>Spin Now</span>
              <motion.span className="spin-btn-arrow" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
            </motion.button>
            <div className="spin-cta-stats">
              <div className="spin-stat-item"><span className="spin-stat-value">3</span><span className="spin-stat-label">Spins / Day</span></div>
              <div className="spin-stat-divider" />
              <div className="spin-stat-item"><span className="spin-stat-value">+10</span><span className="spin-stat-label">Points / Spin</span></div>
              <div className="spin-stat-divider" />
              <div className="spin-stat-item"><span className="spin-stat-value">🏅</span><span className="spin-stat-label">Earn Badges</span></div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="testimonial-section">
        <div className="testimonial-inner">
          <h2 className="testimonial-heading">What Our Foodies Say</h2>
          <p className="testimonial-subtitle">Real reviews from real people who love Spin-to-Dine</p>
          <div className="testimonial-underline" />

          <div className="testimonial-stats-row">
            {REVIEW_STATS.map(stat => (
              <div key={stat.label} className="testimonial-stat">
                <span className="testimonial-stat-value">{stat.value}</span>
                <span className="testimonial-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="testimonial-grid">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <motion.div
                key={i}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="testimonial-quote">{"\u201C"}</div>

                {t.avatar.startsWith('http') ? (
                  <>
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="reviewer-avatar"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="reviewer-avatar-fallback">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </>
                ) : (
                  <div className="reviewer-avatar-fallback" style={{ display: 'flex' }}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}

                <div className="testimonial-stars">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <span key={si} className={si < t.rating ? 'star-active' : 'star-inactive'}>&#9733;</span>
                  ))}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <p className="testimonial-name">{t.name}</p>
                <p className="testimonial-role">{t.role} &#10003;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.section {...fadeUp} className="latest-recipes-section">
        <h2 className="recipes-heading">Latest Recipes</h2>
        <div className="recipes-underline" />
        <p className="recipes-subtitle">Quick and delicious recipes inspired by our top restaurants</p>

        <div className="recipes-grid">
          {RECIPES.map((recipe, i) => (
            <motion.div
              key={recipe.title}
              className="recipe-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="recipe-image-wrapper">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=220&fit=crop';
                  }}
                />
                <span className={`difficulty-badge ${recipe.difficulty.toLowerCase()}`}>
                  {recipe.difficulty}
                </span>
                <span className="time-badge">&#x23F1; {recipe.time}</span>
              </div>
              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>
                <div className="recipe-footer">
                  <span className="recipe-meta">&#x23F1; {recipe.time} &bull; {recipe.difficulty}</span>
                  <span className="recipe-view-link">View Recipe &#x2192;</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="recipes-view-all">
          <button className="view-all-recipes-btn">View All Recipes &#x2192;</button>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="categories-section" style={{ marginBottom: '4rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a3a1a, #2d4a2d)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✉️</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.75rem', color: '#ffffff' }}>Stay in the Loop</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>Get exclusive deals, new restaurant alerts, and recipe inspiration delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-3" style={{ maxWidth: '450px', margin: '0 auto' }} onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: '#1a3a1a',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit'
              }} />
              <button type="submit" style={{
                background: '#FF6B35',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 28px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap'
              }}>Subscribe</button>
            </form>
          </motion.div>
        </div>
      </motion.section>

      <footer style={{ background: '#0f1f0f', color: 'white', width: '100%' }}>
        <div className="max-w-7xl mx-auto px-5 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold mb-4" style={{ color: '#ffffff' }}>
                <span>🍔</span>
                <span>Spin-to-Dine</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', lineHeight: 1.7 }}>Discover delicious food near you. Spin, order, and earn rewards with every meal.</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</Link>
                <Link to="/spin" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Spin Wheel</Link>
                <Link to="/leaderboard" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Leaderboard</Link>
                <Link to="/menu" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Full Menu</Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>Account</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                <Link to="/profile" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>My Profile</Link>
                <Link to="/orders" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>My Orders</Link>
                <Link to="/favorites" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Favorites</Link>
                <Link to="/cart" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Cart</Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)' }}>
                <span>📧 hello@spintodine.com</span>
                <span>📞 +1 234 567 890</span>
                <span>📍 123 Foodie Lane, NYC</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
            <p>© {new Date().getFullYear()} Spin-to-Dine. All rights reserved. Made with ❤️ for food lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
