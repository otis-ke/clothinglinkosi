import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

/** All values come from `.env.local` — see `.env.example` */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "",
};

function createOrGetApp() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn(
      "[Firebase] Set REACT_APP_FIREBASE_API_KEY and REACT_APP_FIREBASE_PROJECT_ID in .env.local (see .env.example)."
    );
  }
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

export const app = createOrGetApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

/** Realtime Database (orders checkout). Requires REACT_APP_FIREBASE_DATABASE_URL. */
export const rtdb = firebaseConfig.databaseURL ? getDatabase(app) : null;
