import './Home.css';
import PackOpeningArea from './PackOpeningArea';
import RuneSlots from './RuneSlots';

const Home = ({ 
  ownedPacks, 
  totalCardsOpened,
  stagedPacks,
  stagePack,
  unstagePack,
  openAllStagedPacks,
  openedCards,
  clearOpenedCards,
  packSlots,
  equippedRunes,
  currentPackPPValues,
  runeSlots
}) => {

  return (
    <div className="home">
      <div className="home-header">
        <div className="active-runes-sidebar">
          <RuneSlots equippedRunes={equippedRunes} maxSlots={runeSlots} />
        </div>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Cards Collected</span>
            <span className="stat-value">{totalCardsOpened}</span>
          </div>
        </div>
      </div>
      
      <div className="home-main">
        <PackOpeningArea
          ownedPacks={ownedPacks}
          stagedPacks={stagedPacks}
          stagePack={stagePack}
          unstagePack={unstagePack}
          openAllStagedPacks={openAllStagedPacks}
          openedCards={openedCards}
          clearOpenedCards={clearOpenedCards}
          packSlots={packSlots}
          equippedRunes={equippedRunes}
          currentPackPPValues={currentPackPPValues}
        />
      </div>
    </div>
  );
};

export default Home;