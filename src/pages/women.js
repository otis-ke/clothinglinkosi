import React, { useEffect, useState, useRef, useCallback } from 'react';
import { db } from './womenfire';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FiShoppingCart } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './women.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../components/firebase/firebase';
import { useNavigate, useLocation } from 'react-router-dom';

const Women = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [modalProduct, setModalProduct] = useState(null);
  const productElementRefs = useRef([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize handleUrlProduct to ensure it's stable across renders
  const handleUrlProduct = useCallback((productsList) => {
    const urlParams = new URLSearchParams(location.search);
    const productId = urlParams.get('id');
    if (productId) {
      const product = productsList.find((p) => p.id === productId);
      if (product) {
        setModalProduct(product);
      }
    }
  }, [location.search]);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productCollectionRef = collection(db, 'women');
        const productQuery = query(productCollectionRef, orderBy('publish_date', 'desc'));
        const productSnapshot = await getDocs(productQuery);
        const productsList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          quantity: 1, // Add quantity field to each product
          ...doc.data(),
        }));
        setProducts(productsList);
        handleUrlProduct(productsList);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchProducts();
  }, [handleUrlProduct]); // Now handleUrlProduct is in the dependency array

  // Add product to the cart
  const handleAddToCart = (product) => {
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} added to cart.`);
  };

  // Add product to cart and navigate to checkout
  const handleBuyNow = (product) => {
    if (!user) {
      alert('Please sign in to proceed with the purchase.');
      return navigate('/signin');
    }

    // Add the product to the cart
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Redirect to the checkout page
    navigate('/checkout', { state: { cart: updatedCart } });
  };

  // Share product via WhatsApp
  const handleWhatsApp = (product) => {
    const productLink = `${window.location.origin}/women?id=${product.id}`;
    const whatsappMessage = `I am interested in ${product.name}, which costs Ksh ${product.price}. Check it out here: ${productLink}`;
    window.open(`https://wa.me/254745826811?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  // Handle opening product modal
  const openProductPage = (product) => {
    setModalProduct(product);
    navigate(`/women?id=${product.id}`);
  };

  // Close modal
  const closeModal = () => {
    setModalProduct(null);
    navigate('/women');
  };

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
      <h2 className="cormorant-garamond-regular">Women</h2>
      <div className="new-product-grid">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`new-product-item new-product-item-${index}`}
            ref={(el) => (productElementRefs.current[index] = el)}
            data-direction={index % 2 === 0 ? 'left' : 'right'}
          >
            <img
              src={product.header_image}
              alt={product.name}
              onClick={() => openProductPage(product)}
              className="product-header-image"
            />
            <h3 className="cormorant-garamond-semibold">{product.name}</h3>
            <p className="new-product-price cormorant-garamond-regular">Ksh {product.price}</p>
            <div className="new-action-buttons">
              <button
                className="new-buy-now-btn cormorant-garamond-medium"
                onClick={() => handleBuyNow(product)}
              >
                Buy Now
              </button>
              <button
                className="new-cart-icon-btn"
                onClick={() => handleAddToCart(product)}
                aria-label={`Add ${product.name} to cart`}
              >
                <FiShoppingCart />
              </button>
              <button
                className="new-whatsapp-icon-btn"
                onClick={() => handleWhatsApp(product)}
                aria-label={`Share ${product.name} on WhatsApp`}
              >
                <FaWhatsapp />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalProduct && (
        <div className="full-page-modal">
          <div className="full-page-content">
            <span className="close-modal" onClick={closeModal}>
              &times;
            </span>
            <div className="full-page-header">
              <img
                src={modalProduct.header_image}
                alt={modalProduct.name}
                className="full-page-main-image"
              />
              <h2 className="cormorant-garamond-semibold">{modalProduct.name}</h2>
              <p className="cormorant-garamond-regular">Ksh {modalProduct.price}</p>
            </div>
            <div className="full-page-gallery">
              {modalProduct.product_images.map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt={modalProduct.name}
                  className="full-page-gallery-image"
                />
              ))}
            </div>
            <div className="full-page-actions">
              <button
                className="full-page-buy-now-btn cormorant-garamond-medium"
                onClick={() => handleBuyNow(modalProduct)}
              >
                Buy Now
              </button>
              <button
                className="full-page-cart-btn"
                onClick={() => handleAddToCart(modalProduct)}
                aria-label={`Add ${modalProduct.name} to cart`}
              >
                <FiShoppingCart />
              </button>
              <button
                className="full-page-whatsapp-btn"
                onClick={() => handleWhatsApp(modalProduct)}
                aria-label={`Share ${modalProduct.name} on WhatsApp`}
              >
                <FaWhatsapp />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Women;
