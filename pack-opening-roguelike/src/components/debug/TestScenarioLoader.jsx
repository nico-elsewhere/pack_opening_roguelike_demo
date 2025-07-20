import React, { useState } from 'react';
import { TEST_SCENARIOS, loadTestScenario } from '../../utils/testScenarios';
import './TestScenarioLoader.css';

const TestScenarioLoader = ({ 
  onLoadScenario, 
  currentScenario,
  onClose 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Categorize scenarios
  const categorizeScenarios = () => {
    const categories = {
      all: [],
      fire: [],
      water: [],
      earth: [],
      air: [],
      shadow: [],
      special: [],
      dream: [],
      edge: []
    };
    
    Object.entries(TEST_SCENARIOS).forEach(([id, scenario]) => {
      categories.all.push({ id, ...scenario });
      
      // Categorize based on scenario id or content
      if (id.includes('fire') || id.includes('pyrrhus') || id.includes('magma')) {
        categories.fire.push({ id, ...scenario });
      } else if (id.includes('water') || id.includes('aqua') || id.includes('hippeye')) {
        categories.water.push({ id, ...scenario });
      } else if (id.includes('earth') || id.includes('sapp') || id.includes('rachmite')) {
        categories.earth.push({ id, ...scenario });
      } else if (id.includes('air') || id.includes('tempest') || id.includes('lileye')) {
        categories.air.push({ id, ...scenario });
      } else if (id.includes('shadow') || id.includes('serafuzz')) {
        categories.shadow.push({ id, ...scenario });
      } else if (id.includes('fred') || id.includes('elwick') || id.includes('loopine')) {
        categories.special.push({ id, ...scenario });
      } else if (id.includes('dream')) {
        categories.dream.push({ id, ...scenario });
      } else if (id.includes('edge') || id.includes('all-token')) {
        categories.edge.push({ id, ...scenario });
      }
    });
    
    return categories;
  };
  
  const categories = categorizeScenarios();
  
  const filteredScenarios = categories[selectedCategory].filter(scenario =>
    scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scenario.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleLoadScenario = (scenarioId) => {
    const scenarioData = loadTestScenario(scenarioId);
    if (scenarioData) {
      onLoadScenario(scenarioData);
    }
  };
  
  const formatExpectedResults = (scenario) => {
    const parts = [];
    
    if (scenario.expectedTokens) {
      const tokens = Object.entries(scenario.expectedTokens)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => `${type}: ${count}`)
        .join(', ');
      if (tokens) parts.push(`Tokens: ${tokens}`);
    }
    
    if (scenario.expectedScores) {
      parts.push(`Scores: [${scenario.expectedScores.join(', ')}]`);
    }
    
    if (scenario.specialEffect) {
      parts.push(`Effect: ${scenario.specialEffect}`);
    }
    
    return parts.join(' | ');
  };
  
  const formatBoard = (board) => {
    return board
      .map((card, i) => card ? `${i+1}. ${card.name}` : `${i+1}. [empty]`)
      .filter((_, i) => board[i])
      .join(', ');
  };

  return (
    <div className="test-scenario-loader">
      <div className="loader-header">
        <h2>Load Test Scenario</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="loader-controls">
        <input
          type="text"
          placeholder="Search scenarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="category-tabs">
          {Object.keys(categories).map(cat => (
            <button
              key={cat}
              className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              <span className="count">({categories[cat].length})</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="scenarios-list">
        {filteredScenarios.map(scenario => (
          <div 
            key={scenario.id} 
            className={`scenario-item ${currentScenario === scenario.id ? 'active' : ''}`}
          >
            <div className="scenario-header">
              <h3>{scenario.name}</h3>
              <button
                className="load-btn"
                onClick={() => handleLoadScenario(scenario.id)}
              >
                Load
              </button>
            </div>
            
            <p className="scenario-description">{scenario.description}</p>
            
            <div className="scenario-details">
              <div className="board-preview">
                <strong>Board:</strong> {formatBoard(scenario.board)}
              </div>
              
              {scenario.tokens && Object.keys(scenario.tokens).length > 0 && (
                <div className="initial-tokens">
                  <strong>Initial Tokens:</strong> {
                    Object.entries(scenario.tokens)
                      .map(([type, count]) => `${type}: ${count}`)
                      .join(', ')
                  }
                </div>
              )}
              
              {scenario.dreamEffects && scenario.dreamEffects.length > 0 && (
                <div className="dream-effects">
                  <strong>Dream:</strong> {scenario.dreamEffects[0].name}
                </div>
              )}
              
              <div className="expected-results">
                <strong>Expected:</strong> {formatExpectedResults(scenario)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredScenarios.length === 0 && (
        <div className="no-results">
          No scenarios match your search.
        </div>
      )}
    </div>
  );
};

export default TestScenarioLoader;