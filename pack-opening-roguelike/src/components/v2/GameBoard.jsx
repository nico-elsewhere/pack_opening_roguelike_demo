import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import Card from '../Card';
import PackStagingDock from './PackStagingDock';
import CardRevealGrid from './CardRevealGrid';

const GameBoard = ({
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
      // Space, Enter, or E to open packs
      if ((e.key === ' ' || e.key === 'Enter' || e.key === 'e') && !isRevealing && !showResults) {
        e.preventDefault();
        handleOpenPacks();
      }
      
      // Number keys 1-9 to stage packs
      if (e.key >= '1' && e.key <= '9' && !isRevealing && !showResults) {
        const num = parseInt(e.key);
        const availableSlots = packSlots - stagedPacks.length;
        const packsToStage = Math.min(num, availableSlots, ownedPacks);
        
        for (let i = 0; i < packsToStage; i++) {
          stagePack();
        }
      }
      
      // C to clear board
      if (e.key === 'c' && showResults) {
        handleClearBoard();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stagedPacks, packSlots, ownedPacks, isRevealing, showResults, stagePack]);

  const handleOpenPacks = () => {
    if (stagedPacks.length === 0 || isRevealing || showResults) return;
    
    const result = openAllStagedPacks();
    if (result) {
      setIsRevealing(true);
      setRevealedCards([]);
      setTotalPP(0);
      
      // Reveal cards sequentially
      result.cards.forEach((card, index) => {
        setTimeout(() => {
          setRevealedCards(prev => [...prev, index]);
          setTotalPP(prev => prev + result.ppValues[index]);
          
          if (index === result.cards.length - 1) {
            setTimeout(() => {
              setIsRevealing(false);
              setShowResults(true);
            }, 500);
          }
        }, index * 150); // 150ms between each card
      });
    }
  };

  const handleClearBoard = () => {
    clearOpenedCards();
    setRevealedCards([]);
    setShowResults(false);
    setTotalPP(0);
  };

  return (
    <div className="game-board">
      <div className="board-header">
        <h1 className="board-title">Pack Opening Chamber</h1>
        {showResults && (
          <div className="results-summary glass">
            <span className="total-label">Total Gained:</span>
            <span className="total-pp">+{totalPP} PP</span>
          </div>
        )}
      </div>
      
      <div className="play-area">
        <CardRevealGrid
          openedCards={openedCards}
          revealedCards={revealedCards}
          currentPackPPValues={currentPackPPValues}
          isRevealing={isRevealing}
          showResults={showResults}
        />
      </div>
      
      <div className="controls-area">
        <PackStagingDock
          ownedPacks={ownedPacks}
          stagedPacks={stagedPacks}
          stagePack={stagePack}
          unstagePack={unstagePack}
          packSlots={packSlots}
          onOpenPacks={handleOpenPacks}
          onClearBoard={handleClearBoard}
          canOpen={stagedPacks.length > 0 && !isRevealing && !showResults}
          showClear={showResults}
        />
      </div>
    </div>
  );
};

export default GameBoard;