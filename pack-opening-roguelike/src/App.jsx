import React from 'react';
import './App.css';
import { useGameState } from './hooks/useGameState';
import Header from './components/v2/Header';
import GameBoard from './components/v2/GameBoard';
import Collection from './components/v2/Collection';
import Shop from './components/v2/Shop';
import Fusion from './components/v2/Fusion';

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
        {currentScreen === 'fusion' && <Fusion {...gameState} />}
      </main>
    </div>
  );
}

export default App;