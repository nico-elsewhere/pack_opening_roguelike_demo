import React, { useState } from 'react';
import Card from './Card';

const PackOpening = ({ pack, onClose }) => {
  const [revealedCards, setRevealedCards] = useState([]);
  
  const handleCardClick = (index) => {
    if (!revealedCards.includes(index)) {
      setRevealedCards([...revealedCards, index]);
    }
  };
  
  const allRevealed = revealedCards.length === pack.length;
  
  return (
    <div className="pack-opening-overlay" onClick={allRevealed ? onClose : undefined}>
      <div className="pack-opening-content" onClick={(e) => e.stopPropagation()}>
        <h2>Pack Opening!</h2>
        <div className="pack-cards">
          {pack.map((card, index) => (
            <div 
              key={index} 
              className={`pack-card-wrapper ${revealedCards.includes(index) ? 'revealed' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              {revealedCards.includes(index) ? (
                <Card card={card} showLevel={false} />
              ) : (
                <div className="card-back">
                  <div className="card-back-design">?</div>
                </div>
              )}
            </div>
          ))}
        </div>
        {allRevealed && (
          <button className="continue-button" onClick={onClose}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default PackOpening;