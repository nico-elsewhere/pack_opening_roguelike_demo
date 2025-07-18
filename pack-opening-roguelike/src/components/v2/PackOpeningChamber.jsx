import React, { useState, useEffect } from 'react';
import './PackOpeningChamber.css';

const PackOpeningChamber = ({ 
  stagedPacks, 
  packSlots, 
  onOpenPacks,
  isOpening,
  showConfirmButton,
  unstagePack,
  onClearBoard,
  showClear
}) => {
  const [animatingPacks, setAnimatingPacks] = useState([]);
  const [burstAnimation, setBurstAnimation] = useState(false);

  const handleOpenPacks = () => {
    if (stagedPacks.length === 0 || isOpening) return;
    
    // Start wiggle animation
    setAnimatingPacks(stagedPacks.map(p => p.id));
    
    // After wiggle, burst animation
    setTimeout(() => {
      setBurstAnimation(true);
      setTimeout(() => {
        onOpenPacks();
        setAnimatingPacks([]);
        setBurstAnimation(false);
      }, 500);
    }, 1000);
  };

  return (
    <div className="pack-opening-chamber">
      <div className="top-actions">
        {showClear ? (
          <button 
            className="clear-button"
            onClick={onClearBoard}
          >
            <span className="button-icon">🧹</span>
            <span className="button-text">Clear Board</span>
          </button>
        ) : (
          <button 
            className="confirm-open-button"
            onClick={handleOpenPacks}
            disabled={isOpening || stagedPacks.length === 0}
          >
            <span className="button-icon">⚡</span>
            <span className="button-text">Open {stagedPacks.length} Pack{stagedPacks.length !== 1 ? 's' : ''}</span>
          </button>
        )}
      </div>
      
      <div className="pack-slots-container">
        {[...Array(packSlots)].map((_, index) => (
          <div key={index} className="pack-slot">
            {stagedPacks[index] ? (
              <div 
                className={`staged-pack-visual ${
                  animatingPacks.includes(stagedPacks[index].id) ? 'wiggling' : ''
                } ${burstAnimation ? 'bursting' : ''}`}
                onClick={() => !isOpening && unstagePack && unstagePack(stagedPacks[index].id)}
              >
                <div className="pack-3d">
                  <div className="pack-face pack-front">
                    <span className="pack-symbol">✨</span>
                  </div>
                  <div className="pack-face pack-back">
                    <span className="pack-symbol">⚡</span>
                  </div>
                  <div className="pack-face pack-top"></div>
                  <div className="pack-face pack-bottom"></div>
                  <div className="pack-face pack-left"></div>
                  <div className="pack-face pack-right"></div>
                </div>
                {burstAnimation && (
                  <div className="burst-particles">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className={`particle particle-${i}`}></div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-pack-slot">
                <div className="slot-number">{index + 1}</div>
                <div className="slot-placeholder">Empty</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackOpeningChamber;