import React from 'react';
import './Header.css';

const Header = ({ 
  pp, 
  ppPerSecond, 
  currentScreen, 
  setCurrentScreen,
  equippedRunes,
  totalCardsOpened,
  collection,
  gameMode,
  setGameMode,
  selectedArchetype,
  currentDream,
  dreamScore,
  dreamThreshold
}) => {
  const uniqueCards = Object.keys(collection).length;
  
  return (
    <header className="header glass">
      <div className="header-left">
      </div>
      
      <nav className="nav-tabs">
      </nav>
      
      <div className="header-right">
        {gameMode === 'roguelike' && currentDream ? (
          <div className="roguelike-stats">
            <div className="stat-item">
              <span className="stat-icon">🌙</span>
              <span className="stat-value">Dream {currentDream}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{dreamScore}/{dreamThreshold}</span>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;