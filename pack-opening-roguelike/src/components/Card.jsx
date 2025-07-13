import React from 'react';

const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

const Card = ({ card, onClick, isEquipped = false, showLevel = true }) => {
  const suitColor = card.suit === 'hearts' || card.suit === 'diamonds' ? 'red' : 'black';
  
  return (
    <div 
      className={`card ${card.isRune ? 'rune' : ''} ${isEquipped ? 'equipped' : ''}`}
      onClick={() => onClick && onClick(card)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="card-top">
        <span className={`rank ${suitColor}`}>{card.rank}</span>
        <span className={`suit ${suitColor}`}>{suitSymbols[card.suit]}</span>
      </div>
      
      <div className="card-center">
        {card.isRune && <div className="rune-indicator">RUNE</div>}
        <div className={`large-suit ${suitColor}`}>{suitSymbols[card.suit]}</div>
      </div>
      
      <div className="card-bottom">
        <div className="pp-value">+{card.ppValue * card.level} PP</div>
        {showLevel && card.level > 1 && <div className="level">Lv.{card.level}</div>}
      </div>
    </div>
  );
};

export default Card;