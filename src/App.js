import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/header/header'; 
import Footer from './components/footer/footer'; 
import Men from './pages/men'; 
import Women from './pages/women'; 
import Kids from './pages/kids'; 
import SignIn from './pages/signin'; 
import Home from './pages/home'; 
import Checkout from './pages/checkout';
import Payment from './pages/payment';
import Orders from './pages/orders';
import Gifts from './pages/gifts'; 
import Decor from './pages/decor'; 
import GetInTouch from './pages/getintouch';
import PostDetail from './pages/blog';
import AdminComponent from './pages/admin';
import LinkosiProfile from './pages/profile.jsx';
import Careers from './pages/careers.js';
import Loader from './components//home/Loader.js';  // Import the Loader component

function App() {
  const [loading, setLoading] = useState(true); // Manage global loading state

  // Simulate loading process for the app
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Show loader for at least 3 seconds
    return () => clearTimeout(timer); // Clear timeout when component unmounts
  }, []);

  // Show loader if the app is still loading
  if (loading) {
    return <Loader fullScreen={true} />; // Loader covering the entire app
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<PostDetail />} />
        <Route path="/postDetail/:id" element={<PostDetail />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/gifts" element={<Gifts />} />
        <Route path="/decor" element={<Decor />} />
        <Route path="/company" element={<LinkosiProfile />} />
        <Route path="/getintouch" element={<GetInTouch />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/admin" element={<AdminComponent />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
