import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "../components/firebase/firebase";
import { upsertUserProfile } from "./userProfile";

// Firebase's popup-auth flow keeps a single internal promise per app instance;
// firing signInWithPopup a second time before the first resolves (double-click,
// a re-render re-invoking the handler, HMR remounting mid-flow) corrupts that
// state and surfaces as "INTERNAL ASSERTION FAILED: Pending promise was never
// set". Coalescing concurrent callers onto one in-flight promise avoids it.
let signInInFlight = null;

/** Google popup sign-in; also upserts the Firestore user profile (non-fatal if it fails). */
export async function signInWithGoogle() {
  if (signInInFlight) return signInInFlight;

  signInInFlight = (async () => {
    const result = await signInWithPopup(auth, provider);
    try {
      await upsertUserProfile(result.user);
    } catch (err) {
      console.warn("[auth] Could not save user profile to Firestore:", err.message || err);
    }
    return result.user;
  })();

  try {
    return await signInInFlight;
  } finally {
    signInInFlight = null;
  }
}

/** Email/password account creation; sets displayName and upserts users/{uid}. */
export async function registerWithEmail({ name, email, password }) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (name?.trim()) {
    await updateProfile(result.user, { displayName: name.trim() });
  }
  try {
    await upsertUserProfile(result.user);
  } catch (err) {
    console.warn("[auth] Could not save user profile to Firestore:", err.message || err);
  }
  return result.user;
}

/** Email/password login; refreshes the users/{uid} lastLoginAt on success. */
export async function loginWithEmail({ email, password }) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  try {
    await upsertUserProfile(result.user);
  } catch (err) {
    console.warn("[auth] Could not save user profile to Firestore:", err.message || err);
  }
  return result.user;
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function signOutUser() {
  await signOut(auth);
}

/**
 * The admin CMS panel signs in anonymously against this same Firebase Auth
 * instance (see src/pages/admin.js). Treat anonymous sessions as "signed out"
 * on the storefront so an admin browsing the shop after managing the CMS
 * doesn't see themselves as a logged-in customer.
 */
export function isCustomerUser(user) {
  return Boolean(user) && !user.isAnonymous;
}

/** Maps Firebase Auth error codes to copy a customer can actually act on. */
export function friendlyAuthError(error) {
  switch (error?.code) {
    case "auth/unauthorized-domain":
      return "Sign-in isn't configured for this domain yet. Please try again shortly.";
    case "auth/operation-not-allowed":
      return "This sign-in method isn't enabled yet. Please try Google sign-in instead.";
    case "auth/email-already-in-use":
      return "An account already exists for that email. Try logging in instead.";
    case "auth/weak-password":
      return "Please choose a password with at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return "No account matches that email and password.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup. Please allow popups and try again.";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export { auth };
