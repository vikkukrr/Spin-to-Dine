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
          <h1>Join Spin-to-Dine</h1>
          <p className="auth-subtitle">Create your account and start exploring flavors!</p>
        </motion.div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          {[1, 2].map(s => (
            <div
              key={s}
              style={{
                width: `${s === step ? 32 : 8}px`, height: 6, borderRadius: 3,
                background: s <= step ? 'var(--primary)' : 'var(--border)',
                transition: 'all 0.3s ease'
              }}
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

        <form onSubmit={handleSubmit} className="auth-form">
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
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder="John Doe" autoFocus />
                </div>
              </div>

              <div className="form-group" {...inputStyle(0.2)}>
                <label htmlFor="email">Email</label>
                <div className="auth-input-icon">
                  <span className="input-icon">✉️</span>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" placeholder="you@example.com" />
                </div>
              </div>

              <div className="form-group" {...inputStyle(0.25)}>
                <label htmlFor="password">Password</label>
                <div className="auth-input-icon" style={{ position: 'relative' }}>
                  <span className="input-icon">🔒</span>
                  <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="form-input" placeholder="Minimum 6 characters" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                      padding: 4, color: 'var(--text-muted)'
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {formData.password && (
                  <div style={{ marginTop: 6, display: 'flex', gap: 4, alignItems: 'center' }}>
                    <div style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: formData.password.length >= 6 ? '#22C55E' : '#EF4444',
                      transition: 'all 0.3s'
                    }} />
                    <span style={{ fontSize: '0.7rem', color: formData.password.length >= 6 ? '#22C55E' : '#EF4444', fontWeight: 600 }}>
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
                  className="btn-primary btn-full"
                  onClick={nextStep}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ padding: '14px 24px', fontSize: '0.95rem', marginTop: 8 }}
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
                  <span className="input-icon" style={{ top: 18, transform: 'none' }}>📍</span>
                  <textarea
                    id="address" name="address" value={formData.address}
                    onChange={handleChange} className="form-input" rows={3}
                    placeholder="Street, city, zip code"
                    style={{ paddingLeft: 44, resize: 'vertical' }}
                    autoFocus
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <motion.button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flex: 1, padding: '14px 24px', fontSize: '0.95rem' }}
                >
                  ← Back
                </motion.button>
                <motion.button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  style={{ flex: 1, padding: '14px 24px', fontSize: '0.95rem' }}
                >
                  {loading ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
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
          style={{ marginTop: 24 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.35 }}
        >
          Already have an account? <Link to="/login">Login</Link>
        </motion.p>
      </motion.div>

      <style>{`
        .loading-dot {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Register;
