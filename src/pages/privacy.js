import React from 'react';
import './privacy.css';

const Privacy = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: {new Date().getFullYear()}</p>
        
        <section className="privacy-section">
          <h2>1. Introduction</h2>
          <p>Linkosi Clothing ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
        </section>

        <section className="privacy-section">
          <h2>2. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Register for an account</li>
            <li>Place an order</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us</li>
            <li>Use certain features of our website</li>
          </ul>
          <p>This information may include your name, email address, phone number, shipping address, and payment information.</p>
        </section>

        <section className="privacy-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>4. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
          <ul>
            <li>Service providers who assist us in operating our website and conducting our business</li>
            <li>Payment processors to complete transactions</li>
            <li>Shipping companies to deliver your orders</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>5. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <section className="privacy-section">
          <h2>6. Cookies</h2>
          <p>We use cookies to enhance your experience on our website. For more information, please see our <a href="/cookies">Cookie Policy</a>.</p>
        </section>

        <section className="privacy-section">
          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>8. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please <a href="/getintouch">contact us</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
