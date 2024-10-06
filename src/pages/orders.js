import React from 'react';
import './orders.css';

const Orders = () => {
  const order = JSON.parse(localStorage.getItem('order'));

  if (!order) {
    return <div>No order found.</div>;
  }

  return (
    <div className="orders-container">
      <h2>Order Details</h2>
      <div className="order-info">
        <h3>Billing Information</h3>
        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Address:</strong> {order.address}</p>
        <p><strong>County:</strong> {order.county}</p>
        <p><strong>Country:</strong> {order.country}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p><strong>Description:</strong> {order.description}</p>
      </div>

      <div className="cart-items">
        <h3>Cart Items</h3>
        {order.cart.map((item, index) => (
          <div key={index} className="order-item">
            <img src={item.header_image} alt={item.name} />
            <h4>{item.name} x {item.quantity}</h4>
            <p>Ksh {item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="payment-info">
        <h3>Payment Information</h3>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Total Amount:</strong> Ksh {order.totalAmount}</p>
        {order.paymentMethod === 'Mpesa' && (
          <>
            <p><strong>M-Pesa Transaction Code:</strong> {order.mpesaTransactionCode}</p>
            <p><strong>Amount Paid:</strong> {order.mpesaTransactionAmount}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
