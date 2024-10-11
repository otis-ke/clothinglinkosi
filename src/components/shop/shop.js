import React, { useEffect, useRef } from 'react';
import './shop.css'; // Import the custom CSS
import Product1 from '../images/pluto.jpg';
import BagProduct1 from '../images/cloth1.jpg';
import ShoeProduct1 from '../images/cloth2.jpg';
import HatProduct1 from '../images/cloth6.jpg';

// Dummy product data
const products = [
  { id: 1, name: "Linkosi track", imgSrc: Product1 },
  { id: 2, name: "Linkosi track", imgSrc: BagProduct1 },
  { id: 3, name: "Linkosi brand", imgSrc: ShoeProduct1 },
  { id: 4, name: "Linkosi fits", imgSrc: HatProduct1 }
];

const Shop = () => {
  const productElementRefs = useRef([]);

  useEffect(() => {
    const observedRefs = productElementRefs.current;

    const observers = observedRefs.map((product, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            product.classList.add('reveal');
          } else {
            product.classList.remove('reveal');
          }
        },
        { threshold: 0.2 }
      );

      if (product) {
        observer.observe(product);
      }

      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if (observedRefs[index]) {
          observer.unobserve(observedRefs[index]);
        }
      });
    };
  }, []);

  return (
    <section id="shop-section" className="new-shop-section">
      <h1>Store</h1>
      <div className="new-product-grid">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`new-product-item product-item-${index}`}
            ref={(el) => (productElementRefs.current[index] = el)}
            data-direction={index % 2 === 0 ? 'left' : 'right'}
          >
            <img src={product.imgSrc} alt={product.name} />
            <h4>{product.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Shop;
