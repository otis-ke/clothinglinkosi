import React from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import './signin.css';

const SignIn = () => {
  const { handleGoogleSignIn, submitting, redirectedFrom } = useGoogleSignIn();

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h2>Welcome back</h2>
        <p>
          {redirectedFrom
            ? 'Sign in to continue with your order.'
            : 'Sign in to track your orders and check out faster next time.'}
        </p>
        <button
          type="button"
          className="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={submitting}
        >
          <FcGoogle size={20} />
          {submitting ? 'Signing in…' : 'Continue with Google'}
        </button>
        <p className="signin-switch">
          New to Linkosi? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
