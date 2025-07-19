import React, { useState } from 'react';
import './DreamReward.css';
import PackRewardSelect from './PackRewardSelect';
import LevelPackView from './LevelPackView';
import FusionPackView from './FusionPackView';
import MementoPackView from './MementoPackView';

const DreamReward = ({ 
  dreamNumber, 
  wasNightmare, 
  selectedArchetype,
  collection,
  archetypeMementos,
  onRewardSelected,
  onContinue,
  fuseCards,
  pp,
  gameMode
}) => {
  const [currentView, setCurrentView] = useState('select'); // 'select', 'level', 'fusion', 'memento'
  const [selectedPackType, setSelectedPackType] = useState(null);

  const handlePackSelect = (packType) => {
    setSelectedPackType(packType);
    setCurrentView(packType);
  };

  const handleRewardComplete = (rewardData) => {
    onRewardSelected(rewardData);
    onContinue();
  };

  const handleBackToSelect = () => {
    setCurrentView('select');
    setSelectedPackType(null);
  };

  return (
    <div className="dream-reward-overlay">
      {currentView === 'select' && (
        <PackRewardSelect
          dreamNumber={dreamNumber}
          wasNightmare={wasNightmare}
          onPackSelect={handlePackSelect}
        />
      )}

      {currentView === 'level' && (
        <LevelPackView
          collection={collection}
          onComplete={handleRewardComplete}
          onBack={handleBackToSelect}
        />
      )}

      {currentView === 'fusion' && (
        <FusionPackView
          collection={collection}
          fuseCards={fuseCards}
          pp={pp}
          onComplete={handleRewardComplete}
          onBack={handleBackToSelect}
          gameMode={gameMode}
          selectedArchetype={selectedArchetype}
        />
      )}

      {currentView === 'memento' && (
        <MementoPackView
          selectedArchetype={selectedArchetype}
          existingMementos={archetypeMementos}
          onComplete={handleRewardComplete}
          onBack={handleBackToSelect}
        />
      )}
    </div>
  );
};

export default DreamReward;