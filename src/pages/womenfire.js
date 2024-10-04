import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use the already initialized app
}

const db = getFirestore(app);

export { db };
