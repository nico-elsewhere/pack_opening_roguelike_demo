import React, { useState, useEffect } from 'react';
import './FusionDialogue.css';
import { getRulerFusionDialogue } from '../../utils/archetypeDialogue';

const FusionDialogue = ({ 
  archetype, 
  fusedCard,
  sourceCards,
  isVisible
}) => {
  const [dialogue, setDialogue] = useState('');
  const [showDialogue, setShowDialogue] = useState(false);

  useEffect(() => {
    if (!isVisible || !archetype || !fusedCard || dialogue) return; // Don't regenerate if dialogue already set

    // Get appropriate dialogue based on archetype
    let selectedDialogue = '';
    
    if (archetype.id === 'ruler') {
      selectedDialogue = getRulerFusionDialogue(fusedCard, sourceCards);
    }
    // Add other archetypes here later

    if (selectedDialogue) {
      // Set dialogue immediately to prevent regeneration
      setDialogue(selectedDialogue);
      
      // Delay the appearance slightly
      setTimeout(() => {
        setShowDialogue(true);
      }, 2000); // Show after the card flip
    }
  }, [isVisible, archetype, fusedCard, sourceCards, dialogue]);

  if (!dialogue || !showDialogue) return null;

  return (
    <div className={`fusion-dialogue-container ${showDialogue ? 'visible' : ''}`}>
      <div className="fusion-dialogue-character">
        <div className="character-portrait">
          <span className="character-icon">{archetype.icon}</span>
        </div>
        <div className="character-name">{archetype.name}</div>
      </div>
      <div className="fusion-dialogue-bubble">
        <div className="dialogue-tail" />
        <div className="dialogue-content">
          <p>{dialogue}</p>
        </div>
      </div>
    </div>
  );
};

export default FusionDialogue;