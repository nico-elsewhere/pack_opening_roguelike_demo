import React, { useState, useEffect } from 'react';
import './DebugPackSelector.css';

const DebugPackSelector = ({ deckTemplate, onSetDebugPack, collection, gameState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheats, setShowCheats] = useState(false);
  const [keepDebugPack, setKeepDebugPack] = useState(false);
  const [scoringSpeed, setScoringSpeed] = useState(1.0);
  
  // Filter available cards based on search
  const filteredCards = deckTemplate.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (card.rarity && card.rarity.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (card.generation && card.generation.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const addCard = (card) => {
    if (selectedCards.length < 10) { // Max 10 cards for testing
      setSelectedCards([...selectedCards, { ...card }]);
    }
  };
  
  const removeCard = (index) => {
    setSelectedCards(selectedCards.filter((_, i) => i !== index));
  };
  
  const applyDebugPack = () => {
    if (selectedCards.length > 0) {
      // Pass both the cards and whether to keep them
      onSetDebugPack({ cards: selectedCards, keepPersistent: keepDebugPack });
      setIsOpen(false);
    }
  };
  
  const clearDebugPack = () => {
    onSetDebugPack(null);
    setSelectedCards([]);
    setKeepDebugPack(false);
  };
  
  const addMultipleFreds = () => {
    const fred = deckTemplate.find(c => c.name === 'Fred');
    if (fred) {
      const freds = Array(5).fill(null).map(() => ({ ...fred }));
      setSelectedCards(freds);
    }
  };
  
  const addOneOfEach = () => {
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const cards = [];
    rarities.forEach(rarity => {
      const card = deckTemplate.find(c => c.rarity === rarity);
      if (card) cards.push(card);
    });
    setSelectedCards(cards);
  };
  
  const addManacliteTest = () => {
    const manaclite = deckTemplate.find(c => c.name === 'Manaclite');
    if (manaclite) {
      // Add 3 Manaclites and 2 other high value cards
      const cards = [
        { ...manaclite },
        { ...manaclite },
        { ...manaclite }
      ];
      
      // Add some high value cards to see the multiplier effect
      const highValueCards = deckTemplate
        .filter(c => c.ppValue >= 15 && c.name !== 'Manaclite')
        .slice(0, 2);
      
      cards.push(...highValueCards);
      setSelectedCards(cards);
    }
  };
  
  // Cheat functions
  const add1000PP = () => {
    if (gameState && gameState.setPP) {
      gameState.setPP(prev => prev + 1000);
    }
  };
  
  const add10000PP = () => {
    if (gameState && gameState.setPP) {
      gameState.setPP(prev => prev + 10000);
    }
  };
  
  const levelUpAllCards = () => {
    if (gameState && gameState.setCollection) {
      const newCollection = { ...collection };
      Object.keys(newCollection).forEach(cardId => {
        newCollection[cardId].level = Math.min(newCollection[cardId].level + 1, 10);
        newCollection[cardId].xp = 0;
      });
      gameState.setCollection(newCollection);
    }
  };
  
  // Update scoring speed in game state when slider changes
  useEffect(() => {
    if (gameState && gameState.setScoringSpeedMultiplier) {
      gameState.setScoringSpeedMultiplier(scoringSpeed);
    }
  }, [scoringSpeed, gameState]);
  
  return (
    <div className="debug-pack-selector">
      <div className="debug-buttons">
        <button 
          className="debug-toggle"
          onClick={() => setIsOpen(!isOpen)}
          title="Debug: Set Next Pack Contents"
        >
          🔧
        </button>
        <button 
          className="debug-toggle cheats"
          onClick={() => setShowCheats(!showCheats)}
          title="Debug: Cheats"
        >
          💰
        </button>
      </div>
      
      {isOpen && (
        <div className="debug-panel">
          <div className="debug-header">
            <h3>Debug: Set Next Pack Contents</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="debug-controls">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <div className="quick-actions">
              <button onClick={addMultipleFreds}>5x Fred</button>
              <button onClick={addOneOfEach}>One of Each Rarity</button>
              <button onClick={addManacliteTest}>Manaclite Test</button>
              <button onClick={clearDebugPack}>Clear Debug</button>
            </div>
          </div>
          
          <div className="selected-cards">
            <h4>Selected Cards ({selectedCards.length}/10):</h4>
            <div className="selected-list">
              {selectedCards.map((card, index) => (
                <div key={index} className="selected-card">
                  <span>{card.name}</span>
                  <span className={`rarity ${card.rarity}`}>{card.rarity}</span>
                  <button onClick={() => removeCard(index)}>×</button>
                </div>
              ))}
            </div>
            {selectedCards.length > 0 && (
              <>
                <div className="debug-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={keepDebugPack}
                      onChange={(e) => setKeepDebugPack(e.target.checked)}
                    />
                    <span>Keep debug pack (don't clear after use)</span>
                  </label>
                </div>
                <button className="apply-button" onClick={applyDebugPack}>
                  Apply Debug Pack
                </button>
              </>
            )}
          </div>
          
          <div className="available-cards">
            <h4>Available Cards:</h4>
            <div className="cards-grid">
              {filteredCards.map(card => {
                const selectedCount = selectedCards.filter(c => c.id === card.id).length;
                const cardLevel = collection[card.id]?.level || 1;
                return (
                  <div 
                    key={card.id} 
                    className={`card-option ${selectedCount > 0 ? 'selected' : ''} ${card.rarity}`}
                    onClick={() => addCard(card)}
                  >
                    <div className="card-name">
                      {card.name}
                      {selectedCount > 0 && (
                        <span className="selected-count">×{selectedCount}</span>
                      )}
                    </div>
                    <div className="card-info">
                      <span className="card-rarity">{card.rarity}</span>
                      <span className="card-pp">+{card.ppValue * cardLevel} PP</span>
                      {cardLevel > 1 && <span className="card-level">Lv.{cardLevel}</span>}
                    </div>
                    {card.generation && (
                      <div className="card-gen">{card.generation}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {showCheats && (
        <div className="cheat-panel">
          <div className="cheat-header">
            <h3>Debug Cheats</h3>
            <button className="close-button" onClick={() => setShowCheats(false)}>×</button>
          </div>
          <div className="cheat-buttons">
            <button onClick={add1000PP}>+1,000 PP</button>
            <button onClick={add10000PP}>+10,000 PP</button>
            <button onClick={levelUpAllCards}>Level Up All Cards</button>
          </div>
          
          <div className="scoring-speed-control">
            <h4>Scoring Animation Speed</h4>
            <div className="speed-slider-container">
              <label>
                <span className="speed-label">Speed: {scoringSpeed.toFixed(1)}x</span>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={scoringSpeed}
                  onChange={(e) => setScoringSpeed(parseFloat(e.target.value))}
                  className="speed-slider"
                />
                <div className="speed-marks">
                  <span>0.1x</span>
                  <span>1.0x</span>
                  <span>3.0x</span>
                </div>
              </label>
              <div className="speed-hints">
                <span className="hint-slow">Slower ←</span>
                <span className="hint-normal">Normal</span>
                <span className="hint-fast">→ Faster</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPackSelector;