import React, { useState, useEffect } from 'react';
import './MementoPackView.css';

// Placeholder mementos for now
const PLACEHOLDER_MEMENTOS = [
  {
    id: 'shadows_embrace',
    name: "Shadow's Embrace",
    description: 'All cards score +3 PP in darkness',
    icon: '🌑',
    effect: { type: 'flat_bonus', value: 3, condition: 'darkness' }
  },
  {
    id: 'memory_fragment',
    name: 'Memory Fragment',
    description: 'First card each hand scores 2x',
    icon: '💭',
    effect: { type: 'position_multiplier', position: 0, multiplier: 2 }
  },
  {
    id: 'dream_echo',
    name: 'Dream Echo',
    description: 'Duplicate cards score +10 PP',
    icon: '🔮',
    effect: { type: 'duplicate_bonus', value: 10 }
  },
  {
    id: 'archetypes_gift',
    name: "Archetype's Gift",
    description: 'Random archetype bonus each dream',
    icon: '🎁',
    effect: { type: 'random_archetype_bonus' }
  },
  {
    id: 'temporal_shift',
    name: 'Temporal Shift',
    description: 'Cards can be rearranged after scoring',
    icon: '⏳',
    effect: { type: 'rearrange_after_score' }
  },
  {
    id: 'golden_ratio',
    name: 'Golden Ratio',
    description: 'Cards in positions 1, 2, 3 score +5, +8, +13',
    icon: '✨',
    effect: { type: 'position_bonus', bonuses: [5, 8, 13] }
  },
  {
    id: 'void_walker',
    name: 'Void Walker',
    description: 'Empty slots grant +15 PP each',
    icon: '🕳️',
    effect: { type: 'empty_slot_bonus', value: 15 }
  },
  {
    id: 'prismatic_lens',
    name: 'Prismatic Lens',
    description: 'All cards gain random suit bonus',
    icon: '🔷',
    effect: { type: 'random_suit_bonus' }
  }
];

const MementoPackView = ({ selectedArchetype, existingMementos, onComplete, onBack }) => {
  const [availableMementos, setAvailableMementos] = useState([]);
  const [selectedMemento, setSelectedMemento] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Filter out mementos the player already has
    const existingIds = existingMementos.map(m => m.id);
    const available = PLACEHOLDER_MEMENTOS.filter(m => !existingIds.includes(m.id));
    
    // Shuffle and pick 5
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    setAvailableMementos(shuffled.slice(0, Math.min(5, shuffled.length)));
  }, [existingMementos]);

  const handleMementoSelect = (memento) => {
    if (isAnimating || selectedMemento) return;

    setSelectedMemento(memento);
    setIsAnimating(true);

    // Animate and complete
    setTimeout(() => {
      onComplete({
        type: 'memento',
        memento: memento
      });
    }, 1500);
  };

  return (
    <div className="memento-pack-view">
      <div className="memento-pack-header">
        <button className="back-button" onClick={onBack} disabled={isAnimating}>
          ← Back
        </button>
        <h2>Memento Pack</h2>
        <p className="memento-pack-subtitle">Choose a powerful modifier for your run</p>
      </div>

      <div className="memento-cards-container">
        {availableMementos.map((memento, index) => {
          const isSelected = selectedMemento?.id === memento.id;

          return (
            <div
              key={memento.id}
              className={`memento-card ${isSelected ? 'selected' : ''} ${isAnimating && !isSelected ? 'fade-out' : ''}`}
              onClick={() => handleMementoSelect(memento)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="memento-glow" />
              <div className="memento-icon">{memento.icon}</div>
              <h3 className="memento-name">{memento.name}</h3>
              <p className="memento-description">{memento.description}</p>
              
              {isSelected && (
                <div className="memento-select-effect">
                  <div className="select-burst" />
                  <div className="select-text">CHOSEN</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {availableMementos.length === 0 && (
        <div className="no-mementos-message">
          <p>No new mementos available</p>
          <button onClick={onBack}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default MementoPackView;