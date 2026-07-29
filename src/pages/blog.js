import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { db } from "./womenfire";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import MediaAsset from "../components/MediaAsset";
import "./postDetail.css";

function slideCount(post) {
  const extra = post.images?.length ?? 0;
  return (post.header_image ? 1 : 0) + extra;
}

function formatPublishDate(p) {
  const ts = p.publish_date;
  if (!ts) return "";
  const ms =
    typeof ts.seconds === "number"
      ? ts.seconds * 1000
      : typeof ts.toMillis === "function"
        ? ts.toMillis()
        : 0;
  if (!ms) return "";
  return new Date(ms).toLocaleDateString();
}

const PostDetail = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [currentIndexes, setCurrentIndexes] = useState({});
  const sliderRefs = useRef([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const blogCollectionRef = collection(db, "linkosiblog");
        const blogQuery = query(
          blogCollectionRef,
          orderBy("publish_date", "desc")
        );
        const blogSnapshot = await getDocs(blogQuery);
        const postsList = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogPosts(postsList);
        const initIdx = {};
        postsList.forEach((p) => {
          initIdx[p.id] = 0;
        });
        setCurrentIndexes(initIdx);
      } catch (error) {
        console.error("Error fetching blog posts: ", error);
      }
    };

    fetchBlogPosts();
  }, []);

  const moveLeft = (postId) => {
    setCurrentIndexes((prev) => {
      const post = blogPosts.find((p) => p.id === postId);
      if (!post) return prev;
      const n = slideCount(post);
      if (n === 0) return prev;
      const cur = prev[postId] ?? 0;
      return { ...prev, [postId]: cur > 0 ? cur - 1 : n - 1 };
    });
  };

  const moveRight = useCallback((postId) => {
    setCurrentIndexes((prev) => {
      const post = blogPosts.find((p) => p.id === postId);
      if (!post) return prev;
      const n = slideCount(post);
      if (n === 0) return prev;
      const cur = prev[postId] ?? 0;
      return { ...prev, [postId]: cur < n - 1 ? cur + 1 : 0 };
    });
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
      if (slider && slider.children[0]) {
        const totalWidth =
          slider.children[0].clientWidth * (currentIndexes[post.id] ?? 0);
        slider.style.transform = `translateX(-${totalWidth}px)`;
      }
    });
  }, [currentIndexes, blogPosts]);

  return (
    <section className="blog-container-renamed">
      <br />
      <br />
      <br />
      <h2 className="explore-world-heading">
        <span className="small-text">explore the world of</span>
        <span className="large-text">Linkosi Clothing</span>
      </h2>

      {blogPosts.map((post, index) => {
        const slides = slideCount(post);
        return (
          <div key={post.id} className="post-renamed">
            <h2 className="bodoni-moda-post-title">{post.name}</h2>

            <div className="slider-wrapper-renamed">
              <div
                className="slider-renamed"
                ref={(el) => (sliderRefs.current[index] = el)}
              >
                {post.header_image ? (
                  <div className="slider-item-renamed">
                    <MediaAsset
                      src={post.header_image}
                      alt={`Header of ${post.name}`}
                      videoControls
                      imgProps={{ loading: "lazy" }}
                    />
                  </div>
                ) : null}
                {(post.images || []).map((src, imgIndex) => (
                  <div key={imgIndex} className="slider-item-renamed">
                    <MediaAsset
                      src={src}
                      alt={`Slide ${imgIndex + 1} of ${post.name}`}
                      videoControls
                      imgProps={{ loading: "lazy" }}
                    />
                  </div>
                ))}
              </div>

              {slides > 0 ? (
                <>
                  <div className="slider-arrows-renamed">
                    <button
                      type="button"
                      className="arrow-button-renamed"
                      onClick={() => moveLeft(post.id)}
                    >
                      &#10094;
                    </button>
                    <button
                      type="button"
                      className="arrow-button-renamed"
                      onClick={() => moveRight(post.id)}
                    >
                      &#10095;
                    </button>
                  </div>

                  <div className="dots-wrapper-renamed">
                    {Array.from({ length: slides }).map((_, imgIndex) => (
                      <span
                        key={imgIndex}
                        className={`dot-renamed ${
                          (currentIndexes[post.id] ?? 0) === imgIndex
                            ? "active-dot-renamed"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <div className="post-info-renamed">
              <p className="bodoni-moda-description">{post.description}</p>
              <p className="bodoni-moda-date">{formatPublishDate(post)}</p>
            </div>

            <div className="separator-renamed">
              <div className="line-renamed" />
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default PostDetail;
