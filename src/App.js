import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header'; // Ensure correct path
import Footer from './components/footer/footer'; // Ensure correct path
import Men from './pages/men'; // Ensure correct path
import Women from './pages/women'; // Ensure correct path
import Kids from './pages/kids'; // Ensure correct path
import SignIn from './pages/signin'; // Ensure correct path
import Home from './pages/home'; // Ensure correct path
import Checkout from './pages/checkout';
import Payment from './pages/payment';

function App() {
  return (
    <Router>
      <Header /> {/* This ensures the Header is visible on all pages */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>

      <Footer /> {/* This ensures the Footer is visible on all pages */}
    </Router>
  );
}

export default App;
