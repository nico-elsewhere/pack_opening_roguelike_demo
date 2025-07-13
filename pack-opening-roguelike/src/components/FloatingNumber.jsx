import React, { useEffect } from 'react';

const FloatingNumber = ({ value, x, y, color = '#f39c12', fontSize = 24, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete && onComplete();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div 
      className="floating-number"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        color,
        fontSize: `${fontSize}px`,
        fontWeight: 'bold',
        pointerEvents: 'none',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        zIndex: 1000,
        transform: 'translateX(-50%)',
        animation: 'floatUpSmooth 2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
      }}
    >
      +{value}
    </div>
  );
};

export default FloatingNumber;