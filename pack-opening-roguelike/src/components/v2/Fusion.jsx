import React, { useState, useEffect } from 'react';
import './Fusion.css';
import Card from '../Card';
import { canFuseCards, generateFusedCard, calculateFusionCost, FUSION_SUITS } from '../../utils/fusionCards';

const Fusion = ({ collection, fuseCards, pp }) => {
  const [selectedCard1, setSelectedCard1] = useState(null);
  const [selectedCard2, setSelectedCard2] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fusionResult, setFusionResult] = useState(null);
  const [error, setError] = useState('');
  
  const cards = Object.values(collection);
  const [showTarot, setShowTarot] = useState(true);
  
  // Filter cards based on toggle and fusion compatibility
  let availableCards = showTarot ? cards : cards.filter(card => ['fire', 'earth', 'water', 'air'].includes(card.suit));
  
  // Further filter by fusion compatibility if a card is selected
  if (selectedCard1 || selectedCard2) {
    const referenceCard = selectedCard1 || selectedCard2;
    availableCards = availableCards.filter(card => {
      // Don't show the already selected cards
      if (card.id === selectedCard1?.id || card.id === selectedCard2?.id) return false;
      
      // Check if this card can fuse with the reference card
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
  
  if (selectedCard1 && selectedCard2) {
    if (canFuseCards(selectedCard1, selectedCard2)) {
      previewCard = generateFusedCard(selectedCard1, selectedCard2);
    } else {
      cannotFuse = true;
    }
  }
  
  const fusionCost = selectedCard1 && selectedCard2 ? calculateFusionCost(selectedCard1, selectedCard2) : 0;
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
    setTimeout(() => {
      const result = fuseCards(selectedCard1.id, selectedCard2.id);
      
      if (result.success) {
        setFusionResult(result.fusedCard);
        setSelectedCard1(null);
        setSelectedCard2(null);
        
        // Clear result after showing
        setTimeout(() => {
          setFusionResult(null);
          setIsAnimating(false);
        }, 3000);
      } else {
        setError(result.message);
        setIsAnimating(false);
      }
    }, 1500);
  };
  
  const getFusionSuitInfo = (card) => {
    if (!card || !card.isFused) return null;
    return FUSION_SUITS[card.suit];
  };
  
  return (
    <div className="fusion-page">
      <div className="fusion-header">
        <h1>Card Fusion Lab</h1>
        <p className="fusion-subtitle">Combine two cards of the same rank to create powerful hybrids</p>
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
                <div className="success-message">Fusion Complete!</div>
              </div>
            ) : previewCard ? (
              <div className="preview-card">
                <Card card={previewCard} />
                <div className="preview-label">Preview</div>
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
          {isAnimating ? 'Fusing...' : 'Fuse Cards'}
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
              className={`toggle-btn ${!showTarot ? 'active' : ''}`}
              onClick={() => setShowTarot(false)}
              disabled={selectedCard1 || selectedCard2}
            >
              Elemental Only
            </button>
            <button 
              className={`toggle-btn ${showTarot ? 'active' : ''}`}
              onClick={() => setShowTarot(true)}
              disabled={selectedCard1 || selectedCard2}
            >
              All Cards
            </button>
          </div>
        </div>
        <div className="cards-grid">
          {availableCards.length === 0 ? (
            <div className="no-cards-message">
              {selectedCard1 || selectedCard2 ? (
                <p>No cards can be fused with the selected card. Try selecting a different card.</p>
              ) : (
                <p>No cards available.</p>
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
        <div className={`fusion-animation-overlay ${
          (selectedCard1?.arcana || selectedCard2?.arcana) ? 'tarot-fusion' : ''
        }`}>
          <div className="fusion-particles">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`particle particle-${i}`}></div>
            ))}
          </div>
          {(selectedCard1?.arcana || selectedCard2?.arcana) && (
            <div className="tarot-fusion-effects">
              <div className="mystical-ring"></div>
              <div className="mystical-symbols">
                {['☽', '☆', '✦', '◈'].map((symbol, i) => (
                  <span key={i} className={`symbol symbol-${i}`}>{symbol}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Fusion;