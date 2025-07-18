import React, { useState } from 'react';
import './MobilePackBar.css';
import PackSelectionModal from './PackSelectionModal';

const MobilePackBar = ({ 
  ownedPacks, 
  packTypes, 
  selectedPackType,
  onSelectPackType,
  stagePack,
  canStagePack
}) => {
  const [showPackModal, setShowPackModal] = useState(false);
  
  const currentPackType = packTypes?.find(p => p.id === selectedPackType) || packTypes?.[0];

  return (
    <>
      <div className="mobile-pack-bar">
        <div className="pack-info">
          <div className="pack-count-section">
            <span className="pack-label">Packs:</span>
            <span className="pack-count">{ownedPacks}</span>
          </div>
          <div className="pack-type-display">
            <span className="current-pack-icon">{currentPackType?.icon || '📦'}</span>
            <span className="current-pack-name">{currentPackType?.name || 'Basic'}</span>
          </div>
        </div>
        
        <div className="pack-actions">
          <button 
            className="pack-select-btn"
            onClick={() => setShowPackModal(true)}
          >
            Select Type
          </button>
          <button 
            className="add-pack-btn"
            onClick={stagePack}
            disabled={!canStagePack || ownedPacks === 0}
          >
            <span className="add-icon">+</span>
            Add Pack
          </button>
        </div>
      </div>
      
      <PackSelectionModal
        isOpen={showPackModal}
        onClose={() => setShowPackModal(false)}
        packTypes={packTypes || []}
        onSelectPack={(packType) => {
          onSelectPackType(packType);
          setShowPackModal(false);
        }}
      />
    </>
  );
};

export default MobilePackBar;