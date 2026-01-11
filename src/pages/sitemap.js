import React from 'react';
import { Link } from 'react-router-dom';
import './sitemap.css';

const Sitemap = () => {
  return (
    <div className="sitemap-container">
      <div className="sitemap-content">
        <h1>Sitemap</h1>
        
        <section className="sitemap-section">
          <h2>Shop</h2>
          <ul>
            <li><Link to="/women">Women</Link></li>
            <li><Link to="/men">Men</Link></li>
            <li><Link to="/kids">Kids</Link></li>
            <li><Link to="/gifts">Gifts</Link></li>
            <li><Link to="/decor">Decor</Link></li>
          </ul>
        </section>

        <section className="sitemap-section">
          <h2>Content</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </section>

        <section className="sitemap-section">
          <h2>Company</h2>
          <ul>
            <li><Link to="/company">Company Profile</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/getintouch">Contact Us</Link></li>
          </ul>
        </section>

        <section className="sitemap-section">
          <h2>Customer Service</h2>
          <ul>
            <li><Link to="/faqs">Help / FAQs</Link></li>
            <li><Link to="/returns">Returns & Refunds</Link></li>
            <li><Link to="/getintouch">Contact Us</Link></li>
          </ul>
        </section>

        <section className="sitemap-section">
          <h2>Legal</h2>
          <ul>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/cookies">Cookie Policy</Link></li>
          </ul>
        </section>

        <section className="sitemap-section">
          <h2>Account</h2>
          <ul>
            <li><Link to="/signin">Sign In</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Sitemap;
