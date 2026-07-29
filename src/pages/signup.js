import React from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiCheckCircle } from 'react-icons/fi';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import './signup.css';

const BENEFITS = [
  'Track every order in one place',
  'Skip re-entering your details at checkout',
  'Get a faster, one-click Buy Now',
];

const SignUp = () => {
  const { handleGoogleSignIn, submitting, redirectedFrom } = useGoogleSignIn();

  return (
    <div className="signup-page">
      <div className="signup-panel">
        <div className="signup-brand">
          <h2 className="signup-logo">LINKOSI</h2>
          <p className="signup-tagline">
            {redirectedFrom
              ? 'Create an account to finish your order.'
              : 'Create your account in one click.'}
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
          <p>No forms, no new password — just your Google account.</p>
          <button
            type="button"
            className="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={submitting}
          >
            <FcGoogle size={20} />
            {submitting ? 'Signing in…' : 'Sign up with Google'}
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
