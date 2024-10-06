import React, { useState } from 'react';
import { FiMail } from "react-icons/fi"; // Mail icon for the button
import emailjs from 'emailjs-com'; // Import EmailJS
import './getintouch.css'; // Updated the stylesheet filename

const GetInTouch = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);

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
        setFormData({ name: '', email: '', message: '' });
      })
      .catch((error) => {
        console.error("Email send error:", error);
        setFormError(true);
      });
  };

  return (
    <div className="get-in-touch-page lora-font">
      {/* Contact Information */}
      <div className="get-in-touch-info">
        <h2 className="get-in-touch-heading">Get In Touch</h2>
        <div className="contact-methods">
          <div>
            <p>
              <strong>CALL US:</strong>{" "}
              <a href="tel:+254745826811">+254.745.826.811</a>
            </p>
            <p>Monday - Saturday from 9 AM to 11 PM (EAT).</p>
            <p>Sunday from 10 AM to 9 PM (EAT).</p>
          </div>
          <div>
            <p>
              <strong>WHATSAPP US:</strong>{" "}
              <a href="https://wa.me/254745826811" target="_blank" rel="noopener noreferrer">
                +254.745.826.811
              </a>
            </p>
            <p>Monday - Saturday from 9 AM to 11 PM (EAT).</p>
            <p>Sunday from 10 AM to 9 PM (EAT).</p>
          </div>
          <div>
            <p>
              <strong>EMAIL US:</strong>{" "}
              <a href="mailto:linkosiclothing@gmail.com">linkosiclothing@gmail.com</a>
            </p>
            <p>We typically reply within a few hours.</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="form-section">
        <h2 className="get-in-touch-heading">Send Us a Message</h2>
        {formSubmitted && <p className="success-message">Message sent successfully!</p>}
        {formError && <p className="error-message">Error sending message. Please try again.</p>}
        <form onSubmit={handleSubmit} className="contact-form">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message"
            required
          ></textarea>
          <button type="submit">
            Send <FiMail className="icon-link" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default GetInTouch;
