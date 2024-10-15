import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../pages/womenfire'; // Ensure this is your Firestore setup file
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './store.css'; // Updated the import to match the new component name

const Store = () => {
  const [storeProducts, setStoreProducts] = useState([]);
  const storeProductRefs = useRef([]);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchStoreProducts = async () => {
      try {
        const productCollectionRef = collection(db, 'store_section');
        const productQuery = query(productCollectionRef, orderBy('publish_date', 'desc'));
        const productSnapshot = await getDocs(productQuery);
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStoreProducts(productList);
      } catch (error) {
        console.error('Error fetching store products: ', error);
      }
    };

    fetchStoreProducts();
  }, []);

  // Intersection Observer for product reveal animations
  useEffect(() => {
    const observedRefs = storeProductRefs.current;
    const observers = observedRefs.map((product, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            product.classList.add('store-reveal');
          } else {
            product.classList.remove('store-reveal');
          }
        },
        { threshold: 0.3 } // Updated scroll factor for reveal animation
      );
      if (product) observer.observe(product);
      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if (observedRefs[index]) observer.unobserve(observedRefs[index]);
      });
    };
  }, [storeProducts]);

  return (
    <section id="store-section" className="store-shop-section">
      <h1>Our Products</h1>
      <div className="store-product-grid">
        {storeProducts.map((product, index) => (
          <div
            key={product.id}
            className={`store-product-item product-item-${index}`}
            ref={(el) => (storeProductRefs.current[index] = el)}
            data-direction={index % 2 === 0 ? 'left' : 'right'}
          >
            <img src={product.header_image} alt={product.name} />
            <h4>{product.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Store;
