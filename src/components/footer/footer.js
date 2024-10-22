import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link for internal navigation
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <div className="footer-column">
            <h3>Client Service</h3>
            <ul>
              <li>
                <Link to="/getintouch">Contact Us</Link>
              </li>
              <li>
                <Link to="/faqs">Help / FAQs</Link>
              </li>
              <li>
                <Link to="/returns">Returns & Refunds</Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>About Us</h3>
            <ul>
              <li>
                <Link to="/company">Company Profile</Link>
              </li>
              <li>
                <Link to="/careers">Careers</Link>
              </li>
              <li>
                <Link to="/sitemap">Sitemap</Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li>
                <Link to="/terms">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/cookies">Cookie Policy</Link>
              </li>
            </ul>
          </div>

          {/* Social media links */}
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

        {/* Logo Text */}
        <h2 className="logo-text">
          <span>LINKOSI</span> CLOTHING
        </h2>

        {/* Footer bottom text */}
        <div className="footer-bottom">
          <p>© 2024 Linkosi Clothing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
