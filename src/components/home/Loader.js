import React from 'react';
import './Loader.css';

const Loader = ({ fullScreen }) => {
  return (
    <div className={`loader-wrapper ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
