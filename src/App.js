import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import GetInTouch from './pages/getintouch';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/gifts" element={<Gifts />} />
        <Route path="/decor" element={<Decor />} />
        <Route path="/GetInTouch" element={<GetInTouch />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
