import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FcGoogle } from 'react-icons/fc';
import { auth, signInWithGoogle, isCustomerUser } from '../firebase/authActions';
import { useToast } from '../context/ToastContext';
import './signin.css';

const SignIn = () => {
  const [authUser, loadingAuth] = useAuthState(auth);
  const user = isCustomerUser(authUser) ? authUser : null;
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();

  const from = location.state?.from || '/';

  // Once Firebase confirms a signed-in user, bounce back to wherever they came from.
  useEffect(() => {
    if (!loadingAuth && user) {
      navigate(from, { replace: true });
    }
  }, [user, loadingAuth, navigate, from]);

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
      const message =
        error.code === 'auth/popup-blocked'
          ? 'Your browser blocked the sign-in popup. Please allow popups and try again.'
          : error.code === 'auth/popup-closed-by-user'
          ? 'Sign-in was cancelled.'
          : 'Could not sign in right now. Please try again.';
      showToast(message, 'error');
      setSubmitting(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h2>Welcome to Linkosi</h2>
        <p>
          {location.state?.from
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
      </div>
    </div>
  );
};

export default SignIn;
