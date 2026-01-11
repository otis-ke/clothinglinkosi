import React from 'react';
import './faqs.css';

const FAQs = () => {
  return (
    <div className="faqs-container">
      <div className="faqs-content">
        <h1>Frequently Asked Questions</h1>
        
        <section className="faq-section">
          <h2>Orders & Shipping</h2>
          <div className="faq-item">
            <h3>How long does shipping take?</h3>
            <p>Shipping typically takes 5-7 business days within Kenya. International shipping may take 10-14 business days.</p>
          </div>
          <div className="faq-item">
            <h3>Do you ship internationally?</h3>
            <p>Yes, we ship to select international destinations. Please contact us for more information about shipping to your location.</p>
          </div>
          <div className="faq-item">
            <h3>How can I track my order?</h3>
            <p>You will receive a tracking number via email once your order has been shipped. You can use this number to track your package.</p>
          </div>
        </section>

        <section className="faq-section">
          <h2>Products & Sizing</h2>
          <div className="faq-item">
            <h3>How do I know what size to order?</h3>
            <p>We provide detailed size charts for each product. Please refer to the size guide available on each product page.</p>
          </div>
          <div className="faq-item">
            <h3>Can I exchange or return an item?</h3>
            <p>Yes, please see our Returns & Refunds policy for detailed information on returns and exchanges.</p>
          </div>
        </section>

        <section className="faq-section">
          <h2>Payment & Checkout</h2>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept various payment methods including mobile money, credit/debit cards, and bank transfers.</p>
          </div>
          <div className="faq-item">
            <h3>Is my payment information secure?</h3>
            <p>Yes, we use secure payment processing to ensure your information is protected.</p>
          </div>
        </section>

        <section className="faq-section">
          <h2>Contact Us</h2>
          <p>Still have questions? Please <a href="/getintouch">contact us</a> and we'll be happy to help!</p>
        </section>
      </div>
    </div>
  );
};

export default FAQs;
