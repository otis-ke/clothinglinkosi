import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import {
  signInWithGoogle,
  loginWithEmail,
  resetPassword,
  friendlyAuthError,
} from '../firebase/authActions';
import { useToast } from '../context/ToastContext';
import './signin.css';

const SignIn = () => {
  const { redirectedFrom } = useAuthRedirect();
  const showToast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogle = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') console.error('Error signing in:', error);
      showToast(friendlyAuthError(error), 'error');
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await loginWithEmail(form);
    } catch (error) {
      console.error('Error signing in:', error);
      showToast(friendlyAuthError(error), 'error');
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      showToast('Enter your email above first, then tap "Forgot password?"', 'error');
      return;
    }
    try {
      await resetPassword(form.email);
      showToast('Password reset email sent — check your inbox.', 'success');
    } catch (error) {
      console.error('Error sending reset email:', error);
      showToast(friendlyAuthError(error), 'error');
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h2>Welcome back</h2>
        <p>
          {redirectedFrom
            ? 'Sign in to continue with your order.'
            : 'Sign in to track your orders and check out faster next time.'}
        </p>

        <form className="signin-form" onSubmit={handleSubmit}>
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
              placeholder="Your password"
              required
            />
          </label>
          <button type="button" className="signin-forgot" onClick={handleForgotPassword}>
            Forgot password?
          </button>
          <button type="submit" className="signup-primary-btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Log In'}
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
          Continue with Google
        </button>

        <p className="signin-switch">
          New to Linkosi? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
