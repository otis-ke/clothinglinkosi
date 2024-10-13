import React, { useEffect, useRef, useState } from 'react';
import './about.css'; // Importing the updated CSS file

const AboutUs = () => {
  const [inView, setInView] = useState(false);
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

  const splitTextIntoLetters = (text) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="letter"
        style={{ animationDelay: `${index * 0.03}s` }} // Staggered animation delay
      >
        {char}
      </span>
    ));
  };

  return (
    <div className={`about-us-container ${inView ? 'animate' : ''}`} ref={textRef}>
      <h1>{splitTextIntoLetters('ABOUT US')}</h1>
      <p>
        {splitTextIntoLetters(
          `Founded in the vibrant city of Nairobi, Kenya, in 2019, Linkosiclothing has swiftly risen 
          to become one of the leading glamorous brands in the fashion industry. The designs are a captivating 
          blend of modern trends and timeless elegance, catering to the discerning individual who seeks to 
          make a statement.`
        )}
      </p>
      <p>
        {splitTextIntoLetters(
          `Linkosiclothing's commitment to quality is evident in every piece, meticulously 
          crafted with premium fabrics and impeccable attention to detail. From stunning dresses to chic separates, 
          their collection empowers women to embrace their inner confidence and radiate style.`
        )}
      </p>
      <p>
        {splitTextIntoLetters(
          `Linkosiclothing's dedication to empowering women extends 
          beyond fashion, as they actively support local artisans and promote sustainable practices. With a global 
          reach and a loyal following, Linkosiclothing continues to redefine elegance and inspire women around the world.`
        )}
      </p>
    </div>
  );
};

export default AboutUs;
