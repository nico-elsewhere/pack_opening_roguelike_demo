import React from 'react';
import './App.css';
import { useGameState } from './hooks/useGameState';
import PackOpening from './components/PackOpening';
import Collection from './components/Collection';
import RuneSlots from './components/RuneSlots';
import Navigation from './components/Navigation';
import PPDisplay from './components/PPDisplay';
import Home from './components/Home';
import Shop from './components/Shop';

function App() {
  const {
    pp,
    ppPerSecond,
    collection,
    equippedRunes,
    currentPack,
    currentPackPPValues,
    totalCardsOpened,
    ownedPacks,
    currentScreen,
    setCurrentScreen,
    canBuyPack,
    canOpenPack,
    packCost,
    buyPack,
    openPack,
    equipRune,
    setCurrentPack,
    packSlots,
    packSlotCost,
    buyPackSlot,
    runeSlots,
    runeSlotCost,
    buyRuneSlot,
    stagedPacks,
    openedCards,
    stagePack,
    unstagePack,
    openAllStagedPacks,
    clearOpenedCards
  } = useGameState();


  const handleCardClick = (card) => {
    if (card.isRune) {
      equipRune(card.id);
    }
  };

  return (
    <div className="app">
      <Navigation currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      
      <div className="main-content">
        {currentScreen === 'home' && (
          <Home 
            ownedPacks={ownedPacks}
            totalCardsOpened={totalCardsOpened}
            stagedPacks={stagedPacks}
            stagePack={stagePack}
            unstagePack={unstagePack}
            openAllStagedPacks={openAllStagedPacks}
            openedCards={openedCards}
            clearOpenedCards={clearOpenedCards}
            packSlots={packSlots}
            equippedRunes={equippedRunes}
            currentPackPPValues={currentPackPPValues}
            runeSlots={runeSlots}
          />
        )}
        
        {currentScreen === 'collection' && (
          <div className="collection-screen">
            <RuneSlots equippedRunes={equippedRunes} maxSlots={runeSlots} />
            <Collection 
              collection={collection} 
              onCardClick={handleCardClick}
              equippedRunes={equippedRunes}
            />
          </div>
        )}
        
        {currentScreen === 'shop' && (
          <Shop 
            canBuyPack={canBuyPack}
            packCost={packCost}
            buyPack={buyPack}
            pp={pp}
            packSlots={packSlots}
            packSlotCost={packSlotCost}
            buyPackSlot={buyPackSlot}
            runeSlots={runeSlots}
            runeSlotCost={runeSlotCost}
            buyRuneSlot={buyRuneSlot}
          />
        )}
      </div>
      
      <PPDisplay pp={pp} ppPerSecond={ppPerSecond} />

      {currentPack && (
        <PackOpening 
          pack={currentPack} 
          onClose={() => setCurrentPack(null)}
          equippedRunes={equippedRunes}
          cardPPValues={currentPackPPValues}
        />
      )}
    </div>
  );
}

export default App;