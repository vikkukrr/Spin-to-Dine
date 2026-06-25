import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const Login = () => {
  const { login, error } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);
    if (result.success) {
      addToast('Welcome back!', 'success');
      navigate('/');
    }
  };

  return (
    <div className="auth-page dark-page">
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Log in to continue your food journey</p>
        </motion.div>

        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            <label htmlFor="email">Email</label>
            <div className="auth-input-icon">
              <span className="input-icon">✉️</span>
              <input
                type="email" id="email" name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="you@example.com"
                autoFocus
              />
            </div>
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
          >
            <label htmlFor="password">Password</label>
            <div className="auth-input-icon">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password" name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </motion.div>

          <motion.div
            className="form-group forgot-password-group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.35 }}
          >
            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
          >
            <motion.button
              type="submit"
              className="btn-primary btn-full"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}

            >
              {loading ? (
                <span className="btn-loading">
                  <span className="loading-dot" /> Logging in...
                </span>
              ) : 'Login'}
            </motion.button>
          </motion.div>
        </form>

        <motion.div
          className="auth-divider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.35 }}
        >
          <span>or continue with</span>
        </motion.div>

        <motion.div
          className="auth-social"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
        >
          <button
            onClick={async () => {
              setSocialLoading(true);
              try {
                const res = await api.post('/social/google', {
                  email: 'google_user_' + Date.now() + '@example.com',
                  name: 'Google User',
                  googleId: 'google_' + Date.now()
                });
                localStorage.setItem('token', res.data.token);
                addToast('Logged in with Google!', 'success');
                window.location.href = '/';
              } catch {
                addToast('Google login failed', 'error');
              } finally {
                setSocialLoading(false);
              }
            }}
            className="btn-google"
            disabled={socialLoading}
          >
            {socialLoading ? 'Connecting...' : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
                Sign in with Google
              </>
            )}
          </button>
        </motion.div>

        <motion.p
          className="auth-switch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.35 }}
        >
          Don't have an account? <Link to="/register">Register</Link>
        </motion.p>
      </motion.div>


    </div>
  );
};

export default Login;
