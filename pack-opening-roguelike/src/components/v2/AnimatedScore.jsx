import React, { useState, useEffect } from 'react';
import './AnimatedScore.css';

const AnimatedScore = ({ value, targetValue, onComplete }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (targetValue !== displayValue) {
      setIsAnimating(true);
      const duration = 500; // Animation duration in ms
      const startTime = Date.now();
      const startValue = displayValue;
      const difference = targetValue - startValue;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quad
        const easeProgress = 1 - Math.pow(1 - progress, 2);
        const currentValue = Math.floor(startValue + (difference * easeProgress));
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          if (onComplete) onComplete();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [targetValue]);
  
  return (
    <div className={`animated-score ${isAnimating ? 'animating' : ''}`}>
      +{displayValue} PP
    </div>
  );
};

export default AnimatedScore;