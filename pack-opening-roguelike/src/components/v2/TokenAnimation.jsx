import React, { useEffect, useState } from 'react';
import './TokenAnimation.css';

const TokenAnimation = ({ tokenType, count, icon, color, x, y, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className="token-animation"
      style={{
        '--start-x': `${x}px`,
        '--start-y': `${y}px`,
        '--token-color': color
      }}
    >
      <span className="token-animation-icon">{icon}</span>
      <span className="token-animation-count">+{count}</span>
    </div>
  );
};

export default TokenAnimation;