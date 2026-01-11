import React from 'react';
import './returns.css';

const Returns = () => {
  return (
    <div className="returns-container">
      <div className="returns-content">
        <h1>Returns & Refunds Policy</h1>
        
        <section className="returns-section">
          <h2>Return Policy</h2>
          <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, you may return items within 14 days of delivery.</p>
          
          <h3>Eligible Items</h3>
          <ul>
            <li>Items must be unworn, unwashed, and in original condition</li>
            <li>Items must have all original tags attached</li>
            <li>Items must be in original packaging if applicable</li>
          </ul>

          <h3>Non-Returnable Items</h3>
          <ul>
            <li>Items that have been worn or washed</li>
            <li>Items without original tags</li>
            <li>Custom or personalized items</li>
            <li>Items purchased during special sales (unless otherwise specified)</li>
          </ul>
        </section>

        <section className="returns-section">
          <h2>How to Return</h2>
          <ol>
            <li>Contact us at <a href="mailto:Linkosiclothing@gmail.com">Linkosiclothing@gmail.com</a> to initiate a return</li>
            <li>Include your order number and reason for return</li>
            <li>We will provide you with return instructions and a return authorization</li>
            <li>Package the items securely and ship them back to us</li>
            <li>Once we receive and inspect your return, we will process your refund</li>
          </ol>
        </section>

        <section className="returns-section">
          <h2>Refunds</h2>
          <p>Refunds will be processed to the original payment method within 5-10 business days after we receive your return. Shipping costs are non-refundable unless the item was defective or we made an error.</p>
        </section>

        <section className="returns-section">
          <h2>Exchanges</h2>
          <p>We currently do not offer direct exchanges. To exchange an item, please return the original item for a refund and place a new order for the desired item.</p>
        </section>

        <section className="returns-section">
          <h2>Contact Us</h2>
          <p>For any questions about returns or refunds, please <a href="/getintouch">contact us</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default Returns;
