import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const { register, error } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    address: '', budgetRange: 'medium', location: 'default'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    if (result.success) {
      addToast('Account created! Welcome to Spin-to-Dine 🎉', 'success');
      navigate('/');
    }
  };

  const inputStyle = (delay) => ({
    initial: { opacity: 0, x: -15 },
    animate: { opacity: 1, x: 0 },
    transition: { delay, duration: 0.35 }
  });

  return (
    <div className="auth-page">
      <div className="auth-left">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h1>Join Spin-to-Dine</h1>
          <p className="auth-subtitle">Create your account and start exploring flavors!</p>
        </motion.div>

        <div className="register-steps">
          {[1, 2].map(s => (
            <div
              key={s}
              className={`register-step-dot ${s === step ? 'active' : ''} ${s <= step ? 'filled' : ''}`}
            />
          ))}
        </div>

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

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="form-group" {...inputStyle(0.15)}>
                <label htmlFor="name">Full Name</label>
                <div className="auth-input-icon">
                  <span className="input-icon">👤</span>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" autoFocus />
                </div>
              </div>

              <div className="form-group" {...inputStyle(0.2)}>
                <label htmlFor="email">Email</label>
                <div className="auth-input-icon">
                  <span className="input-icon">✉️</span>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                </div>
              </div>

              <div className="form-group" {...inputStyle(0.25)}>
                <label htmlFor="password">Password</label>
                <div className="auth-input-icon">
                  <span className="input-icon">🔒</span>
                  <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} placeholder="Minimum 6 characters" />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {formData.password && (
                  <div className="password-strength">
                    <div className={`password-strength-bar ${formData.password.length >= 6 ? 'strong' : 'weak'}`} />
                    <span className={`password-strength-label ${formData.password.length >= 6 ? 'strong' : 'weak'}`}>
                      {formData.password.length >= 6 ? 'Strong' : `${formData.password.length}/6 min`}
                    </span>
                  </div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
              >
                  <motion.button
                    type="button"
                    className="auth-btn"
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ marginTop: 8 }}
                  >
                    Continue →
                  </motion.button>
              </motion.div>

            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="form-group" {...inputStyle(0.15)}>
                <label htmlFor="address">Delivery Address</label>
                <div className="auth-input-icon">
                  <span className="input-icon input-icon-textarea">📍</span>
                  <textarea
                    id="address" name="address" value={formData.address}
                    onChange={handleChange} rows={3}
                    placeholder="Street, city, zip code"
                    autoFocus
                  />
                </div>
              </div>

              <div className="register-step-actions">
                <motion.button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ← Back
                </motion.button>
                <motion.button
                  type="submit"
                  className="auth-btn"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <span className="btn-loading">
                      <span className="loading-dot" /> Creating...
                    </span>
                  ) : 'Create Account'}
                </motion.button>
              </div>

            </motion.div>
          )}
        </form>

        <motion.p
          className="auth-switch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.35 }}
        >
          Already have an account? <Link to="/login">Login</Link>
        </motion.p>
      </motion.div>
      </div>

      <div className="auth-right">
        <div className="auth-right-overlay" />
        <div className="auth-right-content">
          <span className="auth-right-emoji">🍔</span>
          <h2>Discover Your Next Favorite Meal</h2>
          <p>Spin the wheel, explore restaurants, and earn rewards with every order!</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
