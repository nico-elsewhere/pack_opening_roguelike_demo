import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import Card from '../Card';
import MobilePackBar from './MobilePackBar';
import CardRevealGrid from './CardRevealGrid';
import PackOpeningChamber from './PackOpeningChamber';

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
  currentPackPPValues,
  packTypes,
  selectedPackType,
  selectPackType
}) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedCards, setRevealedCards] = useState([]);
  const [totalPP, setTotalPP] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showPackChamber, setShowPackChamber] = useState(true);
  const [chamberAnimating, setChamberAnimating] = useState(false);

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
    
    // Start chamber animation
    setChamberAnimating(true);
    
    // After pack burst animation, transition to card reveal
    setTimeout(() => {
      const result = openAllStagedPacks();
      if (result) {
        setShowPackChamber(false);
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
      setChamberAnimating(false);
    }, 1500); // Wait for wiggle + burst animations
  };

  const handleClearBoard = () => {
    clearOpenedCards();
    setRevealedCards([]);
    setShowResults(false);
    setTotalPP(0);
    setShowPackChamber(true);
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
        <div className={`chamber-view ${!showPackChamber ? 'hidden' : ''}`}>
          <PackOpeningChamber
            stagedPacks={stagedPacks}
            packSlots={packSlots}
            onOpenPacks={handleOpenPacks}
            isOpening={chamberAnimating}
            showConfirmButton={true}
            unstagePack={unstagePack}
            onClearBoard={handleClearBoard}
            showClear={showResults}
          />
        </div>
        <div className={`reveal-view ${showPackChamber ? 'hidden' : ''}`}>
          <CardRevealGrid
            openedCards={openedCards}
            revealedCards={revealedCards}
            currentPackPPValues={currentPackPPValues}
            isRevealing={isRevealing}
            showResults={showResults}
          />
        </div>
      </div>
      
      <div className="controls-area">
        <MobilePackBar
          ownedPacks={ownedPacks}
          packTypes={packTypes}
          selectedPackType={selectedPackType}
          onSelectPackType={selectPackType}
          stagePack={stagePack}
          canStagePack={stagedPacks.length < packSlots && !isRevealing && !showResults}
        />
      </div>
    </div>
  );
};

export default GameBoard;