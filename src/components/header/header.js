import React, { useEffect, useRef, useState } from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithGoogle, signOutUser, isCustomerUser } from '../../firebase/authActions';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { HiMenuAlt4 } from 'react-icons/hi';
import { IoBagOutline } from 'react-icons/io5';
import { FiUser } from 'react-icons/fi';
import { MdScreenSearchDesktop } from 'react-icons/md';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authUser] = useAuthState(auth); // Firebase session persists
  const user = isCustomerUser(authUser) ? authUser : null; // ignore the admin panel's anonymous session
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const showToast = useToast();
  const accountRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleUserIconClick = async () => {
    if (user) {
      setAccountOpen((open) => !open);
      return;
    }
    if (signingIn) return; // a popup is already in flight — ignore repeat clicks
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        console.error('Error signing in:', error);
        showToast('Could not sign in right now. Please try again.', 'error');
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setAccountOpen(false);
      closeMenu();
    } catch (error) {
      console.error('Error signing out:', error);
      showToast('Could not sign out right now.', 'error');
    }
  };

  // Close the account dropdown when clicking outside it.
  useEffect(() => {
    if (!accountOpen) return undefined;
    const onClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [accountOpen]);

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
        <h2 className="logo">LINKOSI</h2>

        <div className="icon-container">
          <Link to="/checkout" className="icon cart-icon-wrap">
            <IoBagOutline />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          <Link to="/company" className="icon">
            <MdScreenSearchDesktop />
          </Link>

          <div className="account-menu" ref={accountRef}>
            {user && user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Account'}
                className="user-avatar"
                onClick={handleUserIconClick}
              />
            ) : (
              <FiUser
                className={`icon user-icon ${user ? 'green' : ''} ${signingIn ? 'is-busy' : ''}`}
                onClick={handleUserIconClick}
              />
            )}

            {accountOpen && user && (
              <div className="account-dropdown">
                <p className="account-dropdown-name">{user.displayName || user.email}</p>
                <Link to="/orders" className="account-dropdown-link" onClick={() => setAccountOpen(false)}>
                  My Orders
                </Link>
                <button className="account-dropdown-signout" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
            )}
          </div>

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
            <div className="account-info">
              <p>Welcome, {user.displayName || user.email}</p>
              <Link to="/orders" className="nav-link" onClick={closeMenu}>My Orders</Link>
              <button className="logout-button" onClick={handleSignOut}>
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
