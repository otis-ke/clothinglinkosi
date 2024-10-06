import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/header/header'; // Ensure correct path
import Footer from './components/footer/footer'; // Ensure correct path
import Men from './pages/men'; // Ensure correct path
import Women from './pages/women'; // Ensure correct path
import Kids from './pages/kids'; // Ensure correct path
import SignIn from './pages/signin'; // Ensure correct path
import Home from './pages/home'; // Ensure correct path
import Checkout from './pages/checkout';
import Payment from './pages/payment';
import Orders from './pages/orders';
import Gifts from './pages/gifts'; // Ensure correct path
import Decor from './pages/decor'; // Ensure correct path
import GetInTouch from './pages/getintouch'; // Correct Get In Touch path

function App() {
  return (
    <Router>
      <Header /> {/* This ensures the Header is visible on all pages */}
      
      <Routes>
        {/* Default route for Home */}
        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/gifts" element={<Gifts />} /> {/* Correct Gifts route */}
        <Route path="/decor" element={<Decor />} /> {/* Correct Decor route */}
        <Route path="/getintouch" element={<GetInTouch />} /> {/* Correct Get In Touch route */}
        {/* Redirect any invalid URL to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer /> {/* This ensures the Footer is visible on all pages */}
    </Router>
  );
}

export default App;
