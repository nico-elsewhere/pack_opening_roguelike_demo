import React, { useState, useEffect } from 'react';
import Card from './Card';
import './PackOpeningArea.css';

const PackOpeningArea = ({ 
  ownedPacks, 
  stagedPacks, 
  stagePack, 
  unstagePack, 
  openAllStagedPacks,
  openedCards,
  clearOpenedCards,
  packSlots,
  equippedRunes,
  currentPackPPValues
}) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedCards, setRevealedCards] = useState([]);
  const [totalPP, setTotalPP] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'e') {
        e.preventDefault();
        handleOpenPacks();
      }
      // Number keys to stage packs
      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key);
        for (let i = 0; i < num && i < packSlots - stagedPacks.length; i++) {
          stagePack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stagedPacks, stagePack, packSlots]);

  const handleOpenPacks = () => {
    if (stagedPacks.length === 0 || isRevealing || showResults) return;
    
    const result = openAllStagedPacks();
    if (result) {
      setIsRevealing(true);
      setRevealedCards([]);
      
      // Reveal cards one by one
      result.cards.forEach((card, index) => {
        setTimeout(() => {
          setRevealedCards(prev => [...prev, index]);
          if (index === result.cards.length - 1) {
            setIsRevealing(false);
            setShowResults(true);
            setTotalPP(result.totalPPGained);
          }
        }, index * 200); // 200ms between each card
      });
    }
  };

  const handleClearBoard = () => {
    clearOpenedCards();
    setRevealedCards([]);
    setShowResults(false);
    setTotalPP(0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    stagePack();
  };

  return (
    <div className="pack-opening-area">
      <div className="left-section">
        <div className="area-header">
          <h2>Pack Opening Chamber</h2>
        </div>
        
        <div 
          className="staging-area"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="staged-packs">
            {stagedPacks.map((pack) => (
              <div 
                key={pack.id}
                className="staged-pack"
                onClick={() => unstagePack(pack.id)}
              >
                <div className="pack-card-back">
                  <div className="pack-design">
                    <div className="mystic-symbol">✦</div>
                  </div>
                </div>
              </div>
            ))}
            {stagedPacks.length < packSlots && (
              <div className="pack-slot-empty" onClick={stagePack}>
                <span>+</span>
                <span className="slot-hint">Click or drag pack here</span>
              </div>
            )}
          </div>
          {stagedPacks.length === 0 && (
            <div className="empty-board-message">
              <p>Drag packs here or press 1-9 to stage packs</p>
              <p>Press Space to open all staged packs</p>
            </div>
          )}
        </div>
        
        <div className="area-controls">
          <button 
            className="open-button"
            onClick={handleOpenPacks}
            disabled={stagedPacks.length === 0 || isRevealing || showResults}
          >
            Open Packs (Space)
          </button>
          {showResults && (
            <button 
              className="clear-button"
              onClick={handleClearBoard}
            >
              Clear Board
            </button>
          )}
        </div>
        
        <div className="pack-toolbar">
          <div className="toolbar-label">Your Packs ({ownedPacks})</div>
          <div className="pack-buttons">
            {[...Array(Math.min(ownedPacks, 9))].map((_, i) => (
              <button
                key={i}
                className="pack-button"
                onClick={stagePack}
                disabled={stagedPacks.length >= packSlots}
              >
                <div className="mini-pack">✦</div>
                <span className="pack-number">{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="right-section">

        {openedCards.length > 0 && (
          <>
            <div className="revealed-cards-grid">
              {openedCards.map((card, index) => (
                <div 
                  key={`${card.id}-${index}`}
                  className={`card-slot ${revealedCards.includes(index) ? 'revealed' : ''}`}
                >
                  {revealedCards.includes(index) ? (
                    <div className="card-with-pp">
                      <Card card={card} showTooltip={false} />
                      <div className="pp-gained">+{currentPackPPValues[index]} PP</div>
                    </div>
                  ) : (
                    <div className="card-back">
                      <div className="card-back-design">?</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {showResults && (
              <div className="results-overlay">
                <div className="total-score">
                  Total: +{totalPP} PP
                </div>
              </div>
            )}
          </>
        )}
        
        {openedCards.length === 0 && (
          <div className="empty-card-area">
            <p>Cards will appear here when opened</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackOpeningArea;