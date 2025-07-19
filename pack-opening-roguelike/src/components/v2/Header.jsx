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
        <div className="game-logo">
          <span className="logo-icon">🎴</span>
          <span className="logo-text">Mystic Cards</span>
        </div>
      </div>
      
      <nav className="nav-tabs">
        <button 
          className={`nav-tab ${currentScreen === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('home')}
        >
          Play
        </button>
        <button 
          className={`nav-tab ${currentScreen === 'collection' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('collection')}
        >
          Collection
        </button>
        <button 
          className={`nav-tab ${currentScreen === 'shop' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('shop')}
        >
          Shop
        </button>
        <button 
          className={`nav-tab ${currentScreen === 'fusion' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('fusion')}
        >
          Fusion
        </button>
        {gameMode === 'classic' && (
          <button 
            className={`nav-tab archetype-tab`}
            onClick={() => setCurrentScreen('archetype')}
          >
            🌟 Roguelike
          </button>
        )}
        {gameMode === 'roguelike' && (
          <button 
            className={`nav-tab exit-roguelike`}
            onClick={() => {
              setGameMode('classic');
              setCurrentScreen('home');
            }}
          >
            ← Exit Run
          </button>
        )}
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
        ) : (
          <div className="stats-mini">
            <div className="stat-item">
              <span className="stat-icon">📇</span>
              <span className="stat-value">{uniqueCards}/52</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🎯</span>
              <span className="stat-value">{totalCardsOpened}</span>
            </div>
          </div>
        )}
        
        <div className="pp-display">
          <div className="pp-main">
            <span className="pp-icon">💎</span>
            <span className="pp-amount">{pp}</span>
          </div>
          <div className="pp-rate">+{ppPerSecond.toFixed(1)}/s</div>
        </div>
        
        <div className="runes-mini">
          {equippedRunes.map((rune, index) => (
            <div key={index} className="rune-icon" title={rune ? (rune.name || `${rune.rank} of ${rune.suit}`) : 'Empty'}>
              {rune ? (rune.symbol || rune.rank?.[0] || '✦') : '○'}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;