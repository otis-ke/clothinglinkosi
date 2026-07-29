import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMobileAlt } from 'react-icons/fa';
import { ref, push, serverTimestamp } from "firebase/database";
import { useAuthState } from 'react-firebase-hooks/auth';
import { rtdb } from "../firebase/client";
import { auth, isCustomerUser } from '../firebase/authActions';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import MediaAsset from '../components/MediaAsset';
import './payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [authUser, loadingAuth] = useAuthState(auth);
  const user = isCustomerUser(authUser) ? authUser : null;
  const { cart, totalPrice, clearCart } = useCart();
  const showToast = useToast();
  const orderPlacedRef = useRef(false);

  // Guard direct navigation to /payment without an eligible cart/session.
  useEffect(() => {
    if (loadingAuth) return;
    if (!user) {
      navigate('/signin', { state: { from: '/checkout' } });
      return;
    }
    if (cart.length === 0 && !orderPlacedRef.current) {
      navigate('/checkout');
    }
  }, [loadingAuth, user, cart, navigate]);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    county: '',
    country: '',
    phone: '',
    description: '',
    mpesaPhone: '',
    mpesaTransactionCode: '',
    mpesaTransactionAmount: '',
  });

  const paypalRef = useRef();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = useCallback(() => totalPrice, [totalPrice]);

  const saveOrderToDatabase = useCallback(async (orderDetails) => {
    if (!rtdb) {
      showToast('Orders database is not configured. Set REACT_APP_FIREBASE_DATABASE_URL in .env.local.', 'error');
      return;
    }
    const fullOrder = {
      ...orderDetails,
      uid: user?.uid || null,
      userEmail: user?.email || null,
      userDisplayName: user?.displayName || null,
      createdAt: serverTimestamp(),
    };
    try {
      await push(ref(rtdb, 'orders'), fullOrder);
      showToast('Order submitted successfully!', 'success');
      orderPlacedRef.current = true;
      clearCart();
      navigate('/orders', { state: { justPlaced: fullOrder } });
    } catch (error) {
      console.error("Error saving order to database: ", error);
      showToast('An error occurred while submitting your order. Please try again.', 'error');
    }
  }, [navigate, user, clearCart, showToast]);

  const handlePayment = () => {
    if (!formData.name || !formData.address || !formData.county || !formData.country || !formData.phone) {
      showToast('Please fill in all the required fields.', 'error');
      return;
    }

    if (paymentMethod === 'Mpesa' && !formData.mpesaPhone) {
      showToast('Please enter your phone number for Mpesa.', 'error');
      return;
    }

    if (paymentMethod === 'Mpesa') {
      alert(`Complete the payment using the following steps:\n
        1. Select M-PESA\n
        2. Send Money\n
        3. Enter Phone No. 0702066492\n
        4. Enter Amount: Ksh ${calculateTotal()}\n
        5. Enter M-PESA PIN\n
        6. Confirm the transaction\n\n
        After confirmation, submit the transaction code below.
      `);
    }
  };

  const handleMpesaSubmit = () => {
    if (!formData.mpesaTransactionCode || !formData.mpesaTransactionAmount) {
      showToast('Please enter the transaction code and amount.', 'error');
      return;
    }
    const orderDetails = {
      ...formData,
      cart,
      paymentMethod: 'Mpesa',
      totalAmount: calculateTotal(),
    };
    saveOrderToDatabase(orderDetails);
  };

  useEffect(() => {
    if (paymentMethod === 'Card') {
      window.paypal.Buttons({
        createOrder: (data, actions) => actions.order.create({
          purchase_units: [{ amount: { value: calculateTotal().toFixed(2) } }],
        }),
        onApprove: (data, actions) =>
          actions.order.capture().then(details => {
            alert(`Transaction completed by ${details.payer.name.given_name}`);
            const orderDetails = {
              ...formData,
              cart,
              paymentMethod: 'Card',
              totalAmount: calculateTotal(),
            };
            saveOrderToDatabase(orderDetails);
          }),
        onError: () => alert('An error occurred during payment.'),
      }).render(paypalRef.current);
    }
  }, [paymentMethod, cart, formData, calculateTotal, saveOrderToDatabase]);

  return (
    <div className="payment-container">
      <h2 style={{ color: 'black' }}>Checkout and Payment</h2>

      <div className="billing-info" style={{ color: 'black' }}>
        <h3>Billing Information</h3>
        {['name', 'address', 'county', 'country', 'phone'].map(field => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
            <input
              type={field === 'phone' ? 'tel' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              required
              style={{ color: 'black' }}
            />
          </label>
        ))}
        <label>Additional Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            style={{ color: 'black' }}
          />
        </label>
      </div>

      <div className="cart-items" style={{ color: 'black' }}>
        <h3>Your Cart</h3>
        {cart.map((item, index) => (
          <div key={index} className="payment-item">
            <MediaAsset src={item.header_image} alt={item.name} />
            <h4>{item.name} x {item.quantity}</h4>
            <p>Ksh {item.price * item.quantity}</p>
          </div>
        ))}
        <h3>Total: Ksh {calculateTotal()}</h3>
      </div>

      <div className="payment-methods">
        <h3 style={{ color: 'black' }}>Choose Payment Method</h3>

        <label
          className={`payment-option ${paymentMethod === 'Card' ? 'selected' : ''}`}
          style={{ color: 'black' }}
        >
          <input
            type="radio"
            value="Card"
            name="paymentMethod"
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ color: 'black' }}
          />
          <FaCreditCard size={30} /> Pay with Card
        </label>

        {paymentMethod === 'Card' && (
          <div ref={paypalRef} className="paypal-button-container"></div>
        )}

        <label
          className={`payment-option ${paymentMethod === 'Mpesa' ? 'selected' : ''}`}
          style={{ color: 'black' }}
        >
          <input
            type="radio"
            value="Mpesa"
            name="paymentMethod"
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ color: 'black' }}
          />
          <FaMobileAlt size={30} /> Pay with Mpesa
        </label>

        {paymentMethod === 'Mpesa' && (
          <div className="payment-details" style={{ color: 'black' }}>
            <label>Phone Number:
              <input
                type="tel"
                name="mpesaPhone"
                value={formData.mpesaPhone}
                onChange={handleInputChange}
                required
                style={{ color: 'black' }}
              />
            </label>
            <button onClick={handlePayment} className="pay-btn" style={{ color: 'black' }}>
              Proceed with Mpesa Payment
            </button>
            <label>Transaction Code:
              <input
                type="text"
                name="mpesaTransactionCode"
                value={formData.mpesaTransactionCode}
                onChange={handleInputChange}
                required
                style={{ color: 'black' }}
              />
            </label>
            <label>Amount Paid:
              <input
                type="text"
                name="mpesaTransactionAmount"
                value={formData.mpesaTransactionAmount}
                onChange={handleInputChange}
                required
                style={{ color: 'black' }}
              />
            </label>
            <button onClick={handleMpesaSubmit} className="pay-btn" style={{ color: 'black' }}>
              Submit Mpesa Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
