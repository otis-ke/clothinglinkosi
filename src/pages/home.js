// src/pages/Home.js

import React from 'react';
import IntroSection from '../components/home/intro';
import NewInSliderUnique from '../components/exclusive/newI'
import NewInSlider from '../components/newin/newin';
import Shop from '../components/shop/shop';
import AboutUs from '../components/about/about';
import Contact from '../components/contactus/contact';


const Home = () => {
  return (
    <>
     
      <IntroSection />
      <NewInSlider />
      
      <Shop />
      <NewInSliderUnique />
      <AboutUs />
      <Contact />
     
    </>
  );
};

export default Home;
