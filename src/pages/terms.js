import React from 'react';
import './terms.css';

const Terms = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1>Terms & Conditions</h1>
        <p className="last-updated">Last updated: {new Date().getFullYear()}</p>
        
        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section className="terms-section">
          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily access the materials on Linkosi Clothing's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>3. Products and Pricing</h2>
          <p>We reserve the right to change prices and availability of products at any time without notice. All prices are in Kenyan Shillings (KSh) unless otherwise stated.</p>
        </section>

        <section className="terms-section">
          <h2>4. Orders and Payment</h2>
          <p>By placing an order, you are offering to purchase a product subject to these terms. All orders are subject to acceptance and availability. We reserve the right to refuse any order.</p>
        </section>

        <section className="terms-section">
          <h2>5. Returns and Refunds</h2>
          <p>Please refer to our <a href="/returns">Returns & Refunds Policy</a> for detailed information about returns and refunds.</p>
        </section>

        <section className="terms-section">
          <h2>6. Limitation of Liability</h2>
          <p>Linkosi Clothing shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
        </section>

        <section className="terms-section">
          <h2>7. Contact Information</h2>
          <p>For questions about these Terms & Conditions, please <a href="/getintouch">contact us</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
