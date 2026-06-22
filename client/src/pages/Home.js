import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const CUISINE_OPTIONS = [
  'All', 'North Indian', 'South Indian', 'Chinese', 'Italian',
  'Mughlai', 'Fast Food', 'American', 'Thai', 'Asian', 'Healthy', 'Vegetarian'
];

const FEATURED_DISHES = [
  { name: 'Margherita Pizza', image: '🍕', restaurant: 'Pizza Paradise', price: '₹249', rating: 4.8 },
  { name: 'Butter Chicken', image: '🍛', restaurant: 'Taste of India', price: '₹349', rating: 4.9 },
  { name: 'Sushi Platter', image: '🍣', restaurant: 'Tokyo Bay', price: '₹599', rating: 4.7 },
  { name: 'Truffle Burger', image: '🍔', restaurant: 'Burger Lab', price: '₹299', rating: 4.6 },
  { name: 'Greek Salad', image: '🥗', restaurant: 'Green Bowl', price: '₹199', rating: 4.5 },
  { name: 'Chocolate Lava', image: '🍫', restaurant: 'Sweet Tooth', price: '₹179', rating: 4.9 },
];

const TESTIMONIALS = [
  { name: 'Rahul S.', avatar: '👨‍💼', text: 'The spin wheel is genius! Found my new favorite restaurant.', rating: 5 },
  { name: 'Priya M.', avatar: '👩‍💼', text: 'Love the loyalty points — I\'ve earned 5 badge already!', rating: 5 },
  { name: 'Amit K.', avatar: '🧑‍💼', text: 'Fast delivery and the food is always fresh. Highly recommend!', rating: 5 },
  { name: 'Neha G.', avatar: '👩‍🎤', text: 'The leaderboard makes ordering so much more fun!', rating: 5 },
  { name: 'Vikram R.', avatar: '👨‍🎤', text: 'Best food delivery app in town. The UI is gorgeous!', rating: 5 },
];

const RECIPES = [
  { title: '5-Minute Pasta Aglio Olio', time: '5 min', difficulty: 'Easy', image: '🍝' },
  { title: 'Crispy Honey Chilli Potato', time: '20 min', difficulty: 'Medium', image: '🥔' },
  { title: 'Mango Lassi Smoothie Bowl', time: '10 min', difficulty: 'Easy', image: '🥭' },
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
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const searchTimeout = useRef(null);
  const filterRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    <div>
      <section className="hero-section" ref={heroRef}>
        <div className="hero-carousel" style={{ transform: window.innerWidth >= 768 ? `translateY(${scrollY * 0.15}px)` : 'none' }}>
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
              <div className="hero-badge">🌟 Premium Food Delivery</div>
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
          </div>
        </div>
        <div className="hero-floating-elements">
          <motion.div className="float-element float-rating" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
            <div className="float-rating-stars">⭐⭐⭐⭐⭐</div>
            <div className="float-rating-text">4.9 ★ Overall Rating</div>
          </motion.div>
          <motion.div className="float-element float-delivery" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}>
            🚚 Free Delivery • 25-35 min
          </motion.div>
          <motion.div className="float-element float-dish" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 1.0 }}>
            <span className="float-dish-icon">🍕</span>
            <div>
              <div className="float-dish-name">Margherita Pizza</div>
              <div className="float-dish-price">₹249</div>
            </div>
          </motion.div>
          <motion.div className="float-element float-category" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 1.2 }}>
            🍔 Burgers
          </motion.div>
          <motion.div className="float-element float-category-2" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 1.3 }}>
            🥗 Healthy
          </motion.div>
          <motion.div className="float-element float-trending" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.4 }}>
            🔥 Trending Near You
          </motion.div>
        </div>
        <div className="hero-indicators">
          {HERO_IMAGES.map((_, i) => (
            <button key={i} className={`hero-indicator ${currentImage === i ? 'active' : ''}`} onClick={() => setCurrentImage(i)} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </section>

      <motion.section {...fadeUp} className="max-w-6xl mx-auto px-5 -mt-9 relative z-10 mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-xl font-bold text-primary-900">What are you craving?</h2>
          <Link to="/spin" className="text-primary-600 text-sm font-semibold hover:text-primary-700">Can't decide? 🎰</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {['🍕', '🍔', '🍜', '🍰', '☕', '🥗'].map((icon, i) => (
            <button key={i} className="flex flex-col items-center gap-2 px-5 py-4 bg-white border border-[var(--border)] rounded-2xl cursor-pointer min-w-[90px] shrink-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-transparent hover:bg-[var(--secondary)]" onClick={() => { setFilters(prev => ({ ...prev, cuisine: ['Pizza', 'Burgers', 'Asian', 'Desserts', 'Cafe', 'Healthy'][i] })); setPage(1); }}>
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-semibold text-primary-900 whitespace-nowrap">{['Pizza', 'Burgers', 'Asian', 'Desserts', 'Cafe', 'Healthy'][i]}</span>
            </button>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="max-w-6xl mx-auto px-5 mb-14">
        <div className="text-center mb-8">
          <h2 className="section-title">Most Loved Dishes</h2>
          <p className="section-subtitle mx-auto">Our community's top picks — tried, tested, and loved by foodies like you</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {FEATURED_DISHES.map((dish, i) => (
            <motion.div key={dish.name} className="bg-white rounded-2xl p-4 text-center border border-[var(--border)] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
              <div className="text-4xl mb-3">{dish.image}</div>
              <h3 className="font-semibold text-sm text-primary-900 mb-1">{dish.name}</h3>
              <p className="text-xs text-[var(--text-muted)] mb-2">{dish.restaurant}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full font-semibold">⭐ {dish.rating}</span>
                <span className="text-sm font-bold text-primary-600">{dish.price}</span>
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
            <h2 className="font-serif text-xl font-bold text-primary-900">Restaurants Near You</h2>
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
            <h2 className="font-serif">Can't Decide? Let Spin-to-Dine Choose For You!</h2>
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

      <motion.section {...fadeUp} className="max-w-6xl mx-auto px-5 mb-16">
        <div className="text-center mb-8">
          <h2 className="section-title">What Our Foodies Say</h2>
          <p className="section-subtitle mx-auto">Real reviews from real people who love Spin-to-Dine</p>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <motion.div key={testimonialIdx} className="bg-white rounded-3xl p-8 md:p-10 text-center border border-[var(--border)] shadow-md" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}>
            <div className="text-5xl mb-4">{TESTIMONIALS[testimonialIdx].avatar}</div>
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-xl ${i < TESTIMONIALS[testimonialIdx].rating ? 'opacity-100' : 'opacity-20'}`}>⭐</span>
              ))}
            </div>
            <p className="text-lg text-primary-900/80 mb-5 italic leading-relaxed">"{TESTIMONIALS[testimonialIdx].text}"</p>
            <p className="font-semibold text-primary-900">{TESTIMONIALS[testimonialIdx].name}</p>
          </motion.div>
          <div className="flex justify-center gap-2 mt-5">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === testimonialIdx ? 'bg-primary-500 w-6' : 'bg-[var(--border)]'}`} onClick={() => setTestimonialIdx(i)} />
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="max-w-6xl mx-auto px-5 mb-16">
        <div className="text-center mb-8">
          <h2 className="section-title">Latest Recipes</h2>
          <p className="section-subtitle mx-auto">Quick and delicious recipes inspired by our top restaurants</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {RECIPES.map((recipe, i) => (
            <motion.div key={recipe.title} className="bg-white rounded-2xl overflow-hidden border border-[var(--border)] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
              <div className="h-44 flex items-center justify-center text-6xl bg-gradient-to-br from-primary-50 to-cream-100">{recipe.image}</div>
              <div className="p-5">
                <h3 className="font-serif font-bold text-lg text-primary-900 mb-3">{recipe.title}</h3>
                <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span>⏱ {recipe.time}</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                  <span>{recipe.difficulty}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="max-w-6xl mx-auto px-5 mb-16">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-10 md:p-14 text-center text-white">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="text-4xl mb-4">✉️</div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">Stay in the Loop</h2>
            <p className="text-primary-100/80 mb-6 max-w-md mx-auto">Get exclusive deals, new restaurant alerts, and recipe inspiration delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3.5 rounded-xl border-none text-primary-900 text-sm outline-none focus:ring-2 focus:ring-gold-400 font-sans" />
              <button type="submit" className="btn-gold whitespace-nowrap">Subscribe</button>
            </form>
          </motion.div>
        </div>
      </motion.section>

      <footer className="bg-primary-900 text-white">
        <div className="max-w-6xl mx-auto px-5 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 text-xl font-bold mb-4">
                <span>🍔</span>
                <span className="text-white">Spin-to-Dine</span>
              </div>
              <p className="text-primary-200/70 text-sm leading-relaxed">Discover delicious food near you. Spin, order, and earn rewards with every meal.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2.5 text-sm text-primary-200/70">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <Link to="/spin" className="hover:text-white transition-colors">Spin Wheel</Link>
                <Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
                <Link to="/menu" className="hover:text-white transition-colors">Full Menu</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Account</h4>
              <div className="flex flex-col gap-2.5 text-sm text-primary-200/70">
                <Link to="/profile" className="hover:text-white transition-colors">My Profile</Link>
                <Link to="/orders" className="hover:text-white transition-colors">My Orders</Link>
                <Link to="/favorites" className="hover:text-white transition-colors">Favorites</Link>
                <Link to="/cart" className="hover:text-white transition-colors">Cart</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <div className="flex flex-col gap-2.5 text-sm text-primary-200/70">
                <span>📧 hello@spintodine.com</span>
                <span>📞 +1 234 567 890</span>
                <span>📍 123 Foodie Lane, NYC</span>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-700/50 pt-6 text-center text-sm text-primary-200/50">
            <p>© {new Date().getFullYear()} Spin-to-Dine. All rights reserved. Made with ❤️ for food lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
