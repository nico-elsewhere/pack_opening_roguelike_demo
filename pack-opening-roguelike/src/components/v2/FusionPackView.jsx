import React, { useState, useEffect } from 'react';
import './FusionPackView.css';
import Card from '../Card';
import { canFuseCards, generateFusedCard, calculateFusionCost } from '../../utils/fusionCards';
import { breedCreatures } from '../../utils/creatureAPI';
import FusionDialogue from './FusionDialogue';

const FusionPackView = ({ collection, fuseCards, pp, onComplete, onBack, gameMode, selectedArchetype }) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedCard1, setSelectedCard1] = useState(null);
  const [selectedCard2, setSelectedCard2] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previewCard, setPreviewCard] = useState(null);
  const [fusionResult, setFusionResult] = useState(null);
  const [showFlippedCard, setShowFlippedCard] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);

  useEffect(() => {
    // Select 5 random Gen1/Gen2 cards from collection that can be fused
    const eligibleCards = Object.values(collection).filter(card => {
      return card.generation === 'Gen1' || card.generation === 'Gen2';
    });

    console.log('FusionPackView - eligible cards:', eligibleCards.length);
    console.log('Collection:', collection);

    if (eligibleCards.length >= 2) {
      // Shuffle and pick up to 5 cards
      const shuffled = [...eligibleCards].sort(() => 0.5 - Math.random());
      setSelectedCards(shuffled.slice(0, Math.min(5, shuffled.length)));
    }
    // Don't automatically go back - let player see the issue and manually go back
  }, []); // Empty dependency - only select cards once on mount

  useEffect(() => {
    // Generate preview when both cards are selected
    if (selectedCard1 && selectedCard2) {
      generatePreview();
    } else {
      setPreviewCard(null);
    }
  }, [selectedCard1, selectedCard2]);

  const generatePreview = async () => {
    if (!selectedCard1 || !selectedCard2) return;

    // For creatures, check breeding
    if (selectedCard1.generation && selectedCard2.generation) {
      setPreviewCard({
        name: '???',
        ppValue: '?',
        rarity: 'legendary',
        isCreature: true,
        generation: getResultGeneration(selectedCard1.generation, selectedCard2.generation)
      });
    } else {
      // Regular fusion
      const fused = generateFusedCard(selectedCard1, selectedCard2);
      setPreviewCard(fused);
    }
  };

  const getResultGeneration = (gen1, gen2) => {
    if (gen1 === 'Gen1' && gen2 === 'Gen1') return 'Gen2';
    return 'Gen3';
  };

  const handleCardSelect = (card) => {
    if (isAnimating) return;

    if (!selectedCard1) {
      setSelectedCard1(card);
    } else if (!selectedCard2 && card.id !== selectedCard1.id) {
      setSelectedCard2(card);
    } else {
      // Reselect
      setSelectedCard1(card);
      setSelectedCard2(null);
    }
  };

  const handleFuse = async () => {
    if (!selectedCard1 || !selectedCard2 || isAnimating) return;

    setIsAnimating(true);

    // Start fusion animation after delay
    setTimeout(async () => {
      try {
        let result;
        
        if (selectedCard1.generation && selectedCard2.generation) {
          // Use creature breeding API with parent data for inheritance
          const bredCreature = await breedCreatures(selectedCard1.id, selectedCard2.id, selectedCard1, selectedCard2);
          console.log('Bred creature:', bredCreature);
          
          // Call the game's fuseCards to handle inventory management
          result = fuseCards(selectedCard1.id, selectedCard2.id, bredCreature);
        } else {
          // Use old fusion logic
          result = fuseCards(selectedCard1.id, selectedCard2.id);
        }
        
        console.log('Fusion result:', result);
        
        if (result && result.success) {
          setFusionResult(result.fusedCard);
          
          // Flip the card after a short delay
          setTimeout(() => {
            setShowFlippedCard(true);
            // Show continue button after flip completes
            setTimeout(() => {
              setShowContinueButton(true);
            }, 800);
          }, 1000);
        } else {
          console.error('Fusion failed:', result);
          setIsAnimating(false);
        }
      } catch (error) {
        console.error('Fusion error:', error);
        setIsAnimating(false);
      }
    }, 1500);
  };

  const getFusionCost = () => {
    if (!selectedCard1 || !selectedCard2) return 0;
    if (selectedCard1.generation === 'Gen1' && selectedCard2.generation === 'Gen1') {
      return 100;
    }
    return calculateFusionCost(selectedCard1, selectedCard2);
  };

  const canAffordFusion = () => {
    // Fusion is free in roguelike mode
    if (gameMode === 'roguelike') return true;
    return pp >= getFusionCost();
  };

  return (
    <div className="fusion-pack-view">
      <div className="fusion-pack-header">
        <button className="back-button" onClick={onBack} disabled={isAnimating}>
          ← Back
        </button>
        <h2>Fusion Pack</h2>
        <p className="fusion-pack-subtitle">Choose two cards to fuse</p>
      </div>

      <div className="fusion-area">
        <div className="fusion-cards-container">
          {selectedCards.map((card, index) => {
            const isSelected = selectedCard1?.id === card.id || selectedCard2?.id === card.id;
            const selectionNumber = selectedCard1?.id === card.id ? 1 : selectedCard2?.id === card.id ? 2 : null;

            return (
              <div
                key={card.id}
                className={`fusion-card-wrapper ${isSelected ? 'selected' : ''} ${isAnimating ? 'animating' : ''}`}
                onClick={() => handleCardSelect(card)}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <Card card={card} showLevel={true} />
                {selectionNumber && (
                  <div className="selection-badge">{selectionNumber}</div>
                )}
              </div>
            );
          })}
        </div>

        {selectedCard1 && selectedCard2 && (
          <div className="fusion-preview">
            <div className="fusion-equation">
              <div className="mini-card">
                <Card card={selectedCard1} />
              </div>
              <span className="fusion-plus">+</span>
              <div className="mini-card">
                <Card card={selectedCard2} />
              </div>
              <span className="fusion-equals">=</span>
              <div className={`mini-card preview ${isAnimating ? 'glowing' : ''}`}>
                {previewCard && <Card card={previewCard} />}
              </div>
            </div>
            
            <button 
              className="fuse-button"
              onClick={handleFuse}
              disabled={!canAffordFusion() || isAnimating}
            >
              {isAnimating ? 'Fusing...' : (gameMode === 'roguelike' ? 'Fuse' : `Fuse (${getFusionCost()} PP)`)}
            </button>
          </div>
        )}

        {isAnimating && (
          <div className="fusion-animation-overlay">
            {/* Background particles */}
            <div className="fusion-particles">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`particle particle-${i}`}></div>
              ))}
            </div>
            
            {/* Mystical effects for creatures */}
            {(selectedCard1?.generation && selectedCard2?.generation) && (
              <div className="tarot-fusion-effects">
                <div className="mystical-ring"></div>
                <div className="mystical-symbols">
                  {['☽', '☆', '✦', '◈'].map((symbol, i) => (
                    <span key={i} className={`symbol symbol-${i}`}>{symbol}</span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Mystery card that flips to reveal result */}
            <div className="fusion-overlay-result">
              <div className={`card-flip-container ${showFlippedCard ? 'flipped' : ''}`}>
                <div className="card-face card-face-front">
                  <div className="mystery-card">
                    <div className="mystery-text">?</div>
                  </div>
                </div>
                <div className="card-face card-face-back">
                  <div className="result-card-display">
                    {fusionResult && <Card card={fusionResult} />}
                  </div>
                </div>
              </div>
              
              {/* Show card info and continue button after flip */}
              {showContinueButton && fusionResult && (
                <div className="fusion-result-info">
                  <h3>{fusionResult.name}</h3>
                  {fusionResult.flavorText && (
                    <p className="flavor-text">{fusionResult.flavorText}</p>
                  )}
                  <button 
                    className="continue-button"
                    onClick={() => onComplete({
                      type: 'fusion',
                      fusedCard: fusionResult,
                      sourceCards: [selectedCard1, selectedCard2]
                    })}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
            )}
          </div>
        )}

        {/* Show Ruler dialogue during fusion */}
        {isAnimating && selectedArchetype && (
          <FusionDialogue
            archetype={selectedArchetype}
            fusedCard={fusionResult}
            sourceCards={[selectedCard1, selectedCard2]}
            isVisible={showFlippedCard}
          />
        )}

        {selectedCards.length < 2 && (
          <div className="no-cards-message">
            <p>Not enough cards to fuse. Need at least 2 Gen1 or Gen2 cards.</p>
            <button onClick={onBack}>Go Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FusionPackView;