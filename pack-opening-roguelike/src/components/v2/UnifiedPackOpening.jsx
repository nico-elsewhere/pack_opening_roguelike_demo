import React, { useState, useEffect, useRef } from 'react';
import './UnifiedPackOpening.css';
import Card from '../Card';
import FloatingText from './FloatingText';

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
  onPhaseChange
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
  const [runningTotal, setRunningTotal] = useState(0);
  const containerRef = useRef(null);

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

  const startScoringSequence = () => {
    let currentIndex = 0;
    let total = 0;
    
    const scoreNext = () => {
      if (currentIndex < openedCards.length) {
        setScoringIndex(currentIndex);
        total += currentPackPPValues[currentIndex];
        setRunningTotal(total);
        
        // Scroll to current card on mobile
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          setTimeout(() => {
            const cardElement = document.querySelector(`[data-card-index="${currentIndex}"]`);
            if (cardElement && containerRef.current) {
              const containerRect = containerRef.current.getBoundingClientRect();
              const cardRect = cardElement.getBoundingClientRect();
              const currentScroll = containerRef.current.scrollTop;
              
              // Calculate the target scroll position to center the card
              const targetScroll = currentScroll + cardRect.top - containerRect.top - (containerRect.height / 2) + (cardRect.height / 2);
              
              containerRef.current.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: 'smooth'
              });
            }
          }, 50);
        }
        
        // Add floating text
        const newFloatingText = {
          id: `float-${Date.now()}-${currentIndex}`,
          text: `+${currentPackPPValues[currentIndex]}`,
          cardIndex: currentIndex,
          color: currentPackPPValues[currentIndex] > 50 ? '#f59e0b' : '#fbbf24',
          persistent: true
        };
        
        setFloatingTexts(prev => [...prev, newFloatingText]);
        
        currentIndex++;
        setTimeout(scoreNext, 400);
      } else {
        // Scoring complete
        setTimeout(() => {
          setPhase('complete');
        }, 800);
      }
    };
    
    scoreNext();
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
    setRunningTotal(0);
    
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
      setRunningTotal(0);
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
      {phase === 'ready' && stagedPacks.length > 0 && (
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
      {phase === 'ready' && (
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
                  <Card card={card} showTooltip={false} />
                  {floatingTexts.find(text => text.cardIndex === index) && (
                    <div className="card-floating-text">
                      <FloatingText
                        text={floatingTexts.find(text => text.cardIndex === index).text}
                        x={0}
                        y={0}
                        color={floatingTexts.find(text => text.cardIndex === index).color}
                        persistent={true}
                        relative={true}
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
      {phase === 'complete' && (
        <button className="continue-button-unified" onClick={handleContinue}>
          <span className="continue-desktop">Continue</span>
          <span className="continue-mobile">→</span>
        </button>
      )}


    </div>
  );
};

export default UnifiedPackOpening;