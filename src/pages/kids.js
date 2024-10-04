
import React, { useEffect, useRef } from 'react';
import './pagesstles/kids.css';

// Import your images
import kidsProduct1 from '../components/images/child 2.jpg';
import kidsProduct2 from '../components/images/child 2.jpg';

const Kids = () => {
  const collectionRefs = useRef([]);

  useEffect(() => {
    const observers = collectionRefs.current.map((collection, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            collection.classList.add('animate');
          } else {
            // Reset animation when out of view to trigger again when scrolled back
            collection.classList.remove('animate');
          }
        },
        { threshold: 0.2 }
      );

      if (collection) {
        observer.observe(collection);
      }

      return observer;
    });

    return () => {
      // Cleanup observers
      observers.forEach((observer, index) => {
        if (collectionRefs.current[index]) {
          observer.unobserve(collectionRefs.current[index]);
        }
      });
    };
  }, []);

  return (
    <section id="shop" className="shop-section">
      <h2>Our Kids Collection</h2>
      <div className="collections-container">
        {/* Kids' Collection */}
        <div
          className="collection-section"
          ref={(el) => (collectionRefs.current[0] = el)}
          data-direction="right" // Right to left animation
        >
          <h3>Kids Collection</h3>
          <div className="product-gallery">
            <div className="product-item">
              <img src={kidsProduct1} alt="Kids' Product 1" />
            </div>
            <div className="product-item">
              <img src={kidsProduct2} alt="Kids' Product 2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Kids;
