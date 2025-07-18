import React from 'react';
import './PackToolbar.css';

const PackToolbar = ({ 
  packTypes, 
  pp, 
  onBuyPack,
  isOpening,
  canOpenPacks
}) => {
  const handlePackClick = (packType) => {
    if (pp >= packType.cost && !isOpening && canOpenPacks) {
      onBuyPack(packType);
    }
  };

  return (
    <div className="pack-toolbar">
      <div className="pack-buttons">
        {packTypes.map(packType => {
          const canAfford = pp >= packType.cost;
          const isDisabled = !canAfford || isOpening || !canOpenPacks;
          
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