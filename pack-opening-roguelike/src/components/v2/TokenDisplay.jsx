import React from 'react';
import './TokenDisplay.css';

const TokenDisplay = ({ tokens, isVisible, isScoringTokens = false, scoringTokenType = null, tokenScores = {} }) => {
  const tokenTypes = [
    { type: 'fire', icon: '🔥', color: '#f97316', label: 'Fire' },
    { type: 'water', icon: '💧', color: '#3b82f6', label: 'Water' },
    { type: 'earth', icon: '🌍', color: '#84cc16', label: 'Earth' },
    { type: 'shadow', icon: '🌑', color: '#6b21a8', label: 'Shadow' },
    { type: 'light', icon: '✨', color: '#fbbf24', label: 'Light' },
    { type: 'chaos', icon: '🎲', color: '#ec4899', label: 'Chaos' },
    { type: 'arcane', icon: '🔮', color: '#6366f1', label: 'Arcane' }
  ];

  const activeTokens = tokenTypes.filter(tokenType => tokens[tokenType.type] > 0);

  if (!isVisible || activeTokens.length === 0) {
    return null;
  }

  return (
    <div className="token-display">
      {activeTokens.map((tokenType, index) => {
        const isCurrentlyScoring = isScoringTokens && scoringTokenType === tokenType.type;
        const tokenScore = tokenScores[tokenType.type];
        const hasScore = tokenScore !== undefined && tokenScore > 0;
        
        return (
          <div 
            key={tokenType.type}
            className={`token-badge ${isCurrentlyScoring ? 'scoring' : ''} ${hasScore ? 'scored' : ''}`}
            style={{ '--token-color': tokenType.color }}
          >
            <span className="token-icon">{tokenType.icon}</span>
            <span className="token-count">{tokens[tokenType.type]}</span>
            <span className="token-label">{tokenType.label}</span>
            {(isCurrentlyScoring || hasScore) && tokenScore !== undefined && tokenScore > 0 && (
              <div className="token-score-popup">
                +{tokenScore} PP
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TokenDisplay;