import React, { useEffect, useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import './profile.css'; // Import the updated CSS file

const LinkosiProfile = () => {
  const [inView, setInView] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const currentTextRef = textRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    if (currentTextRef) {
      observer.observe(currentTextRef);
    }

    return () => {
      if (currentTextRef) {
        observer.unobserve(currentTextRef);
      }
    };
  }, []);

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

    if (!formData.name || !formData.email || !formData.message) {
      setFormError(true);
      return;
    }

    setFormError(false);

    const serviceID = "service_nrp825u";
    const templateID = "template_snlxzaf";
    const publicKey = "boD8gEEKKfJEZzoE0";

    emailjs.send(serviceID, templateID, {
      from_name: formData.name,
      message: formData.message,
      to_name: "Linkosi Team",
      from_email: formData.email
    }, publicKey)
      .then(() => {
        setFormSubmitted(true);
        alert("Message sent successfully!");
        setFormData({ name: '', email: '', message: '' });
      })
      .catch((error) => {
        console.error("Email send error:", error);
        setFormError(true);
      });
  };

  return (
    <div className="profile-wrapper">
      <div className={`profile-container ${inView ? 'profile-animate' : ''}`} ref={textRef}>
        <h1 className="profile-heading">LINKOSICLOTHING COMPANY PROFILE</h1>
        <p className="profile-paragraph">
          Linkosiclothing is a leading provider of high-quality, stylish clothing for men and women. 
          Our goal is to help customers showcase their unique identity through fashion, offering a 
          versatile collection that adapts to every occasion. Whether it’s a casual day out, or a formal 
          event, we strive to provide fashion-forward options that cater to all tastes and preferences.
        </p>
        <p className="profile-paragraph">
          Founded on the principles of inclusivity and style, Linkosiclothing is committed to bringing 
          high-quality, affordable clothing to individuals across the globe. Each piece is thoughtfully 
          designed and carefully crafted using the best materials to ensure comfort and durability. Our 
          collections speak to those who value both trend and timelessness in their wardrobe.
        </p>

        <h2 className="collab-heading">Wanna Collaborate?</h2>
        <p className="profile-paragraph">
          At Linkosiclothing, we believe in the power of collaboration. We actively partner with dancers, 
          actors, and brand influencers who share our passion for creativity and innovation. Whether you're 
          a content creator, social media influencer, or performing artist, we are always looking for talented 
          individuals to join our growing family. Our collaborations help extend the reach of our brand, while 
          showcasing the diverse talents of our partners. If you're interested in being part of the Linkosi journey, 
          let’s connect! Together, we can inspire a new generation of style.
        </p>

        <div className="form-wrapper">
        <h2 className="contact-heading" style={{ color: 'white' }}>
       Send Us a Message
      </h2>

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
            <button type="submit" className="submit-button">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LinkosiProfile;
