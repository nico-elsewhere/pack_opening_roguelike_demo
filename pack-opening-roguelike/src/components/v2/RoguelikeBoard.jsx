import React, { useState, useEffect, useRef } from 'react';
import './RoguelikeBoard.css';
import Card from '../Card';
import DreamReward from './DreamReward';
import ArchetypeDialogue from './ArchetypeDialogue';
import TokenDisplay from './TokenDisplay';
import { isNightmare } from '../../utils/dreams';
import { shouldShuffleHand, getHandLimit } from '../../utils/dreamEffects';
import { calculateDynamicScores } from '../../utils/dynamicScoring';

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
  archetypeMementos,
  // Other state
  pp,
  collection,
  equippedRunes,
  setCurrentScreen,
  applyCardXP,
  setDreamScore,
  setGameMode,
  applyReward,
  setCollection,
  fuseCards,
  scoringSpeedMultiplier = 1.0
}) => {
  const [boardSlots, setBoardSlots] = useState([null, null, null, null, null]);
  const [isScoring, setIsScoring] = useState(false);
  const [scoringComplete, setScoringComplete] = useState(false);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFromBoard, setDraggedFromBoard] = useState(false);
  const [draggedBoardIndex, setDraggedBoardIndex] = useState(null);
  const [lastScoreGained, setLastScoreGained] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [showRewards, setShowRewards] = useState(false);
  const [completedDreamNumber, setCompletedDreamNumber] = useState(null);
  const [wasNightmareDream, setWasNightmareDream] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  
  // Scoring animation state
  const [scoringIndex, setScoringIndex] = useState(-1);
  const [cardScores, setCardScores] = useState({});
  const [cardScoreDetails, setCardScoreDetails] = useState({});
  const [runningTotal, setRunningTotal] = useState(0);
  const [showLoopineEffect, setShowLoopineEffect] = useState(false);
  const [loopineEffectIndex, setLoopineEffectIndex] = useState(-1);
  const [isLoopPass, setIsLoopPass] = useState(false);
  const scoringTimeoutRef = useRef(null);
  const countIntervalRef = useRef(null);
  
  // Token state
  const [tokens, setTokens] = useState({ strength: 0 });
  const [tokenAnimations, setTokenAnimations] = useState([]);
  const [showingMultiplier, setShowingMultiplier] = useState({});
  const [animatingScores, setAnimatingScores] = useState({}); // Track animated score values
  const [showingDreamEffect, setShowingDreamEffect] = useState({}); // Track dream effect display

  const isCurrentNightmare = isNightmare(currentDream);
  const remainingPacks = packsPerRoom - packsOpenedThisRoom;
  const boardIsFull = boardSlots.every(slot => slot !== null);
  const boardIsEmpty = boardSlots.every(slot => slot === null);

  const handleOpenPack = () => {
    if (remainingPacks <= 0 || hand.length > 0) return;
    openPackToHand();
  };

  const handleDragStart = (e, card, fromHand = true, boardIndex = null) => {
    setDraggedCard(card);
    setDraggedFromBoard(!fromHand);
    setDraggedBoardIndex(boardIndex);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnBoard = (e, slotIndex) => {
    e.preventDefault();
    if (!draggedCard) return;

    const newBoardSlots = [...boardSlots];
    
    if (draggedFromBoard && draggedBoardIndex !== null) {
      // Swapping between board slots
      const tempCard = newBoardSlots[slotIndex];
      newBoardSlots[slotIndex] = draggedCard;
      newBoardSlots[draggedBoardIndex] = tempCard;
    } else {
      // Playing from hand
      // If there's already a card in this slot, swap it back to hand
      if (newBoardSlots[slotIndex]) {
        setHand([...hand, newBoardSlots[slotIndex]]);
      } else {
        // Remove from hand
        setHand(hand.filter(c => c !== draggedCard));
      }
      newBoardSlots[slotIndex] = draggedCard;
    }

    setBoardSlots(newBoardSlots);
    setDraggedCard(null);
    setDraggedFromBoard(false);
    setDraggedBoardIndex(null);
  };

  const handleDropOnHand = (e) => {
    e.preventDefault();
    if (!draggedCard || !draggedFromBoard) return;

    // Return card from board to hand
    const newBoardSlots = [...boardSlots];
    newBoardSlots[draggedBoardIndex] = null;
    setBoardSlots(newBoardSlots);
    setHand([...hand, draggedCard]);
    
    setDraggedCard(null);
    setDraggedFromBoard(false);
    setDraggedBoardIndex(null);
  };

  const handleScoreHand = () => {
    if (!boardIsFull) return;
    
    console.log('Starting to score board:', boardSlots);
    
    // Start scoring sequence
    setIsScoring(true);
    setScoringIndex(-1);
    setCardScores({});
    setRunningTotal(0);
    
    // Start the scoring animation
    setTimeout(() => startScoringSequence(), 200); // Much faster
  };

  const startScoringSequence = () => {
    // Get only the actual cards from board slots
    const validCards = [];
    const cardIndices = [];
    let loopineIndex = -1;
    
    boardSlots.forEach((card, index) => {
      if (card) {
        validCards.push(card);
        cardIndices.push(index);
        // Check if this card is Loopine
        if (card.name === 'Loopine') {
          loopineIndex = validCards.length - 1; // Index in validCards array
        }
      }
    });
    
    console.log('Valid cards to score:', validCards);
    console.log('Card indices:', cardIndices);
    console.log('Loopine index:', loopineIndex);
    
    if (validCards.length === 0) {
      console.error('No cards to score!');
      handleScoringComplete(0);
      return;
    }
    
    let currentIndex = 0;
    let currentTotal = 0;
    let isLoopPass = false;
    const loopPassScores = {}; // Track additional scores from loop pass
    
    const scoreNext = () => {
      if (currentIndex < validCards.length) {
        const actualBoardIndex = cardIndices[currentIndex];
        console.log(`Scoring card ${currentIndex} (board slot ${actualBoardIndex})`, validCards[currentIndex]);
        setScoringIndex(actualBoardIndex);
        
        // Calculate scores for all revealed cards so far
        const revealedCards = validCards.slice(0, currentIndex + 1);
        const { scores, tokensGained } = calculateDynamicScores(
          revealedCards,
          validCards,
          equippedRunes || [],
          collection || {},
          dreamEffects,
          tokens,
          currentIndex // Pass the just revealed index
        );
        
        console.log('Calculated scores:', scores);
        console.log('Tokens gained:', tokensGained);
        
        // Get current card info
        const currentCardScore = scores[currentIndex];
        
        // Update all card scores - map from validCards index to board slot index
        const newScores = {};
        const newScoreDetails = {};
        scores.forEach((score, idx) => {
          const boardIndex = cardIndices[idx];
          newScoreDetails[boardIndex] = score;
          
          if (isLoopPass && idx >= loopineIndex) {
            // During loop pass, add to existing scores
            const baseScore = cardScores[boardIndex] || 0;
            const loopAddition = score.currentValue;
            loopPassScores[boardIndex] = loopAddition;
            newScores[boardIndex] = baseScore + loopAddition;
          } else if (!isLoopPass) {
            // For current card being revealed, always show base score first
            if (idx === currentIndex) {
              newScores[boardIndex] = score.baseValueBeforeEffects;
              // Track if we need animations
              if (score.dreamMultiplier || (score.tokenMultiplier > 1 && score.baseValueBeforeTokens !== score.currentValue)) {
                setAnimatingScores(prev => ({ ...prev, [boardIndex]: {
                  from: score.baseValueBeforeEffects,
                  to: score.currentValue,
                  current: score.baseValueBeforeEffects,
                  phases: {
                    dream: score.dreamMultiplier,
                    tokens: score.tokenMultiplier > 1 ? score.tokenMultiplier : null
                  }
                }}));
              }
            } else {
              newScores[boardIndex] = score.currentValue;
            }
          } else {
            // Keep existing score for cards before Loopine during loop pass
            newScores[boardIndex] = cardScores[boardIndex] || score.currentValue;
          }
        });
        setCardScores(newScores);
        setCardScoreDetails(newScoreDetails);
        
        // Calculate delays first
        const speedMult = 1 / scoringSpeedMultiplier;
        const baseDelay = 300 * speedMult; // Base delay for card reveal
        
        // Track total delay needed for all animations
        let totalAnimationDelay = baseDelay;
        
        // For cards with effects, we need to wait for the initial score to be visible
        // before starting any animations
        const hasEffects = currentCardScore && 
          ((currentCardScore.dreamMultiplier && currentCardScore.dreamMultiplier !== 1) || 
           (currentCardScore.dreamAddition && currentCardScore.dreamAddition !== 0) || 
           currentCardScore.tokenMultiplier > 1);
        if (hasEffects) {
          totalAnimationDelay += 200 * speedMult; // Extra delay to see base score first
        }
        
        // Animate scoring phases for current card
        if (currentCardScore && 
            ((currentCardScore.dreamMultiplier && currentCardScore.dreamMultiplier !== 1) || 
             (currentCardScore.dreamAddition && currentCardScore.dreamAddition !== 0) || 
             currentCardScore.tokenMultiplier > 1)) {
          const boardIndex = cardIndices[currentIndex];
          let phaseDelay = baseDelay + (200 * speedMult); // Start animations after base score is visible
          
          // Phase 1: Dream effects
          if ((currentCardScore.dreamMultiplier && currentCardScore.dreamMultiplier !== 1) || 
              (currentCardScore.dreamAddition && currentCardScore.dreamAddition !== 0)) {
            const dreamAnimDuration = 600 * speedMult;
            const dreamFadeDuration = 200 * speedMult;
            
            setTimeout(() => {
              setShowingDreamEffect(prev => ({ ...prev, [boardIndex]: true }));
              
              // Animate from base to after dream effect
              const from = currentCardScore.baseValueBeforeEffects;
              const to = currentCardScore.baseValueBeforeTokens;
              animateScore(boardIndex, from, to, dreamAnimDuration, () => {
                // Keep dream multiplier visible for a moment
                setTimeout(() => {
                  setShowingDreamEffect(prev => ({ ...prev, [boardIndex]: false }));
                }, dreamFadeDuration);
              });
            }, phaseDelay);
            
            // Add full animation time plus a small buffer
            phaseDelay += dreamAnimDuration + dreamFadeDuration + (100 * speedMult);
            totalAnimationDelay = phaseDelay;
          }
          
          // Phase 2: Token multipliers
          if (currentCardScore.tokenMultiplier > 1 && currentCardScore.baseValueBeforeTokens !== currentCardScore.currentValue) {
            const tokenAnimDuration = 800 * speedMult;
            const tokenFadeDuration = 200 * speedMult;
            
            setTimeout(() => {
              setShowingMultiplier(prev => ({ ...prev, [boardIndex]: true }));
              
              // Animate from after dream to final value
              const from = currentCardScore.baseValueBeforeTokens;
              const to = currentCardScore.currentValue;
              animateScore(boardIndex, from, to, tokenAnimDuration, () => {
                setTimeout(() => {
                  setShowingMultiplier(prev => ({ ...prev, [boardIndex]: false }));
                }, tokenFadeDuration);
              });
            }, phaseDelay);
            
            // Update total delay to include token animation
            totalAnimationDelay = phaseDelay + tokenAnimDuration + tokenFadeDuration + (100 * speedMult);
          }
        }
        
        // Helper function to animate score counting
        const animateScore = (boardIndex, from, to, duration, onComplete) => {
          const steps = 20;
          const stepDuration = duration / steps;
          const increment = (to - from) / steps;
          let step = 0;
          
          if (countIntervalRef.current) {
            clearInterval(countIntervalRef.current);
          }
          
          countIntervalRef.current = setInterval(() => {
            step++;
            if (step >= steps) {
              clearInterval(countIntervalRef.current);
              countIntervalRef.current = null;
              setCardScores(prev => ({ ...prev, [boardIndex]: to }));
              if (onComplete) onComplete();
            } else {
              const current = Math.floor(from + (increment * step));
              setCardScores(prev => ({ ...prev, [boardIndex]: current }));
            }
          }, stepDuration);
        };
        
        // Update running total
        if (isLoopPass) {
          // Add loop pass scores to existing total
          const loopAddition = Object.values(loopPassScores).reduce((sum, val) => sum + val, 0);
          setRunningTotal(currentTotal + loopAddition);
        } else {
          currentTotal = scores.reduce((sum, score) => sum + score.currentValue, 0);
          setRunningTotal(currentTotal);
        }
        console.log('Running total:', currentTotal);
        
        // Check if current card generated tokens
        const hasTokens = currentCardScore && currentCardScore.tokensGenerated && Object.keys(currentCardScore.tokensGenerated).length > 0;
        const hasMultiplier = currentCardScore && currentCardScore.tokenMultiplier > 1 && currentCardScore.baseValueBeforeTokens !== currentCardScore.currentValue;
        
        // Update token state immediately for the current card
        if (hasTokens && currentCardScore.wasJustRevealed) {
          // Get tokens generated by this specific card
          const thisCardTokens = currentCardScore.tokensGenerated;
          
          setTimeout(() => {
            // Update tokens state
            setTokens(prevTokens => {
              const newTokens = { ...prevTokens };
              for (const [tokenType, amount] of Object.entries(thisCardTokens)) {
                newTokens[tokenType] = (newTokens[tokenType] || 0) + amount;
              }
              return newTokens;
            });
            
            // Add token animation
            const boardIndex = cardIndices[currentIndex];
            setTokenAnimations(prev => [...prev, {
              id: Date.now(),
              boardIndex,
              tokens: thisCardTokens,
              timestamp: Date.now()
            }]);
          }, baseDelay); // Show tokens after initial score
        }
        
        // Use the longer of totalAnimationDelay or the base delays
        let totalDelay = Math.max(totalAnimationDelay, baseDelay);
        
        // Add token generation delay if needed
        if (hasTokens) {
          totalDelay += 600 * speedMult; // Extra delay for token generation animation
        }
        
        currentIndex++;
        scoringTimeoutRef.current = setTimeout(scoreNext, totalDelay);
      } else {
        // Check if we need to do a loop pass
        if (!isLoopPass && loopineIndex >= 0) {
          // Trigger Loopine's time loop effect
          isLoopPass = true;
          setIsLoopPass(true);
          currentIndex = loopineIndex;
          
          // Show Loopine ability animation
          const loopineBoardIndex = cardIndices[loopineIndex];
          setShowLoopineEffect(true);
          setLoopineEffectIndex(loopineBoardIndex);
          
          // Continue scoring from Loopine's position after animation
          const speedMult = 1 / scoringSpeedMultiplier;
          scoringTimeoutRef.current = setTimeout(() => {
            setShowLoopineEffect(false);
            scoreNext();
          }, 1500 * speedMult);
        } else {
          // Scoring complete
          const finalTotal = currentTotal + Object.values(loopPassScores).reduce((sum, val) => sum + val, 0);
          console.log('Scoring complete, total:', finalTotal);
          const speedMult = 1 / scoringSpeedMultiplier;
          setTimeout(() => {
            handleScoringComplete(finalTotal);
          }, 400 * speedMult);
        }
      }
    };
    
    scoreNext();
  };

  const handleScoringComplete = (totalScore) => {
    console.log('Scoring complete with total:', totalScore);
    const newDreamScore = dreamScore + totalScore;
    setDreamScore(newDreamScore);
    setLastScoreGained(totalScore);
    setScoringComplete(true);
    setIsScoring(false);
    setScoringIndex(-1);
    setIsLoopPass(false);
    
    // Apply XP to cards
    if (applyCardXP) {
      const cardIds = boardSlots.filter(card => card !== null).map(card => card.id);
      applyCardXP(cardIds);
    }

    // Show archetype dialogue
    setShowDialogue(true);
  };
  
  // Cleanup scoring timeout and intervals on unmount
  useEffect(() => {
    return () => {
      if (scoringTimeoutRef.current) {
        clearTimeout(scoringTimeoutRef.current);
      }
      if (countIntervalRef.current) {
        clearInterval(countIntervalRef.current);
      }
    };
  }, []);
  
  // Clean up old token animations
  useEffect(() => {
    const cleanupTimer = setInterval(() => {
      setTokenAnimations(prev => prev.filter(anim => Date.now() - anim.timestamp < 2000));
    }, 2000);
    
    return () => clearInterval(cleanupTimer);
  }, []);

  const handleContinue = () => {
    // Clear the board
    setBoardSlots([null, null, null, null, null]);
    setScoringComplete(false);
    setIsScoring(false);
    setTokens({ strength: 0 });
    setCardScoreDetails({});
    setTokenAnimations([]);
    setShowingMultiplier({});
    setAnimatingScores({});
    setShowingDreamEffect({});
    
    // Check if dream is already complete (reached threshold)
    if (dreamScore >= dreamThreshold) {
      // Show rewards screen
      setCompletedDreamNumber(currentDream);
      setWasNightmareDream(isCurrentNightmare);
      setShowRewards(true);
      return;
    }
    
    // Check if we can open more packs this dream
    if (remainingPacks > 0) {
      // Continue with current dream
      return;
    }
    
    // All packs used and didn't reach threshold - failed
    setCurrentScreen('home');
    setGameMode('classic');
  };

  const handleRewardSelected = (rewardData) => {
    if (rewardData.type === 'memento') {
      // Add memento to collection
      if (applyReward) {
        applyReward({ type: 'memento', reward: rewardData.memento });
      }
    } else if (rewardData.type === 'level') {
      // Level up selected card
      const newCollection = { ...collection };
      const cardId = rewardData.card.id;
      if (newCollection[cardId]) {
        newCollection[cardId].level = rewardData.newLevel;
        newCollection[cardId].xpToNextLevel = rewardData.newLevel * 100;
        newCollection[cardId].xp = 0;
      }
      setCollection(newCollection);
    } else if (rewardData.type === 'fusion') {
      // Fusion is already handled by fuseCards in FusionPackView
      // Just need to ensure the collection is updated
    }
  };

  const handleRewardContinue = () => {
    setShowRewards(false);
    startNewDream();
  };

  // console.log('RoguelikeBoard render - boardSlots:', boardSlots);
  // console.log('RoguelikeBoard render - isScoring:', isScoring, 'scoringIndex:', scoringIndex);

  return (
    <div className="roguelike-board-tcg">
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

      {/* Main Game Area */}
      <div className="tcg-game-area">
        {/* Archetype Display */}
        {selectedArchetype && (
          <div className="archetype-display-tcg">
            <div className="archetype-header">
              <span className="archetype-icon">{selectedArchetype.icon}</span>
              <span className="archetype-name">{selectedArchetype.name}</span>
            </div>
            <div className="archetype-power">
              {selectedArchetype.effect.description}
            </div>
            
            {/* Archetype Dialogue */}
            {showDialogue && scoringComplete && (
              <ArchetypeDialogue
                archetype={selectedArchetype}
                gameContext={{
                  lastScore: lastScoreGained,
                  boardSlots: boardSlots,
                  remainingPacks: remainingPacks,
                  dreamScore: dreamScore,
                  dreamThreshold: dreamThreshold,
                  isNightmare: isCurrentNightmare,
                  dreamEffects: dreamEffects,
                  archetypeMementos: archetypeMementos,
                  collection: collection,
                  dreamNumber: currentDream
                }}
                onComplete={() => setShowDialogue(false)}
              />
            )}
          </div>
        )}
        
        {isScoring && (
          <div className="scoring-overlay" />
        )}
        
        {/* Token Display */}
        <TokenDisplay tokens={tokens} isVisible={isScoring} />
        
        {/* Pack Status */}
        {!isScoring && !scoringComplete && (
          <div className="pack-status">
            <div className="packs-remaining">{remainingPacks} packs remaining</div>
            {hand.length === 0 && boardIsEmpty && remainingPacks > 0 && (
              <button 
                className="open-pack-btn-tcg"
                onClick={handleOpenPack}
              >
                Open Pack
              </button>
            )}
          </div>
        )}

        {/* Board Area - 5 Slots */}
        <div className={`board-area ${isScoring ? 'scoring' : ''} ${scoringComplete ? 'review-mode' : ''}`}>
          <div className="board-slots">
            {boardSlots.map((card, index) => (
              <div
                key={`board-slot-${index}`}
                className={`board-slot ${card ? 'occupied' : 'empty'} ${isScoring && index <= scoringIndex ? 'scoring' : ''} ${isLoopPass && isScoring ? 'loop-pass' : ''}`}
                onDragOver={!isScoring && !scoringComplete ? handleDragOver : undefined}
                onDrop={!isScoring && !scoringComplete ? (e) => handleDropOnBoard(e, index) : undefined}
              >
                {card ? (
                  <div
                    className="board-card"
                    draggable={!isScoring && !scoringComplete}
                    onDragStart={!isScoring && !scoringComplete ? (e) => handleDragStart(e, card, false, index) : undefined}
                  >
                    <Card card={card} showTooltip={true} showLevel={true} isRoguelikeMode={true} />
                    {(isScoring && index <= scoringIndex && cardScores[index] !== undefined) && (
                      <div className="card-score-overlay">
                        <span className={`score-value ${showingMultiplier[index] ? 'multiplying' : ''} ${showingDreamEffect[index] ? 'dream-multiplying' : ''}`}>
                          +{cardScores[index]}
                        </span>
                        {cardScoreDetails[index] && 
                         (cardScoreDetails[index].dreamMultiplier || cardScoreDetails[index].dreamAddition) && 
                         showingDreamEffect[index] && (
                          <span className={`dream-multiplier ${showingDreamEffect[index] ? 'active' : ''}`}>
                            {cardScoreDetails[index].isAdditiveDream ? 
                              `+${cardScoreDetails[index].dreamAddition}` : 
                              `×${cardScoreDetails[index].dreamMultiplier.toFixed(1)}`}
                          </span>
                        )}
                        {cardScoreDetails[index] && 
                         cardScoreDetails[index].tokenMultiplier > 1 && 
                         cardScoreDetails[index].baseValueBeforeTokens !== cardScoreDetails[index].currentValue && (
                          <span className={`score-multiplier ${showingMultiplier[index] ? 'active' : ''}`}>
                            ×{cardScoreDetails[index].tokenMultiplier}
                          </span>
                        )}
                      </div>
                    )}
                    {scoringComplete && cardScores[index] !== undefined && (
                      <div className="card-score-review">
                        <span className="score-value">+{cardScores[index]}</span>
                      </div>
                    )}
                    {showLoopineEffect && index === loopineEffectIndex && (
                      <div className="loopine-effect-overlay">
                        <div className="loopine-time-loop-text">Time Loop!</div>
                        <div className="loopine-ripple-effect"></div>
                      </div>
                    )}
                    {tokenAnimations.filter(anim => anim.boardIndex === index).map(anim => (
                      <div key={anim.id} className="token-gain-animation">
                        {Object.entries(anim.tokens).map(([tokenType, amount]) => (
                          <div key={tokenType} className="token-popup">
                            +{amount} {tokenType}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="slot-placeholder">
                    <span className="slot-number">{index + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {isScoring && (
            <div className="scoring-total">
              Total: <span className="total-value">+{runningTotal} PP</span>
            </div>
          )}
          
          {scoringComplete && (
            <div className="scoring-total review">
              Total: <span className="total-value">+{lastScoreGained} PP</span>
            </div>
          )}
          
          {boardIsFull && !isScoring && !scoringComplete && (
            <button 
              className="score-board-btn"
              onClick={handleScoreHand}
            >
              Score Board
            </button>
          )}
        </div>

        {/* Hand Area */}
        {!isScoring && !scoringComplete && (
          <div 
            className={`tcg-hand-area`}
            onDragOver={handleDragOver}
            onDrop={handleDropOnHand}
          >
            <div className="hand-container">
              {hand.map((card, index) => (
                <div
                  key={`hand-${index}`}
                  className={`tcg-hand-card ${hoveredCardIndex === index ? 'hovered' : ''}`}
                  style={{
                    '--card-index': index,
                    '--total-cards': hand.length,
                  }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card, true)}
                  onMouseEnter={() => setHoveredCardIndex(index)}
                  onMouseLeave={() => setHoveredCardIndex(null)}
                >
                  <Card card={card} showTooltip={true} showLevel={true} />
                </div>
              ))}
            </div>
            {hand.length === 0 && !boardIsEmpty && (
              <div className="hand-empty-hint">Play all cards to the board</div>
            )}
          </div>
        )}

        {/* Scoring Complete - Compact notification */}
        {scoringComplete && (
          <div className="score-notification">
            <div className="score-notification-content">
              <span className="score-gained-text">+{lastScoreGained} PP</span>
              <button className="continue-btn-compact" onClick={handleContinue}>
                {dreamScore >= dreamThreshold ? 'Next Dream' : (remainingPacks > 0 ? 'Next Hand' : 'End Run')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dream Reward Screen */}
      {showRewards && (
        <DreamReward
          dreamNumber={completedDreamNumber}
          wasNightmare={wasNightmareDream}
          selectedArchetype={selectedArchetype}
          collection={collection}
          archetypeMementos={archetypeMementos}
          onRewardSelected={handleRewardSelected}
          onContinue={handleRewardContinue}
          fuseCards={fuseCards}
          pp={pp}
          gameMode={gameMode}
        />
      )}
    </div>
  );
};

export default RoguelikeBoard;