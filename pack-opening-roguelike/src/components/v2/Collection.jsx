import React from 'react';
import './Collection.css';
import Card from '../Card';

const Collection = ({ collection, equipRune, equippedRunes, runeSlots }) => {
  const cards = Object.values(collection);
  const equippedRuneIds = equippedRunes.map(r => r.id);
  
  const handleCardClick = (card) => {
    if (card.isRune) {
      equipRune(card.id);
    }
  };
  
  return (
    <div className="collection-page">
      <div className="collection-header">
        <h1>Card Collection</h1>
        <div className="collection-stats">
          <span className="stat">{cards.length} / 52 Cards</span>
          <span className="stat">{cards.filter(c => c.isRune).length} / 16 Runes</span>
        </div>
      </div>
      
      <div className="collection-content">
        <div className="rune-section glass">
          <h2>Equipped Runes ({equippedRunes.length}/{runeSlots})</h2>
          <div className="equipped-runes">
            {[...Array(runeSlots)].map((_, index) => (
              <div key={index} className="rune-slot-display">
                {equippedRunes[index] ? (
                  <Card 
                    card={equippedRunes[index]} 
                    onClick={() => handleCardClick(equippedRunes[index])}
                    isEquipped={true}
                  />
                ) : (
                  <div className="empty-rune-slot">
                    <span>Empty Slot {index + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="cards-section glass">
          <h2>All Cards</h2>
          <div className="cards-grid">
            {cards.map(card => (
              <Card
                key={card.id}
                card={{...card, effect: equippedRunes.find(r => r.id === card.id)?.effect}}
                onClick={() => handleCardClick(card)}
                showProgress={true}
                isEquipped={equippedRuneIds.includes(card.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;