import React, { useState, useEffect } from 'react';
import './ArchetypeDialogue.css';
import { getRulerDialogue } from '../../utils/archetypeDialogue';

const ArchetypeDialogue = ({ 
  archetype, 
  gameContext, 
  onComplete 
}) => {
  const [dialogue, setDialogue] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 30% chance to show dialogue
    if (Math.random() > 0.3) {
      onComplete?.();
      return;
    }

    // Get appropriate dialogue based on archetype
    let selectedDialogue = '';
    
    if (archetype.id === 'ruler') {
      selectedDialogue = getRulerDialogue(gameContext);
    }
    // Add other archetypes here later

    if (selectedDialogue) {
      setDialogue(selectedDialogue);
      setIsVisible(true);

      // Auto-hide after 4 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onComplete?.(), 300);
      }, 4000);

      return () => clearTimeout(hideTimer);
    } else {
      onComplete?.();
    }
  }, []);

  if (!dialogue) return null;

  return (
    <div className={`archetype-dialogue-bubble ${isVisible ? 'visible' : ''}`}>
      <div className="dialogue-tail" />
      <div className="dialogue-content">
        <p>{dialogue}</p>
      </div>
    </div>
  );
};

export default ArchetypeDialogue;