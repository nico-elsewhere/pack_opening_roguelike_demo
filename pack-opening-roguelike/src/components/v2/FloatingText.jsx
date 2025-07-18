import React, { useEffect } from 'react';
import './FloatingText.css';

const FloatingText = ({ text, x, y, color = '#fbbf24', onComplete }) => {
  useEffect(() => {
    // Auto-remove after animation completes
    const timer = setTimeout(() => {
      onComplete && onComplete();
    }, 1000); // Match animation duration
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="floating-text"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        color: color
      }}
    >
      {text}
    </div>
  );
};

export default FloatingText;