import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import PackToolbar from './PackToolbar';
import UnifiedPackOpening from './UnifiedPackOpening';
import RoguelikeBoard from './RoguelikeBoard';

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
  totalCardsOpened,
  collection,
  equippedRunes,
  applyCardXP,
  // Roguelike mode props
  gameMode,
  setCurrentScreen,
  ...roguelikeProps
}) => {
  // If in roguelike mode, render the roguelike board
  if (gameMode === 'roguelike') {
    return (
      <RoguelikeBoard
        gameMode={gameMode}
        pp={pp}
        collection={collection}
        equippedRunes={equippedRunes}
        setCurrentScreen={setCurrentScreen}
        applyCardXP={applyCardXP}
        {...roguelikeProps}
      />
    );
  }
  
  // Classic mode below
  const [isOpening, setIsOpening] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [totalPP, setTotalPP] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('ready');

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

  const handlePhaseChange = (phase) => {
    setCurrentPhase(phase);
  };

  const handleBuyPack = (packType) => {
    // If we're in complete phase, act like continue button and add pack
    if (currentPhase === 'complete') {
      // Add pack first before clearing cards
      buyAndStagePack(packType);
      
      // Then clear opened cards
      clearOpenedCards();
      setIsOpening(false);
      setTotalPP(0);
    } else {
      buyAndStagePack(packType);
    }
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
        onPhaseChange={handlePhaseChange}
        collection={collection}
        equippedRunes={equippedRunes}
        applyCardXP={applyCardXP}
      />
      
      <PackToolbar
        packTypes={packTypes}
        pp={pp}
        onBuyPack={handleBuyPack}
        isOpening={isOpening}
        canOpenPacks={stagedPacks.length < packSlots}
        currentPhase={currentPhase}
      />
    </div>
  );
};

export default GameBoard;