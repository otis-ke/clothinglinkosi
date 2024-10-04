// src/pages/Home.js

import React from 'react';
import IntroSection from '../components/home/intro';
import FeaturedCollection from '../components/featured/featured';
import NewInSlider from '../components/newin/newin';
import Shop from '../components/shop/shop';
import AboutUs from '../components/about/about';
import Contact from '../components/contactus/contact';


const Home = () => {
  return (
    <>
     
      <IntroSection />
      <NewInSlider />
      <FeaturedCollection />
      <Shop />
      <AboutUs />
      <Contact />
     
    </>
  );
};

export default Home;
