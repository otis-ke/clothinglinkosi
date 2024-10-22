import React, { useState, useRef } from 'react';
import './AdminComponent.css';

const AdminComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const ordersRef = useRef(null);
  const updatesRef = useRef(null);

  const validUsername = 'admin';
  const validPassword = 'LCmodeling12';

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === validUsername && password === validPassword) {
      setIsLoggedIn(true);
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h2 className="bodoni-moda-admin">Login</h2>
          {error && <p className="admin-error-message">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="admin-login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="admin-login-input"
          />
          <button type="submit" className="admin-login-button">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <aside className="admin-sidebar">
        <h2 className="bodoni-moda-admin">Admin Panel</h2>
        <nav>
          <button className="admin-nav-button" onClick={() => scrollToSection(ordersRef)}>Orders</button>
          <button className="admin-nav-button" onClick={() => scrollToSection(updatesRef)}>Updates</button>
        </nav>
        <button className="admin-logout-button" onClick={handleLogout}>Logout</button>
      </aside>

      <div className="admin-content-wrapper">
        <section ref={ordersRef} className="admin-section">
          <h2 className="bodoni-moda-admin">Orders Section</h2>
          <p>Manage and view orders here.</p>
        </section>

        <section ref={updatesRef} className="admin-section">
          <h2 className="bodoni-moda-admin">Updates Section</h2>
          <p><strong>Update Links:</strong></p>
          <ul>
            <li><a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/intro_section">Home Intro Content</a></li>
            <li><a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/linkosiblog">Blog Content</a></li>
            <li><a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/women">Women's Products</a></li>
            <li><a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/men">Men's Products</a></li>
            <li><a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/kids_collections">Kids' Products</a></li>
            <li><a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/gifts">Gift Products</a></li>
            <li><a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/decor">Decor Products</a></li>
            <li><a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/store_section">Store Section Images</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminComponent;
