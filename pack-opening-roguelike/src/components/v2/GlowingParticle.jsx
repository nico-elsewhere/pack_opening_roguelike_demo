import React from 'react';
import './GlowingParticle.css';

const GlowingParticle = ({ 
  startX, 
  startY, 
  endX, 
  endY,
  delay = 0,
  color = '#a855f7',
  size = 8,
  onAnimationComplete
}) => {
  // Generate random scatter position
  const angle = Math.random() * Math.PI * 2;
  const distance = 100 + Math.random() * 150;
  const scatterX = startX + Math.cos(angle) * distance;
  const scatterY = startY + Math.sin(angle) * distance;

  return (
    <div 
      className="glowing-particle"
      style={{
        '--start-x': `${startX}px`,
        '--start-y': `${startY}px`,
        '--scatter-x': `${scatterX}px`,
        '--scatter-y': `${scatterY}px`,
        '--end-x': `${endX}px`,
        '--end-y': `${endY}px`,
        '--particle-color': color,
        '--particle-size': `${size}px`,
        '--delay': `${delay}ms`,
        animationDelay: `${delay}ms`
      }}
      onAnimationEnd={onAnimationComplete}
    >
      <div className="particle-core"></div>
      <div className="particle-glow"></div>
    </div>
  );
};

export default GlowingParticle;