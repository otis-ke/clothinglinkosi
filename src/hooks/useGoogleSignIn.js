import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithGoogle, isCustomerUser } from '../firebase/authActions';
import { useToast } from '../context/ToastContext';

/** Shared Google popup sign-in flow used by both /signin and /signup. */
export function useGoogleSignIn() {
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
    if (submitting) return;
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      const message =
        error.code === 'auth/popup-blocked'
          ? 'Your browser blocked the sign-in popup. Please allow popups and try again.'
          : error.code === 'auth/popup-closed-by-user'
          ? 'Sign-in was cancelled.'
          : 'Could not sign in right now. Please try again.';
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Error signing in:', error);
      }
      showToast(message, 'error');
      setSubmitting(false);
    }
  };

  return { handleGoogleSignIn, submitting, redirectedFrom: location.state?.from || null };
}
