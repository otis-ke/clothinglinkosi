import React, { useState, useRef, useEffect, useCallback } from 'react';
import { db } from './womenfire';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './postDetail.css';

const PostDetail = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [currentIndexes, setCurrentIndexes] = useState({});
  const sliderRefs = useRef([]);

  // Fetch blog posts from Firestore
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const blogCollectionRef = collection(db, 'linkosiblog');
        const blogQuery = query(blogCollectionRef, orderBy('publish_date', 'desc'));
        const blogSnapshot = await getDocs(blogQuery);
        const postsList = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogPosts(postsList);
      } catch (error) {
        console.error('Error fetching blog posts: ', error);
      }
    };

    fetchBlogPosts();
  }, []);

  // Slide movement handlers
  const moveLeft = (postId) => {
    setCurrentIndexes((prev) => {
      const post = blogPosts.find((p) => p.id === postId);
      if (!post || !post.images) return prev;
      return {
        ...prev,
        [postId]: prev[postId] > 0 ? prev[postId] - 1 : post.images.length - 1,
      };
    });
  };

  const moveRight = useCallback(
    (postId) => {
      setCurrentIndexes((prev) => {
        const post = blogPosts.find((p) => p.id === postId);
        if (!post || !post.images) return prev;
        return {
          ...prev,
          [postId]: prev[postId] < post.images.length - 1 ? prev[postId] + 1 : 0,
        };
      });
    },
    [blogPosts]
  );

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      blogPosts.forEach((post) => moveRight(post.id));
    }, 4000);
    return () => clearInterval(interval);
  }, [blogPosts, moveRight]);

  // Update slider position based on index
  useEffect(() => {
    blogPosts.forEach((post, index) => {
      const slider = sliderRefs.current[index];
      if (slider) {
        const totalWidth = slider.children[0].clientWidth * currentIndexes[post.id];
        slider.style.transform = `translateX(-${totalWidth}px)`;
      }
    });
  }, [currentIndexes, blogPosts]);

  return (
    <section className="blog-section bodoni-moda-sc-regular">
      {blogPosts.map((post, index) => (
        <div key={post.id} className="post">
          <h2 className="post-name bodoni-moda-sc-regular">{post.name}</h2>

          <div className="slider-container">
            <div className="slider" ref={(el) => (sliderRefs.current[index] = el)}>
              <div className="slider-item">
                <img src={post.header_image} alt={`Header of ${post.name}`} />
              </div>
              {post.images?.map((image, imgIndex) => (
                <div key={imgIndex} className="slider-item">
                  <img src={image} alt={`Slide ${imgIndex + 1} of ${post.name}`} />
                </div>
              ))}
            </div>

            <div className="slider-arrows">
              <button className="slider-arrow" onClick={() => moveLeft(post.id)}>
                &#10094;
              </button>
              <button className="slider-arrow" onClick={() => moveRight(post.id)}>
                &#10095;
              </button>
            </div>
          </div>

          <div className="post-details">
            <p className="post-description">{post.description}</p>
            <p className="post-date">
              {new Date(post.publish_date.seconds * 1000).toLocaleDateString()}
            </p>
          </div>

          <div className="separator">
            <div className="blue-line"></div>
            <div className="dot-separator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default PostDetail;
