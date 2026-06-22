import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user && !user.isAdmin) { navigate('/'); return; }
    fetchDashboard();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      setStats(res.data.stats);
    } catch (err) {
      addToast('Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading dashboard...</div>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        {['dashboard', 'orders', 'users', 'restaurants', 'menu', 'badges'].map(tab => (
          <button key={tab} className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && stats && (
        <div className="admin-stats">
          <div className="stat-card"><h3>{stats.totalUsers}</h3><p>Total Users</p></div>
          <div className="stat-card"><h3>{stats.totalOrders}</h3><p>Total Orders</p></div>
          <div className="stat-card"><h3>{stats.totalRestaurants}</h3><p>Restaurants</p></div>
          <div className="stat-card"><h3>{stats.totalMenuItems}</h3><p>Menu Items</p></div>
          <div className="stat-card"><h3>₹{stats.totalRevenue.toLocaleString()}</h3><p>Total Revenue</p></div>
        </div>
      )}

      {activeTab === 'orders' && <OrdersTab addToast={addToast} />}
      {activeTab === 'users' && <UsersTab addToast={addToast} />}
      {activeTab === 'restaurants' && <RestaurantsTab addToast={addToast} />}
      {activeTab === 'menu' && <MenuTab addToast={addToast} />}
      {activeTab === 'badges' && <BadgesTab addToast={addToast} />}
    </div>
  );
};

const OrdersTab = ({ addToast }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      addToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}`, { deliveryStatus: status });
      addToast('Order updated', 'success');
      fetchOrders();
    } catch (err) {
      addToast('Failed to update order', 'error');
    }
  };

  if (loading) return <div className="loading-spinner">Loading orders...</div>;

  return (
    <div className="admin-orders">
      <h2>All Orders</h2>
      {orders.map(order => (
        <div key={order._id} className="admin-order-card">
          <div className="admin-order-info">
            <p><strong>Order:</strong> {order._id?.substring(0, 8)}...</p>
            <p><strong>User:</strong> {order.userId?.name || 'Unknown'}</p>
            <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
            <p><strong>Status:</strong> {order.deliveryStatus}</p>
          </div>
          <div className="admin-order-actions">
            {['confirmed', 'preparing', 'out_for_delivery', 'delivered'].map(status => (
              <button key={status} className={`btn-sm btn-${status}`}
                onClick={() => updateStatus(order._id, status)}
                disabled={order.deliveryStatus === status}>
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const UsersTab = ({ addToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      addToast('User deleted', 'success');
      fetchUsers();
    } catch (err) {
      addToast('Failed to delete user', 'error');
    }
  };

  if (loading) return <div className="loading-spinner">Loading users...</div>;

  return (
    <div className="admin-users">
      <h2>Users</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Points</th>
            <th>Spins</th>
            <th>Streak</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.loyaltyPoints}</td>
              <td>{u.totalSpins}</td>
              <td>{u.currentStreak}</td>
              <td>
                <button className="btn-danger btn-sm" onClick={() => deleteUser(u._id)} disabled={u.isAdmin}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RestaurantsTab = ({ addToast }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', location: '', cuisines: '', deliveryTime: '', deliveryFee: 0, minOrder: 0, rating: 0, imageUrl: '', vegOnly: false
  });

  useEffect(() => { fetchRestaurants(); }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await api.get('/restaurants?limit=50');
      setRestaurants(res.data.restaurants || []);
    } catch (err) {
      addToast('Failed to load restaurants', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, cuisines: form.cuisines.split(',').map(c => c.trim()) };
    try {
      if (editing) {
        await api.put(`/admin/restaurants/${editing}`, data);
        addToast('Restaurant updated', 'success');
      } else {
        await api.post('/admin/restaurants', data);
        addToast('Restaurant created', 'success');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', location: '', cuisines: '', deliveryTime: '', deliveryFee: 0, minOrder: 0, rating: 0, imageUrl: '', vegOnly: false });
      fetchRestaurants();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error');
    }
  };

  const handleEdit = (r) => {
    setForm({
      name: r.name, location: r.location, cuisines: r.cuisines.join(', '),
      deliveryTime: r.deliveryTime, deliveryFee: r.deliveryFee, minOrder: r.minOrder,
      rating: r.rating, imageUrl: r.imageUrl || '', vegOnly: r.vegOnly
    });
    setEditing(r._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this restaurant and all its menu items?')) return;
    try {
      await api.delete(`/admin/restaurants/${id}`);
      addToast('Restaurant deleted', 'success');
      fetchRestaurants();
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  if (loading) return <div className="loading-spinner">Loading restaurants...</div>;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Restaurants</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', location: '', cuisines: '', deliveryTime: '', deliveryFee: 0, minOrder: 0, rating: 0, imageUrl: '', vegOnly: false }); }} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Restaurant'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="form-input" required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="form-input" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Cuisines (comma separated)</label>
              <input type="text" value={form.cuisines} onChange={e => setForm(p => ({ ...p, cuisines: e.target.value }))} className="form-input" required />
            </div>
            <div className="form-group">
              <label>Delivery Time (e.g. 30-40 min)</label>
              <input type="text" value={form.deliveryTime} onChange={e => setForm(p => ({ ...p, deliveryTime: e.target.value }))} className="form-input" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Delivery Fee (₹)</label>
              <input type="number" value={form.deliveryFee} onChange={e => setForm(p => ({ ...p, deliveryFee: +e.target.value }))} className="form-input" min={0} />
            </div>
            <div className="form-group">
              <label>Min Order (₹)</label>
              <input type="number" value={form.minOrder} onChange={e => setForm(p => ({ ...p, minOrder: +e.target.value }))} className="form-input" min={0} />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <input type="number" value={form.rating} onChange={e => setForm(p => ({ ...p, rating: +e.target.value }))} className="form-input" min={0} max={5} step={0.1} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Image URL</label>
              <input type="text" value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} className="form-input" />
            </div>
            <div className="form-group">
              <label className="filter-checkbox" style={{ marginTop: 30 }}>
                <input type="checkbox" checked={form.vegOnly} onChange={e => setForm(p => ({ ...p, vegOnly: e.target.checked }))} />
                Veg Only
              </label>
            </div>
          </div>
          <button type="submit" className="btn-primary">{editing ? 'Update Restaurant' : 'Create Restaurant'}</button>
        </form>
      )}

      <div className="admin-list">
        {restaurants.map(r => (
          <div key={r._id} className="admin-list-item">
            <div className="admin-list-info">
              <strong>{r.name}</strong>
              <span>{r.location} • {r.cuisines?.join(', ')} • ⭐{r.rating}</span>
            </div>
            <div className="admin-list-actions">
              <button onClick={() => handleEdit(r)} className="btn-secondary btn-sm">Edit</button>
              <button onClick={() => handleDelete(r._id)} className="btn-danger btn-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuTab = ({ addToast }) => {
  const [items, setItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: 0, category: 'lunch', veg: true,
    restaurantId: '', imageUrl: '', available: true
  });

  useEffect(() => {
    Promise.all([
      api.get('/restaurants?limit=50'),
      api.get('/restaurants/menu/all')
    ]).then(([rRes, mRes]) => {
      setRestaurants(rRes.data.restaurants || []);
      setItems(mRes.data || []);
    }).catch(() => addToast('Failed to load data', 'error'))
    .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/admin/menu/${editing}`, form);
        addToast('Menu item updated', 'success');
      } else {
        await api.post('/admin/menu', form);
        addToast('Menu item created', 'success');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', price: 0, category: 'lunch', veg: true, restaurantId: '', imageUrl: '', available: true });
      const mRes = await api.get('/restaurants/menu/all');
      setItems(mRes.data || []);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error');
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name, description: item.description || '', price: item.price,
      category: item.category, veg: item.veg, restaurantId: item.restaurantId?._id || item.restaurantId,
      imageUrl: item.imageUrl || '', available: item.available
    });
    setEditing(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await api.delete(`/admin/menu/${id}`);
      addToast('Menu item deleted', 'success');
      const mRes = await api.get('/restaurants/menu/all');
      setItems(mRes.data || []);
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  if (loading) return <div className="loading-spinner">Loading menu items...</div>;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Menu Items</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '', price: 0, category: 'lunch', veg: true, restaurantId: restaurants[0]?._id || '', imageUrl: '', available: true }); }} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Menu Item'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="form-input" required />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: +e.target.value }))} className="form-input" min={0} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Restaurant</label>
              <select value={form.restaurantId} onChange={e => setForm(p => ({ ...p, restaurantId: e.target.value }))} className="form-input" required>
                <option value="">Select restaurant</option>
                {restaurants.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="form-input">
                {['breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'desserts'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="form-input" rows={2} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Image URL</label>
              <input type="text" value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} className="form-input" />
            </div>
            <div className="form-group">
              <label className="filter-checkbox" style={{ marginTop: 30 }}>
                <input type="checkbox" checked={form.veg} onChange={e => setForm(p => ({ ...p, veg: e.target.checked }))} />
                Vegetarian
              </label>
            </div>
            <div className="form-group">
              <label className="filter-checkbox" style={{ marginTop: 30 }}>
                <input type="checkbox" checked={!form.available} onChange={e => setForm(p => ({ ...p, available: !e.target.checked }))} />
                Unavailable
              </label>
            </div>
          </div>
          <button type="submit" className="btn-primary">{editing ? 'Update Item' : 'Create Item'}</button>
        </form>
      )}

      <div className="admin-list">
        {items.map(item => (
          <div key={item._id} className="admin-list-item">
            <div className="admin-list-info">
              <strong>{item.name}</strong>
              <span>₹{item.price} • {item.category} • {item.restaurantId?.name || 'Unknown'} • {item.veg ? '🟢 Veg' : '🔴 Non-Veg'}</span>
            </div>
            <div className="admin-list-actions">
              <button onClick={() => handleEdit(item)} className="btn-secondary btn-sm">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="btn-danger btn-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BadgesTab = ({ addToast }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', icon: '', criteriaType: 'spin_count', criteriaThreshold: 1 });

  useEffect(() => { fetchBadges(); }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/badges');
      setBadges(res.data || []);
    } catch (err) {
      addToast('Failed to load badges', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/badges', {
        name: form.name, description: form.description, icon: form.icon,
        criteria: { type: form.criteriaType, threshold: form.criteriaThreshold }
      });
      addToast('Badge created', 'success');
      setShowForm(false);
      setForm({ name: '', description: '', icon: '', criteriaType: 'spin_count', criteriaThreshold: 1 });
      fetchBadges();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create badge', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this badge?')) return;
    try {
      await api.delete(`/admin/badges/${id}`);
      addToast('Badge deleted', 'success');
      fetchBadges();
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  if (loading) return <div className="loading-spinner">Loading badges...</div>;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Badges</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Badge'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="form-input" required />
            </div>
            <div className="form-group">
              <label>Icon (emoji)</label>
              <input type="text" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="form-input" required />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="form-input" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Criteria Type</label>
              <select value={form.criteriaType} onChange={e => setForm(p => ({ ...p, criteriaType: e.target.value }))} className="form-input">
                <option value="spin_count">Spin Count</option>
                <option value="order_count">Order Count</option>
                <option value="streak_days">Streak Days</option>
                <option value="points_earned">Points Earned</option>
              </select>
            </div>
            <div className="form-group">
              <label>Threshold</label>
              <input type="number" value={form.criteriaThreshold} onChange={e => setForm(p => ({ ...p, criteriaThreshold: +e.target.value }))} className="form-input" min={1} required />
            </div>
          </div>
          <button type="submit" className="btn-primary">Create Badge</button>
        </form>
      )}

      <div className="badges-grid">
        {badges.map(badge => (
          <div key={badge._id} className="badge-card">
            <span className="badge-icon">{badge.icon}</span>
            <span className="badge-name">{badge.name}</span>
            <span className="badge-desc">{badge.description}</span>
            <span className="badge-criteria">{badge.criteria?.type?.replace(/_/g, ' ')}: {badge.criteria?.threshold}</span>
            <button onClick={() => handleDelete(badge._id)} className="btn-danger btn-sm" style={{ marginTop: 8 }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
