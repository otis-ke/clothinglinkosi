import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, get } from 'firebase/database';
import { rtdb } from '../firebase/client';
import { auth, isCustomerUser } from '../firebase/authActions';
import MediaAsset from '../components/MediaAsset';
import './orders.css';

function formatDate(value) {
  if (typeof value !== 'number') return 'Just now';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? 'Just now' : d.toLocaleString();
}

function OrderCard({ order }) {
  return (
    <div className="order-card">
      <div className="order-card-head">
        <span>{formatDate(order.createdAt)}</span>
        <span className="order-total">Ksh {order.totalAmount}</span>
      </div>

      <div className="order-info">
        <h3>Billing Information</h3>
        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Address:</strong> {order.address}, {order.county}, {order.country}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        {order.description && <p><strong>Description:</strong> {order.description}</p>}
      </div>

      <div className="cart-items">
        <h3>Cart Items</h3>
        {(order.cart || []).map((item, index) => (
          <div key={index} className="order-item">
            <MediaAsset src={item.header_image} alt={item.name} />
            <div>
              <h4>{item.name} x {item.quantity}</h4>
              <p>Ksh {item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="payment-info">
        <h3>Payment Information</h3>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Total Amount:</strong> Ksh {order.totalAmount}</p>
        {order.paymentMethod === 'Mpesa' && (
          <p><strong>M-Pesa Transaction Code:</strong> {order.mpesaTransactionCode}</p>
        )}
      </div>
    </div>
  );
}

const Orders = () => {
  const location = useLocation();
  const [authUser, loadingAuth] = useAuthState(auth);
  const user = isCustomerUser(authUser) ? authUser : null;
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');
  const justPlaced = location.state?.justPlaced;

  useEffect(() => {
    if (loadingAuth) return;
    if (!user || !rtdb) {
      setLoadingOrders(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const snapshot = await get(ref(rtdb, 'orders'));
        if (cancelled) return;
        const all = snapshot.exists() ? Object.values(snapshot.val()) : [];
        const mine = all
          .filter((o) => o.uid === user.uid)
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setOrders(mine);
      } catch (err) {
        console.error('Error loading order history:', err);
        if (!cancelled) {
          setError("Couldn't load your order history right now.");
        }
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, loadingAuth]);

  if (loadingAuth || loadingOrders) {
    return (
      <div className="orders-container">
        <p>Loading your orders…</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>

      {justPlaced && (
        <div className="order-confirmation-banner">Thank you — your order was placed!</div>
      )}
      {justPlaced && <OrderCard order={justPlaced} />}

      {!user ? (
        <div className="orders-signin-prompt">
          <p>Sign in to see your past orders.</p>
          <Link to="/signin" state={{ from: '/orders' }} className="go-home-btn">
            Sign in
          </Link>
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : orders.length === 0 && !justPlaced ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order, i) => <OrderCard key={i} order={order} />)
      )}
    </div>
  );
};

export default Orders;
