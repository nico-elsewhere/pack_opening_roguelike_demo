import React from 'react';
import './PackToolbar.css';

const PackToolbar = ({ 
  packTypes, 
  pp, 
  onBuyPack,
  isOpening,
  canOpenPacks,
  currentPhase
}) => {
  const handlePackClick = (packType) => {
    const canAfford = pp >= packType.cost;
    const isPurchaseDisabled = (currentPhase === 'scoring') || (isOpening && currentPhase !== 'complete');
    
    // Allow purchase if we can afford it and we're either in ready phase or complete phase
    if (canAfford && !isPurchaseDisabled && (canOpenPacks || currentPhase === 'complete')) {
      onBuyPack(packType);
    }
  };

  return (
    <div className="pack-toolbar">
      <div className="pack-buttons">
        {packTypes.map(packType => {
          const canAfford = pp >= packType.cost;
          const isPurchaseDisabled = (currentPhase === 'scoring') || (isOpening && currentPhase !== 'complete');
          const isDisabled = !canAfford || isPurchaseDisabled || (!canOpenPacks && currentPhase !== 'complete');
          
          return (
            <button
              key={packType.id}
              className={`pack-button ${!canAfford ? 'unaffordable' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => handlePackClick(packType)}
              disabled={isDisabled}
            >
              <div className="pack-icon">{packType.icon}</div>
              <div className="pack-name">{packType.name}</div>
              <div className="pack-cost">{packType.cost} PP</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PackToolbar;