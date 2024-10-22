import React, { useState, useRef, useEffect } from 'react';
import { db } from '../../pages/womenfire'; // Ensure this path points to your Firestore setup
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './newInUnique.css'; // Import unique CSS

const NewInSliderUnique = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collectionsData, setCollectionsData] = useState([]);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Good morning");

  // Function to determine greeting based on time of day
  const updateGreeting = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      setGreeting("Good morning");
    } else if (currentTime < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  };

  useEffect(() => {
    updateGreeting(); // Set greeting when the component loads
  }, []);

  // Fetch data from all collections
  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        const collections = ['women', 'men', 'kids', 'gifts'];
        const fetchPromises = collections.map(async (collectionName) => {
          const collectionRef = collection(db, collectionName);
          const collectionQuery = query(collectionRef, orderBy('publish_date', 'desc'), limit(1)); // Fetch only the latest item
          const snapshot = await getDocs(collectionQuery);
          return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            collectionName, // Add collection name for routing
          }))[0]; // Get the first document
        });

        const fetchedData = await Promise.all(fetchPromises);
        setCollectionsData(fetchedData);
      } catch (error) {
        console.error('Error fetching data from collections:', error);
      }
    };

    fetchCollectionData();
  }, []);

  const moveLeft = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : collectionsData.length - 1);
  };

  const moveRight = () => {
    setCurrentIndex(currentIndex < collectionsData.length - 1 ? currentIndex + 1 : 0);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    const totalWidth = slider?.children[0]?.clientWidth * currentIndex;
    if (slider) slider.style.transform = `translateX(-${totalWidth}px)`;
  }, [currentIndex]);

  useEffect(() => {
    const section = document.querySelector('.new-arrivals-section');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('section-visible');
        }
      },
      { threshold: 0.1 }
    );
    if (section) {
      observer.observe(section);
    }
  }, []);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex < collectionsData.length - 1 ? prevIndex + 1 : 0
      );
    }, 4000); // Adjust the interval to 4 seconds

    return () => clearInterval(autoSlide);
  }, [collectionsData.length]);

  const handleExploreClick = (collectionName) => {
    const routeMap = {
      women: '/women',
      men: '/men',
      kids: '/kids',
      gifts: '/gifts',
    };
    navigate(routeMap[collectionName]); // Navigate based on the collection
  };

  return (
    <section className="new-arrivals-section bodoni-moda-sc-custom">
      <br />
      <h2 className="world-heading-unique">
        <span className="small-heading-text">{greeting}</span>
      </h2>
      <p className="quicksand-custom-regular">Explore Our Top Recommendations For You,</p>

      <div className="slider-unique" ref={sliderRef}>
        {collectionsData.map((post, index) => (
          <div key={index} className="slider-item-unique">
            <img
              src={post.header_image}
              alt={`new-in-post-${post.collectionName}`}
            />
            <div className={`slider-overlay-unique ${currentIndex === index ? 'visible-unique' : ''}`}>
              <span
                className="explore-now-text bodoni-moda-sc-medium"
                onClick={() => handleExploreClick(post.collectionName)}
              >
                {post.collectionName === 'women' && 'Explore Women’s Clothing'}
                {post.collectionName === 'men' && ' Explore Men’s Clothing'}
                {post.collectionName === 'kids' && 'Explore Kids’ Clothing'}
                {post.collectionName === 'gifts' && 'Explore Linkosi Gifts'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-container-unique">
        <div className="arrow-left-unique" onClick={moveLeft}>
          &#10094;
        </div>

        <div className="pagination-dots-unique">
          {collectionsData.map((_, index) => (
            <span
              key={index}
              className={`dot-unique ${currentIndex === index ? 'dot-active-unique' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>

        <div className="arrow-right-unique" onClick={moveRight}>
          &#10095;
        </div>
      </div>
    </section>
  );
};

export default NewInSliderUnique;
