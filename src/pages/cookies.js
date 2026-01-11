import React from 'react';
import './cookies.css';

const Cookies = () => {
  return (
    <div className="cookies-container">
      <div className="cookies-content">
        <h1>Cookie Policy</h1>
        <p className="last-updated">Last updated: {new Date().getFullYear()}</p>
        
        <section className="cookies-section">
          <h2>1. What Are Cookies?</h2>
          <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.</p>
        </section>

        <section className="cookies-section">
          <h2>2. How We Use Cookies</h2>
          <p>Linkosi Clothing uses cookies to:</p>
          <ul>
            <li>Remember your preferences and settings</li>
            <li>Keep you logged in to your account</li>
            <li>Remember items in your shopping cart</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Improve website functionality and user experience</li>
          </ul>
        </section>

        <section className="cookies-section">
          <h2>3. Types of Cookies We Use</h2>
          
          <h3>Essential Cookies</h3>
          <p>These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.</p>

          <h3>Performance Cookies</h3>
          <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>

          <h3>Functionality Cookies</h3>
          <p>These cookies allow the website to remember choices you make and provide enhanced, personalized features.</p>

          <h3>Targeting/Advertising Cookies</h3>
          <p>These cookies may be set through our site by advertising partners to build a profile of your interests and show you relevant advertisements.</p>
        </section>

        <section className="cookies-section">
          <h2>4. Third-Party Cookies</h2>
          <p>Some cookies are placed by third-party services that appear on our pages. These may include:</p>
          <ul>
            <li>Analytics services (e.g., Google Analytics)</li>
            <li>Social media platforms</li>
            <li>Payment processors</li>
          </ul>
        </section>

        <section className="cookies-section">
          <h2>5. Managing Cookies</h2>
          <p>You can control and manage cookies in various ways:</p>
          <ul>
            <li>Browser settings: Most browsers allow you to refuse or accept cookies</li>
            <li>Browser plugins: Various plugins can help you manage cookies</li>
            <li>Opt-out tools: You can use opt-out tools provided by advertising networks</li>
          </ul>
          <p><strong>Note:</strong> Disabling cookies may limit your ability to use certain features of our website.</p>
        </section>

        <section className="cookies-section">
          <h2>6. Changes to This Policy</h2>
          <p>We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
        </section>

        <section className="cookies-section">
          <h2>7. Contact Us</h2>
          <p>If you have questions about our use of cookies, please <a href="/getintouch">contact us</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default Cookies;
