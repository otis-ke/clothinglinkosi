import React, { useState, useEffect } from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, provider, signInWithPopup, signOut } from '../firebase/firebase';
import { HiMenuAlt4 } from 'react-icons/hi';
import { IoBagOutline } from 'react-icons/io5';
import { FiUser } from 'react-icons/fi';
import { MdScreenSearchDesktop } from 'react-icons/md';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user] = useAuthState(auth); // Firebase session persists
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

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

  // Detect scroll to change header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        <h2 className="logo">LINKOSI CLOTHING</h2>

        <div className="icon-container">
          <Link to="/checkout" className="icon">
            <IoBagOutline />
          </Link>
          <Link to="/company" className="icon">
            <MdScreenSearchDesktop />
          </Link>

          {user ? (
            <FiUser className="icon user-icon" onClick={handleSignOut} />
          ) : (
            <FiUser className="icon user-icon" onClick={handleSignIn} />
          )}

          <HiMenuAlt4
            className="icon hamburger-container"
            onClick={toggleMenu}
          />
        </div>

        <nav className={`mobile-nav ${menuOpen ? 'is-active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/blog" className="nav-link" onClick={closeMenu}>Blog</Link>
          <Link to="/women" className="nav-link" onClick={closeMenu}>Women</Link>
          <Link to="/men" className="nav-link" onClick={closeMenu}>Men</Link>
          <Link to="/kids" className="nav-link" onClick={closeMenu}>Kids</Link>
          <Link to="/gifts" className="nav-link" onClick={closeMenu}>Gifts</Link>
          <Link to="/decor" className="nav-link" onClick={closeMenu}>Decor</Link>
          <Link to="/getintouch" className="nav-link" onClick={closeMenu}>Contact Us</Link>

          {user && (
            <>
              <div className="account-info">
                <p>Welcome, {user.displayName || user.email}</p>
                <button className="logout-button" onClick={handleSignOut}>
                  Logout
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
