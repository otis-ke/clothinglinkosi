import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, isCustomerUser } from '../firebase/authActions';

/** Bounces an already-signed-in customer back to wherever they came from. */
export function useAuthRedirect() {
  const [authUser, loadingAuth] = useAuthState(auth);
  const user = isCustomerUser(authUser) ? authUser : null;
  const navigate = useNavigate();
  const location = useLocation();
  const redirectedFrom = location.state?.from || null;

  useEffect(() => {
    if (!loadingAuth && user) {
      navigate(redirectedFrom || '/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loadingAuth, navigate, redirectedFrom]);

  return { redirectedFrom };
}
