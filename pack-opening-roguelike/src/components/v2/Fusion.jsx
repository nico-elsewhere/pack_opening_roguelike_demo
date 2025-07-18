import React, { useState, useEffect } from 'react';
import './Fusion.css';
import Card from '../Card';
import { canFuseCards, generateFusedCard, calculateFusionCost, FUSION_SUITS } from '../../utils/fusionCards';
import { breedCreatures } from '../../utils/creatureAPI';

const Fusion = ({ collection, fuseCards, pp }) => {
  const [selectedCard1, setSelectedCard1] = useState(null);
  const [selectedCard2, setSelectedCard2] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [overlayResult, setOverlayResult] = useState(null);
  
  const cards = Object.values(collection);
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [selectedGeneration, setSelectedGeneration] = useState('all');
  
  // Show all breedable creatures
  let availableCards = cards.filter(card => {
    // Only show Gen1 and Gen2 creatures (Gen3 can't breed further)
    if (!(card.generation === 'Gen1' || card.generation === 'Gen2')) {
      return false;
    }
    
    // Apply rarity filter
    if (selectedRarity !== 'all' && card.rarity !== selectedRarity) {
      return false;
    }
    
    // Apply generation filter
    if (selectedGeneration !== 'all' && card.generation !== selectedGeneration) {
      return false;
    }
    
    return true;
  });
  
  // Further filter if a card is selected
  if (selectedCard1 || selectedCard2) {
    const referenceCard = selectedCard1 || selectedCard2;
    availableCards = availableCards.filter(card => {
      // Don't show the already selected cards
      if (card.id === selectedCard1?.id || card.id === selectedCard2?.id) return false;
      
      // For creatures, check breeding compatibility
      if (referenceCard.generation && card.generation) {
        // Gen1 + Gen1 = Gen2 ✓
        if (referenceCard.generation === 'Gen1' && card.generation === 'Gen1') {
          return true;
        }
        // Gen2 + Gen1 = Gen3 ✓ (either order)
        if ((referenceCard.generation === 'Gen2' && card.generation === 'Gen1') ||
            (referenceCard.generation === 'Gen1' && card.generation === 'Gen2')) {
          return true;
        }
        // Gen2 + Gen2 = Gen3 ✓
        if (referenceCard.generation === 'Gen2' && card.generation === 'Gen2') {
          return true;
        }
        // Any combination with Gen3 is not allowed
        return false;
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
    }
  };
  
  // Calculate preview card without setting state during render
  let previewCard = null;
  let cannotFuse = false;
  let isCreatureFusion = false;
  
  if (selectedCard1 && selectedCard2) {
    // Check if they are creatures that can breed
    if (selectedCard1.generation && selectedCard2.generation) {
      // Determine if breeding is valid
      const gen1 = selectedCard1.generation;
      const gen2 = selectedCard2.generation;
      
      let resultGeneration = null;
      
      // Gen1 + Gen1 = Gen2
      if (gen1 === 'Gen1' && gen2 === 'Gen1') {
        resultGeneration = 'Gen2';
      }
      // Gen2 + Gen1 = Gen3 (either order)
      else if ((gen1 === 'Gen2' && gen2 === 'Gen1') || (gen1 === 'Gen1' && gen2 === 'Gen2')) {
        resultGeneration = 'Gen3';
      }
      // Gen2 + Gen2 = Gen3
      else if (gen1 === 'Gen2' && gen2 === 'Gen2') {
        resultGeneration = 'Gen3';
      }
      
      if (resultGeneration) {
        isCreatureFusion = true;
        // For creatures, we'll show a placeholder preview
        previewCard = {
          id: 'preview',
          name: '???',
          ppValue: Math.round((selectedCard1.ppValue + selectedCard2.ppValue) / 2),
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          arcana: 'creature',
          generation: resultGeneration,
          rarity: 'uncommon'
        };
      } else {
        cannotFuse = true;
      }
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
        setError('Failed to fuse creatures. Please try again.');
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
      // Reset selection
      setSelectedCard1(null);
      setSelectedCard2(null);
      
      // Clear overlay states
      setShowResultOverlay(false);
      setOverlayResult(null);
      setIsAnimating(false);
    }
  };
  
  return (
    <div className="fusion-page">
      
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
          
          <div className={`fusion-result-slot ${previewCard ? 'preview' : ''}`}>
            <div className="empty-result-slot">
              <span className="result-hint">?</span>
            </div>
          </div>
        </div>
        
        {/* Fusion cost in fixed position */}
        <div className="fusion-cost-display">
          <span className="cost-label">Cost:</span>
          <span className={`cost-value ${!previewCard ? 'inactive' : (canAfford ? 'affordable' : 'expensive')}`}>
            {previewCard ? `${fusionCost} PP` : '---'}
          </span>
        </div>
        
        {error && (
          <div className="fusion-error">{error}</div>
        )}
        
        <button 
          className="fusion-button"
          onClick={handleFusion}
          disabled={!previewCard || !canAfford || isAnimating}
        >
          {isAnimating ? 'Fusing...' : (
            <>
              <span className="button-text-desktop">
                Fuse Creatures
              </span>
              <span className="button-text-mobile">
                {previewCard ? `Fuse Creatures: ${fusionCost} PP` : 'Fuse'}
              </span>
            </>
          )}
        </button>
      </div>
      
      <div className="available-cards">
        <div className="cards-header">
          <div className="filter-controls">
            <div className="filter-group">
              <label className="filter-label">Rarity:</label>
              <select 
                className="filter-select" 
                value={selectedRarity} 
                onChange={(e) => setSelectedRarity(e.target.value)}
                disabled={selectedCard1 || selectedCard2}
              >
                <option value="all">All</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Generation:</label>
              <select 
                className="filter-select" 
                value={selectedGeneration} 
                onChange={(e) => setSelectedGeneration(e.target.value)}
                disabled={selectedCard1 || selectedCard2}
              >
                <option value="all">All</option>
                <option value="Gen1">Gen 1</option>
                <option value="Gen2">Gen 2</option>
              </select>
            </div>
          </div>
        </div>
        <div className="cards-grid">
          {availableCards.length === 0 ? (
            <div className="no-cards-message">
              {selectedCard1 || selectedCard2 ? (
                <p>No compatible creatures found. Try selecting a different creature.</p>
              ) : (
                <p>No creatures match your filter criteria.</p>
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
                <div className="result-card-display">
                  {overlayResult ? (
                    <Card card={overlayResult} />
                  ) : (
                    <div style={{color: 'white'}}>Loading...</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Flavor text anchored to card */}
            {showResultOverlay && overlayResult?.flavorText && (
              <div className="flavor-text-box">
                <p className="typed-flavor-text">
                  {overlayResult.flavorText}
                </p>
              </div>
            )}
          </div>
          
          {/* Flavor text as part of the result display */}
          
        </div>
      )}
    </div>
  );
};

export default Fusion;