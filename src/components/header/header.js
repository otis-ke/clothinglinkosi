// Header.js
import React, { useState, useEffect } from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, provider, signInWithPopup, signOut } from '../firebase/firebase';
import { FaShoppingCart, FaTimes, FaBoxOpen } from 'react-icons/fa'; // Added Orders Icon (FaBoxOpen)

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user] = useAuthState(auth);
  

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (window.scrollY > 50) {
        header.classList.add('is-scrolling');
      } else {
        header.classList.remove('is-scrolling');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header>
      <div className="container">
        <h2>LINKOSI CLOTHING</h2>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/women" className="nav-link">Women</Link>
          <Link to="/men" className="nav-link">Men</Link>
          <Link to="/kids" className="nav-link">Kids</Link>
          <Link to="/gifts" className="nav-link">Gifts</Link>
          <Link to="/decor" className="nav-link">Decor</Link>
          <Link to="/getintouch" className="nav-link" onClick={closeMenu}>Contact Us</Link>
          <Link to="/checkout" className="cart-icon">
            <FaShoppingCart />
          </Link>
          <Link to="/orders" className="order-icon"> {/* Added Orders link */}
            <FaBoxOpen />
          </Link>
          {!user && <span className="login-link" onClick={handleSignIn}>Sign In</span>}
        </nav>

        {/* User Section for larger screens */}
        {user ? (
          <div className="user-section">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="user-image"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="user-dropdown">
                <span>{user.displayName}</span>
                <span className="logout-link" onClick={handleSignOut}>Log Out</span>
              </div>
            )}
          </div>
        ) : null}

        {/* Hamburger Menu Icon for Mobile */}
        <div className="hamburger-container" onClick={toggleMenu}>
          <span className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
            {menuOpen ? <FaTimes /> : '☰'}
          </span>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${menuOpen ? 'is-active' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
        <Link to="/women" className="nav-link" onClick={closeMenu}>Women</Link>
        <Link to="/men" className="nav-link" onClick={closeMenu}>Men</Link>
        <Link to="/kids" className="nav-link" onClick={closeMenu}>Kids</Link>
        <Link to="/gifts" className="nav-link" onClick={closeMenu}>Gifts</Link>
        <Link to="/decor" className="nav-link" onClick={closeMenu}>Decor</Link>
        <Link to="/getintouch" className="nav-link" onClick={closeMenu}>Contact Us</Link>
        <Link to="/checkout" className="nav-link" onClick={closeMenu}>
          <FaShoppingCart /> Cart
        </Link>
        <Link to="/orders" className="nav-link" onClick={closeMenu}>
          <FaBoxOpen /> Orders
        </Link>
        {user ? (
          <div className="user-section">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="user-image"
            />
            <span>{user.displayName}</span>
            <span className="logout-link" onClick={handleSignOut}>Log Out</span>
          </div>
        ) : (
          <span className="login-link" onClick={handleSignIn}>Sign In</span>
        )}
      </nav>
    </header>
  );
};

export default Header;
