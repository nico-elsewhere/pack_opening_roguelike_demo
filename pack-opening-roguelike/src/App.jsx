import React, { useState } from 'react';
import './App.css';
import { useGameState } from './hooks/useGameState';
import PackOpening from './components/PackOpening';
import Collection from './components/Collection';
import RuneSlots from './components/RuneSlots';

function App() {
  const {
    pp,
    collection,
    equippedRunes,
    currentPack,
    totalCardsOpened,
    canOpenPack,
    packCost,
    openPack,
    equipRune,
    setCurrentPack
  } = useGameState();

  const [activeTab, setActiveTab] = useState('collection');

  const handleOpenPack = () => {
    const result = openPack();
    if (result) {
      console.log(`Opened pack! Gained ${result.totalPPGained} PP`);
    }
  };

  const handleCardClick = (card) => {
    if (card.isRune) {
      equipRune(card.id);
    }
  };

  return (
    <div className="app">
      <div className="game-header">
        <div className="pp-display">
          PP: {pp}
        </div>
        <div className="stats">
          <div>Cards Opened: {totalCardsOpened}</div>
          <div>Unique Cards: {Object.keys(collection).length}/52</div>
        </div>
      </div>

      <div className="main-content">
        <div className="left-section">
          <div className="pack-section">
            <h1>Pack Opening Roguelike</h1>
            <button 
              className="open-pack-button"
              onClick={handleOpenPack}
              disabled={!canOpenPack}
            >
              Open Pack
            </button>
            <div className="pack-cost">Cost: {packCost} PP</div>
          </div>

          <RuneSlots equippedRunes={equippedRunes} />
        </div>

        <div className="right-section">
          <Collection 
            collection={collection} 
            onCardClick={handleCardClick}
          />
        </div>
      </div>

      {currentPack && (
        <PackOpening 
          pack={currentPack} 
          onClose={() => setCurrentPack(null)}
        />
      )}
    </div>
  );
}

export default App;