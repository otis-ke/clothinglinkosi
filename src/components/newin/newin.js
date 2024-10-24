import React, { useState, useRef, useEffect } from 'react';
import { db } from '../../pages/womenfire'; // Ensure this path points to your Firestore setup
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './newin.css';

const NewInSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blogPosts, setBlogPosts] = useState([]);
  const sliderRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch blog posts from Firestore
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const blogCollectionRef = collection(db, 'linkosiblog');
        const blogQuery = query(blogCollectionRef, orderBy('publish_date', 'desc')); // Sort by publish date
        const blogSnapshot = await getDocs(blogQuery);
        const postsList = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() // Spread the data fields from the document
        }));
        setBlogPosts(postsList);
      } catch (error) {
        console.error('Error fetching blog posts: ', error);
      }
    };

    fetchBlogPosts();
  }, []);

  const moveLeft = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : blogPosts.length - 1);
  };

  const moveRight = () => {
    setCurrentIndex(currentIndex < blogPosts.length - 1 ? currentIndex + 1 : 0);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    const totalWidth = slider?.children[0]?.clientWidth * currentIndex;
    if (slider) slider.style.transform = `translateX(-${totalWidth}px)`;
  }, [currentIndex]);

  useEffect(() => {
    const section = document.querySelector('.new-in-section');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('reveal');
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
        prevIndex < blogPosts.length - 1 ? prevIndex + 1 : 0
      );
    }, 4000); // Adjust the interval to 4 seconds

    return () => clearInterval(autoSlide);
  }, [blogPosts.length]);

  const handleExploreClick = (postId) => {
    navigate(`/PostDetail/${postId}`); // Navigate to PostDetail with post ID
  };

  return (
    <section className="new-in-section bodoni-moda-sc-regular">
      <br />
      <h2 class="explore-world-heading">
  <span class="small-text">Explore The World Of</span>
  <span class="large-text">LINKOSI CLOTHING</span>
 
</h2>
<p className="quicksand-regular">Explore Our Seasonal Clothing,</p>
<div></div>
<p className="quicksand-semibold">Collections and Fresh Arrivals.</p>


      <div className="slider" ref={sliderRef}>
        {blogPosts.map((post, index) => (
          <div key={index} className="slider-item">
            <img
              src={post.header_image}
              alt={`new in post ${post.name}`}
            />
            <div
              className={`slider-overlay ${currentIndex === index ? 'visible' : ''}`}
            >
              <button
                className="shop-now-btn bodoni-moda-sc-medium"
                onClick={() => handleExploreClick(post.id)}
              >
                explore collection
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-arrows-container">
        <div className="slider-arrow slider-arrow-left" onClick={moveLeft}>
          &#10094;
        </div>

        <div className="pagination">
          {blogPosts.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>

        <div className="slider-arrow slider-arrow-right" onClick={moveRight}>
          &#10095;
        </div>
      </div>
    </section>
  );
};

export default NewInSlider;
