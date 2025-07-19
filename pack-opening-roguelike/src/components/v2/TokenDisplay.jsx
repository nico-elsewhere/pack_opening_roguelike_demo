import React from 'react';
import './TokenDisplay.css';

const TOKEN_CONFIG = {
  fire: { icon: '🔥', color: '#ff4444', baseValue: 10 },
  water: { icon: '💧', color: '#4488ff', baseValue: 10 },
  earth: { icon: '⛰️', color: '#88aa44', baseValue: 10 },
  air: { icon: '🌪️', color: '#88ddff', baseValue: 10 },
  light: { icon: '✨', color: '#ffdd44', baseValue: 10 },
  shadow: { icon: '🌑', color: '#6644aa', baseValue: -5 },
  arcane: { icon: '🔮', color: '#dd44ff', baseValue: 15 },
  nature: { icon: '🌿', color: '#44dd88', baseValue: 10 }
};

const TokenDisplay = ({ tokens, isAnimating = false, previousTokens = {} }) => {
  const tokenTypes = Object.keys(TOKEN_CONFIG);
  const activeTokens = tokenTypes.filter(type => tokens[type] > 0);

  if (activeTokens.length === 0) return null;

  const totalValue = activeTokens.reduce((sum, type) => {
    return sum + (tokens[type] * TOKEN_CONFIG[type].baseValue);
  }, 0);

  return (
    <div className={`token-display ${isAnimating ? 'animating' : ''}`}>
      <div className="token-header">
        <span className="token-title">Tokens</span>
        <span className="token-total-value">+{totalValue} PP</span>
      </div>
      <div className="token-list">
        {activeTokens.map(type => {
          const prevCount = previousTokens[type] || 0;
          const currentCount = tokens[type];
          const isNew = prevCount === 0 && currentCount > 0;
          const hasIncreased = currentCount > prevCount;
          
          return (
            <div 
              key={type} 
              className={`token-item ${type} ${isNew ? 'new-token' : ''} ${hasIncreased ? 'token-increased' : ''}`}
              style={{ '--token-color': TOKEN_CONFIG[type].color }}
            >
              <span className="token-icon">{TOKEN_CONFIG[type].icon}</span>
              <span className="token-count">
                {tokens[type]}
                {hasIncreased && (
                  <span className="token-increase">+{currentCount - prevCount}</span>
                )}
              </span>
              <span className="token-value">
                ({tokens[type] * TOKEN_CONFIG[type].baseValue} PP)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TokenDisplay;