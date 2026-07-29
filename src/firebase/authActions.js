import { auth, provider, signInWithPopup, signOut } from "../components/firebase/firebase";
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

export { auth };
