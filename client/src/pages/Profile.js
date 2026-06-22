import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import usePushNotifications from '../hooks/usePushNotifications';
import api from '../services/api';

const Profile = () => {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { isSupported, permission, register, sendTestNotification } = usePushNotifications();

  const [formData, setFormData] = useState({
    name: '', email: '', address: '', budgetRange: 'medium', location: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setProfile(res.data);
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        address: res.data.address || '',
        budgetRange: res.data.budgetRange || 'medium',
        location: res.data.location || ''
      });
    } catch (err) {
      console.error('Failed to fetch profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfile(formData);
    setLoading(false);
    if (result.success) {
      addToast('Profile updated successfully!', 'success');
    } else {
      addToast(result.error || 'Update failed', 'error');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      addToast('Password changed successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>

        {profile && (
          <div className="profile-stats">
            <div className="stat-card">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{profile.loyaltyPoints || 0}</span>
              <span className="stat-label">Loyalty Points</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🎰</span>
              <span className="stat-value">{profile.totalSpins || 0}</span>
              <span className="stat-label">Total Spins</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🔥</span>
              <span className="stat-value">{profile.currentStreak || 0}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🏅</span>
              <span className="stat-value">{profile.badges?.length || 0}</span>
              <span className="stat-label">Badges</span>
            </div>
          </div>
        )}

        {profile?.badges && profile.badges.length > 0 && (
          <div className="profile-badges">
            <h2>Badges Earned</h2>
            <div className="badges-grid">
              {profile.badges.map(badge => (
                <div key={badge._id} className="badge-card">
                  <span className="badge-icon">{badge.icon}</span>
                  <span className="badge-name">{badge.name}</span>
                  <span className="badge-desc">{badge.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="profile-form-section">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label>Delivery Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} className="form-input" rows={3} />
            </div>
            <div className="form-group">
              <label>Budget Range</label>
              <select name="budgetRange" value={formData.budgetRange} onChange={handleChange} className="form-input">
                <option value="low">Budget Friendly (Under ₹150)</option>
                <option value="medium">Medium (Under ₹350)</option>
                <option value="high">Premium (Above ₹350)</option>
              </select>
            </div>
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="profile-form-section">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="auth-form">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="form-input" required minLength={6} />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="form-input" required minLength={6} />
            </div>
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {isSupported && (
          <div className="notification-settings">
            <h2>Notifications</h2>
            <div className="notification-toggle">
              {permission !== 'granted' ? (
                <button onClick={register}>Enable Notifications</button>
              ) : (
                <>
                  <button onClick={sendTestNotification}>Test Notification</button>
                  <span className="notification-status">✅ Notifications enabled</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
