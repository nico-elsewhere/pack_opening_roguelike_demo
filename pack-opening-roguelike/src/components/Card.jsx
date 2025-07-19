import React from 'react';
import './Card.css';

const suitSymbols = {
  fire: '🔥',
  earth: '⛰️',
  water: '💧',
  air: '🌪️',
  // Fusion suits
  magma: '🌋',
  steam: '💨',
  lightning: '⚡',
  mud: '🟫',
  dust: '🌪️',
  ice: '❄️'
};

const Card = ({ card, onClick, isEquipped = false, showLevel = true, showProgress = false, showTooltip = true, alwaysShowLevel = false }) => {
  const suitClass = card.suit; // fire, earth, water, or air
  const xpProgress = (card.xp / card.xpToNextLevel) * 100;
  
  // Determine card type
  const isTarot = card.arcana && (card.arcana === 'major' || card.arcana === 'minor');
  const isMajorArcana = card.arcana === 'major';
  const isFusedTarot = card.arcana && ['transcendent', 'empowered', 'enhanced-minor'].includes(card.arcana);
  const isCreature = card.arcana === 'creature';
  
  // Debug log
  if (!card.arcana) {
    console.log('Card missing arcana:', card);
  }
  
  // Get rarity color
  const getRarityColor = () => {
    switch(card.rarity) {
      case 'legendary': return '#ff8c00';
      case 'epic': return '#9400d3';
      case 'rare': return '#0080ff';
      case 'uncommon': return '#00ff00';
      default: return '#808080';
    }
  };
  
  const getRuneDescription = () => {
    if (!card.isRune || !card.effect) return '';
    
    // Use tarot card descriptions if available
    if (card.effect.description) {
      return card.effect.description;
    }
    
    // Fallback to old system for playing cards
    switch (card.effect.type) {
      case 'suit_bonus':
        return `${card.effect.suit} cards +${Math.round((card.effect.multiplier - 1) * 100)}% PP`;
      case 'pp_generation':
        return `+${card.effect.bonusPP.toFixed(1)} PP/sec`;
      case 'suit_count_mult':
        return `${card.effect.suit} cards +${Math.round(card.effect.multiplierPerCard * 100)}% per ${card.effect.suit}`;
      case 'suit_chance':
        return `+${Math.round(card.effect.chanceBonus * 100)}% ${card.effect.suit} chance`;
      default:
        return 'Unknown effect';
    }
  };
  
  return (
    <div className="card-container">
      <div 
        className={`card ${card.isRune ? 'rune' : ''} ${isEquipped ? 'equipped' : ''} ${isTarot ? 'tarot' : ''} ${isMajorArcana ? 'major-arcana' : ''} ${isFusedTarot ? 'fused-tarot' : ''} ${isCreature ? 'creature' : ''}`}
        onClick={() => onClick && onClick(card)}
        style={{ 
          cursor: onClick ? 'pointer' : 'default',
          borderColor: card.rarity ? getRarityColor() : undefined,
          borderWidth: card.rarity && card.rarity !== 'common' ? '3px' : undefined
        }}
      >
        {isEquipped && <div className="equipped-indicator">EQUIPPED</div>}
        
        <div className="card-top">
          {isCreature ? (
            <>
              <span></span>
              <span></span>
            </>
          ) : isTarot || isFusedTarot ? (
            <>
              {!isFusedTarot ? (
                <span className="tarot-number">{card.number !== undefined ? card.number : card.rankValue}</span>
              ) : (
                <span></span>
              )}
              {card.rarity && <span className="rarity-indicator" style={{ color: getRarityColor() }}>{card.rarity.toUpperCase()}</span>}
            </>
          ) : (
            <>
              <span className={`rank ${suitClass}`}>{card.rank}</span>
              <span className={`suit ${suitClass}`}>{suitSymbols[card.suit]}</span>
            </>
          )}
        </div>
        
        <div className="card-center">
          {isCreature ? (
            <>
              <div className="creature-name">{card.name}</div>
              {card.imageUrl ? (
                <img className="creature-image" src={card.imageUrl} alt={card.name} />
              ) : (
                <div className="creature-placeholder">🐾</div>
              )}
            </>
          ) : isTarot || isFusedTarot ? (
            <>
              <div className="tarot-name">{card.name}</div>
              {card.symbol && <div className="large-suit">{card.symbol}</div>}
              {card.isRune && <div className="rune-indicator">EFFECT</div>}
            </>
          ) : (
            <>
              {card.isRune && <div className="rune-indicator">RUNE</div>}
              <div className={`large-suit ${suitClass}`}>{suitSymbols[card.suit]}</div>
            </>
          )}
        </div>
        
        <div className="card-bottom">
          <div className="pp-value">+{card.ppValue * (card.level || 1)} PP</div>
          {showLevel && (alwaysShowLevel || (card.level || 1) > 1) && <div className="level">Lv.{card.level || 1}</div>}
        </div>
        
        {showTooltip && (
          <>
            {card.isRune && (
              <div className="rune-tooltip">
                {getRuneDescription()}
              </div>
            )}
          </>
        )}
      </div>
      
      {showProgress && (
        <div className="card-progress">
          <div className="progress-info">
            <span className="current-level">Lv.{card.level || 1}</span>
            <span className="xp-text">{card.xp}/{card.xpToNextLevel} XP</span>
            <span className="next-level">Lv.{(card.level || 1) + 1}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <div className="level-bonus">
            Next: +{card.ppValue * ((card.level || 1) + 1)} PP
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;