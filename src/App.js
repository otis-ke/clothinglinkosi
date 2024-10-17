import React from 'react';
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
// Uncomment these imports when you are ready to use them
// import FAQs from './pages/faqs';  
// import Returns from './pages/returns';  
import Careers from './pages/careers.js';  
// import About from './pages/about';  
// import Sitemap from './pages/sitemap';  
// import Terms from './pages/terms';  
// import Privacy from './pages/privacy';  
// import Cookies from './pages/cookies';  

function App() {
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
        {/* Uncomment these routes when you are ready to use them */}
        {/* <Route path="/faqs" element={<FAQs />} /> */}
        {/* <Route path="/returns" element={<Returns />} /> */}
        <Route path="/careers" element={<Careers />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/sitemap" element={<Sitemap />} /> */}
        {/* <Route path="/terms" element={<Terms />} /> */}
        {/* <Route path="/privacy" element={<Privacy />} /> */}
        {/* <Route path="/cookies" element={<Cookies />} /> */}
        <Route path="/admin" element={<AdminComponent />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
