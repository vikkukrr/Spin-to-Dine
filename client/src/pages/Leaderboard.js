import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DUMMY_DATA = [
  { name: 'Priya Sharma', email: 'priya@example.com', loyaltyPoints: 2450, totalSpins: 87, currentStreak: 12, badgesCount: 8 },
  { name: 'Amit Patel', email: 'amit@example.com', loyaltyPoints: 2100, totalSpins: 65, currentStreak: 9, badgesCount: 6 },
  { name: 'Rahul Verma', email: 'rahul@example.com', loyaltyPoints: 1890, totalSpins: 72, currentStreak: 15, badgesCount: 7 },
  { name: 'Sneha Reddy', email: 'sneha@example.com', loyaltyPoints: 1650, totalSpins: 54, currentStreak: 7, badgesCount: 5 },
  { name: 'Vikram Singh', email: 'vikram@example.com', loyaltyPoints: 1420, totalSpins: 48, currentStreak: 6, badgesCount: 4 },
  { name: 'Ananya Gupta', email: 'ananya@example.com', loyaltyPoints: 1280, totalSpins: 39, currentStreak: 5, badgesCount: 4 },
  { name: 'Arjun Nair', email: 'arjun@example.com', loyaltyPoints: 1150, totalSpins: 61, currentStreak: 11, badgesCount: 6 },
  { name: 'Neha Joshi', email: 'neha@example.com', loyaltyPoints: 980, totalSpins: 33, currentStreak: 4, badgesCount: 3 },
  { name: 'Karan Mehta', email: 'karan@example.com', loyaltyPoints: 820, totalSpins: 27, currentStreak: 3, badgesCount: 3 },
  { name: 'Divya Kapoor', email: 'divya@example.com', loyaltyPoints: 750, totalSpins: 22, currentStreak: 8, badgesCount: 4 },
  { name: 'Rohit Desai', email: 'rohit@example.com', loyaltyPoints: 680, totalSpins: 19, currentStreak: 2, badgesCount: 2 },
  { name: 'Isha Malhotra', email: 'isha@example.com', loyaltyPoints: 610, totalSpins: 31, currentStreak: 6, badgesCount: 3 },
  { name: 'Manish Tiwari', email: 'manish@example.com', loyaltyPoints: 540, totalSpins: 15, currentStreak: 1, badgesCount: 2 },
  { name: 'Pooja Agarwal', email: 'pooja@example.com', loyaltyPoints: 480, totalSpins: 18, currentStreak: 3, badgesCount: 2 },
  { name: 'Suresh Iyer', email: 'suresh@example.com', loyaltyPoints: 390, totalSpins: 12, currentStreak: 0, badgesCount: 1 },
  { name: 'Kavita Das', email: 'kavita@example.com', loyaltyPoints: 310, totalSpins: 9, currentStreak: 2, badgesCount: 1 },
  { name: 'Deepak Choudhary', email: 'deepak@example.com', loyaltyPoints: 250, totalSpins: 7, currentStreak: 1, badgesCount: 1 },
  { name: 'Ritu Jain', email: 'ritu@example.com', loyaltyPoints: 190, totalSpins: 5, currentStreak: 0, badgesCount: 1 },
  { name: 'Akash Pandey', email: 'akash@example.com', loyaltyPoints: 120, totalSpins: 3, currentStreak: 0, badgesCount: 0 },
  { name: 'Simran Kaur', email: 'simran@example.com', loyaltyPoints: 50, totalSpins: 1, currentStreak: 0, badgesCount: 0 },
];

const sortDummy = (data, type) => {
  const sorted = [...data];
  if (type === 'points') sorted.sort((a, b) => b.loyaltyPoints - a.loyaltyPoints);
  else if (type === 'spins') sorted.sort((a, b) => b.totalSpins - a.totalSpins);
  else if (type === 'streak') sorted.sort((a, b) => b.currentStreak - a.currentStreak);
  return sorted.map((entry, i) => ({ ...entry, _id: `dummy_${i}`, rank: i + 1 }));
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [type, setType] = useState('points');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [type]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/leaderboard?type=${type}&limit=20`);
      if (res.data && res.data.length > 0) {
        setLeaderboard(res.data);
      } else {
        setLeaderboard(sortDummy(DUMMY_DATA, type));
      }
    } catch (err) {
      console.error('Failed to load leaderboard, using dummy data');
      setLeaderboard(sortDummy(DUMMY_DATA, type));
    } finally {
      setLoading(false);
    }
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  };

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="leaderboard-page">
      <h1>Leaderboard</h1>
      <p className="leaderboard-subtitle">Our finest food enthusiasts — where every meal tells a story</p>

      <div className="leaderboard-tabs">
        {[
          { value: 'points', label: 'Points' },
          { value: 'spins', label: 'Spins' },
          { value: 'streak', label: 'Streak' }
        ].map(tab => (
          <button key={tab.value}
            className={`leaderboard-tab ${type === tab.value ? 'active' : ''}`}
            onClick={() => setType(tab.value)}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner">Loading leaderboard...</div>
      ) : (
        <div className="leaderboard-list">
          {leaderboard.map(entry => (
            <div key={entry._id} className={`leaderboard-card ${getRankClass(entry.rank)}`}>
              <div className="leaderboard-rank">
                <span className="rank-number">{getMedal(entry.rank)}</span>
              </div>
              <div className="leaderboard-avatar">
                {entry.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="leaderboard-info">
                <h3>{entry.name}</h3>
                <div className="leaderboard-metrics">
                  <span className="metric">⭐ {entry.loyaltyPoints} pts</span>
                  <span className="metric">🎰 {entry.totalSpins} spins</span>
                  <span className="metric">🔥 {entry.currentStreak} day streak</span>
                  <span className="metric">🏅 {entry.badgesCount} badges</span>
                </div>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="empty-state">
              <p>No data yet. Start spinning and ordering!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
