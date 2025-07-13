import React from 'react';
import Card from './Card';

const Collection = ({ collection, onCardClick, equippedRunes }) => {
  const collectionArray = Object.values(collection);
  const equippedRuneIds = equippedRunes.map(r => r.id);
  
  return (
    <div className="collection">
      <h2>Collection ({collectionArray.length} unique cards)</h2>
      <div className="collection-grid">
        {collectionArray.map(card => (
          <Card 
            key={card.id} 
            card={{...card, effect: equippedRunes.find(r => r.id === card.id)?.effect}}
            onClick={onCardClick}
            showProgress={true}
            isEquipped={equippedRuneIds.includes(card.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Collection;