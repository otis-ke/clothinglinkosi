import React, { useState, useEffect } from "react";
import { FiMinusCircle, FiMail, FiArrowRightCircle } from "react-icons/fi"; // Import icons
import './contact.css';

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openContactForm = () => setIsOpen(true);
  const closeContactForm = () => setIsOpen(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  // Blur the body when the popup is open
  useEffect(() => {
    if (isOpen || isFormOpen) {
      document.body.classList.add('blurred');  // Add blur class to body
    } else {
      document.body.classList.remove('blurred'); // Remove blur class from body
    }
  }, [isOpen, isFormOpen]);

  return (
    <>
      {/* Main Section */}
      <div className="contact-section lora-font">
        <button className="contact-btn" onClick={openContactForm}>
          Get In Touch <FiArrowRightCircle className="icon-link" />
        </button>
      </div>

      {/* Contact Popup */}
      <div className={`contact-popup ${isOpen ? "open" : ""}`}>
        <div className="contact-popup-content">
          {/* Close button */}
          <span className="close-btn" onClick={closeContactForm}>
            <FiMinusCircle className="close-icon" />
          </span>
          <h3 className="contact-heading">Contact Us</h3>
          <div className="contact-methods">
          <br></br>
            <div>
              <p>
                <strong>CALL US</strong> <a href="tel:+18774822430">+1.877.482.2430</a>
              </p>
              <p>Monday - Saturday from 9 AM to 11 PM (EST).</p>
              <p>Sunday from 10 AM to 9 PM (EST).</p>
            </div>
<br></br>

            <div>
              <p>
                <strong>WHATSAPP US</strong>{" "}
                <a
                  href="https://wa.me/18774822430"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +1.877.482.2430
                </a>
              </p>
              <button className="whatsapp-btn">
                <a
                  href="https://wa.me/18774822430"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Message Us <FiArrowRightCircle className="icon-link" />
                </a>
              </button>
            </div>
     <br></br>
            <div>
              <p>
                <strong>EMAIL US</strong>{" "}
                <a href="mailto:support@example.com">support@example.com</a>
              </p>
            </div>
          </div>

          <br></br>
          <button className="form-btn" onClick={openForm}>
            Contact Form <FiMail className="icon-link" />
          </button>
        </div>
      </div>

      {/* Contact Form Popup */}
      {isFormOpen && (
        <div className="form-popup">
          <div className="form-popup-content">
            <span className="close-btn" onClick={closeForm}>
              <FiMinusCircle className="close-icon" />
            </span>
            <h2 className="contact-heading">Send Us a Message</h2>
            <form>
              <label>Name</label>
              <input type="text" placeholder="Enter your name" required />
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />
              <label>Message</label>
              <textarea placeholder="Your message" required></textarea>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
