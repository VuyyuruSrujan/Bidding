import React from 'react';
import './LoadingDots.css'; // Import the CSS file

const LoadingDots = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default LoadingDots;
