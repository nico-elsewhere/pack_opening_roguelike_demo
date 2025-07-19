import React from 'react';
import './PackRewardSelect.css';

const PACK_TYPES = [
  {
    id: 'level',
    name: 'Level Pack',
    icon: '⬆️',
    description: 'Choose a card to instantly level up',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
  },
  {
    id: 'fusion',
    name: 'Fusion Pack',
    icon: '🔮',
    description: 'Fuse two cards into a powerful new form',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
  },
  {
    id: 'memento',
    name: 'Memento Pack',
    icon: '✨',
    description: 'Gain a powerful run modifier',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
  }
];

const PackRewardSelect = ({ dreamNumber, wasNightmare, onPackSelect }) => {
  return (
    <div className="pack-reward-select">
      <div className="pack-select-header">
        <h2 className="pack-select-title">
          {wasNightmare ? 'Nightmare Conquered!' : `Dream ${dreamNumber} Complete!`}
        </h2>
        <p className="pack-select-subtitle">Choose your reward pack</p>
      </div>

      <div className="pack-options">
        {PACK_TYPES.map((pack, index) => (
          <div
            key={pack.id}
            className="pack-option"
            onClick={() => onPackSelect(pack.id)}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="pack-card" style={{ background: pack.gradient }}>
              <div className="pack-glow" />
              <div className="pack-icon">{pack.icon}</div>
              <h3 className="pack-name">{pack.name}</h3>
              <p className="pack-description">{pack.description}</p>
              <div className="pack-shine" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackRewardSelect;