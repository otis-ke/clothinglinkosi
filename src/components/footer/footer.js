import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Links */}
        <div className="footer-links">
          <div className="footer-column">
            <h3>Client Service</h3>
            <ul>
              <li><Link to="/getintouch">Contact Us</Link></li>
              <li><Link to="/faqs">Help / FAQs</Link></li>
              <li><Link to="/returns">Returns & Refunds</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>About Us</h3>
            <ul>
              <li><Link to="/company">Company Profile</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Social media */}
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

        {/* PAYMENT SECTION */}
        <div className="footer-payment">
          <p className="payment-title">Secure Payments via</p>

          <div className="mpesa-box">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg"
              alt="M-PESA"
            />
            <div className="mpesa-details">
              <span>PayBill</span>
              <strong>522533</strong>
              <span>Account</span>
              <strong>7997927</strong>
            </div>
          </div>
        </div>

        {/* Logo */}
        <h2 className="logo-text">
          <span>LINKOSI</span> CLOTHING
        </h2>

        {/* Footer bottom */}
        <div className="footer-bottom">
          <p>© Linkosi Clothing founded in 2019. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
