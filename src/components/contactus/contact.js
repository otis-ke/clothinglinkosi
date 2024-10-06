import React, { useState, useEffect } from "react";
import { FiMinusCircle, FiMail, FiArrowRightCircle } from "react-icons/fi"; // Import icons
import emailjs from 'emailjs-com'; // Import EmailJS
import './contact.css';

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);

  const openContactForm = () => setIsOpen(true);
  const closeContactForm = () => setIsOpen(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => {
    setIsFormOpen(false);
    setFormSubmitted(false); // Reset form submission state
    setFormData({ name: '', email: '', message: '' }); // Reset form data
  };

  // Blur the body when the popup is open
  useEffect(() => {
    if (isOpen || isFormOpen) {
      document.body.classList.add('blurred');  // Add blur class to body
    } else {
      document.body.classList.remove('blurred'); // Remove blur class from body
    }
  }, [isOpen, isFormOpen]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before sending
    if (!formData.name || !formData.email || !formData.message) {
      setFormError(true);
      return;
    }

    setFormError(false);

    // EmailJS service, template, and public key
    const serviceID = "service_nrp825u";
    const templateID = "template_snlxzaf";
    const publicKey = "boD8gEEKKfJEZzoE0";

    emailjs.send(serviceID, templateID, {
      from_name: formData.name,
      message: formData.message,
      to_name: "EmailJS Team", // Customize recipient
      from_email: formData.email
    }, publicKey)
      .then(() => {
        setFormSubmitted(true);
        alert("Message sent successfully!"); // Show alert
        closeForm(); // Close form and reset data
      })
      .catch((error) => {
        console.error("Email send error:", error);
        setFormError(true);
      });
  };

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
            <br />
            <div>
              <p>
                <strong>CALL US</strong> <a href="tel:+254745826811">+254.745.826.811</a>
              </p>
              <p>Monday - Saturday from 9 AM to 11 PM (EAT).</p>
              <p>Sunday from 10 AM to 9 PM (EAT).</p>
            </div>
            <br />
            <div>
              <p>
                <strong>WHATSAPP US</strong>{" "}
                <a href="https://wa.me/254745826811" target="_blank" rel="noopener noreferrer">
                  +254.745.826.811
                </a>
              </p>
              <button className="whatsapp-btn">
                <a href="https://wa.me/254745826811" target="_blank" rel="noopener noreferrer">
                  Message Us <FiArrowRightCircle className="icon-link" />
                </a>
              </button>
              <p>Monday - Saturday from 9 AM to 11 PM (EAT).</p>
              <p>Sunday from 10 AM to 9 PM (EAT).</p>
            </div>
            <br />
            <div>
              <p>
                <strong>EMAIL US</strong>{" "}
                <a href="mailto:linkosiclothing@gmail.com">linkosiclothing@gmail.com</a>
              </p>
              <p>We typically reply within a few hours.</p>
            </div>
          </div>

          <br />
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
            {formSubmitted && <p className="success-message">Message sent successfully!</p>}
            {formError && <p className="error-message">Error sending message. Please try again.</p>}
            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                required
              ></textarea>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
