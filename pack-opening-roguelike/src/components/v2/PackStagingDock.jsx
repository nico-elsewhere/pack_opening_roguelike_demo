import React, { useState } from 'react';
import './PackStagingDock.css';
import PackSelectionModal from './PackSelectionModal';

const PackStagingDock = ({
  ownedPacks,
  stagedPacks,
  stagePack,
  unstagePack,
  packSlots,
  onOpenPacks,
  onClearBoard,
  canOpen,
  showClear,
  packTypes,
  onSelectPackType
}) => {
  const [showPackModal, setShowPackModal] = useState(false);
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (stagedPacks.length < packSlots) {
      stagePack();
    }
  };

  return (
    <>
      <div className="pack-staging-dock glass">
      <div className="dock-left">
        <div className="pack-inventory">
          <h3 className="inventory-title">Your Packs</h3>
          <div className="pack-count">{ownedPacks}</div>
          <div className="pack-stack">
            {[...Array(Math.min(3, ownedPacks))].map((_, i) => (
              <div 
                key={i} 
                className="inventory-pack"
                style={{ transform: `translateY(${i * -2}px)` }}
              >
                <div className="pack-mini">
                  <div className="pack-symbol">✦</div>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="pack-select-btn"
            onClick={() => setShowPackModal(true)}
          >
            Select Pack Type
          </button>
        </div>
      </div>

      <div className="dock-center">
        <div className="staging-area">
          <h3 className="staging-title">Stage Packs Here</h3>
          <div 
            className="staging-slots"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {[...Array(packSlots)].map((_, index) => (
              <div key={index} className="staging-slot">
                {stagedPacks[index] ? (
                  <div 
                    className="staged-pack"
                    onClick={() => unstagePack(stagedPacks[index].id)}
                  >
                    <div className="pack-card">
                      <div className="pack-back">
                        <div className="pack-symbol">✦</div>
                      </div>
                    </div>
                    <div className="remove-hint">×</div>
                  </div>
                ) : (
                  <div className="empty-slot" onClick={stagePack}>
                    <span className="slot-number">{index + 1}</span>
                    <span className="slot-plus">+</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="staging-hints">
            <span className="hint">Press 1-9 to stage packs</span>
            <span className="hint">• Click + to add</span>
            <span className="hint">• Click pack to remove</span>
          </div>
        </div>
      </div>

      <div className="dock-right">
        <div className="action-buttons">
          {!showClear ? (
            <button 
              className={`action-btn open-btn ${canOpen ? 'ready' : ''}`}
              onClick={onOpenPacks}
              disabled={!canOpen}
            >
              <span className="btn-icon">⚡</span>
              <span className="btn-text">Open Packs</span>
              <span className="btn-hint">Space</span>
            </button>
          ) : (
            <button 
              className="action-btn clear-btn"
              onClick={onClearBoard}
            >
              <span className="btn-icon">🧹</span>
              <span className="btn-text">Clear Board</span>
              <span className="btn-hint">C</span>
            </button>
          )}
        </div>
      </div>
      </div>
      
      <PackSelectionModal
        isOpen={showPackModal}
        onClose={() => setShowPackModal(false)}
        packTypes={packTypes || []}
        onSelectPack={onSelectPackType}
      />
    </>
  );
};

export default PackStagingDock;