import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import './checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Calculate total price when cart changes
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cart]);

  const handleQuantityChange = (index, amount) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += amount;
    
    // Automatically remove item if quantity becomes 1 and user clicks minus
    if (updatedCart[index].quantity <= 1 && amount === -1) {
      handleRemoveItem(index);
    } else {
      if (updatedCart[index].quantity <= 0) updatedCart[index].quantity = 1;
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart)); // Sync with localStorage
    }
  };

  const handleRemoveItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Sync with localStorage
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate('/payment', { state: { cart, totalPrice } });
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([])); // Clear cart in localStorage
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {cart.length > 0 ? (
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.header_image} alt={item.name} className="cart-image" />
              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>Price: Ksh {item.price}</p>
                <div className="quantity-control">
                  <button onClick={() => handleQuantityChange(index, -1)} className="qty-btn">
                    <FiMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(index, 1)} className="qty-btn">
                    <FiPlus />
                  </button>
                </div>
                <button onClick={() => handleRemoveItem(index)} className="remove-btn">
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
          <button onClick={handleClearCart} className="clear-btn">
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
