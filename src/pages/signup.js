import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiCheckCircle } from 'react-icons/fi';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { registerWithEmail, signInWithGoogle, friendlyAuthError } from '../firebase/authActions';
import { useToast } from '../context/ToastContext';
import './signup.css';

const BENEFITS = [
  'Track every order in one place',
  'Skip re-entering your details at checkout',
  'Get a faster, one-click Buy Now',
];

const SignUp = () => {
  const { redirectedFrom } = useAuthRedirect();
  const showToast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogle = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') console.error('Error signing up:', error);
      showToast(friendlyAuthError(error), 'error');
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (form.password.length < 6) {
      showToast('Please choose a password with at least 6 characters.', 'error');
      return;
    }
    if (form.password !== form.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await registerWithEmail(form);
    } catch (error) {
      console.error('Error creating account:', error);
      showToast(friendlyAuthError(error), 'error');
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-panel">
        <div className="signup-brand">
          <h2 className="signup-logo">LINKOSI</h2>
          <p className="signup-tagline">
            {redirectedFrom
              ? 'Create an account to finish your order.'
              : 'Create your account in a minute.'}
          </p>
          <ul className="signup-benefits">
            {BENEFITS.map((benefit) => (
              <li key={benefit}>
                <FiCheckCircle />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="signup-card">
          <h3>Create your account</h3>

          <form className="signup-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </label>
            <label>
              Confirm password
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                minLength={6}
                required
              />
            </label>
            <button type="submit" className="signup-primary-btn" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="signup-divider"><span>or</span></div>

          <button
            type="button"
            className="google-signin-btn"
            onClick={handleGoogle}
            disabled={submitting}
          >
            <FcGoogle size={20} />
            Sign up with Google
          </button>

          <p className="signup-switch">
            Already have an account? <Link to="/signin">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
