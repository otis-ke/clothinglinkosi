import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <div className="footer-column">
            <h3>Client Service</h3>
            <ul>
              <li>Contact Us</li>
              <li>Help / FAQs</li>
              <li>Returns & Refunds</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>About Us</h3>
            <ul>
              <li>Company Profile</li>
              <li>Careers</li>
              <li>Sitemap</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
          <div className="footer-social">
            <a href="https://www.facebook.com/LINKOSICLOTHING?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/linkosiclothing?igsh=MWx5azg5bm9uanloZw==" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/company/l-c-modeling-company-academy/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://www.youtube.com/@lc_modeling_academy" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </div>
        <h2 className="logo-text">
          <span>LINKOSI</span> CLOTHING
        </h2>
        <div className="footer-bottom">
          <p>© 2024 Linkosi Clothing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
