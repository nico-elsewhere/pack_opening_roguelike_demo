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
  totalPP
}) => {
  const [phase, setPhase] = useState('ready'); // ready, animating, scoring, complete
  const [buttonFading, setButtonFading] = useState(false);
  const [packAnimating, setPackAnimating] = useState(false);
  const [scoringIndex, setScoringIndex] = useState(-1);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [runningTotal, setRunningTotal] = useState(0);
  const [cardPositions, setCardPositions] = useState([]);
  const containerRef = useRef(null);

  // Calculate card grid positions
  useEffect(() => {
    if (openedCards.length > 0 && containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const cardsPerRow = 5;
      const cardWidth = 120;
      const cardHeight = 168;
      const gap = 16;
      
      const positions = openedCards.map((_, index) => {
        const row = Math.floor(index / cardsPerRow);
        const col = index % cardsPerRow;
        
        const gridWidth = cardsPerRow * cardWidth + (cardsPerRow - 1) * gap;
        const startX = container.left + container.width / 2 - gridWidth / 2;
        const startY = container.top + 150; // Leave space for header
        
        return {
          x: startX + col * (cardWidth + gap) + cardWidth / 2,
          y: startY + row * (cardHeight + gap) + cardHeight / 2
        };
      });
      
      setCardPositions(positions);
    }
  }, [openedCards]);

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
      // Start scoring immediately when cards are available
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
        
        // Add floating text
        const pos = cardPositions[currentIndex];
        if (pos) {
          const newFloatingText = {
            id: `float-${Date.now()}-${currentIndex}`,
            text: `+${currentPackPPValues[currentIndex]} PP`,
            x: pos.x,
            y: pos.y,
            color: currentPackPPValues[currentIndex] > 50 ? '#f59e0b' : '#fbbf24'
          };
          
          setFloatingTexts(prev => [...prev, newFloatingText]);
        }
        
        currentIndex++;
        setTimeout(scoreNext, 100);
      } else {
        // Scoring complete
        setTimeout(() => {
          setPhase('complete');
        }, 500);
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
    setCardPositions([]);
    
    // Call parent completion handler
    onComplete();
  };

  return (
    <div className="unified-pack-opening" ref={containerRef}>
      {/* Header */}
      <div className="opening-header">
        {phase === 'scoring' || phase === 'complete' ? (
          <div className="score-display">
            <span className="score-label">Total:</span>
            <span className="score-value">+{runningTotal} PP</span>
          </div>
        ) : null}
      </div>

      {/* Open Button */}
      {phase === 'ready' && stagedPacks.length > 0 && (
        <button 
          className={`open-packs-button ${buttonFading ? 'fading' : ''}`}
          onClick={handleOpenClick}
          disabled={isOpening}
        >
          <span className="button-icon">⚡</span>
          <span className="button-text">Open {stagedPacks.length} Pack{stagedPacks.length !== 1 ? 's' : ''}</span>
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
            >
              {index <= scoringIndex ? (
                <Card card={card} showTooltip={false} />
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
          Continue
        </button>
      )}


      {/* Floating Texts */}
      {floatingTexts.map(text => (
        <FloatingText
          key={text.id}
          text={text.text}
          x={text.x}
          y={text.y}
          color={text.color}
          onComplete={() => handleFloatingTextComplete(text.id)}
        />
      ))}
    </div>
  );
};

export default UnifiedPackOpening;