import React, { useState, useEffect, useRef } from 'react';
import './UnifiedPackOpening.css';
import Card from '../Card';
import FloatingText from './FloatingText';
import AnimatedScore from './AnimatedScore';
import SequentialFloatingText from './SequentialFloatingText';
import { calculateDynamicScores, generateScoringAnimations } from '../../utils/dynamicScoring';

const UnifiedPackOpening = ({
  stagedPacks,
  packSlots,
  unstagePack,
  onOpenPacks,
  openedCards,
  currentPackPPValues,
  isOpening,
  onComplete,
  totalPP,
  onPhaseChange,
  collection,
  equippedRunes,
  applyCardXP,
  roguelikeMode = false,
  dreamEffects = [],
  onScoringComplete
}) => {
  const [phase, setPhase] = useState('ready'); // ready, animating, scoring, complete
  
  // Notify parent of phase changes
  useEffect(() => {
    if (onPhaseChange) {
      onPhaseChange(phase);
    }
  }, [phase, onPhaseChange]);
  const [buttonFading, setButtonFading] = useState(false);
  const [packAnimating, setPackAnimating] = useState(false);
  const [scoringIndex, setScoringIndex] = useState(-1);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [sequentialAnimations, setSequentialAnimations] = useState({});
  const [runningTotal, setRunningTotal] = useState(0);
  const [cardScores, setCardScores] = useState({});
  const [revealedCards, setRevealedCards] = useState([]);
  const containerRef = useRef(null);
  const finalScoreRef = useRef(0);

  const handleOpenClick = () => {
    if (stagedPacks.length === 0 || isOpening) return;
    
    // Start opening sequence - immediately hide everything and open packs
    setButtonFading(true);
    setPhase('scoring');
    onOpenPacks();
  };

  // Watch for openedCards to be populated
  useEffect(() => {
    if (openedCards.length > 0 && phase === 'scoring') {
      // Start scoring when cards are available
      startScoringSequence();
    }
  }, [openedCards, phase]);
  
  // In roguelike mode, start scoring immediately
  useEffect(() => {
    if (roguelikeMode && openedCards.length > 0) {
      setPhase('scoring');
      startScoringSequence();
    }
  }, [roguelikeMode, openedCards]);

  const startScoringSequence = () => {
    let currentIndex = 0;
    let currentlyRevealed = []; // Track revealed cards locally
    let loopineIndex = -1; // Track if we have a Loopine
    let isLoopPass = false; // Track if we're in the loop pass
    finalScoreRef.current = 0; // Reset the final score
    
    // Pre-calculate initial scores for all cards to avoid 0 display
    const initialScores = {};
    openedCards.forEach((card, idx) => {
      const ppValue = card.ppValue !== undefined ? card.ppValue : 10;
      const level = card.level || 1;
      const baseValue = ppValue * level;
      initialScores[idx] = { base: baseValue, current: baseValue, passiveMultiplier: 1 };
      // Check if this card is Loopine
      if (card.name === 'Loopine') {
        loopineIndex = idx;
      }
    });
    setCardScores(initialScores);
    
    const scoreNext = () => {
      if (currentIndex < openedCards.length) {
        // On first pass, add card to revealed cards
        if (!isLoopPass) {
          currentlyRevealed = [...currentlyRevealed, openedCards[currentIndex]];
          setRevealedCards([...currentlyRevealed]); // Update state for React
        }
        
        // Calculate dynamic scores for all revealed cards
        const { scores, findNewEffects } = calculateDynamicScores(
          currentlyRevealed, 
          openedCards,
          equippedRunes || [],
          collection || {},
          dreamEffects
        );
        
        // Get the current card's score (it's the last one since we just added it)
        const currentCardScore = scores[scores.length - 1];
        if (!currentCardScore) {
          console.error('No score found for current card. Scores:', scores);
          currentIndex++;
          setTimeout(scoreNext, 100);
          return;
        }
        const baseValue = currentCardScore.baseValue;
        
        
        // Reveal the card (only update scoring index on first pass)
        if (!isLoopPass) {
          setScoringIndex(currentIndex);
        }
        
        // If this is a loop pass, show a special effect
        if (isLoopPass) {
          const cardElement = document.querySelector(`[data-card-index="${currentIndex}"]`);
          if (cardElement) {
            cardElement.classList.add('loop-scoring');
            setTimeout(() => {
              cardElement.classList.remove('loop-scoring');
            }, 600);
          }
        }
        
        // Always update the score to include passive multiplier
        const currentCard = openedCards[currentIndex];
        setCardScores(prev => {
          // During loop pass, add to existing score
          const existingScore = prev[currentIndex];
          const previousValue = existingScore?.current || baseValue;
          const newCurrentValue = isLoopPass 
            ? previousValue + currentCardScore.currentValue
            : currentCardScore.currentValue;
          
          const newScores = {
            ...prev,
            [currentIndex]: { 
              base: baseValue, 
              current: newCurrentValue,
              previous: previousValue,
              passiveMultiplier: currentCardScore.passiveMultiplier || 1,
              looped: isLoopPass
            }
          };
          return newScores;
        });
        
        // Show loop addition animation if in loop pass
        if (isLoopPass && currentIndex >= loopineIndex) {
          const addedValue = currentCardScore.currentValue;
          const capturedIndex = currentIndex;
          setTimeout(() => {
            setSequentialAnimations(prev => ({
              ...prev,
              [capturedIndex]: [
                {
                  type: 'pp',
                  text: `+${addedValue}`,
                  delay: 0,
                  duration: 1500
                }
              ]
            }));
          }, 100);
        }
        
        // If this card has effects (e.g., Fred with multiplier from previous Freds)
        else if (currentCardScore.passiveMultiplier > 1 && !isLoopPass) {
          // Capture the current index value to avoid closure issues
          const indexToAnimate = currentIndex;
          const multiplierToShow = currentCardScore.passiveMultiplier;
          
          // Show the animation explaining why
          setTimeout(() => {
            const animations = [
              {
                type: 'ability',
                text: 'Fredmaxxing!',
                delay: 0,
                duration: 1500
              },
              {
                type: 'multiplier',
                text: `×${multiplierToShow}`,
                delay: 300,
                duration: 1500
              }
            ];
            
            setSequentialAnimations(prev => ({
              ...prev,
              [indexToAnimate]: animations
            }));
          }, 200);
        }
        
        // Calculate total including this card
        const currentTotal = scores.reduce((sum, score) => sum + score.currentValue, 0);
        setRunningTotal(currentTotal);
        finalScoreRef.current = currentTotal;
        
        // Scroll to current card on mobile
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          setTimeout(() => {
            const cardElement = document.querySelector(`[data-card-index="${currentIndex}"]`);
            if (cardElement && containerRef.current) {
              const containerRect = containerRef.current.getBoundingClientRect();
              const cardRect = cardElement.getBoundingClientRect();
              const currentScroll = containerRef.current.scrollTop;
              
              const targetScroll = currentScroll + cardRect.top - containerRect.top - (containerRect.height / 2) + (cardRect.height / 2);
              
              containerRef.current.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: 'smooth'
              });
            }
          }, 50);
        }
        
        // Move to next card
        currentIndex++;
        setTimeout(scoreNext, 600);
      } else {
        // Check if we need to do a loop pass
        if (!isLoopPass && loopineIndex >= 0) {
          // Trigger Loopine's time loop effect
          isLoopPass = true;
          currentIndex = loopineIndex;
          
          // Show a special animation for Loopine's effect
          setTimeout(() => {
            setSequentialAnimations(prev => ({
              ...prev,
              [loopineIndex]: [
                {
                  type: 'ability',
                  text: 'Time Loop!',
                  delay: 0,
                  duration: 2000
                },
                {
                  type: 'multiplier',
                  text: 'Rescoring...',
                  delay: 500,
                  duration: 1500
                }
              ]
            }));
          }, 200);
          
          // Continue scoring from Loopine's position after a delay
          setTimeout(scoreNext, 1500);
        } else {
          // Scoring complete - apply XP to all opened cards
          if (applyCardXP && openedCards.length > 0 && !roguelikeMode) {
            const cardIds = openedCards.map(card => card.id);
            applyCardXP(cardIds);
          }
          
          // In roguelike mode, call the scoring complete callback
          if (roguelikeMode && onScoringComplete) {
            onScoringComplete(finalScoreRef.current);
          }
          
          setTimeout(() => {
            setPhase('complete');
          }, 800);
        }
      }
    };
    
    // Start scoring after a brief delay to ensure initial scores are set
    setTimeout(() => {
      scoreNext();
    }, 100);
  };


  const handleFloatingTextComplete = (id) => {
    setFloatingTexts(prev => prev.filter(text => text.id !== id));
  };

  const handleContinue = () => {
    // Reset all local state
    setPhase('ready');
    setButtonFading(false);
    setPackAnimating(false);
    setScoringIndex(-1);
    setFloatingTexts([]);
    setSequentialAnimations({});
    setRunningTotal(0);
    setCardScores({});
    setRevealedCards([]);
    
    // Call parent completion handler
    onComplete();
  };

  // Expose reset function to parent
  useEffect(() => {
    if (openedCards.length === 0 && phase !== 'ready') {
      // When cards are cleared externally, reset to ready
      setPhase('ready');
      setButtonFading(false);
      setPackAnimating(false);
      setScoringIndex(-1);
      setFloatingTexts([]);
      setSequentialAnimations({});
      setRunningTotal(0);
      setCardScores({});
      setRevealedCards([]);
      }
  }, [openedCards.length, phase]);

  return (
    <div className={`unified-pack-opening ${phase}`} ref={containerRef}>
      {/* Header */}
      {(phase === 'scoring' || phase === 'complete') && (
        <div className="opening-header">
          <div className="score-display">
            <span className="score-label">Total:</span>
            <span className="score-value">+{runningTotal} PP</span>
          </div>
        </div>
      )}

      {/* Open Button */}
      {!roguelikeMode && phase === 'ready' && stagedPacks.length > 0 && (
        <button 
          className={`open-packs-button ${buttonFading ? 'fading' : ''}`}
          onClick={handleOpenClick}
          disabled={isOpening}
        >
          <span className="button-icon">⚡</span>
          <span className="button-text">OPEN</span>
        </button>
      )}

      {/* Pack Display */}
      {!roguelikeMode && phase === 'ready' && (
        <div className="packs-container">
          {[...Array(packSlots)].map((_, index) => (
            <div key={index} className="pack-slot-unified">
              {stagedPacks[index] ? (
                <div 
                  className={`pack-visual-unified ${packAnimating ? 'glowing exploding' : ''}`}
                  onClick={() => phase === 'ready' && unstagePack(index)}
                >
                  <div className="pack-content-unified">
                    <span className="pack-icon-unified">{stagedPacks[index].icon || '📦'}</span>
                  </div>
                  <div className="pack-label-unified">{stagedPacks[index].name}</div>
                  {packAnimating && (
                    <div className="pack-explosion-particles">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={`explosion-particle particle-${i}`}></div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-slot-unified">
                  <span className="slot-number">{index + 1}</span>
                  <span className="slot-text">Empty</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Card Grid */}
      {(phase === 'scoring' || phase === 'complete') && (
        <div className="cards-grid-unified">
          {openedCards.map((card, index) => (
            <div 
              key={`card-${index}`}
              className={`card-slot-unified ${index <= scoringIndex ? 'revealed' : ''} ${index === scoringIndex ? 'scoring' : ''}`}
              data-card-index={index}
            >
              {index <= scoringIndex ? (
                <>
                  <Card card={card} showTooltip={false} showLevel={true} alwaysShowLevel={true} />
                  <div className="card-score-container">
                    <AnimatedScore 
                      value={cardScores[index]?.previous || cardScores[index]?.base || 0}
                      targetValue={cardScores[index]?.current || 0}
                    />
                  </div>
                  {sequentialAnimations[index] && (
                    <div className="card-animation-container">
                      <SequentialFloatingText
                        animations={sequentialAnimations[index]}
                        onComplete={() => {
                          setSequentialAnimations(prev => {
                            const newAnims = { ...prev };
                            delete newAnims[index];
                            return newAnims;
                          });
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="card-placeholder"></div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Continue Button */}
      {!roguelikeMode && phase === 'complete' && (
        <button className="continue-button-unified" onClick={handleContinue}>
          <span className="continue-desktop">Continue</span>
          <span className="continue-mobile">→</span>
        </button>
      )}


    </div>
  );
};

export default UnifiedPackOpening;