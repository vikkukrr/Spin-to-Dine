import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { getFallbackOrders } from '../services/fallbackData';

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

const STATUS_COLORS = {
  placed: { bg: '#FF6B35', text: '#ffffff' },
  confirmed: { bg: '#3B82F6', text: '#ffffff' },
  preparing: { bg: '#F59E0B', text: '#ffffff' },
  out_for_delivery: { bg: '#8B5CF6', text: '#ffffff' },
  delivered: { bg: '#10B981', text: '#ffffff' },
  cancelled: { bg: '#EF4444', text: '#ffffff' }
};

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
      const fallback = getFallbackOrders({ status: statusFilter, search: searchQuery });
      setOrders(fallback);
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
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, deliveryStatus: 'cancelled' } : o));
      addToast('Order cancelled', 'success');
    }
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

  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'cash': return 'Cash on Delivery';
      case 'card': return 'Card Payment';
      case 'online': return 'Online Payment';
      default: return method;
    }
  };

  if (loading) return <div className="loading-spinner">Loading orders...</div>;

  if (error) {
    return (
      <div className="orders-page">
        <div className="checkout-error">{error}</div>
        <button onClick={fetchOrders} className="btn-primary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="orders-title">My Orders</h1>

      <div className="orders-filter-bar">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
          {STATUS_OPTIONS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <form onSubmit={handleSearch} className="order-search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="orders-search-input"
          />
          <button type="submit" className="orders-search-btn">Search</button>
        </form>

        <div className="date-range-group">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="date-input" />
          <span className="date-range-sep">to</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="date-input" />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-orders-icon">&#x1F4E6;</div>
          <h2 className="empty-orders-title">No orders yet!</h2>
          <p className="empty-orders-text">Start exploring restaurants and place your first order</p>
          <Link to="/" className="explore-btn">Explore Restaurants</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const currentStep = getStatusStep(order.deliveryStatus);
            const isCancelled = order.deliveryStatus === 'cancelled';
            const statusColor = STATUS_COLORS[order.deliveryStatus] || { bg: '#999', text: '#fff' };

            return (
              <div key={order._id} className="order-card">
                {/* Card Header */}
                <div className="order-card-header">
                  <div>
                    <h3 className="order-restaurant-name">{order.restaurantName}</h3>
                    <p className="order-date">{formatDate(order.orderedAt)}</p>
                  </div>
                  <span
                    className="status-badge"
                    style={{ background: statusColor.bg, color: statusColor.text }}
                  >
                    {order.deliveryStatus === 'cancelled' && <>&#10005;</>}
                    {order.deliveryStatus === 'delivered' && <>&#10003;</>}
                    {!['cancelled', 'delivered'].includes(order.deliveryStatus) && <>&#9679;</>}
                    {' '}{order.deliveryStatus.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>

                {/* Progress Stepper */}
                {!isCancelled && (
                  <div className="stepper">
                    <div className="stepper-track">
                      <div
                        className="stepper-progress"
                        style={{ width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%` }}
                      />
                    </div>
                    {ORDER_STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStep;
                      const isCurrent = idx === currentStep;
                      return (
                        <div
                          key={step}
                          className={`step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                        >
                          <div className={`step-circle ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                            {isCompleted ? <>&#10003;</> : isCurrent ? <span className="step-pulse" /> : idx + 1}
                          </div>
                          <span className={`step-label ${isCompleted || isCurrent ? 'active' : ''}`}>
                            {step.replace(/_/g, ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {isCancelled && (
                  <div className="cancelled-label">This order has been cancelled</div>
                )}

                {/* Items */}
                <div className="order-items-section">
                  <div className="order-divider" />
                  <p className="order-items-label">Items Ordered</p>
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <span className="order-item-name">{item.name} &times; {item.quantity}</span>
                      <span className="order-item-price">&#x20B9;{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="order-divider" />
                <div className="order-card-footer">
                  <div className="order-footer-left">
                    <div className="order-total-row">
                      <span className="order-total-label">Total:</span>
                      <span className="order-total-value">&#x20B9;{order.totalAmount}</span>
                    </div>
                    <div className="order-footer-badges">
                      <span className="footer-badge">&#x1F4B3; {formatPaymentMethod(order.paymentMethod)}</span>
                      {order.deliveryAddress && (
                        <span className="footer-badge footer-address">&#x1F4CD; {order.deliveryAddress}</span>
                      )}
                    </div>
                  </div>
                  <div className="order-footer-actions">
                    {(order.deliveryStatus === 'placed' || order.deliveryStatus === 'confirmed') && (
                      <button onClick={() => handleCancelOrder(order._id)} className="cancel-order-btn">
                        Cancel Order
                      </button>
                    )}
                    {order.deliveryStatus === 'delivered' && (
                      <button onClick={() => navigate('/')} className="reorder-btn">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
