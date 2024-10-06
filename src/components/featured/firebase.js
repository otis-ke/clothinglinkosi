import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBmMhcQLQyZjAUx-fZoQnVyTpQeSqn9ktk",
  authDomain: "linkosiclothing-cf88d.firebaseapp.com",
  databaseURL: "https://linkosiclothing-cf88d-default-rtdb.firebaseio.com",
  projectId: "linkosiclothing-cf88d",
  storageBucket: "linkosiclothing-cf88d.appspot.com",
  messagingSenderId: "355158310567",
  appId: "1:355158310567:web:72cfaef2016b336a516582",
  measurementId: "G-QBHDELJNH3"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
