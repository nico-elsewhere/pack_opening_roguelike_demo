import React, { useState, useEffect } from 'react';
import './Fusion.css';
import Card from '../Card';
import { canFuseCards, generateFusedCard, calculateFusionCost, FUSION_SUITS } from '../../utils/fusionCards';
import { breedCreatures } from '../../utils/creatureAPI';

const Fusion = ({ collection, fuseCards, pp }) => {
  const [selectedCard1, setSelectedCard1] = useState(null);
  const [selectedCard2, setSelectedCard2] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fusionResult, setFusionResult] = useState(null);
  const [error, setError] = useState('');
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [overlayResult, setOverlayResult] = useState(null);
  
  const cards = Object.values(collection);
  const [showCreatures, setShowCreatures] = useState(true);
  
  // For creatures, show all Gen1 creatures; for old cards, use old logic
  let availableCards = cards.filter(card => {
    if (showCreatures) {
      // Show only Gen1 creatures
      return card.generation === 'Gen1';
    } else {
      // Old logic for elemental cards
      return ['fire', 'earth', 'water', 'air'].includes(card.suit);
    }
  });
  
  // Further filter if a card is selected
  if (selectedCard1 || selectedCard2) {
    const referenceCard = selectedCard1 || selectedCard2;
    availableCards = availableCards.filter(card => {
      // Don't show the already selected cards
      if (card.id === selectedCard1?.id || card.id === selectedCard2?.id) return false;
      
      // For creatures, all Gen1 can fuse with all other Gen1
      if (referenceCard.generation === 'Gen1' && card.generation === 'Gen1') {
        return true;
      }
      
      // For old cards, check if this card can fuse with the reference card
      return canFuseCards(referenceCard, card);
    });
  }
  
  const handleCardSelect = (card) => {
    if (isAnimating) return;
    
    setError(''); // Always clear error when selecting cards
    
    if (!selectedCard1) {
      setSelectedCard1(card);
    } else if (!selectedCard2 && card.id !== selectedCard1.id) {
      setSelectedCard2(card);
    } else {
      // Reset selection
      setSelectedCard1(card);
      setSelectedCard2(null);
      setFusionResult(null);
    }
  };
  
  // Calculate preview card without setting state during render
  let previewCard = null;
  let cannotFuse = false;
  let isCreatureFusion = false;
  
  if (selectedCard1 && selectedCard2) {
    // Check if both are Gen1 creatures
    if (selectedCard1.generation === 'Gen1' && selectedCard2.generation === 'Gen1') {
      isCreatureFusion = true;
      // For creatures, we'll show a placeholder preview
      previewCard = {
        id: 'preview',
        name: '???',
        ppValue: (selectedCard1.ppValue + selectedCard2.ppValue) / 2,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        arcana: 'creature',
        generation: 'Gen2',
        rarity: 'uncommon'
      };
    } else if (canFuseCards(selectedCard1, selectedCard2)) {
      previewCard = generateFusedCard(selectedCard1, selectedCard2);
    } else {
      cannotFuse = true;
    }
  }
  
  const fusionCost = selectedCard1 && selectedCard2 ? 
    (isCreatureFusion ? 100 : calculateFusionCost(selectedCard1, selectedCard2)) : 0;
  const canAfford = pp >= fusionCost;
  
  // Set error in useEffect to avoid state updates during render
  useEffect(() => {
    if (cannotFuse && selectedCard1 && selectedCard2) {
      setError('These cards cannot be fused');
    } else {
      setError('');
    }
  }, [cannotFuse, selectedCard1, selectedCard2]);
  
  
  const handleFusion = async () => {
    if (!selectedCard1 || !selectedCard2 || !previewCard || !canAfford) return;
    
    setIsAnimating(true);
    setError('');
    
    // Start fusion animation
    setTimeout(async () => {
      try {
        let result;
        
        if (isCreatureFusion) {
          // Use creature breeding API
          const bredCreature = await breedCreatures(selectedCard1.id, selectedCard2.id);
          // Call the game's fuseCards to handle inventory management
          result = fuseCards(selectedCard1.id, selectedCard2.id, bredCreature);
        } else {
          // Use old fusion logic
          result = fuseCards(selectedCard1.id, selectedCard2.id);
        }
        
        if (result.success) {
          // Show result in overlay first
          setTimeout(() => {
            console.log('Setting overlay result:', result.fusedCard);
            setOverlayResult(result.fusedCard);
            // Small delay before flipping to show the ? card and mystical effects
            setTimeout(() => {
              setShowResultOverlay(true);
            }, 800);
          }, 1000); // Delay to show animation first
          
        } else {
          setError(result.message);
          setIsAnimating(false);
        }
      } catch (error) {
        console.error('Fusion error:', error);
        setError('Failed to breed creatures. Please try again.');
        setIsAnimating(false);
      }
    }, 1500);
  };
  
  const getFusionSuitInfo = (card) => {
    if (!card || !card.isFused) return null;
    return FUSION_SUITS[card.suit];
  };
  
  const handleOverlayDismiss = () => {
    if (showResultOverlay && overlayResult) {
      // Update the main UI with the result
      setFusionResult(overlayResult);
      setSelectedCard1(null);
      setSelectedCard2(null);
      
      // Clear overlay states
      setShowResultOverlay(false);
      setOverlayResult(null);
      setIsAnimating(false);
      
      // Clear the result from main UI after a short delay
      setTimeout(() => {
        setFusionResult(null);
      }, 2000);
    }
  };
  
  return (
    <div className="fusion-page">
      <div className="fusion-header">
        <h1>Creature Breeding Lab</h1>
        <p className="fusion-subtitle">
          {showCreatures ? 
            "Breed two Gen1 creatures to create new Gen2 hybrids" : 
            "Combine two cards of the same rank to create powerful hybrids"}
        </p>
      </div>
      
      <div className="fusion-workspace">
        <div className="fusion-slots">
          <div className={`fusion-slot ${selectedCard1 ? 'filled' : ''} ${isAnimating ? 'animating' : ''}`}>
            {selectedCard1 ? (
              <Card card={selectedCard1} onClick={() => !isAnimating && setSelectedCard1(null)} />
            ) : (
              <div className="empty-fusion-slot">
                <span className="slot-number">1</span>
                <span className="slot-hint">Select First Card</span>
              </div>
            )}
          </div>
          
          <div className="fusion-operator">
            <span className="fusion-plus">+</span>
          </div>
          
          <div className={`fusion-slot ${selectedCard2 ? 'filled' : ''} ${isAnimating ? 'animating' : ''}`}>
            {selectedCard2 ? (
              <Card card={selectedCard2} onClick={() => !isAnimating && setSelectedCard2(null)} />
            ) : (
              <div className="empty-fusion-slot">
                <span className="slot-number">2</span>
                <span className="slot-hint">Select Second Card</span>
              </div>
            )}
          </div>
          
          <div className="fusion-arrow">
            <span>→</span>
          </div>
          
          <div className={`fusion-result-slot ${previewCard ? 'preview' : ''} ${fusionResult ? 'success' : ''}`}>
            {fusionResult ? (
              <div className="fusion-success">
                <Card card={fusionResult} />
                <div className="success-message">
                  {fusionResult?.generation === 'Gen2' ? 'Breeding Complete!' : 'Fusion Complete!'}
                </div>
              </div>
            ) : previewCard ? (
              <div className="preview-card">
                <Card card={previewCard} />
              </div>
            ) : (
              <div className="empty-result-slot">
                <span className="result-hint">?</span>
              </div>
            )}
          </div>
        </div>
        
        {previewCard && (
          <div className="fusion-info">
            <div className="fusion-cost">
              <span className="cost-label">Fusion Cost:</span>
              <span className={`cost-value ${canAfford ? 'affordable' : 'expensive'}`}>
                {fusionCost} PP
              </span>
            </div>
            {previewCard.description && (
              <div className="fusion-description">
                {previewCard.description}
              </div>
            )}
            {previewCard.isFused && getFusionSuitInfo(previewCard) && (
              <div className="fusion-description">
                {getFusionSuitInfo(previewCard).description}
              </div>
            )}
            {previewCard.arcana && ['transcendent', 'empowered', 'enhanced-minor'].includes(previewCard.arcana) && (
              <div className="tarot-fusion-badge">✨ Mystical Fusion ✨</div>
            )}
          </div>
        )}
        
        {error && (
          <div className="fusion-error">{error}</div>
        )}
        
        <button 
          className="fusion-button"
          onClick={handleFusion}
          disabled={!previewCard || !canAfford || isAnimating}
        >
          {isAnimating ? (isCreatureFusion ? 'Breeding...' : 'Fusing...') : 
           (isCreatureFusion ? 'Breed Creatures' : 'Fuse Cards')}
        </button>
      </div>
      
      <div className="available-cards">
        <div className="cards-header">
          <h2>
            Available Cards
            {(selectedCard1 || selectedCard2) && (
              <span className="filter-indicator"> (Showing compatible cards)</span>
            )}
          </h2>
          <div className="filter-toggle">
            <button 
              className={`toggle-btn ${showCreatures ? 'active' : ''}`}
              onClick={() => setShowCreatures(true)}
              disabled={selectedCard1 || selectedCard2}
            >
              Creatures
            </button>
            <button 
              className={`toggle-btn ${!showCreatures ? 'active' : ''}`}
              onClick={() => setShowCreatures(false)}
              disabled={selectedCard1 || selectedCard2}
            >
              Elemental Cards
            </button>
          </div>
        </div>
        <div className="cards-grid">
          {availableCards.length === 0 ? (
            <div className="no-cards-message">
              {selectedCard1 || selectedCard2 ? (
                <p>No compatible cards found. {showCreatures ? 'Select another Gen1 creature.' : 'Try selecting a different card.'}</p>
              ) : (
                <p>No {showCreatures ? 'Gen1 creatures' : 'cards'} available.</p>
              )}
            </div>
          ) : (
            availableCards.map(card => (
              <div 
                key={card.id} 
                className={`card-wrapper ${
                  selectedCard1?.id === card.id || selectedCard2?.id === card.id ? 'selected' : ''
                }`}
              >
                <Card 
                  card={card} 
                  onClick={() => handleCardSelect(card)}
                  showLevel={false}
                />
              </div>
            ))
          )}
        </div>
      </div>
      
      {isAnimating && (
        <div 
          className={`fusion-animation-overlay ${
            (selectedCard1?.arcana || selectedCard2?.arcana || isCreatureFusion) ? 'tarot-fusion' : ''
          }`}
          onClick={showResultOverlay ? handleOverlayDismiss : null}
          style={{ cursor: showResultOverlay ? 'pointer' : 'default' }}
        >
          {/* Background particles */}
          <div className="fusion-particles">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`particle particle-${i}`}></div>
            ))}
          </div>
          
          {/* Mystical effects for tarot/creatures */}
          {(selectedCard1?.arcana || selectedCard2?.arcana || isCreatureFusion) && (
            <div className="tarot-fusion-effects">
              <div className="mystical-ring"></div>
              <div className="mystical-symbols">
                {['☽', '☆', '✦', '◈'].map((symbol, i) => (
                  <span key={i} className={`symbol symbol-${i}`}>{symbol}</span>
                ))}
              </div>
            </div>
          )}
          
          {/* Centered result display with 3D flip */}
          <div className="fusion-overlay-result">
            <div className={`card-flip-container ${showResultOverlay ? 'flipped' : ''}`}>
              {/* Front face - Mystery card */}
              <div className="card-face card-face-front">
                <div className="mystery-card">
                  <span className="mystery-text">?</span>
                </div>
              </div>
              
              {/* Back face - Result card */}
              <div className="card-face card-face-back">
                {overlayResult && (
                  <Card card={overlayResult} />
                )}
              </div>
            </div>
          </div>
          
          {/* Flavor text as separate element */}
          {showResultOverlay && overlayResult?.flavorText && (
            <div className="flavor-text-box">
              <p className="typed-flavor-text">
                {overlayResult.flavorText}
              </p>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
};

export default Fusion;