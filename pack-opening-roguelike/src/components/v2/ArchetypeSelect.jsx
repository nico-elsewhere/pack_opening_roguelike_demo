import React from 'react';
import './ArchetypeSelect.css';
import { ARCHETYPES } from '../../utils/archetypes';

const ArchetypeSelect = ({ selectArchetype, setCurrentScreen }) => {
  const handleSelect = (archetypeId) => {
    selectArchetype(archetypeId);
    setCurrentScreen('home');
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="archetype-select">
      <div className="archetype-header">
        <h1>Choose Your Archetype</h1>
        <p className="archetype-subtitle">Select a guiding force for your journey through dreams</p>
      </div>

      <div className="archetype-grid">
        {Object.values(ARCHETYPES).filter(archetype => archetype.id === 'ruler').map(archetype => (
          <div 
            key={archetype.id} 
            className="archetype-card"
            onClick={() => handleSelect(archetype.id)}
            style={{ '--archetype-color': archetype.color }}
          >
            <div className="archetype-icon">{archetype.icon}</div>
            <h3 className="archetype-name">{archetype.name}</h3>
            <p className="archetype-description">{archetype.description}</p>
            <div className="archetype-effect">
              <span className="effect-label">Effect:</span>
              <span className="effect-text">{archetype.effect.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchetypeSelect;