import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../pages/womenfire'; // Ensure this is your Firestore setup file
import { collection, getDocs } from 'firebase/firestore';
import './intro.css';

const IntroSection = () => {
  const [headerImage, setHeaderImage] = useState(null);
  const introRef = useRef(null);

  // Fetch header image from Firestore
  useEffect(() => {
    const fetchHeaderImage = async () => {
      try {
        const introCollectionRef = collection(db, 'intro_section');
        const introSnapshot = await getDocs(introCollectionRef);
        const introList = introSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHeaderImage(introList[0].header_content); // Assuming the image field is named 'header_content'
      } catch (error) {
        console.error('Error fetching header image: ', error);
      }
    };

    fetchHeaderImage();
  }, []);

  // Scroll effect: Hide title when user scrolls down, show when scrolling back up
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      if (scrollPos > 100) {
        introRef.current.classList.add('scroll-out');
      } else {
        introRef.current.classList.remove('scroll-out');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!headerImage) {
    return <div>Loading...</div>; // Render a loading state while fetching data
  }

  return (
    <div className="intro-section" ref={introRef}>
      <img src={headerImage} alt="Linkosi Clothing Background" className="background-image" />
      <div className="content">
        <div className="headings">
          <h1 className="dm-serif-display-regular linkosi-clothing-title">LINKOSI CLOTHING</h1>
          {/* Let your style shine - further down, stays within the section */}
          <h4 className="dm-serif-display-regular section-footer">Let your style shine</h4>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
