import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import PackToolbar from './PackToolbar';
import UnifiedPackOpening from './UnifiedPackOpening';

const GameBoard = ({
  pp,
  stagedPacks,
  buyAndStagePack,
  unstagePack,
  openAllStagedPacks,
  openedCards,
  clearOpenedCards,
  packSlots,
  currentPackPPValues,
  packTypes,
  totalCardsOpened
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [totalPP, setTotalPP] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Space, Enter, or E to open packs
      if ((e.key === ' ' || e.key === 'Enter' || e.key === 'e') && !isOpening && stagedPacks.length > 0) {
        e.preventDefault();
        handleOpenPacks();
      }
      
      // C to clear/continue
      if (e.key === 'c' && openedCards.length > 0) {
        handleComplete();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stagedPacks, isOpening, openedCards]);

  const handleOpenPacks = () => {
    if (stagedPacks.length === 0 || isOpening) return;
    
    setIsOpening(true);
    
    // Trigger screen shake when packs explode
    setTimeout(() => {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);
    }, 1000); // Time it with pack explosion
  };

  const handlePacksOpened = () => {
    const result = openAllStagedPacks();
    if (result) {
      setTotalPP(result.totalPPGained);
    }
  };

  const handleComplete = () => {
    clearOpenedCards();
    setIsOpening(false);
    setTotalPP(0);
  };

  return (
    <div className={`game-board ${screenShake ? 'screen-shake' : ''}`}>
      <UnifiedPackOpening
        stagedPacks={stagedPacks}
        packSlots={packSlots}
        unstagePack={unstagePack}
        onOpenPacks={handlePacksOpened}
        openedCards={openedCards}
        currentPackPPValues={currentPackPPValues}
        isOpening={isOpening}
        onComplete={handleComplete}
        totalPP={totalPP}
      />
      
      <PackToolbar
        packTypes={packTypes}
        pp={pp}
        onBuyPack={buyAndStagePack}
        isOpening={isOpening}
        canOpenPacks={stagedPacks.length < packSlots}
      />
    </div>
  );
};

export default GameBoard;