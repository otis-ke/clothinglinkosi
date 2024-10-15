// src/pages/signin.js
import React, { useState } from 'react';
import {
  auth,
  provider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  db,
} from '../firebase/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './signin.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to save user data to Firestore
  const saveUserToFirestore = async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // Create a new user document
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName || '',
          email: user.email,
          photoURL: user.photoURL || '',
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await saveUserToFirestore(user);
      navigate('/'); // Redirect to home page
    } catch (error) {
      setError('Error signing in with Google');
      console.error(error);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isNewUser) {
        // Sign up new user
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Sign in existing user
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;
      await saveUserToFirestore(user);
      navigate('/'); // Redirect to home page
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  return (
    <div className="signin-container">
      <h2>{isNewUser ? 'Sign Up' : 'Sign In'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleEmailSignIn}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signin-button">
          {isNewUser ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <p>
        {isNewUser ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span className="toggle-link" onClick={() => setIsNewUser(!isNewUser)}>
          {isNewUser ? 'Sign In' : 'Sign Up'}
        </span>
      </p>
      <p>Or</p>
      <button onClick={handleGoogleSignIn} className="google-button">
        Continue with Google
      </button>
    </div>
  );
};

export default SignIn;
