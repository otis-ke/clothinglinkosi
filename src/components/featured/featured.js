import React, { useEffect, useRef } from 'react';
import './featured.css';

// Import your images
import mensProduct1 from '../images/pluto.jpg';
import mensProduct2 from '../images/manz.jpg';
import womensProduct1 from '../images/women.jpg';
import womensProduct2 from '../images/womenz.jpg';
import kidsProduct1 from '../images/child 1.jpg';
import kidsProduct2 from '../images/child 2.jpg';
import newInProduct1 from '../images/show.jpg';
import newInProduct2 from '../images/shallow.jpg';

const FeaturedCollection = () => {
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
      <h2>Our Featured Collection</h2>
      <div className="collections-container">
        {/* Men's Collection */}
        <div
          className="collection-section"
          ref={(el) => (collectionRefs.current[0] = el)}
          data-direction="right" // Right to left animation
        >
          <h3>Mens Collection</h3>
          <div className="product-gallery">
            <div className="product-item">
              <img src={mensProduct1} alt="Men's Product 1" />
            </div>
            <div className="product-item">
              <img src={mensProduct2} alt="Men's Product 2" />
            </div>
          </div>
        </div>

        {/* Women's Collection */}
        <div
          className="collection-section"
          ref={(el) => (collectionRefs.current[1] = el)}
          data-direction="left" // Left to right animation
        >
          <h3>Womens Collection</h3>
          <div className="product-gallery">
            <div className="product-item">
              <img src={womensProduct1} alt="Women's Product 1" />
            </div>
            <div className="product-item">
              <img src={womensProduct2} alt="Women's Product 2" />
            </div>
          </div>
        </div>

        {/* Kids' Collection */}
        <div
          className="collection-section"
          ref={(el) => (collectionRefs.current[2] = el)}
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

        {/* New In Collection */}
        <div
          className="collection-section"
          ref={(el) => (collectionRefs.current[3] = el)}
          data-direction="left" // Left to right animation
        >
          <h3>Fits</h3>
          <div className="product-gallery">
            <div className="product-item">
              <img src={newInProduct1} alt="New In Product 1" />
            </div>
            <div className="product-item">
              <img src={newInProduct2} alt="New In Product 2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
