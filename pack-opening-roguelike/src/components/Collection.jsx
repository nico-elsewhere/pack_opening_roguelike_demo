import React from 'react';
import Card from './Card';

const Collection = ({ collection, onCardClick }) => {
  const collectionArray = Object.values(collection);
  
  return (
    <div className="collection">
      <h2>Collection ({collectionArray.length} unique cards)</h2>
      <div className="collection-grid">
        {collectionArray.map(card => (
          <Card 
            key={card.id} 
            card={card} 
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Collection;