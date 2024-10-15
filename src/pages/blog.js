import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { db } from './womenfire';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './postDetail.css';

const PostDetail = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [currentIndexes, setCurrentIndexes] = useState({});
  const sliderRefs = useRef([]);

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

  const moveLeft = (postId) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [postId]: prev[postId] > 0 ? prev[postId] - 1 : blogPosts.find(p => p.id === postId).images.length - 1,
    }));
  };

  const moveRight = useCallback((postId) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [postId]: prev[postId] < blogPosts.find(p => p.id === postId).images.length - 1 ? prev[postId] + 1 : 0,
    }));
  }, [blogPosts]);

  useEffect(() => {
    const intervals = blogPosts.map((post) =>
      setInterval(() => moveRight(post.id), 4000)
    );
    return () => intervals.forEach((interval) => clearInterval(interval));
  }, [blogPosts, moveRight]);

  useLayoutEffect(() => {
    blogPosts.forEach((post, index) => {
      const slider = sliderRefs.current[index];
      if (slider) {
        const totalWidth = slider.children[0].clientWidth * currentIndexes[post.id];
        slider.style.transform = `translateX(-${totalWidth}px)`;
      }
    });
  }, [currentIndexes, blogPosts]);

  return (
    <section className="blog-container-renamed">
  <br />
<br />
<br />
      <h2 className="bodoni-moda-heading">Explore the World of Linkosi Clothing</h2>
      <hr />

      {blogPosts.map((post, index) => (
        <div key={post.id} className="post-renamed">
          <h2 className="bodoni-moda-post-title">{post.name}</h2>

          <div className="slider-wrapper-renamed">
            <div className="slider-renamed" ref={(el) => (sliderRefs.current[index] = el)}>
              <div className="slider-item-renamed">
                <img src={post.header_image} alt={`Header of ${post.name}`} loading="lazy" />
              </div>
              {post.images?.map((image, imgIndex) => (
                <div key={imgIndex} className="slider-item-renamed">
                  <img src={image} alt={`Slide ${imgIndex + 1} of ${post.name}`} loading="lazy" />
                </div>
              ))}
            </div>

            <div className="slider-arrows-renamed">
              <button className="arrow-button-renamed" onClick={() => moveLeft(post.id)}>
                &#10094;
              </button>
              <button className="arrow-button-renamed" onClick={() => moveRight(post.id)}>
                &#10095;
              </button>
            </div>

            <div className="dots-wrapper-renamed">
              {post.images?.map((_, imgIndex) => (
                <span
                  key={imgIndex}
                  className={`dot-renamed ${currentIndexes[post.id] === imgIndex ? 'active-dot-renamed' : ''}`}
                ></span>
              ))}
            </div>
          </div>

          <div className="post-info-renamed">
            <p className="bodoni-moda-description">{post.description}</p>
            <p className="bodoni-moda-date">
              {new Date(post.publish_date.seconds * 1000).toLocaleDateString()}
            </p>
          </div>

          <div className="separator-renamed">
            <div className="line-renamed"></div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default PostDetail;
