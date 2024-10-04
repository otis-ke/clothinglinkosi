import React, { useState, useRef, useEffect } from 'react';
import './newin.css';

// Import your images
import newInProduct1 from '../images/new1.jpg';
import newInProduct2 from '../images/new2.jpg';
import newInProduct3 from '../images/new3.jpg'; // Add more images as needed
import newInProduct4 from '../images/new4.jpg';
import newInProduct5 from '../images/new5.jpg';
import newInProduct6 from '../images/new6.jpg';
import newInProduct7 from '../images/new7.jpg';
const NewInSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const images = [newInProduct1, newInProduct2, newInProduct3, newInProduct4, newInProduct5, newInProduct6, newInProduct7];

  // Move left (previous)
  const moveLeft = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  // Move right (next)
  const moveRight = () => {
    setCurrentIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  };

  // Slide logic
  useEffect(() => {
    const slider = sliderRef.current;
    const totalWidth = slider?.children[0]?.clientWidth * currentIndex;
    if (slider) slider.style.transform = `translateX(-${totalWidth}px)`;
  }, [currentIndex]);

  // Reveal animation on scroll
  useEffect(() => {
    const section = document.querySelector('.new-in-section');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('reveal');
        }
      },
      { threshold: 0.1 }
    );
    if (section) {
      observer.observe(section);
    }
  }, []);

  // Auto-slide after 4 seconds
  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
    }, 4000); // Adjust the interval to 4 seconds (4000 milliseconds)

    // Clear the interval when component is unmounted
    return () => clearInterval(autoSlide);
  }, [images.length]);

  return (
    <section className="new-in-section lora-regular">
      <h2 className="new-in-heading">New In</h2>
      <div className="slider-container">
        <div ref={sliderRef} className="slider">
          {images.map((img, index) => (
            <div key={index} className="slider-item">
              <img src={img} alt={`New In Product ${index + 1}`} />
              <div className={`slider-overlay ${currentIndex === index ? 'visible' : ''}`}>
                <button className="shop-now-btn">Explore Collection</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination and Arrows container below the slider */}
      <div className="pagination-arrows-container">
        {/* Left Arrow */}
        <div className="slider-arrow slider-arrow-left" onClick={moveLeft}>
          &#10094;
        </div>

        {/* Pagination Dots */}
        <div className="pagination">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>

        {/* Right Arrow */}
        <div className="slider-arrow slider-arrow-right" onClick={moveRight}>
          &#10095;
        </div>
      </div>
    </section>
  );
};

export default NewInSlider;
