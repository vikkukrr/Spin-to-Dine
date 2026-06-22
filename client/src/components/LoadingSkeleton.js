import React from 'react';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-image skeleton-pulse" />
    <div className="skeleton-content">
      <div className="skeleton-line skeleton-pulse" style={{ width: '70%' }} />
      <div className="skeleton-line skeleton-pulse" style={{ width: '50%' }} />
      <div className="skeleton-line skeleton-pulse" style={{ width: '30%' }} />
    </div>
  </div>
);

const SkeletonMenuItem = () => (
  <div className="skeleton-menu-item">
    <div className="skeleton-image skeleton-pulse" style={{ width: 80, height: 80 }} />
    <div className="skeleton-content" style={{ flex: 1 }}>
      <div className="skeleton-line skeleton-pulse" style={{ width: '60%' }} />
      <div className="skeleton-line skeleton-pulse" style={{ width: '80%' }} />
      <div className="skeleton-line skeleton-pulse" style={{ width: '20%' }} />
    </div>
  </div>
);

const SkeletonOrderCard = () => (
  <div className="skeleton-order-card">
    <div className="skeleton-line skeleton-pulse" style={{ width: '40%', height: 20 }} />
    <div className="skeleton-line skeleton-pulse" style={{ width: '60%', height: 14 }} />
    <div className="skeleton-line skeleton-pulse" style={{ width: '30%', height: 14 }} />
  </div>
);

const LoadingSkeleton = ({ type = 'card', count = 6 }) => {
  if (type === 'page') {
    return (
      <div className="skeleton-page">
        <div className="skeleton-hero skeleton-pulse" />
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (type === 'menu') {
    return (
      <div className="skeleton-menu-list">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonMenuItem key={i} />)}
      </div>
    );
  }

  if (type === 'order') {
    return (
      <div className="skeleton-orders-list">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonOrderCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
};

export default LoadingSkeleton;
