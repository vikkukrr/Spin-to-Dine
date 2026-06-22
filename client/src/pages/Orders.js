import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const ORDER_STEPS = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Orders' },
  { value: 'placed', label: 'Placed' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(`/orders?${params.toString()}`);
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      addToast('Order cancelled', 'success');
      fetchOrders();
    } catch (err) {
      addToast(err.response?.data?.message || 'Cannot cancel order', 'error');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: '#FF6B35', confirmed: '#F97316', preparing: '#FFB347',
      out_for_delivery: '#4CAF50', delivered: '#2E7D32', cancelled: '#EF5350'
    };
    return colors[status] || '#999';
  };

  const getStatusStep = (status) => ORDER_STEPS.indexOf(status);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  if (loading) return <div className="loading-spinner">Loading orders...</div>;

  if (error) {
    return (
      <div className="orders-page">
        <div className="error-message">{error}</div>
        <button onClick={fetchOrders} className="btn-primary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      <div className="orders-filters">
        <div className="filter-group">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
            {STATUS_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSearch} className="order-search-form">
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search orders..." className="form-input" />
          <button type="submit" className="btn-secondary">Search</button>
        </form>

        <div className="filter-group">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="filter-select" />
          <span>to</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="filter-select" />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>No orders found</h2>
          <p>Start exploring and order your favorite food!</p>
          <Link to="/" className="btn-primary">Browse Restaurants</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const currentStep = getStatusStep(order.deliveryStatus);
            const isCancelled = order.deliveryStatus === 'cancelled';

            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>{order.restaurantName}</h3>
                    <p className="order-date">{formatDate(order.orderedAt)}</p>
                  </div>
                  <div className="order-status" style={{ backgroundColor: getStatusColor(order.deliveryStatus) }}>
                    {order.deliveryStatus.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>

                {!isCancelled && (
                  <div className="order-tracking">
                    {ORDER_STEPS.map((step, idx) => (
                      <div key={step} className={`tracking-step ${idx <= currentStep ? 'completed' : ''} ${idx === currentStep ? 'active' : ''}`}>
                        <div className="tracking-dot">
                          {idx < currentStep ? '✓' : idx + 1}
                        </div>
                        <span className="tracking-label">{step.replace(/_/g, ' ')}</span>
                        {idx < ORDER_STEPS.length - 1 && <div className="tracking-line" />}
                      </div>
                    ))}
                  </div>
                )}

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <span key={index} className="order-item">{item.name} x {item.quantity}</span>
                  ))}
                </div>

                <div className="order-footer">
                  <span className="order-total">Total: ₹{order.totalAmount}</span>
                  <span className="payment-method">
                    Payment: {order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod === 'card' ? 'Card' : 'Online'}
                  </span>
                </div>

                <div className="order-address">📍 {order.deliveryAddress}</div>

                {(order.deliveryStatus === 'placed' || order.deliveryStatus === 'confirmed') && (
                  <button onClick={() => handleCancelOrder(order._id)} className="btn-secondary" style={{ marginTop: '10px' }}>
                    Cancel Order
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
