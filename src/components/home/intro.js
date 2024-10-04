import React, { useEffect, useRef } from 'react';
import './intro.css'
import backgroundImage from '../images/linkosiclothing-20240904-0002.jpg'; // Path to your background image

const IntroSection = () => {
  const introRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          } else {
            entry.target.classList.remove('reveal');
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const elements = introRef.current.querySelectorAll('.headings h1, .headings h4');
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  return (
    <div className="intro-section" ref={introRef}>
      <img src={backgroundImage} alt="Linkosi Clothing Background" />
      <div className="content">
        <div className="headings">
          <h1 className="protest-guerrilla-regular">LINKOSI CLOTHING</h1>
          <h4 className="merriweather-regular">Let your style shine</h4>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
