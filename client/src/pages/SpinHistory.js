import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import spinService from '../services/spinService';

const SpinHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [isAuthenticated, navigate, user?._id]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await spinService.getSpinHistory(user._id);
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch spin history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading-spinner">Loading spin history...</div>;
  }

  return (
    <div className="spin-history-page">
      <h1 className="spin-history-title">Spin History</h1>
      {history.length === 0 ? (
        <div className="empty-state">
          <h2>No spins yet! 🎰</h2>
          <p>Start spinning to discover amazing food</p>
          <button onClick={() => navigate('/spin')} className="btn-primary">Spin Now</button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <div key={entry._id} className="spin-history-card">
              <div className="spin-history-card-inner">
                {entry.suggestedDish && (
                  <>
                    <img
                      src={entry.suggestedDish.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop'}
                      alt={entry.suggestedDish.name}
                      className="dish-image"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop'; }}
                    />
                    <div className="dish-info">
                      <h3>{entry.suggestedDish.name}</h3>
                      {entry.restaurantId && <p className="restaurant-name">from {entry.restaurantId.name}</p>}
                      <p className="dish-price">₹{entry.suggestedDish.price}</p>
                    </div>
                  </>
                )}
                <div className="history-right">
                  <span className="history-date">{formatDate(entry.spinDate)}</span>
                  <span className={`history-status-badge ${entry.accepted ? 'accepted' : 'skipped'}`}>
                    {entry.accepted ? 'Accepted' : 'Skipped'}
                  </span>
                </div>
              </div>
              {entry.score !== undefined && (
                <div className="match-score">
                  Match Score: {Math.round(entry.score * 100)}%
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpinHistory;
