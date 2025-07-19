import React, { useState, useEffect } from 'react';
import './LevelPackView.css';
import Card from '../Card';

const LevelPackView = ({ collection, onComplete, onBack }) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Select 5 random cards from collection that can be leveled up
    const eligibleCards = Object.values(collection).filter(card => {
      const currentLevel = card.level || 1;
      return currentLevel < 10; // Max level is 10
    });

    console.log('LevelPackView - eligible cards:', eligibleCards.length);
    console.log('Collection size:', Object.keys(collection).length);

    // Always show cards if we have any in collection
    // Even if no cards to level up, we should show the view
    if (eligibleCards.length > 0) {
      // Shuffle and pick up to 5 cards
      const shuffled = [...eligibleCards].sort(() => 0.5 - Math.random());
      setSelectedCards(shuffled.slice(0, Math.min(5, shuffled.length)));
    } else if (Object.keys(collection).length > 0) {
      // Show any cards from collection even if at max level
      const anyCards = Object.values(collection);
      const shuffled = [...anyCards].sort(() => 0.5 - Math.random());
      setSelectedCards(shuffled.slice(0, Math.min(5, shuffled.length)));
    }
  }, [collection]);

  const handleCardSelect = (card) => {
    if (isAnimating || selectedCard) return;

    setSelectedCard(card);
    setIsAnimating(true);

    // Animate and complete
    setTimeout(() => {
      onComplete({
        type: 'level',
        card: card,
        newLevel: (card.level || 1) + 1
      });
    }, 1000);
  };

  const calculateNextLevelPP = (card) => {
    const currentLevel = card.level || 1;
    const basePP = card.ppValue || 10;
    const currentPP = basePP * currentLevel;
    const nextPP = basePP * (currentLevel + 1);
    return nextPP - currentPP;
  };

  return (
    <div className="level-pack-view">
      <div className="level-pack-header">
        <button className="back-button" onClick={onBack} disabled={isAnimating}>
          ← Back
        </button>
        <h2>Level Pack</h2>
        <p className="level-pack-subtitle">Choose a card to level up</p>
      </div>

      <div className="level-cards-container">
        {selectedCards.map((card, index) => {
          const isSelected = selectedCard?.id === card.id;
          const currentLevel = card.level || 1;
          const ppIncrease = calculateNextLevelPP(card);

          return (
            <div
              key={card.id}
              className={`level-card-wrapper ${isSelected ? 'selected' : ''} ${isAnimating && !isSelected ? 'fade-out' : ''}`}
              onClick={() => handleCardSelect(card)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="level-card-hover">
                <Card card={card} showLevel={true} alwaysShowLevel={true} />
                <div className="level-info">
                  <div className="current-level">Lv.{currentLevel}</div>
                  <div className="level-arrow">→</div>
                  <div className="next-level">Lv.{currentLevel + 1}</div>
                </div>
                <div className="pp-increase">
                  <span className="pp-plus">+{ppIncrease}</span>
                  <span className="pp-label">PP per card</span>
                </div>
              </div>
              {isSelected && (
                <div className="level-up-effect">
                  <div className="level-burst" />
                  <div className="level-text">LEVEL UP!</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedCards.length === 0 && (
        <div className="no-cards-message">
          <p>No cards available to level up</p>
          <button onClick={onBack}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default LevelPackView;