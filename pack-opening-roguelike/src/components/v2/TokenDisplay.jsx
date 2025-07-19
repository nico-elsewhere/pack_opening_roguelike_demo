import React from 'react';
import './TokenDisplay.css';

const TokenDisplay = ({ tokens, isVisible }) => {
  const tokenTypes = [
    { type: 'strength', icon: '💪', color: '#ef4444', label: 'Strength' },
    { type: 'fire', icon: '🔥', color: '#f97316', label: 'Fire' },
    { type: 'water', icon: '💧', color: '#3b82f6', label: 'Water' },
    { type: 'earth', icon: '🌿', color: '#84cc16', label: 'Earth' },
    { type: 'air', icon: '💨', color: '#06b6d4', label: 'Air' },
    { type: 'shadow', icon: '🌑', color: '#6b21a8', label: 'Shadow' },
    { type: 'light', icon: '✨', color: '#fbbf24', label: 'Light' },
    { type: 'chaos', icon: '🌀', color: '#ec4899', label: 'Chaos' },
    { type: 'order', icon: '⚖️', color: '#8b5cf6', label: 'Order' },
    { type: 'wild', icon: '🌸', color: '#10b981', label: 'Wild' },
    { type: 'tech', icon: '⚡', color: '#6366f1', label: 'Tech' },
    { type: 'void', icon: '⚫', color: '#1f2937', label: 'Void' }
  ];

  const activeTokens = tokenTypes.filter(tokenType => tokens[tokenType.type] > 0);

  if (!isVisible || activeTokens.length === 0) {
    return null;
  }

  return (
    <div className="token-display">
      {activeTokens.map(tokenType => (
        <div 
          key={tokenType.type}
          className="token-badge"
          style={{ '--token-color': tokenType.color }}
        >
          <span className="token-icon">{tokenType.icon}</span>
          <span className="token-count">{tokens[tokenType.type]}</span>
          <span className="token-label">{tokenType.label}</span>
        </div>
      ))}
    </div>
  );
};

export default TokenDisplay;