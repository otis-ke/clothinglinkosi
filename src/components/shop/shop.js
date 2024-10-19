import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../pages/womenfire'; // Ensure this is your Firestore setup file
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './shop.css'; // Import the custom CSS

const Shop = () => {
  const [products, setProducts] = useState([]);
  const productElementRefs = useRef([]);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productCollectionRef = collection(db, 'store_section');
        const productQuery = query(productCollectionRef, orderBy('publish_date', 'desc'));
        const productSnapshot = await getDocs(productQuery);
        const productsList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchProducts();
  }, []);

  // Intersection Observer for product reveal animations
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
      if (product) observer.observe(product);
      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if (observedRefs[index]) observer.unobserve(observedRefs[index]);
      });
    };
  }, [products]);

  return (
    <section id="shop-section" className="new-shop-section">
      <h1>Our Collection</h1>
      <div className="new-product-grid">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`new-product-item product-item-${index}`}
            ref={(el) => (productElementRefs.current[index] = el)}
            data-direction={index % 2 === 0 ? 'left' : 'right'}
          >
            <img src={product.header_image} alt={product.name} />
            <div className="product-name-button">
              <span>{product.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Shop;
