import React, { useEffect, useRef } from 'react';
import './shop.css'; // Import the custom CSS
import { FiShoppingCart } from 'react-icons/fi'; // Import cart icon from react-icons

import Product1 from '../images/pluto.jpg';
import BagProduct1 from '../images/cloth1.jpg';
import ShoeProduct1 from '../images/cloth2.jpg';
import HatProduct1 from '../images/cloth6.jpg';
import MensProduct2 from '../images/cloth4.jpg';
import BagProduct2 from '../images/cloth5.jpg';

// Dummy product data
const products = [
  { id: 1, name: "Linkosi track", price: 1500, imgSrc: Product1 },
  { id: 2, name: "Linkosi track", price: 3000, imgSrc: BagProduct1 },
  { id: 3, name: "Linkosi brand", price: 900, imgSrc: ShoeProduct1 },
  { id: 4, name: "Linkosi fits", price: 250, imgSrc: HatProduct1 },
  { id: 5, name: "Designer Coat", price: 1800, imgSrc: MensProduct2 },
  { id: 6, name: "Luxury Tote Bag", price: 3500, imgSrc: BagProduct2 }
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

  const handleAddToCart = (product) => {
    try {
      console.log(`${product.name} added to cart.`);
      // Implement actual logic to add the item to a cart.
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <section id="shop-section" className="new-shop-section">
      <h1> Store</h1>
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
            
            {/* Price and Action Buttons Container */}
            <div className="new-product-info">
              <p className="new-product-price">${product.price}</p>
              
              {/* Action Buttons */}
              <div className="new-action-buttons">
                <button className="new-buy-now-btn">Buy Now</button>
                <button
                  className="new-cart-icon-btn"
                  onClick={() => handleAddToCart(product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <FiShoppingCart />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Shop;
