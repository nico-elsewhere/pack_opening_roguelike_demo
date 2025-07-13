import React from 'react';

const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

const Card = ({ card, onClick, isEquipped = false, showLevel = true, showProgress = false, showTooltip = true }) => {
  const suitColor = card.suit === 'hearts' || card.suit === 'diamonds' ? 'red' : 'black';
  const xpProgress = (card.xp / card.xpToNextLevel) * 100;
  
  const getRuneDescription = () => {
    if (!card.isRune || !card.effect) return '';
    switch (card.effect.type) {
      case 'suit_bonus':
        return `${card.effect.suit} cards +${Math.round((card.effect.multiplier - 1) * 100)}% PP`;
      case 'rank_bonus':
        return `${card.effect.rank} cards +${Math.round((card.effect.multiplier - 1) * 100)}% PP`;
      case 'pp_generation':
        return `+${card.effect.bonusPP.toFixed(1)} PP/sec`;
      default:
        return 'Unknown effect';
    }
  };
  
  return (
    <div className="card-container">
      <div 
        className={`card ${card.isRune ? 'rune' : ''} ${isEquipped ? 'equipped' : ''}`}
        onClick={() => onClick && onClick(card)}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        {isEquipped && <div className="equipped-indicator">EQUIPPED</div>}
        
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
        
        {card.isRune && showTooltip && (
          <div className="rune-tooltip">
            {getRuneDescription()}
          </div>
        )}
      </div>
      
      {showProgress && (
        <div className="card-progress">
          <div className="progress-info">
            <span className="current-level">Lv.{card.level}</span>
            <span className="xp-text">{card.xp}/{card.xpToNextLevel} XP</span>
            <span className="next-level">Lv.{card.level + 1}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <div className="level-bonus">
            Next: +{card.ppValue * (card.level + 1)} PP
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;