import React, { useState } from 'react';
import './RoguelikeBoard.css';
import Card from '../Card';
import UnifiedPackOpening from './UnifiedPackOpening';
import { isNightmare } from '../../utils/dreams';
import { shouldShuffleHand, getHandLimit } from '../../utils/dreamEffects';

const RoguelikeBoard = ({
  // Game state
  gameMode,
  selectedArchetype,
  currentDream,
  dreamScore,
  dreamThreshold,
  dreamEffects,
  hand,
  setHand,
  packsPerRoom,
  packsOpenedThisRoom,
  openPackToHand,
  startNewDream,
  // Other state
  pp,
  collection,
  equippedRunes,
  setCurrentScreen,
  applyCardXP,
  setDreamScore
}) => {
  const [arrangedHand, setArrangedHand] = useState([]);
  const [isScoring, setIsScoring] = useState(false);
  const [scoringComplete, setScoringComplete] = useState(false);
  const [draggedCard, setDraggedCard] = useState(null);

  const isCurrentNightmare = isNightmare(currentDream);
  const remainingPacks = packsPerRoom - packsOpenedThisRoom;

  const handleOpenPack = () => {
    if (remainingPacks <= 0) return;
    openPackToHand();
  };

  const handleDragStart = (e, card, index) => {
    setDraggedCard({ card, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (!draggedCard) return;

    const newArranged = [...arrangedHand];
    const draggedCardData = draggedCard.card;

    // Remove from original position if it was already arranged
    const existingIndex = newArranged.findIndex(c => c.id === draggedCardData.id);
    if (existingIndex !== -1) {
      newArranged.splice(existingIndex, 1);
    }

    // Insert at new position
    newArranged.splice(dropIndex, 0, draggedCardData);
    setArrangedHand(newArranged);

    // Remove from hand if it was there
    setHand(hand.filter(c => c.id !== draggedCardData.id));
    
    setDraggedCard(null);
  };

  const handleRemoveFromArranged = (index) => {
    const card = arrangedHand[index];
    setArrangedHand(arrangedHand.filter((_, i) => i !== index));
    setHand([...hand, card]);
  };

  const handleScoreHand = () => {
    if (arrangedHand.length === 0) return;
    
    let finalHand = [...arrangedHand];
    
    // Apply hand limit if nightmare effect is active
    const handLimit = getHandLimit(dreamEffects);
    if (handLimit && finalHand.length > handLimit) {
      finalHand = finalHand.slice(0, handLimit);
    }
    
    // Apply shuffle if nightmare effect is active
    if (shouldShuffleHand(dreamEffects)) {
      finalHand = [...finalHand].sort(() => Math.random() - 0.5);
    }
    
    setArrangedHand(finalHand);
    setIsScoring(true);
    // The UnifiedPackOpening component will handle the scoring animation
  };

  const handleScoringComplete = (totalScore) => {
    setDreamScore(prev => prev + totalScore);
    setScoringComplete(true);
    setIsScoring(false);
    
    // Apply XP to cards
    if (applyCardXP) {
      const cardIds = arrangedHand.map(card => card.id);
      applyCardXP(cardIds);
    }
  };

  const handleContinue = () => {
    if (dreamScore >= dreamThreshold) {
      // Dream completed successfully
      startNewDream();
      setArrangedHand([]);
      setScoringComplete(false);
    } else {
      // Failed - game over or retry logic
      // For now, just reset
      setCurrentScreen('home');
    }
  };

  return (
    <div className="roguelike-board">
      {/* Dream Header */}
      <div className={`dream-header ${isCurrentNightmare ? 'nightmare' : 'dream'}`}>
        <div className="dream-info">
          <h2>{isCurrentNightmare ? 'Nightmare' : 'Dream'} {currentDream}</h2>
          <div className="dream-effect">
            {dreamEffects[0] && (
              <>
                <span className="effect-name">{dreamEffects[0].name}</span>
                <span className="effect-desc">{dreamEffects[0].description}</span>
              </>
            )}
          </div>
        </div>
        <div className="dream-progress">
          <div className="score-progress">
            <span className="current-score">{dreamScore}</span>
            <span className="score-divider">/</span>
            <span className="target-score">{dreamThreshold}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(100, (dreamScore / dreamThreshold) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Archetype Display */}
      {selectedArchetype && (
        <div className="archetype-display">
          <span className="archetype-icon">{selectedArchetype.icon}</span>
          <span className="archetype-name">{selectedArchetype.name}</span>
        </div>
      )}

      {/* Main Game Area */}
      {!isScoring && !scoringComplete && (
        <>
          {/* Pack Opening Area */}
          <div className="pack-area">
            <button 
              className="open-pack-btn"
              onClick={handleOpenPack}
              disabled={remainingPacks <= 0}
            >
              Open Pack ({remainingPacks} remaining)
            </button>
          </div>

          {/* Hand Area */}
          <div className="hand-area">
            <h3>Your Hand</h3>
            <div className="hand-cards">
              {hand.map((card, index) => (
                <div
                  key={card.id}
                  className="hand-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, card, index)}
                >
                  <Card card={card} showTooltip={true} showLevel={true} />
                </div>
              ))}
            </div>
          </div>

          {/* Arrangement Area */}
          <div className="arrangement-area">
            <h3>Arrange Your Cards</h3>
            <div className="arranged-cards">
              {[...arrangedHand, null].map((card, index) => (
                <div
                  key={index}
                  className={`arrangement-slot ${card ? 'filled' : 'empty'}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {card ? (
                    <div className="arranged-card">
                      <Card card={card} showTooltip={true} showLevel={true} />
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveFromArranged(index)}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="drop-hint">Drop here</div>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              className="score-hand-btn"
              onClick={handleScoreHand}
              disabled={arrangedHand.length === 0}
            >
              Score Hand
            </button>
          </div>
        </>
      )}

      {/* Scoring Animation */}
      {isScoring && (
        <UnifiedPackOpening
          stagedPacks={[{ name: 'Hand', icon: '✋' }]} // Dummy pack for UI
          packSlots={1}
          unstagePack={() => {}}
          onOpenPacks={() => {}}
          openedCards={arrangedHand}
          currentPackPPValues={[]}
          isOpening={true}
          onComplete={() => {}}
          totalPP={0}
          onPhaseChange={() => {}}
          collection={collection}
          equippedRunes={equippedRunes}
          applyCardXP={() => {}} // XP handled by parent
          onScoringComplete={handleScoringComplete}
          roguelikeMode={true}
          dreamEffects={dreamEffects}
        />
      )}

      {/* Dream Complete */}
      {scoringComplete && (
        <div className="dream-complete">
          <h2>{dreamScore >= dreamThreshold ? 'Dream Complete!' : 'Dream Failed'}</h2>
          <div className="final-score">
            Score: {dreamScore} / {dreamThreshold}
          </div>
          <button className="continue-btn" onClick={handleContinue}>
            {dreamScore >= dreamThreshold ? 'Next Dream' : 'Try Again'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoguelikeBoard;