import React from 'react';
import './App.css';
import { useGameState } from './hooks/useGameState';
import Header from './components/v2/Header';
import GameBoard from './components/v2/GameBoard';
import Collection from './components/v2/Collection';
import Shop from './components/v2/Shop';
import Fusion from './components/v2/Fusion';
import DebugPackSelector from './components/DebugPackSelector';

function App() {
  const gameState = useGameState();
  const { currentScreen, deckTemplate, setDebugPackContents, collection } = gameState;

  return (
    <div className="app">
      <Header {...gameState} />
      
      <main className="main-content">
        {currentScreen === 'home' && <GameBoard {...gameState} />}
        {currentScreen === 'collection' && <Collection {...gameState} />}
        {currentScreen === 'shop' && <Shop {...gameState} />}
        {currentScreen === 'fusion' && <Fusion {...gameState} />}
      </main>
      
      {/* Debug tool - only visible in development */}
      <DebugPackSelector 
        deckTemplate={deckTemplate}
        onSetDebugPack={setDebugPackContents}
        collection={collection}
        gameState={gameState}
      />
    </div>
  );
}

export default App;