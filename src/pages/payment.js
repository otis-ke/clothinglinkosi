import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './payment.css';
import { FaCreditCard, FaMobileAlt } from 'react-icons/fa';

const Payment = () => {
  const location = useLocation();
  const cart = location.state?.cart || JSON.parse(localStorage.getItem('cart'));

  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    county: '',
    country: '',
    phone: '',
    description: '',
    mpesaPhone: ''
  });

  const paypalRef = useRef();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handlePayment = () => {
    if (!formData.name || !formData.address || !formData.county || !formData.country || !formData.phone) {
      alert('Please fill in all the required fields.');
      return;
    }

    if (paymentMethod === 'Mpesa' && !formData.mpesaPhone) {
      alert('Please enter your phone number for Mpesa.');
      return;
    }

    if (paymentMethod === 'Mpesa') {
      // Implement Mpesa payment logic here using the Daraja API
      alert(`Sending STK push to phone number: ${formData.mpesaPhone}`);
    }
  };

  useEffect(() => {
    if (paymentMethod === 'Card') {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: calculateTotal().toFixed(2),
              },
            }],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(details => {
            alert('Transaction completed by ' + details.payer.name.given_name);
            // Handle successful payment
          });
        },
        onError: (err) => {
          alert('An error occurred during the payment process.');
        }
      }).render(paypalRef.current);
    }
  }, [paymentMethod, calculateTotal]);

  return (
    <div className="payment-container">
      <h2>Checkout and Payment</h2>

      <div className="billing-info">
        <h3>Billing Information</h3>
        <label>Name:
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </label>
        <label>Address:
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
        </label>
        <label>County:
          <input type="text" name="county" value={formData.county} onChange={handleInputChange} required />
        </label>
        <label>Country:
          <input type="text" name="country" value={formData.country} onChange={handleInputChange} required />
        </label>
        <label>Phone Number:
          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
        </label>
        <label>Additional Description:
          <textarea name="description" value={formData.description} onChange={handleInputChange} />
        </label>
      </div>

      <div className="cart-items">
        <h3>Your Cart</h3>
        {cart.map((item, index) => (
          <div key={index} className="payment-item">
            <img src={item.header_image} alt={item.name} />
            <h4>{item.name} x {item.quantity}</h4>
            <p>Ksh {item.price * item.quantity}</p>
          </div>
        ))}
        <h3>Total: Ksh {calculateTotal()}</h3>
      </div>

      <div className="payment-methods">
        <h3>Choose Payment Method</h3>
        <label className={`payment-option ${paymentMethod === 'Card' ? 'selected' : ''}`}>
          <input type="radio" value="Card" name="paymentMethod" onChange={(e) => setPaymentMethod(e.target.value)} />
          <FaCreditCard size={30} /> Pay with Card
        </label>
        {paymentMethod === 'Card' && (
          <div ref={paypalRef} className="paypal-button-container"></div>
        )}

        <label className={`payment-option ${paymentMethod === 'Mpesa' ? 'selected' : ''}`}>
          <input type="radio" value="Mpesa" name="paymentMethod" onChange={(e) => setPaymentMethod(e.target.value)} />
          <FaMobileAlt size={30} /> Pay with Mpesa
        </label>
        {paymentMethod === 'Mpesa' && (
          <div className="payment-details">
            <label>Phone Number:
              <input type="tel" name="mpesaPhone" value={formData.mpesaPhone} onChange={handleInputChange} required />
            </label>
          </div>
        )}
      </div>

      <button onClick={handlePayment} className="pay-btn">Confirm Payment</button>
    </div>
  );
};

export default Payment;
