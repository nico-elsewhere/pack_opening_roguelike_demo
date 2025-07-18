import React, { useState } from 'react';
import './PackSelectionModal.css';

const PackSelectionModal = ({ isOpen, onClose, packTypes, onSelectPack }) => {
  const [selectedPackType, setSelectedPackType] = useState(null);

  if (!isOpen) return null;

  const handlePackSelect = (packType) => {
    setSelectedPackType(packType);
    onSelectPack(packType);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Select Pack Type</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="pack-types-grid">
          {packTypes.map((packType) => (
            <div
              key={packType.id}
              className={`pack-type-card ${packType.unlocked ? 'unlocked' : 'locked'} ${selectedPackType?.id === packType.id ? 'selected' : ''}`}
              onClick={() => packType.unlocked && handlePackSelect(packType)}
            >
              <div className="pack-icon">
                {packType.icon || '📦'}
              </div>
              <h3 className="pack-name">{packType.name}</h3>
              <p className="pack-description">{packType.description}</p>
              {packType.unlocked ? (
                <div className="pack-stats">
                  <div className="stat">
                    <span className="stat-label">Cards:</span>
                    <span className="stat-value">{packType.cardsPerPack}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Rarity:</span>
                    <span className="stat-value">{packType.rarityBonus}%</span>
                  </div>
                </div>
              ) : (
                <div className="locked-overlay">
                  <span className="lock-icon">🔒</span>
                  <p className="unlock-requirement">{packType.unlockRequirement}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackSelectionModal;