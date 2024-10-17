import React, { useEffect, useRef, useState } from 'react';
import './about.css'; // Import the updated CSS file

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

  const splitTextIntoWords = (text) => {
    return text.split(' ').map((word, index) => (
      <span
        key={index}
        className="bodoni-word"
        style={{ animationDelay: `${index * 0.1}s` }} // Staggered animation delay for each word
      >
        {word}{' '}
      </span>
    ));
  };

  return (
    <div className="about-us-wrapper">
      <div className={`about-us-container ${inView ? 'bodoni-animate' : ''}`} ref={textRef}>
        <h1 className="bodoni-heading">{splitTextIntoWords('ABOUT US')}</h1>
        <p className="bodoni-paragraph">
          {splitTextIntoWords(
            `Founded in the vibrant city of Nairobi, Kenya, in 2019, Linkosi Clothing has swiftly risen to become one of the leading glamorous brands in the fashion industry. The designs are a captivating blend of modern trends and timeless elegance, catering to the discerning individual who seeks to make a statement.`
          )}
        </p>
        <p className="bodoni-paragraph">
          {splitTextIntoWords(
            `Linkosi Clothing's commitment to quality is evident in every piece, meticulously crafted with premium fabrics and impeccable attention to detail. From stunning dresses to chic separates, their collection empowers women to embrace their inner confidence and radiate style.`
          )}
        </p>
        <p className="bodoni-paragraph">
          {splitTextIntoWords(
            `Linkosi Clothing's dedication to empowering women extends beyond fashion, as they actively support local artisans and promote sustainable practices. With a global reach and a loyal following, Linkosi Clothing continues to redefine elegance and inspire women around the world.`
          )}
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
