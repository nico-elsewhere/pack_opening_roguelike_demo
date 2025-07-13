import React, { useState, useRef } from 'react';
import Card from './Card';
import FloatingNumber from './FloatingNumber';

const PackOpening = ({ pack, onClose, equippedRunes, cardPPValues }) => {
  const [revealedCards, setRevealedCards] = useState([]);
  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const packCardsRef = useRef(null);
  
  const handleCardClick = (index, event) => {
    if (!revealedCards.includes(index)) {
      setRevealedCards([...revealedCards, index]);
      
      // Calculate position for floating number
      const rect = event.currentTarget.getBoundingClientRect();
      const containerRect = packCardsRef.current.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;
      
      // Get PP value and check for rune bonuses
      const card = pack[index];
      const ppValue = cardPPValues[index];
      const baseValue = card.ppValue * card.level;
      const hasBonus = ppValue > baseValue;
      
      // Add floating number
      const id = Date.now() + Math.random();
      setFloatingNumbers(prev => [...prev, {
        id,
        value: ppValue,
        x,
        y,
        color: hasBonus ? '#e74c3c' : '#f39c12',
        fontSize: hasBonus ? 32 : 24
      }]);
      
      // Show rune triggers
      if (hasBonus) {
        const triggeredRunes = equippedRunes.filter(rune => {
          if (rune.effect.type === 'suit_bonus' && rune.effect.suit === card.suit) return true;
          if (rune.effect.type === 'rank_bonus' && rune.effect.rank === card.rank) return true;
          return false;
        });
        
        triggeredRunes.forEach((rune, i) => {
          setTimeout(() => {
            const runeId = Date.now() + Math.random();
            setFloatingNumbers(prev => [...prev, {
              id: runeId,
              value: `${rune.effect.type === 'suit_bonus' ? rune.effect.suit : rune.effect.rank} RUNE!`,
              x: x + (i * 30 - 15),
              y: y - 30,
              color: '#9b59b6',
              fontSize: 16
            }]);
          }, 200 + i * 100);
        });
      }
    }
  };
  
  const removeFloatingNumber = (id) => {
    setFloatingNumbers(prev => prev.filter(n => n.id !== id));
  };
  
  const allRevealed = revealedCards.length === pack.length;
  
  return (
    <div className="pack-opening-overlay" onClick={allRevealed ? onClose : undefined}>
      <div className="pack-opening-content" onClick={(e) => e.stopPropagation()}>
        <h2>Pack Opening!</h2>
        <div className="pack-cards" ref={packCardsRef} style={{ position: 'relative' }}>
          {pack.map((card, index) => (
            <div 
              key={index} 
              className={`pack-card-wrapper ${revealedCards.includes(index) ? 'revealed' : ''}`}
              onClick={(e) => handleCardClick(index, e)}
            >
              {revealedCards.includes(index) ? (
                <Card 
                  card={card} 
                  showLevel={false} 
                  showTooltip={true}
                />
              ) : (
                <div className="card-back">
                  <div className="card-back-design">?</div>
                </div>
              )}
            </div>
          ))}
          
          {floatingNumbers.map(num => (
            <FloatingNumber
              key={num.id}
              value={num.value}
              x={num.x}
              y={num.y}
              color={num.color}
              fontSize={num.fontSize}
              onComplete={() => removeFloatingNumber(num.id)}
            />
          ))}
        </div>
        
        {allRevealed && (
          <>
            <div className="total-pp-gained">
              Total PP Gained: {cardPPValues.reduce((sum, val) => sum + val, 0)}
            </div>
            <button className="continue-button" onClick={onClose}>
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PackOpening;