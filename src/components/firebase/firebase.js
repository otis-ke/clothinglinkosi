import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';  
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBmMhcQLQyZjAUx-fZoQnVyTpQeSqn9ktk",
  authDomain: "linkosiclothing-cf88d.firebaseapp.com",
  projectId: "linkosiclothing-cf88d",
  storageBucket: "linkosiclothing-cf88d.appspot.com",
  messagingSenderId: "355158310567",
  appId: "1:355158310567:web:72cfaef2016b336a516582",
  measurementId: "G-QBHDELJNH3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export the auth methods, Firestore, and provider
export { auth, provider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, db };
