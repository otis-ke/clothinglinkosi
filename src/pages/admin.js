import React, { useState, useRef, useEffect } from "react";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase/client";
import "./AdminComponent.css";
import AdminCmsPanel from "../components/admin/AdminCmsPanel";
import AdminPostUploader from "../components/admin/AdminPostUploader";

const AdminComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ordersRef = useRef(null);
  const cmsRef = useRef(null);
  const postDashRef = useRef(null);

  const validUsername = "admin";
  const validPassword = "LCmodeling12";

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === validUsername && password === validPassword) {
      setIsLoggedIn(true);
    } else {
      setError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setError("");
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    if (auth.currentUser) return;
    signInAnonymously(auth).catch((err) => {
      console.warn(
        "[Admin] Anonymous sign-in:",
        err?.code || err?.message || err
      );
    });
  }, [isLoggedIn]);

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
          <button type="submit" className="admin-login-button">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <aside className="admin-sidebar">
        <h2 className="bodoni-moda-admin">Admin Panel</h2>
        <nav>
          <button
            className="admin-nav-button"
            onClick={() => scrollToSection(cmsRef)}
          >
            Content (Cloudinary + Firestore)
          </button>
          <button
            className="admin-nav-button"
            onClick={() => scrollToSection(postDashRef)}
          >
            Quick post (card uploader)
          </button>
          <button
            className="admin-nav-button"
            onClick={() => scrollToSection(ordersRef)}
          >
            Orders
          </button>
        </nav>
        <button className="admin-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <div className="admin-content-wrapper">
        <section ref={cmsRef} className="admin-section admin-section-cms">
          <h2 className="bodoni-moda-admin">Storefront CMS</h2>
          <p>
            Upload images or videos to <strong>Cloudinary</strong>, then save{' '}
            <code>secure_url</code> values into <strong>Firestore</strong> per
            collection. Use <code>.env.local</code> for Firebase and Cloudinary
            variables (see <code>.env.example</code>).
          </p>
          <AdminCmsPanel />
        </section>

        <section ref={postDashRef} className="admin-section">
          <h2 className="bodoni-moda-admin">Quick post dashboard</h2>
          <p className="admin-section-lead">
            Card layout: media preview, caption, then one action to upload to Cloudinary and save the URL to the{" "}
            <code>posts</code> collection with <code>serverTimestamp()</code>.
          </p>
          <AdminPostUploader />
        </section>

        <section ref={ordersRef} className="admin-section">
          <h2 className="bodoni-moda-admin">Orders</h2>
          <p>
            Customer orders are pushed to Firebase <strong>Realtime Database</strong>{' '}
            from the payment page. Inspect them in the Firebase console under your
            RTDB project (<code>orders</code>).
          </p>
        </section>
      </div>
    </div>
  );
};

export default AdminComponent;
