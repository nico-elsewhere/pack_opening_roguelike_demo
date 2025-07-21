import React, { useState, useEffect, useRef } from 'react';
import './RoguelikeBoard.css';
import Card from '../Card';
import DreamReward from './DreamReward';
import ArchetypeDialogue from './ArchetypeDialogue';
import TokenDisplay from './TokenDisplay';
import { isNightmare } from '../../utils/dreams';
import { shouldShuffleHand, getHandLimit } from '../../utils/dreamEffects';
import { calculateDynamicScores } from '../../utils/dynamicScoring';
import { getCreatureAbilityText, CREATURE_EFFECTS } from '../../utils/creatureEffects';

// Token emoji mapping
const TOKEN_EMOJIS = {
  fire: '🔥',
  water: '💧',
  earth: '🌍',
  shadow: '🌑',
  light: '✨',
  chaos: '🎲',
  arcane: '🔮'
};

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
  scoringSpeedMultiplier = 1.0,
  debugScenario,
  setDebugScenario
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
  const [previewBonuses, setPreviewBonuses] = useState({});
  const [completedDreamNumber, setCompletedDreamNumber] = useState(null);
  const [wasNightmareDream, setWasNightmareDream] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  const [discardedCards, setDiscardedCards] = useState([]);
  
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
  const [tokens, setTokens] = useState({});
  const [tokenAnimations, setTokenAnimations] = useState([]);
  const [showingMultiplier, setShowingMultiplier] = useState({});
  const [animatingScores, setAnimatingScores] = useState({}); // Track animated score values
  const [showingDreamEffect, setShowingDreamEffect] = useState({}); // Track dream effect display
  const [showingLightShadow, setShowingLightShadow] = useState({}); // Track light/shadow modifier display
  const [debugExpectedResults, setDebugExpectedResults] = useState(null); // Debug: expected results
  const [isScoringTokens, setIsScoringTokens] = useState(false);
  const [scoringTokenType, setScoringTokenType] = useState(null);
  const [tokenScores, setTokenScores] = useState({});

  const isCurrentNightmare = isNightmare(currentDream);
  const remainingPacks = packsPerRoom - packsOpenedThisRoom;
  const boardIsFull = boardSlots.every(slot => slot !== null);
  const boardIsEmpty = boardSlots.every(slot => slot === null);

  const handleOpenPack = (packCount = 1) => {
    if (remainingPacks < packCount) return;
    if (hand.length + (packCount * 5) > 10) return; // Would exceed hand limit
    
    // Open the requested number of packs
    for (let i = 0; i < packCount; i++) {
      openPackToHand();
    }
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

  const handleDropOnDiscard = (e) => {
    e.preventDefault();
    if (!draggedCard || draggedFromBoard) return; // Only accept cards from hand
    
    // Calculate minimum cards needed (board slots - cards already on board)
    const cardsOnBoard = boardSlots.filter(slot => slot !== null).length;
    const emptySlotsOnBoard = 5 - cardsOnBoard;
    const minCardsNeeded = emptySlotsOnBoard;
    
    // Prevent discarding if it would leave too few cards
    if (hand.length <= minCardsNeeded) {
      // Could add a visual feedback here
      return;
    }
    
    // Add to discarded cards for visual feedback
    setDiscardedCards([...discardedCards, draggedCard]);
    
    // Remove from hand
    setHand(hand.filter(c => c !== draggedCard));
    
    setDraggedCard(null);
    setDraggedFromBoard(false);
    setDraggedBoardIndex(null);
  };

  // Calculate preview bonuses based on current board state
  const calculatePreviewBonuses = (slots) => {
    const bonuses = {};
    
    slots.forEach((card, index) => {
      if (!card) return;
      
      // Get the creature's effect
      const creatureName = card.name;
      const effect = CREATURE_EFFECTS[creatureName];
      
      // Check for adjacent bonus effects
      if (effect && effect.effect) {
        let hasAdjacentBonus = false;
        let bonusValue = 0;
        
        // Handle complex effects that contain multiple sub-effects
        if (effect.effect.type === 'complex' && effect.effect.effects) {
          const adjacentEffect = effect.effect.effects.find(e => e.type === 'adjacent_bonus');
          if (adjacentEffect) {
            hasAdjacentBonus = true;
            bonusValue = adjacentEffect.bonus || 5;
          }
        }
        // Handle direct adjacent_bonus effects
        else if (effect.effect.type === 'adjacent_bonus') {
          hasAdjacentBonus = true;
          bonusValue = effect.effect.bonus || 5;
        }
        
        // Apply bonus to adjacent slots
        if (hasAdjacentBonus) {
          // Left adjacent
          if (index > 0 && slots[index - 1]) {
            bonuses[index - 1] = (bonuses[index - 1] || 0) + bonusValue;
          }
          // Right adjacent
          if (index < 4 && slots[index + 1]) {
            bonuses[index + 1] = (bonuses[index + 1] || 0) + bonusValue;
          }
        }
        
        // Handle directional modifier effects (Siammeow)
        if (effect.effect.type === 'directional_modifier') {
          const leftMod = effect.effect.leftModifier || 0;
          const rightMod = effect.effect.rightModifier || 0;
          
          // Apply to all cards to the left
          for (let i = 0; i < index; i++) {
            if (slots[i]) {
              bonuses[i] = (bonuses[i] || 0) + leftMod;
            }
          }
          
          // Apply to all cards to the right
          for (let i = index + 1; i < 5; i++) {
            if (slots[i]) {
              bonuses[i] = (bonuses[i] || 0) + rightMod;
            }
          }
        }
      }
    });
    
    return bonuses;
  };

  // Update preview bonuses whenever board slots change
  useEffect(() => {
    const newBonuses = calculatePreviewBonuses(boardSlots);
    setPreviewBonuses(newBonuses);
  }, [boardSlots]);

  const handleScoreHand = () => {
    if (!boardIsFull) return;
    
    // Animation logging
    if (window.ANIMATION_LOGGER) {
      window.ANIMATION_LOGGER.log('SCORING_START', {
        board: boardSlots.map(card => card?.name),
        timestamp: 0
      });
    }
    
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
    
    const scoreNext = () => {
      if (currentIndex < validCards.length) {
        const actualBoardIndex = cardIndices[currentIndex];
        console.log(`Scoring card ${currentIndex} (board slot ${actualBoardIndex})`, validCards[currentIndex]);
        setScoringIndex(actualBoardIndex);
        
        // Animation logging for card reveal
        if (window.ANIMATION_LOGGER) {
          window.ANIMATION_LOGGER.log('CARD_REVEAL', {
            cardIndex: actualBoardIndex,
            cardName: validCards[currentIndex]?.name,
            timestamp: Date.now()
          });
        }
        
        // Calculate scores for all revealed cards so far
        const revealedCards = validCards.slice(0, currentIndex + 1);
        const { scores, tokensGained } = calculateDynamicScores(
          revealedCards,
          validCards,
          equippedRunes || [],
          collection || {},
          dreamEffects,
          tokens || {},
          currentIndex // Pass the just revealed index
        );
        
        console.log('Calculated scores:', scores);
        console.log('Tokens gained:', tokensGained);
        console.log('Current tokens before update:', tokens);
        
        // Get current card info
        const currentCardScore = scores[currentIndex];
        
        // Update all card scores - map from validCards index to board slot index
        const newScores = {};
        const newScoreDetails = {};
        scores.forEach((score, idx) => {
          const boardIndex = cardIndices[idx];
          newScoreDetails[boardIndex] = score;
          
          if (isLoopPass && idx >= loopineIndex) {
            // During loop pass, show original score (not doubled)
            // The running total will continue from where it left off
            newScores[boardIndex] = score.currentValue;
          } else if (!isLoopPass) {
            // For current card being revealed, always show base score first
            if (idx === currentIndex) {
              newScores[boardIndex] = score.baseValueBeforeEffects;
              // Track if we need animations (including light/shadow)
              if (score.dreamMultiplier || 
                  (score.tokenMultiplier > 1 && score.baseValueBeforeTokens !== score.currentValue) ||
                  score.lightShadowModifier) {
                setAnimatingScores(prev => ({ ...prev, [boardIndex]: {
                  from: score.baseValueBeforeEffects,
                  to: score.currentValue,
                  current: score.baseValueBeforeEffects,
                  phases: {
                    dream: score.dreamMultiplier,
                    lightShadow: score.lightShadowModifier,
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
           currentCardScore.tokenMultiplier > 1 ||
           currentCardScore.lightShadowModifier);
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
              
              // Animation logging for dream effect
              if (window.ANIMATION_LOGGER) {
                window.ANIMATION_LOGGER.log('DREAM_EFFECT_START', {
                  cardIndex: boardIndex,
                  multiplier: currentCardScore.dreamMultiplier,
                  addition: currentCardScore.dreamAddition,
                  timestamp: Date.now()
                });
              }
              
              // Animate from base to after dream effect
              const from = currentCardScore.baseValueBeforeEffects;
              const to = currentCardScore.baseValueBeforeTokens;
              animateScore(boardIndex, from, to, dreamAnimDuration, () => {
                // Keep dream multiplier visible for a moment then hide it
                setTimeout(() => {
                  setShowingDreamEffect(prev => ({ ...prev, [boardIndex]: false }));
                  if (window.ANIMATION_LOGGER) {
                    window.ANIMATION_LOGGER.log('DREAM_EFFECT_END', {
                      cardIndex: boardIndex,
                      timestamp: Date.now()
                    });
                  }
                }, dreamFadeDuration);
              });
            }, phaseDelay);
            
            // Add full animation time plus a small buffer
            phaseDelay += dreamAnimDuration + dreamFadeDuration + (100 * speedMult);
            totalAnimationDelay = phaseDelay;
          }
          
          // Phase 2: Light/Shadow modifiers (additive, before multipliers)
          if (currentCardScore.lightShadowModifier) {
            const lightShadowDuration = 600 * speedMult;
            const lightShadowFadeDuration = 200 * speedMult;
            
            setTimeout(() => {
              setShowingLightShadow(prev => ({ ...prev, [boardIndex]: true }));
              
              // Get the current displayed score for this card
              // Use the value after dream effects if they were applied, otherwise base value
              const currentDisplayedScore = currentCardScore.dreamMultiplier || currentCardScore.dreamAddition ? 
                currentCardScore.baseValueBeforeTokens : currentCardScore.baseValueBeforeEffects;
              
              // Animate from current score to score with light/shadow
              const from = currentDisplayedScore;
              const to = Math.max(0, from + currentCardScore.lightShadowModifier); // Ensure non-negative
              animateScore(boardIndex, from, to, lightShadowDuration, () => {
                // Keep modifier visible briefly then hide
                setTimeout(() => {
                  setShowingLightShadow(prev => ({ ...prev, [boardIndex]: false }));
                }, lightShadowFadeDuration);
              });
            }, phaseDelay);
            
            // Update phase delay
            phaseDelay += lightShadowDuration + lightShadowFadeDuration + (100 * speedMult);
            totalAnimationDelay = phaseDelay;
          }
          
          // Phase 3: Token multipliers (earth tokens)
          if (currentCardScore.tokenMultiplier > 1 && currentCardScore.baseValueBeforeTokens !== currentCardScore.currentValue) {
            const tokenAnimDuration = 800 * speedMult;
            const tokenFadeDuration = 200 * speedMult;
            
            setTimeout(() => {
              // Small delay to ensure dream effect is hidden first
              setTimeout(() => {
                setShowingMultiplier(prev => ({ ...prev, [boardIndex]: true }));
                if (window.ANIMATION_LOGGER) {
                  window.ANIMATION_LOGGER.log('TOKEN_MULTIPLIER_START', {
                    cardIndex: boardIndex,
                    multiplier: currentCardScore.tokenMultiplier,
                    timestamp: Date.now()
                  });
                }
              }, 50 * speedMult);
              
              // Animate from after dream to final value
              const from = currentCardScore.baseValueBeforeTokens;
              const to = currentCardScore.currentValue;
              animateScore(boardIndex, from, to, tokenAnimDuration, () => {
                // Keep multiplier visible briefly then hide
                setTimeout(() => {
                  setShowingMultiplier(prev => ({ ...prev, [boardIndex]: false }));
                  if (window.ANIMATION_LOGGER) {
                    window.ANIMATION_LOGGER.log('TOKEN_MULTIPLIER_END', {
                      cardIndex: boardIndex,
                      timestamp: Date.now()
                    });
                  }
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
          // During loop pass, continue from where we left off
          // Just add the current card's value to the existing total
          if (currentIndex >= loopineIndex) {
            const currentCardValue = scores[currentIndex].currentValue;
            currentTotal += currentCardValue;
            setRunningTotal(currentTotal);
          }
        } else {
          // Normal scoring - accumulate all scores
          currentTotal = scores.reduce((sum, score) => sum + score.currentValue, 0);
          setRunningTotal(currentTotal);
        }
        console.log('Running total:', currentTotal);
        
        // Check if current card generated tokens
        const hasTokens = currentCardScore && currentCardScore.tokensGenerated && Object.keys(currentCardScore.tokensGenerated).length > 0;
        const hasMultiplier = currentCardScore && currentCardScore.tokenMultiplier > 1 && currentCardScore.baseValueBeforeTokens !== currentCardScore.currentValue;
        
        // Apply tokens AFTER all scoring animations for this card complete
        if (hasTokens && currentCardScore.wasJustRevealed) {
          const thisCardTokens = currentCardScore.tokensGenerated;
          const boardIndex = cardIndices[currentIndex];
          
          // Wait for all animations to complete before showing tokens
          setTimeout(() => {
            // Update tokens state
            setTokens(prevTokens => {
              const newTokens = { ...prevTokens };
              for (const [tokenType, amount] of Object.entries(thisCardTokens)) {
                newTokens[tokenType] = (newTokens[tokenType] || 0) + amount;
              }
              console.log('Updating tokens from:', prevTokens, 'to:', newTokens);
              return newTokens;
            });
            
            // Add token animation
            setTokenAnimations(prev => [...prev, {
              id: Date.now(),
              boardIndex,
              tokens: thisCardTokens,
              timestamp: Date.now()
            }]);
            
            // Animation logging for token generation
            if (window.ANIMATION_LOGGER) {
              window.ANIMATION_LOGGER.log('TOKEN_GENERATED', {
                cardIndex: boardIndex,
                cardName: validCards[currentIndex]?.name,
                tokens: thisCardTokens,
                timestamp: Date.now()
              });
            }
            
            // Handle special effects after token generation
            if (currentCardScore.specialEffect) {
              setTimeout(() => {
                if (window.ANIMATION_LOGGER) {
                  window.ANIMATION_LOGGER.log('SPECIAL_EFFECT', {
                    cardIndex: boardIndex,
                    effectType: currentCardScore.specialEffect.type,
                    timestamp: Date.now()
                  });
                }
                handleSpecialEffect(currentCardScore.specialEffect);
              }, 500 * speedMult);
            }
          }, totalAnimationDelay); // Show tokens after all scoring animations
        }
        
        // Use the longer of totalAnimationDelay or the base delays
        let totalDelay = Math.max(totalAnimationDelay, baseDelay);
        
        // Add extra delay if tokens were generated
        if (hasTokens && currentCardScore.wasJustRevealed) {
          totalDelay += 800 * speedMult; // Extra time for token animation
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
          
          if (window.ANIMATION_LOGGER) {
            window.ANIMATION_LOGGER.log('LOOPINE_TIME_LOOP', {
              loopineIndex: loopineBoardIndex,
              timestamp: Date.now()
            });
          }
          
          // Continue scoring from Loopine's position after animation
          const speedMult = 1 / scoringSpeedMultiplier;
          scoringTimeoutRef.current = setTimeout(() => {
            setShowLoopineEffect(false);
            scoreNext();
          }, 1500 * speedMult);
        } else {
          // Calculate final tokens from all cards
          const { tokensGained: finalTokens } = calculateDynamicScores(
            validCards,
            validCards,
            equippedRunes || [],
            collection || {},
            dreamEffects,
            {},
            validCards.length - 1
          );
          
          console.log('Final tokens calculated:', finalTokens);
          
          // Start token scoring phase
          const creatureTotal = currentTotal; // Use the running total directly
          console.log('Creature scoring complete, total:', creatureTotal);
          
          // Get active tokens (tokens with count > 0)
          const activeTokens = Object.entries(finalTokens).filter(([_, count]) => count > 0);
          
          console.log('Active tokens for scoring:', activeTokens);
          
          if (activeTokens.length > 0) {
            console.log('Starting token scoring phase with tokens:', activeTokens);
            
            // Update the token state to reflect final tokens
            setTokens(finalTokens);
            
            const speedMult = 1 / scoringSpeedMultiplier;
            
            // Start token scoring after a brief pause
            setTimeout(() => {
              scoreTokens(creatureTotal, activeTokens);
            }, 600 * speedMult);
          } else {
            // No tokens to score
            const speedMult = 1 / scoringSpeedMultiplier;
            setTimeout(() => {
              handleScoringComplete(creatureTotal);
            }, 400 * speedMult);
          }
        }
      }
    };
    
    scoreNext();
  };

  const scoreTokens = (creatureTotal, activeTokens) => {
    console.log('Starting token scoring animation');
    setIsScoringTokens(true);
    
    // Get token counts for purge calculation
    const tokenCounts = {};
    activeTokens.forEach(([tokenType, count]) => {
      tokenCounts[tokenType] = count;
    });
    
    const getTokenValue = (tokenType, tokenCount = 1) => {
  if (tokenType === 'chaos') {
    // Chaos tokens are worth random 1 to (count * 30)
    const maxValue = tokenCount * 30;
    return Math.floor(Math.random() * maxValue) + 1;
  }
  // Only fire and water tokens provide PP
  if (tokenType === 'fire' || tokenType === 'water') {
    return 10;
  }
  // Shadow and light tokens don't provide direct PP
  if (tokenType === 'shadow' || tokenType === 'light') {
    return 0; // They modify creature scores instead
  }
  // All other tokens (earth, arcane) provide 0 PP
  return 0;
};
    let tokenIndex = 0;
    let tokenTotal = creatureTotal;
    const newTokenScores = {};
    
    const scoreNextToken = () => {
      if (tokenIndex < activeTokens.length) {
        const [tokenType, tokenCount] = activeTokens[tokenIndex];
        const tokenValue = getTokenValue(tokenType);
        const tokenScore = tokenType === 'chaos' 
          ? getTokenValue(tokenType, tokenCount)
          : tokenCount * tokenValue;
        
        console.log(`Scoring ${tokenCount} ${tokenType} tokens: value=${tokenValue}, total=${tokenScore} PP`);
        
        // Skip tokens with exactly 0 PP value
        if (tokenScore === 0) {
          tokenIndex++;
          scoreNextToken(); // Move to next token immediately
          return;
        }
        
        // Set which token is currently scoring
        setScoringTokenType(tokenType);
        
        // Calculate and store this token's score
        newTokenScores[tokenType] = tokenScore;
        setTokenScores({...newTokenScores});
        
        // Animate the score addition
        const speedMult = 1 / scoringSpeedMultiplier;
        
        // Show the token score for a moment
        setTimeout(() => {
          // Add to running total with animation
          const steps = 20;
          const increment = tokenScore / steps;
          let step = 0;
          
          const animateTokenScore = () => {
            step++;
            if (step <= steps) {
              const currentAddition = Math.floor(increment * step);
              setRunningTotal(creatureTotal + currentAddition + 
                Object.values(newTokenScores).reduce((sum, score, idx) => 
                  idx < tokenIndex ? sum + score : sum, 0));
              setTimeout(animateTokenScore, 20);
            } else {
              tokenTotal += tokenScore;
              tokenIndex++;
              
              // Continue to next token
              setTimeout(scoreNextToken, 300 * speedMult);
            }
          };
          
          animateTokenScore();
        }, 400 * speedMult);
        
      } else {
        // All tokens scored
        console.log('Token scoring complete, final total:', tokenTotal);
        setIsScoringTokens(false);
        setScoringTokenType(null);
        
        const speedMult = 1 / scoringSpeedMultiplier;
        setTimeout(() => {
          handleScoringComplete(tokenTotal);
        }, 400 * speedMult);
      }
    };
    
    scoreNextToken();
  };

  const handleSpecialEffect = (effect) => {
    switch (effect.type) {
      case 'shuffle_board':
        // Shuffle the board positions
        const newBoardSlots = [...boardSlots];
        const occupiedSlots = newBoardSlots.map((card, index) => ({ card, index })).filter(slot => slot.card !== null);
        
        // Fisher-Yates shuffle of occupied slots
        for (let i = occupiedSlots.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [occupiedSlots[i], occupiedSlots[j]] = [occupiedSlots[j], occupiedSlots[i]];
        }
        
        // Clear board first
        const clearedBoard = [null, null, null, null, null];
        
        // Place shuffled cards back
        occupiedSlots.forEach((slot, idx) => {
          clearedBoard[slot.index] = slot.card;
        });
        
        setBoardSlots(clearedBoard);
        break;
        
      case 'time_loop':
        // Time loop is handled in the main scoring sequence
        break;
        
      case 'fredmaxxing':
        // Fredmaxxing is handled in the passive system
        break;
        
      default:
        console.log('Unhandled special effect:', effect);
    }
  };

  const handleScoringComplete = (totalScore) => {
    console.log('Scoring complete with total:', totalScore);
    
    if (window.ANIMATION_LOGGER) {
      window.ANIMATION_LOGGER.log('SCORING_COMPLETE', {
        totalScore,
        timestamp: Date.now()
      });
    }
    
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
  
  // Helper function to create a Gen2 creature for testing
  const createGen2CreatureForTest = (name, parent1Name, parent2Name) => {
    // Get parent abilities
    const ability1 = getCreatureAbilityText(parent1Name);
    const ability2 = getCreatureAbilityText(parent2Name);
    
    return {
      id: `debug-gen2-${name}`,
      name: name,
      generation: 'Gen2',
      ppValue: 20, // Gen2 base value
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      ability: ability1 && ability2 ? `${ability1} & ${ability2}` : 'Fused creature ability',
      parentCardId1: `debug-parent1-${parent1Name}`,
      parentCardId2: `debug-parent2-${parent2Name}`,
      arcana: 'creature'
    };
  };
  
  // Handle debug scenarios
  useEffect(() => {
    console.log('Debug scenario effect triggered:', {
      hasDebugScenario: !!debugScenario,
      hasCollection: !!collection,
      collectionSize: collection ? Object.keys(collection).length : 0
    });
    
    if (debugScenario && collection && Object.keys(collection).length > 0) {
      console.log('Loading debug scenario:', debugScenario);
      
      // Set initial tokens if any
      if (debugScenario.initialTokens) {
        setTokens(debugScenario.initialTokens);
      } else {
        setTokens({});
      }
      
      // Set expected results
      setDebugExpectedResults({
        tokens: debugScenario.expectedTokens || {},
        scores: debugScenario.expectedScores || []
      });
      
      // Place cards on the board
      if (debugScenario.board) {
        const newBoard = [null, null, null, null, null];
        let placedCount = 0;
        
        // First, place all specified cards
        debugScenario.board.forEach((card, index) => {
          if (card && index < 5) {
            placedCount++;
            // Find the card in collection
            const collectionEntry = Object.entries(collection).find(([id, c]) => 
              c.name === card.name
            );
            
            if (collectionEntry) {
              const [cardId, templateCard] = collectionEntry;
              const cardWithLevel = {
                ...templateCard,
                id: cardId,
                level: card.level || templateCard.level || 1,
                ability: templateCard.ability || getCreatureAbilityText(card.name),
                ppValue: templateCard.ppValue || 10
              };
              newBoard[index] = cardWithLevel;
            } else {
              // If not in collection, create card (handles TestCreature, Gen2/Gen3)
              console.log(`Creating card ${card.name} for debug scenario`, card);
              
              // Handle TestCreature as a basic placeholder
              if (card.name === 'TestCreature') {
                const testCard = {
                  id: `debug-test-${index}`,
                  name: 'TestCreature',
                  level: card.level || 1,
                  ppValue: card.ppValue || 10,
                  ability: card.ability || 'No ability',
                  generation: card.generation || 'Gen1',
                  arcana: 'creature',
                  xp: 0,
                  xpToNextLevel: 100
                };
                newBoard[index] = testCard;
              } else {
                // Determine generation and properties
                let generation = card.generation || 'Gen1';
                let ppValue = 10;
                let ability = getCreatureAbilityText(card.name);
                
                // Handle Gen2 creatures specifically
                if ((generation === 'Gen2' || generation === 2) && card.parent1 && card.parent2) {
                  // Create a proper Gen2 creature with parent abilities
                  const gen2Card = createGen2CreatureForTest(card.name, card.parent1, card.parent2);
                  gen2Card.level = card.level || 1;
                  if (card.ppValue) gen2Card.ppValue = card.ppValue;
                  if (card.ability) gen2Card.ability = card.ability;
                  newBoard[index] = gen2Card;
                } else {
                  // If ability is not found, it might be a Gen2/Gen3
                  if (!ability && card.ability) {
                    ability = card.ability;
                  } else if (!ability) {
                    // Try to infer from name or use placeholder
                    if (card.name.includes('Fused') || generation === 'Gen2' || generation === 2) {
                      generation = 'Gen2';
                      ppValue = 20;
                      ability = card.ability || 'Fused creature ability';
                    } else if (generation === 'Gen3' || generation === 3) {
                      generation = 'Gen3';
                      ppValue = 40;
                      ability = card.ability || 'Triple fused creature ability';
                    } else {
                      ability = 'No ability';
                    }
                  }
                  
                  // Set PP value based on generation if not specified
                  if (!card.ppValue) {
                    if (generation === 'Gen2' || generation === 2) ppValue = 20;
                    else if (generation === 'Gen3' || generation === 3) ppValue = 40;
                  }
                  
                  const debugCard = {
                    id: `debug-${card.name}-${index}`,
                    name: card.name,
                    level: card.level || 1,
                    ppValue: card.ppValue || ppValue,
                    ability: ability,
                    generation: generation,
                    arcana: 'creature',
                    xp: 0,
                    xpToNextLevel: 100
                  };
                  newBoard[index] = debugCard;
                }
              }
            }
          }
        });
        
        // Fill remaining slots with basic creatures to ensure we have 5
        if (placedCount < 5) {
          console.log(`Test scenario only has ${placedCount} creatures, filling remaining slots`);
          const fillerCreature = {
            name: 'Flitterfin',
            level: 1,
            ppValue: 10,
            ability: getCreatureAbilityText('Flitterfin'),
            generation: 'Gen1',
            arcana: 'creature',
            xp: 0,
            xpToNextLevel: 100
          };
          
          for (let i = 0; i < 5; i++) {
            if (newBoard[i] === null) {
              newBoard[i] = {
                ...fillerCreature,
                id: `debug-filler-${i}`
              };
            }
          }
        }
        
        setBoardSlots(newBoard);
        // Clear hand since we're placing directly on board
        setHand([]);
        
        // Log what was loaded
        console.log('Test scenario loaded with board:', newBoard.map(card => 
          card ? `${card.name} (${card.generation}, ${card.ppValue} PP, "${card.ability}")` : 'null'
        ));
      }
      
      // Note: Dream effects would need to be set through game state
      // For now, we'll just log if they're present
      if (debugScenario.dreamEffects && debugScenario.dreamEffects.length > 0) {
        console.log('Debug scenario includes dream effects:', debugScenario.dreamEffects);
      }
      
      // Reset scoring state
      setIsScoring(false);
      setScoringComplete(false);
      setCardScores({});
      setScoringIndex(-1);
      setRunningTotal(0);
      setAnimatingScores({});
      setShowingDreamEffect({});
      setShowingMultiplier({});
      
      // Clear the scenario after applying it
      setDebugScenario(null);
    }
  }, [debugScenario, setDebugScenario, collection]);
  
  // Clean up old token animations
  useEffect(() => {
    const cleanupTimer = setInterval(() => {
      setTokenAnimations(prev => prev.filter(anim => Date.now() - anim.timestamp < 2000));
    }, 2000);
    
    return () => clearInterval(cleanupTimer);
  }, []);

  const handleContinue = () => {
    // Clear the board and hand
    setBoardSlots([null, null, null, null, null]);
    setHand([]);
    setDiscardedCards([]);
    setScoringComplete(false);
    setIsScoring(false);
    setTokens({});
    setCardScoreDetails({});
    setTokenAnimations([]);
    setTokenScores({});
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
        <TokenDisplay 
          tokens={tokens} 
          isVisible={isScoring || scoringComplete} 
          isScoringTokens={isScoringTokens}
          scoringTokenType={scoringTokenType}
          tokenScores={tokenScores}
        />
        
        {/* Pack Status - Removed dream info, only show pack buttons */}
        {!isScoring && !scoringComplete && (
          <div className="pack-status">
            {boardIsEmpty && remainingPacks > 0 && (
              <div className="pack-buttons">
                <button 
                  className="open-pack-btn-tcg"
                  onClick={() => handleOpenPack(1)}
                  disabled={hand.length > 5}
                  title={hand.length > 5 ? `Need ${hand.length - 5} empty slots` : "Open 1 pack (5 cards)"}
                >
                  Open 1 Pack
                </button>
                {remainingPacks >= 2 && (
                  <button 
                    className="open-pack-btn-tcg open-two"
                    onClick={() => handleOpenPack(2)}
                    disabled={hand.length > 0}
                    title={hand.length > 0 ? `Need ${hand.length} empty slots` : "Open 2 packs (10 cards)"}
                  >
                    Open 2 Packs
                  </button>
                )}
              </div>
            )}
            {boardIsEmpty && hand.length > 0 && remainingPacks > 0 && (
              <div className="pack-warning">
                ⚠️ Unplayed cards will be discarded after scoring!
              </div>
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
                    <Card 
                      card={card} 
                      showTooltip={true} 
                      showLevel={true} 
                      isRoguelikeMode={true}
                      previewBonus={previewBonuses[index] || 0}
                    />
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
                         cardScoreDetails[index].baseValueBeforeTokens !== cardScoreDetails[index].currentValue && 
                         showingMultiplier[index] && (
                          <span className={`score-multiplier ${showingMultiplier[index] ? 'active' : ''}`}>
                            ×{cardScoreDetails[index].tokenMultiplier}
                          </span>
                        )}
                        {cardScoreDetails[index] && 
                         cardScoreDetails[index].lightShadowModifier && 
                         showingLightShadow[index] && (
                          <span className={`light-shadow-modifier ${showingLightShadow[index] ? 'active' : ''}`}>
                            {cardScoreDetails[index].lightShadowModifier > 0 ? '+' : ''}{cardScoreDetails[index].lightShadowModifier}
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
                            +{amount} {TOKEN_EMOJIS[tokenType] || tokenType}
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
            <div className="scoring-complete-container">
              <div className="scoring-total review">
                Total: <span className="total-value">+{lastScoreGained} PP</span>
              </div>
              <button className="continue-btn-compact" onClick={handleContinue}>
                {dreamScore >= dreamThreshold ? 'Next Dream' : (remainingPacks > 0 ? 'Next Hand' : 'End Run')}
              </button>
            </div>
          )}
        </div>

        {/* Score Button - Outside board area */}
        {boardIsFull && !isScoring && !scoringComplete && (
          <button 
            className="score-board-btn"
            onClick={handleScoreHand}
          >
            Score Board
          </button>
        )}

        {/* Hand Area */}
        {!isScoring && !scoringComplete && (
          <div className="hand-and-discard-container">
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
            
            {/* Discard Pile */}
            {(() => {
              const cardsOnBoard = boardSlots.filter(slot => slot !== null).length;
              const emptySlotsOnBoard = 5 - cardsOnBoard;
              const canDiscard = hand.length > emptySlotsOnBoard;
              const isDraggingFromHand = draggedCard && !draggedFromBoard;
              
              return (
                <div 
                  className={`discard-pile ${isDraggingFromHand ? (canDiscard ? 'highlight' : 'disabled') : ''}`}
                  onDragOver={canDiscard ? handleDragOver : (e) => e.preventDefault()}
                  onDrop={handleDropOnDiscard}
                >
                  <div className="discard-icon">{canDiscard || discardedCards.length > 0 ? '🗑️' : '🚫'}</div>
                  {discardedCards.length === 0 ? (
                    canDiscard ? (
                      <div className="discard-hint">Drag cards here to discard</div>
                    ) : (
                      <div className="discard-hint disabled">Need {emptySlotsOnBoard} cards for board</div>
                    )
                  ) : (
                    <div className="discard-count">{discardedCards.length} discarded</div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        
        {/* Debug Expected Results */}
        {debugExpectedResults && (
          <div className="debug-expected-results">
            <h4>Expected Results:</h4>
            <div className="expected-content">
              {debugExpectedResults.tokens && (
                <div>Tokens: {JSON.stringify(debugExpectedResults.tokens)}</div>
              )}
              {debugExpectedResults.scores && (
                <div>Scores: [{debugExpectedResults.scores.join(', ')}]</div>
              )}
              {scoringComplete && (
                <div className="actual-results">
                  <h5>Actual Results:</h5>
                  <div>Tokens: {JSON.stringify(tokens)}</div>
                  <div>Scores: [{boardSlots.filter(Boolean).map((_, i) => cardScores[i] || 0).join(', ')}]</div>
                </div>
              )}
            </div>
            <button 
              className="close-debug-results"
              onClick={() => setDebugExpectedResults(null)}
            >
              Close
            </button>
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