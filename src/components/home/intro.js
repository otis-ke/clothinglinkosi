import React, { useEffect, useState, useRef } from "react";
import { db } from "../../pages/womenfire";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Loader from "./Loader";
import MediaAsset from "../MediaAsset";
import "./intro.css";

const IntroSection = () => {
  const [headerImage, setHeaderImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const introRef = useRef(null);

  useEffect(() => {
    const fetchHeaderImage = async () => {
      try {
        const introCollectionRef = collection(db, "intro_section");
        let snapshot;
        try {
          snapshot = await getDocs(
            query(introCollectionRef, orderBy("publish_date", "desc"))
          );
        } catch {
          snapshot = await getDocs(introCollectionRef);
        }
        const introList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        introList.sort((a, b) => {
          const ca = a.publish_date?.toMillis?.() ?? 0;
          const cb = b.publish_date?.toMillis?.() ?? 0;
          return cb - ca;
        });
        const first = introList[0];
        setHeaderImage(first?.header_content || null);
      } catch (error) {
        console.error("Error fetching header image: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderImage();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const el = introRef.current;
      if (!el) return;
      if (window.scrollY > 100) {
        el.classList.add("scroll-out");
      } else {
        el.classList.remove("scroll-out");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="intro-section" ref={introRef}>
      {headerImage ? (
        <MediaAsset
          src={headerImage}
          alt="Linkosi Clothing Background"
          className="background-image"
        />
      ) : (
        <div className="background-image intro-section-fallback" aria-hidden />
      )}
      <div className="content">
        <div className="headings">
          <h1 className="dm-serif-display-regular linkosi-clothing-title">
            LINKOSI CLOTHING
          </h1>
          <h4 className="dm-serif-display-regular section-footer">
            Let your style shine
          </h4>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
