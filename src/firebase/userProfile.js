import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./client";

/**
 * Upserts `users/{uid}` on every sign-in so the account has a persistent
 * Firestore record (name/email/photo refreshed, createdAt set only once).
 * Requires a Firestore rule allowing a signed-in user to write their own doc:
 *   match /users/{uid} { allow read, write: if request.auth.uid == uid; }
 */
export async function upsertUserProfile(user) {
  if (!user || user.isAnonymous) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  const profile = {
    uid: user.uid,
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    provider: user.providerData?.[0]?.providerId || "google.com",
    lastLoginAt: serverTimestamp(),
  };
  if (!snap.exists()) {
    profile.createdAt = serverTimestamp();
  }

  await setDoc(ref, profile, { merge: true });
}
