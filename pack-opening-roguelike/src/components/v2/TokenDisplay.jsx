import React from 'react';
import './TokenDisplay.css';

const TokenDisplay = ({ tokens, isVisible }) => {
  const tokenTypes = [
    { type: 'strength', icon: '💪', color: '#ef4444', label: 'Strength' }
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