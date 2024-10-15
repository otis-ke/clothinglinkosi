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
  const validPassword = '12345';

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
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2 className="bodoni-moda-admin">Login</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2 className="bodoni-moda-admin">Admin Panel</h2>
        <nav>
          <button onClick={() => scrollToSection(ordersRef)}>Orders</button>
          <button onClick={() => scrollToSection(updatesRef)}>Updates</button>
        </nav>
        <button onClick={handleLogout}>Logout</button>
      </aside>

      <div className="content-wrapper">
        <section ref={ordersRef} className="section">
          <h2 className="bodoni-moda-admin">Orders Section</h2>
          <p>Manage and view orders here.</p>
        </section>

        <section ref={updatesRef} className="section">
          <h2 className="bodoni-moda-admin">Updates Section</h2>
          <p>
            <strong>Update Links:</strong>
          </p>
          <ul>
            <li>
              <a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/intro_section">home intro content</a>
            </li>
            <li>
              <a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/linkosiblog">blog content</a>
            </li>
            <li>
              <a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/women">womens products</a>
            </li>
            <li>
              <a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/men">Men products</a>
            </li>
            <li>
              <a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/kids_collections">kids products</a>
            </li>
            <li>
              <a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/gifts">gifts products</a>
            </li>
            <li>
              <a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/decor">decor products</a>
            </li>
            <li>
              <a href="https://app.firecms.co/p/linkosiclothing-cf88d/c/store_section">store section images</a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminComponent;
