import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, isCustomerUser } from '../firebase/authActions';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './checkout.css';
import MediaAsset from '../components/MediaAsset';

const Checkout = () => {
  const navigate = useNavigate();
  const [authUser] = useAuthState(auth);
  const user = isCustomerUser(authUser) ? authUser : null;
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const showToast = useToast();

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }
    if (!user) {
      showToast('Please sign in to continue to payment.', 'info');
      navigate('/signin', { state: { from: '/checkout' } });
      return;
    }
    navigate('/payment');
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {cart.length > 0 ? (
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <MediaAsset src={item.header_image} alt={item.name} className="cart-image" />
              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>Price: Ksh {item.price}</p>
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(index, -1)} className="qty-btn">
                    <FiMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(index, 1)} className="qty-btn">
                    <FiPlus />
                  </button>
                </div>
                <button onClick={() => removeFromCart(index)} className="remove-btn">
                  <MdDelete /> Remove
                </button>
              </div>
            </div>
          ))}
          <div className="total-price">
            <h3>Total Price: Ksh {totalPrice.toFixed(2)}</h3>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button onClick={() => navigate('/')} className="go-home-btn">
            Go Back Home
          </button>
        </div>
      )}
      {cart.length > 0 && (
        <div className="checkout-actions">
          <button onClick={handleProceedToPayment} className="proceed-btn">
            Proceed to Payment
          </button>
          <button onClick={clearCart} className="clear-btn">
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
