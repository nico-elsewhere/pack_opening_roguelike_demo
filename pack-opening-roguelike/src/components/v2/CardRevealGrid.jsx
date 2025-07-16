import React from 'react';
import './CardRevealGrid.css';
import Card from '../Card';

const CardRevealGrid = ({
  openedCards,
  revealedCards,
  currentPackPPValues,
  isRevealing,
  showResults
}) => {
  if (openedCards.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎴</div>
        <h2 className="empty-title">Ready to Open Packs</h2>
        <p className="empty-subtitle">Stage packs below and press Space to reveal</p>
      </div>
    );
  }

  const getCardDelay = (index) => {
    const row = Math.floor(index / 5);
    const col = index % 5;
    return (row * 0.1 + col * 0.05);
  };

  return (
    <div className="card-reveal-container">
      <div className={`card-grid ${isRevealing ? 'revealing' : ''}`}>
        {openedCards.map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            className={`card-wrapper ${revealedCards.includes(index) ? 'revealed' : ''}`}
            style={{ animationDelay: `${getCardDelay(index)}s` }}
          >
            {revealedCards.includes(index) ? (
              <>
                <div className="card-flip-container">
                  <Card card={card} showTooltip={false} />
                </div>
                <div className="pp-popup">
                  +{currentPackPPValues[index]} PP
                </div>
                {card.isRune && (
                  <div className="rune-glow"></div>
                )}
              </>
            ) : (
              <div className="card-back-wrapper">
                <div className="card-back">
                  <div className="back-design">
                    <span className="back-symbol">?</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showResults && (
        <div className="pack-indicators">
          {Math.ceil(openedCards.length / 5) > 1 && 
            [...Array(Math.ceil(openedCards.length / 5))].map((_, i) => (
              <div key={i} className="pack-indicator">
                Pack {i + 1}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default CardRevealGrid;