import React, { useState, useEffect } from 'react';
import './DreamReward.css';
import Card from '../Card';
import { MEMENTOS } from '../../utils/archetypes';

const DreamReward = ({ 
  dreamNumber, 
  wasNightmare, 
  selectedArchetype,
  collection,
  archetypeMementos,
  onRewardSelected,
  onContinue 
}) => {
  const [rewardType, setRewardType] = useState(null);
  const [rewardOptions, setRewardOptions] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    generateRewardOptions();
  }, []);

  const generateRewardOptions = () => {
    // Nightmares give mementos
    if (wasNightmare && selectedArchetype) {
      const archetypeMementoPool = MEMENTOS[selectedArchetype.id] || [];
      const availableMementos = archetypeMementoPool.filter(
        m => !archetypeMementos.find(owned => owned.id === m.id)
      );
      
      if (availableMementos.length > 0) {
        // Pick 2 random mementos to choose from
        const shuffled = [...availableMementos].sort(() => 0.5 - Math.random());
        setRewardOptions(shuffled.slice(0, Math.min(2, shuffled.length)));
        setRewardType('memento');
        return;
      }
    }

    // Regular dreams give card upgrades
    generateCardUpgradeOptions();
  };

  const generateCardUpgradeOptions = () => {
    // Get all cards that can be upgraded (not at max level)
    const upgradeableCards = Object.values(collection).filter(
      card => card.level < 10 // Assuming max level is 10
    );

    if (upgradeableCards.length >= 3) {
      // Pick 5 random cards to choose 3 from
      const shuffled = [...upgradeableCards].sort(() => 0.5 - Math.random());
      setRewardOptions(shuffled.slice(0, Math.min(5, shuffled.length)));
      setRewardType('upgrade');
    } else {
      // Not enough cards to upgrade, skip reward
      setRewardType('skip');
    }
  };

  const handleMementoSelect = (memento) => {
    setSelectedReward(memento);
  };

  const handleCardSelect = (card) => {
    if (rewardType !== 'upgrade') return;
    
    if (!selectedReward) {
      setSelectedReward([card]);
    } else if (selectedReward.length < 3) {
      if (!selectedReward.find(c => c.id === card.id)) {
        setSelectedReward([...selectedReward, card]);
      } else {
        setSelectedReward(selectedReward.filter(c => c.id !== card.id));
      }
    } else {
      // Already have 3, replace one
      if (selectedReward.find(c => c.id === card.id)) {
        setSelectedReward(selectedReward.filter(c => c.id !== card.id));
      }
    }
  };

  const confirmReward = () => {
    if (!selectedReward) return;
    
    setIsProcessing(true);
    
    if (rewardType === 'memento') {
      onRewardSelected({ type: 'memento', reward: selectedReward });
    } else if (rewardType === 'upgrade') {
      onRewardSelected({ type: 'upgrade', cards: selectedReward });
    }
    
    setTimeout(() => {
      onContinue();
    }, 500);
  };

  const skipReward = () => {
    onContinue();
  };

  return (
    <div className="dream-reward-overlay">
      <div className="dream-reward-container">
        <div className="reward-header">
          <h2>{wasNightmare ? 'Nightmare Conquered!' : 'Dream Complete!'}</h2>
          <p className="reward-subtitle">
            {wasNightmare ? 'Your trials have forged a powerful memento...' : 'Choose cards to strengthen for the journey ahead...'}
          </p>
        </div>

        {rewardType === 'memento' && (
          <div className="memento-selection">
            <h3>Choose Your Memento</h3>
            <div className="memento-options">
              {rewardOptions.map(memento => (
                <div
                  key={memento.id}
                  className={`memento-card ${selectedReward?.id === memento.id ? 'selected' : ''}`}
                  onClick={() => handleMementoSelect(memento)}
                >
                  <div className="memento-icon">{selectedArchetype.icon}</div>
                  <h4>{memento.name}</h4>
                  <p>{memento.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {rewardType === 'upgrade' && (
          <div className="upgrade-selection">
            <h3>Upgrade 3 Cards</h3>
            <div className="upgrade-cards">
              {rewardOptions.map(card => (
                <div
                  key={card.id}
                  className={`upgrade-card-wrapper ${
                    selectedReward?.find(c => c.id === card.id) ? 'selected' : ''
                  }`}
                  onClick={() => handleCardSelect(card)}
                >
                  <Card card={card} showLevel={true} showTooltip={true} />
                  <div className="upgrade-preview">
                    Lv.{card.level} → Lv.{card.level + 1}
                  </div>
                </div>
              ))}
            </div>
            {selectedReward && (
              <p className="selection-count">
                {selectedReward.length}/3 cards selected
              </p>
            )}
          </div>
        )}

        {rewardType === 'skip' && (
          <div className="no-rewards">
            <p>No rewards available at this time.</p>
          </div>
        )}

        <div className="reward-actions">
          {rewardType !== 'skip' && (
            <button
              className="confirm-reward-btn"
              onClick={confirmReward}
              disabled={
                !selectedReward || 
                (rewardType === 'upgrade' && selectedReward.length !== 3) ||
                isProcessing
              }
            >
              {rewardType === 'upgrade' && selectedReward?.length !== 3
                ? `Select ${3 - (selectedReward?.length || 0)} more`
                : 'Confirm Selection'
              }
            </button>
          )}
          <button
            className="skip-reward-btn"
            onClick={skipReward}
            disabled={isProcessing}
          >
            {rewardType === 'skip' ? 'Continue' : 'Skip Reward'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DreamReward;