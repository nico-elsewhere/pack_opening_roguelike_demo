import React, { useEffect, useState } from 'react';
import './FloatingText.css';

const FloatingText = ({ text, x, y, color = '#fbbf24', onComplete, persistent = false, relative = false }) => {
  const [animationPhase, setAnimationPhase] = useState('floating');

  useEffect(() => {
    if (!persistent) {
      // Auto-remove after animation completes for non-persistent text
      const timer = setTimeout(() => {
        onComplete && onComplete();
      }, 1000); // Match animation duration
      
      return () => clearTimeout(timer);
    } else {
      // For persistent text, transition to settled state after initial animation
      const timer = setTimeout(() => {
        setAnimationPhase('settled');
      }, 800); // After initial animation
      
      return () => clearTimeout(timer);
    }
  }, [onComplete, persistent]);

  const style = relative ? 
    { color: color } : 
    {
      left: `${x}px`,
      top: `${y}px`,
      color: color
    };

  return (
    <div 
      className={`floating-text ${persistent ? 'persistent' : ''} ${relative ? 'relative' : ''} ${animationPhase}`}
      style={style}
    >
      {text}
    </div>
  );
};

export default FloatingText;