import React from 'react';
import './App2.css';
import { useGameState } from './hooks/useGameState';
import Header from './components/v2/Header';
import GameBoard from './components/v2/GameBoard';
import Collection from './components/v2/Collection';
import Shop from './components/v2/Shop';

function App() {
  const gameState = useGameState();
  const { currentScreen } = gameState;

  return (
    <div className="app">
      <Header {...gameState} />
      
      <main className="main-content">
        {currentScreen === 'home' && <GameBoard {...gameState} />}
        {currentScreen === 'collection' && <Collection {...gameState} />}
        {currentScreen === 'shop' && <Shop {...gameState} />}
      </main>
    </div>
  );
}

export default App;