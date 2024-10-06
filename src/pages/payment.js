import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMobileAlt } from 'react-icons/fa';
import { getDatabase, ref, push } from "firebase/database";
import './payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || JSON.parse(localStorage.getItem('cart'));

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

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const saveOrderToDatabase = async (orderDetails) => {
    const db = getDatabase();
    try {
      await push(ref(db, 'orders'), orderDetails);
      alert('Order submitted successfully!');
      localStorage.setItem('order', JSON.stringify(orderDetails));  // Store order locally for viewing
      localStorage.removeItem('cart');  // Clear cart after order submission
      navigate('/orders');
    } catch (error) {
      console.error("Error saving order to database: ", error);
      alert('An error occurred while submitting your order. Please try again.');
    }
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
      alert(`Please complete the payment using the following steps:\n
        1. Select M-PESA\n
        2. Send Money\n
        3. Enter Phone No. 0702066492\n
        4. Enter Amount: Ksh ${calculateTotal()}\n
        5. Enter M-PESA PIN\n
        6. Confirm the transaction\n\n
        After receiving the confirmation message, copy the message with the transaction code and submit it in the form below.
      `);
    }
  };

  const handleMpesaSubmit = () => {
    if (!formData.mpesaTransactionCode || !formData.mpesaTransactionAmount) {
      alert('Please enter the transaction code and amount.');
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
            const orderDetails = {
              ...formData,
              cart,
              paymentMethod: 'Card',
              totalAmount: calculateTotal(),
            };
            saveOrderToDatabase(orderDetails);
          });
        },
        onError: (err) => {
          alert('An error occurred during the payment process.');
        }
      }).render(paypalRef.current);
    }
  }, [paymentMethod, cart, formData, navigate]);

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
            <button onClick={handlePayment} className="pay-btn">Proceed with Mpesa Payment</button>
            <label>Transaction Code:
              <input type="text" name="mpesaTransactionCode" value={formData.mpesaTransactionCode} onChange={handleInputChange} required />
            </label>
            <label>Amount Paid:
              <input type="text" name="mpesaTransactionAmount" value={formData.mpesaTransactionAmount} onChange={handleInputChange} required />
            </label>
            <button onClick={handleMpesaSubmit} className="pay-btn">Submit Mpesa Details</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
