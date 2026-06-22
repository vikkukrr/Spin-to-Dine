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
      <h1>Spin History</h1>
      {history.length === 0 ? (
        <div className="empty-state">
          <h2>No spins yet</h2>
          <p>Start spinning the wheel to see your history!</p>
          <button onClick={() => navigate('/spin')} className="btn-primary">Go Spin!</button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <div key={entry._id} className="history-card">
              <div className="history-header">
                <span className="history-date">{formatDate(entry.spinDate)}</span>
                <span className={`history-status ${entry.accepted ? 'accepted' : 'skipped'}`}>
                  {entry.accepted ? 'Accepted' : 'Skipped'}
                </span>
              </div>
              <div className="history-body">
                {entry.suggestedDish && (
                  <>
                    <img src={entry.suggestedDish.imageUrl} alt={entry.suggestedDish.name} className="history-dish-img" />
                    <div className="history-dish-info">
                      <h3>{entry.suggestedDish.name}</h3>
                      <p className="history-price">₹{entry.suggestedDish.price}</p>
                    </div>
                  </>
                )}
                {entry.restaurantId && (
                  <p className="history-restaurant">from {entry.restaurantId.name}</p>
                )}
              </div>
              {entry.score !== undefined && (
                <div className="history-score">
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
