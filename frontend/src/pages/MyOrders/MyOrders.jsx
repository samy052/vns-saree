import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_ENDPOINTS from '../../config/api';
import './MyOrders.css';

/* ─── Status helpers ─────────────────────────────────────── */
const STATUS_CONFIG = {
  Pending:    { color: '#F59E0B', bg: '#FEF3C7', icon: 'lucide:clock',            label: 'Order Placed'   },
  Processing: { color: '#3B82F6', bg: '#EFF6FF', icon: 'lucide:package',          label: 'Processing'     },
  Shipped:    { color: '#8B5CF6', bg: '#F5F3FF', icon: 'lucide:truck',             label: 'Shipped'        },
  Delivered:  { color: '#10B981', bg: '#ECFDF5', icon: 'lucide:check-circle',      label: 'Delivered'      },
  Cancelled:  { color: '#EF4444', bg: '#FEF2F2', icon: 'lucide:x-circle',         label: 'Cancelled'      },
  'Out For Delivery': { color: '#F59E0B', bg: '#FEF3C7', icon: 'lucide:navigation', label: 'Out for Delivery' },
};

const getStatus = (s) => STATUS_CONFIG[s] || STATUS_CONFIG['Pending'];

/* ─── Tracking Timeline ──────────────────────────────────── */
const TrackingTimeline = ({ activities = [] }) => {
  if (!activities.length) {
    return (
      <div className="tracking-empty">
        <iconify-icon icon="lucide:map-pin-off" className="text-3xl text-gray-300"></iconify-icon>
        <p>Tracking updates will appear once shipment is dispatched.</p>
      </div>
    );
  }
  return (
    <div className="tracking-timeline">
      {activities.map((act, i) => (
        <div key={i} className={`timeline-item ${i === 0 ? 'active' : ''}`}>
          <div className="timeline-dot"></div>
          {i < activities.length - 1 && <div className="timeline-line"></div>}
          <div className="timeline-content">
            <p className="timeline-status">{act.activity}</p>
            <p className="timeline-location">{act.location}</p>
            <p className="timeline-date">{act.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Single Order Card ──────────────────────────────────── */
const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const [tracking, setTracking] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState(null);

  const cfg = getStatus(order.status);
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const loadTracking = useCallback(async () => {
    if (tracking || trackLoading) return;
    setTrackLoading(true);
    setTrackError(null);
    try {
      const res = await fetch(API_ENDPOINTS.trackOrder(order.id));
      const data = await res.json();
      setTracking(data);
    } catch {
      setTrackError('Could not load tracking info. Please try again.');
    } finally {
      setTrackLoading(false);
    }
  }, [order.id, tracking, trackLoading]);

  const handleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) loadTracking();
  };

  // Extract tracking activities from ShipRocket response
  const activities = tracking?.tracking?.tracking_data?.shipment_track_activities || [];
  const etd = tracking?.tracking?.tracking_data?.etd;
  const courierName = tracking?.tracking?.tracking_data?.shipment_track?.[0]?.courier_name;
  const awbCode = tracking?.tracking?.tracking_data?.shipment_track?.[0]?.awb_code;

  return (
    <div className="order-card">
      {/* ── Card Header ── */}
      <div className="order-card-header">
        <div className="order-meta">
          <div className="order-id-wrap">
            <iconify-icon icon="lucide:receipt-text" className="text-[#800020]"></iconify-icon>
            <span className="order-id">Order #{order.id}</span>
          </div>
          <span className="order-date">{orderDate}</span>
        </div>

        <div className="order-status-badge" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
          <iconify-icon icon={cfg.icon}></iconify-icon>
          {cfg.label}
        </div>
      </div>

      {/* ── Items Preview ── */}
      <div className="order-items-row">
        {(order.OrderItems || []).slice(0, 3).map((item, i) => (
          <div key={i} className="order-item-chip">
            <span className="item-name">{item.product_name || `Product #${item.product_id}`}</span>
            <span className="item-qty">×{item.quantity}</span>
            <span className="item-price">₹{Number(item.price).toLocaleString('en-IN')}</span>
          </div>
        ))}
        {(order.OrderItems || []).length > 3 && (
          <span className="more-items">+{order.OrderItems.length - 3} more</span>
        )}
      </div>

      {/* ── Amount + Actions ── */}
      <div className="order-footer">
        <div className="order-total">
          <span className="total-label">Total Paid</span>
          <span className="total-amount">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
          {Number(order.discount_amount) > 0 && (
            <span className="discount-saved">
              <iconify-icon icon="lucide:tag"></iconify-icon>
              Saved ₹{Number(order.discount_amount).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <button className={`track-btn ${expanded ? 'active' : ''}`} onClick={handleExpand}>
          <iconify-icon icon={expanded ? 'lucide:chevron-up' : 'lucide:map-pin'}></iconify-icon>
          {expanded ? 'Hide Tracking' : 'Track Order'}
        </button>
      </div>

      {/* ── Shipping Address ── */}
      <div className="order-address">
        <iconify-icon icon="lucide:map-pin" className="text-[#800020]"></iconify-icon>
        <span>{order.address}, {order.city} – {order.pincode}</span>
      </div>

      {/* ── Tracking Panel ── */}
      {expanded && (
        <div className="tracking-panel">
          <div className="tracking-panel-header">
            <h4><iconify-icon icon="lucide:truck"></iconify-icon> Live Shipment Tracking</h4>
            {courierName && <span className="courier-badge">{courierName}</span>}
          </div>

          {awbCode && (
            <div className="awb-row">
              <span className="awb-label">AWB</span>
              <span className="awb-code">{awbCode}</span>
            </div>
          )}

          {etd && (
            <div className="etd-row">
              <iconify-icon icon="lucide:calendar-check"></iconify-icon>
              <span>Expected Delivery: <strong>{etd}</strong></span>
            </div>
          )}

          {trackLoading && (
            <div className="track-loading">
              <div className="track-spinner"></div>
              <span>Fetching live tracking...</span>
            </div>
          )}

          {trackError && (
            <div className="track-error">
              <iconify-icon icon="lucide:alert-circle"></iconify-icon>
              {trackError}
            </div>
          )}

          {!trackLoading && !trackError && (
            <TrackingTimeline activities={activities} />
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Main Page ──────────────────────────────────────────── */
export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) { navigate('/login'); return; }

    (async () => {
      try {
        const res = await fetch(API_ENDPOINTS.myOrders(user.email));
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, navigate]);

  return (
    <div className="my-orders-page">
      {/* Hero Banner */}
      <div className="orders-hero">
        <div className="orders-hero-content">
          <iconify-icon icon="lucide:package-search" className="hero-icon"></iconify-icon>
          <div>
            <h1>My Orders</h1>
            <p>Track your Banarasi sarees from our loom to your doorstep</p>
          </div>
        </div>
      </div>

      <div className="orders-container">
        {loading && (
          <div className="orders-loading">
            {[1, 2, 3].map(i => (
              <div key={i} className="order-skeleton">
                <div className="skel skel-header"></div>
                <div className="skel skel-body"></div>
                <div className="skel skel-footer"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="orders-error">
            <iconify-icon icon="lucide:wifi-off" className="text-4xl text-red-400"></iconify-icon>
            <h3>Could not load orders</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <iconify-icon icon="lucide:shopping-bag" className="empty-icon"></iconify-icon>
            <h3>No Orders Yet</h3>
            <p>Your orders will appear here once you place your first order.</p>
            <Link to="/collection" className="shop-now-btn">
              <iconify-icon icon="lucide:sparkles"></iconify-icon>
              Explore Collection
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            <div className="orders-count">
              <iconify-icon icon="lucide:layers"></iconify-icon>
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </div>
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
