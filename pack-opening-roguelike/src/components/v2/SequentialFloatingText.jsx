import React, { useState, useEffect } from 'react';
import './SequentialFloatingText.css';

const SequentialFloatingText = ({ animations, onComplete }) => {
  const [currentAnimations, setCurrentAnimations] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  
  useEffect(() => {
    if (!animations || animations.length === 0) return;
    
    // Start all animations with their respective delays
    const activeAnimations = animations.map((anim, index) => ({
      ...anim,
      id: `anim-${Date.now()}-${index}`,
      startTime: Date.now() + anim.delay
    }));
    
    setCurrentAnimations(activeAnimations);
  }, [animations]);
  
  const handleAnimationEnd = (animId) => {
    setCurrentAnimations(prev => prev.filter(anim => anim.id !== animId));
    setCompletedCount(prev => {
      const newCount = prev + 1;
      if (newCount === animations.length && onComplete) {
        // Use setTimeout to avoid setState during render
        setTimeout(() => onComplete(), 0);
      }
      return newCount;
    });
  };
  
  return (
    <div className="sequential-floating-text">
      {currentAnimations.map(anim => (
        <FloatingTextItem
          key={anim.id}
          {...anim}
          onComplete={() => handleAnimationEnd(anim.id)}
        />
      ))}
    </div>
  );
};

const FloatingTextItem = ({ id, type, text, delay, duration, startTime, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    const now = Date.now();
    const delayRemaining = Math.max(0, startTime - now);
    
    // Show animation after delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, delayRemaining);
    
    // Start exit animation before end
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, delayRemaining + duration - 300);
    
    // Remove animation after duration
    const removeTimer = setTimeout(() => {
      onComplete();
    }, delayRemaining + duration);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);
  
  if (!isVisible) return null;
  
  const getClassName = () => {
    let className = 'floating-text-item';
    className += ` type-${type}`;
    if (isExiting) className += ' exiting';
    return className;
  };
  
  const getStyle = () => {
    switch (type) {
      case 'ability':
        return { color: '#9333ea', fontSize: '1.1rem' };
      case 'multiplier':
        return { color: '#10b981', fontSize: '1.3rem' };
      case 'update':
        return { color: '#f59e0b', fontSize: '1rem' };
      case 'pp':
      default:
        return { color: '#fbbf24', fontSize: '1.2rem' };
    }
  };
  
  return (
    <div className={getClassName()} style={getStyle()}>
      {text}
    </div>
  );
};

export default SequentialFloatingText;