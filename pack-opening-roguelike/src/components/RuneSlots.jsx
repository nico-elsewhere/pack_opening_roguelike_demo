import React from 'react';
import Card from './Card';

const RuneSlots = ({ equippedRunes, maxSlots = 3 }) => {
  return (
    <div className="rune-slots">
      <h3>Equipped Runes</h3>
      <div className="rune-grid">
        {[...Array(maxSlots)].map((_, index) => (
          <div key={index} className="rune-slot">
            {equippedRunes[index] ? (
              <div className="equipped-rune">
                <Card card={equippedRunes[index]} isEquipped={true} />
                <div className="rune-effect">
                  {formatRuneEffect(equippedRunes[index].effect)}
                </div>
              </div>
            ) : (
              <div className="empty-slot">Empty Slot</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const formatRuneEffect = (effect) => {
  switch (effect.type) {
    case 'suit_bonus':
      return `${effect.suit} cards +${Math.round((effect.multiplier - 1) * 100)}% PP`;
    case 'pp_generation':
      return `+${effect.bonusPP.toFixed(1)} PP/sec`;
    case 'suit_count_mult':
      return `${effect.suit} cards +${Math.round(effect.multiplierPerCard * 100)}% per ${effect.suit}`;
    case 'suit_chance':
      return `+${Math.round(effect.chanceBonus * 100)}% ${effect.suit} chance`;
    default:
      return 'Unknown effect';
  }
};

export default RuneSlots;