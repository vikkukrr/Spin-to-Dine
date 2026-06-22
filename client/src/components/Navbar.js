import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'hi' ? 'en' : 'hi');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🍔</span>
          <span className="logo-text">Spin-to-Dine</span>
        </Link>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${menuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>

          {isAuthenticated && (
            <Link to="/spin" className="nav-link spin-link" onClick={() => setMenuOpen(false)}>
              🎰 {t('nav.spin')}
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/spin-history" className="nav-link" onClick={() => setMenuOpen(false)}>
              {t('nav.spinHistory')}
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/favorites" className="nav-link" onClick={() => setMenuOpen(false)}>
              {t('nav.favorites')}
            </Link>
          )}

          <Link to="/leaderboard" className="nav-link" onClick={() => setMenuOpen(false)}>
            {t('nav.leaderboard')}
          </Link>

          {user?.isAdmin && (
            <Link to="/admin" className="nav-link admin-link" onClick={() => setMenuOpen(false)}>
              {t('nav.admin')}
            </Link>
          )}
        </div>

        <div className={`navbar-actions ${menuOpen ? 'mobile-open' : ''}`}>
          <button onClick={toggleLanguage} className="theme-toggle" title="Toggle language">
            {i18n.language === 'hi' ? '🇬🇧' : '🇮🇳'}
          </button>

          <button onClick={toggleDarkMode} className="theme-toggle" title="Toggle dark mode">
            {darkMode ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/cart" className="cart-link">
                <span className="cart-icon">🛒</span>
                <span className="cart-count">{getCartCount()}</span>
              </Link>
              <Link to="/orders" className="nav-link">{t('nav.orders')}</Link>
              <Link to="/profile" className="nav-link">{user?.name}</Link>
              <button onClick={handleLogout} className="logout-btn">{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">{t('nav.login')}</Link>
              <Link to="/register" className="btn-primary">{t('nav.signUp')}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
