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

  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          } else {
            entry.target.classList.remove('reveal');
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    if (introRef.current) {
      const elements = introRef.current.querySelectorAll('.headings h1, .headings h4');
      elements.forEach((element) => observer.observe(element));

      return () => {
        elements.forEach((element) => observer.unobserve(element));
      };
    }
  }, []);

  if (!headerImage) {
    return <div>Loading...</div>; // Render a loading state while fetching data
  }

  return (
    <div className="intro-section" ref={introRef}>
      <img src={headerImage} alt="Linkosi Clothing Background" className="background-image" />
      <div className="content">
        <div className="headings">
          <h1 className="protest-guerrilla-regular">LINKOSI CLOTHING</h1>
          <h4 className="merriweather-regular">Let your style shine</h4>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
