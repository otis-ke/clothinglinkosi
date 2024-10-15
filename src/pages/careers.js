import React from 'react';
import './careers.css'; // Import the CSS file
import image from '.././components/images/men.jpg'

const Careers = () => {
  const careers = [
    {
      title: 'Fashion & Design',
      description: 'Join our creative team to design the next big trends in fashion.',
    },
    {
      title: 'Clothing Construction',
      description: 'Help bring our designs to life with precision and craftsmanship.',
    },
    {
      title: 'Modeling',
      description: 'Be the face of Linkosi Clothing and showcase our latest collections.',
    },
    {
      title: 'Event Planning',
      description: 'Organize and manage our fashion events and brand showcases.',
    },
    {
      title: 'Customer Service',
      description: 'Provide top-notch support to our customers and ensure a seamless shopping experience.',
    },
  ];

  return (
    <div className="careers-container">
      <div className="careers-header">
        <img
         src={image} 
          alt="Careers at Linkosi Clothing"
          className="careers-image"
        />
        <h1 className="careers-title">Careers at Linkosi Clothing</h1>
        <p className="careers-subtitle">
          Join our fast-growing fashion company that makes fashion accessible and exciting for everyone.
        </p>
      </div>

      <div className="careers-why">
        <h2>Why Work at Linkosi Clothing?</h2>
        <ul>
          <li>Be a part of a dynamic and innovative company.</li>
          <li>Work with a talented and supportive team.</li>
          <li>Make a positive impact on the world.</li>
          <li>Enjoy competitive benefits and opportunities for growth.</li>
        </ul>
      </div>

      <div className="careers-positions">
        <h2>Current Openings</h2>
        <div className="careers-cards">
          {careers.map((career, index) => (
            <div key={index} className="career-card">
              <h3>{career.title}</h3>
              <p>{career.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="careers-apply">
        <h2>Apply Now</h2>
        <p>
          If you're interested in joining our team, please submit your resume and cover letter to{' '}
          <a href="mailto:Linkosiclothing@gmail.com">Linkosiclothing@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default Careers;
