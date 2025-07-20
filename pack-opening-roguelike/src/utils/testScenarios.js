// Test scenarios that can be loaded in debug mode
export const TEST_SCENARIOS = {
  // Fire Creatures Tests
  'pyrrhus-double-fire': {
    name: 'Pyrrhus Double Fire',
    description: 'Tests Pyrrhus doubling fire tokens (2 Magmaduke + Pyrrhus)',
    board: [
      { name: 'Magmaduke', level: 1 },
      { name: 'Magmaduke', level: 1 },
      { name: 'Pyrrhus', level: 1 },
      { name: 'Flitterfin', level: 1 },
      { name: 'Flitterfin', level: 1 }
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { fire: 4 },
    expectedScores: [12, 16, 10, 10, 10]
  },

  'escarglow-water-to-fire': {
    name: 'Escarglow Water Conversion',
    description: 'Tests Escarglow converting 2 water to 3 fire',
    board: [
      { name: 'Aquara', level: 1 },
      { name: 'Aquara', level: 1 },
      { name: 'Escarglow', level: 1 },
      { name: 'Flitterfin', level: 1 },
      { name: 'Flitterfin', level: 1 }
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { water: 0, fire: 3 },
    expectedScores: [15, 25, 10, 10, 10]
  },

  // Water Creatures Tests
  'hippeye-threshold': {
    name: 'Hippeye x3 Multiplier',
    description: 'Tests Hippeye getting x3 with 3+ water tokens',
    board: [
      { name: 'Aquara', level: 1 },
      { name: 'Aquara', level: 1 },
      { name: 'Hippeye', level: 1 },
      { name: 'Aquara', level: 1 },
      { name: 'Hippeye', level: 1 }
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { water: 3 },
    expectedScores: [15, 25, 10, 35, 30]
  },

  'buuevo-position': {
    name: 'Buuevo Position Scaling',
    description: 'Tests Buuevo generating water based on position',
    board: [
      { name: 'Buuevo', level: 1 },
      { name: 'Buuevo', level: 1 },
      { name: 'Buuevo', level: 1 },
      { name: 'Buuevo', level: 1 },
      { name: 'Buuevo', level: 1 }
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { water: 15 }, // 1+2+3+4+5
    expectedScores: [10, 10, 10, 10, 10]
  },

  // Earth Creatures Tests
  'sapphungus-earth-strength': {
    name: 'Sapphungus Earth to Strength',
    description: 'Tests Sapphungus generating earth and converting to strength',
    board: [
      { name: 'Sapphungus', level: 1 },
      { name: 'TestCreature', level: 1 },
      { name: 'TestCreature', level: 1 },
      null,
      null
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { earth: 2, strength: 2 },
    expectedScores: [10, 30, 30]
  },

  'rachmite-adjacent': {
    name: 'Rachmite Adjacent Bonus',
    description: 'Tests Rachmite giving +5 to adjacent cards',
    board: [
      { name: 'TestCreature', level: 1 },
      { name: 'Rachmite', level: 1 },
      { name: 'TestCreature', level: 1 },
      null,
      null
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { earth: 1 },
    expectedScores: [15, 10, 15]
  },

  // Air Creatures Tests
  'tempest-convert-all': {
    name: 'Tempest Convert All to Air',
    description: 'Tests Tempest converting all tokens to air',
    board: [
      { name: 'Magmaduke', level: 1 },
      { name: 'Aquara', level: 1 },
      { name: 'Sapphungus', level: 1 },
      { name: 'Tempest', level: 1 },
      null
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { air: 6, fire: 0, water: 0, earth: 0, strength: 0 },
    expectedScores: [12, 15, 10, 10]
  },

  'lileye-shuffle': {
    name: 'Lileye Shuffle at 5 Air',
    description: 'Tests Lileye triggering board shuffle at 5+ air',
    board: [
      { name: 'Lileye', level: 1 },
      { name: 'Lileye', level: 1 },
      { name: 'Lileye', level: 1 },
      { name: 'Lileye', level: 1 },
      { name: 'Lileye', level: 1 }
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { air: 5 },
    expectedScores: [10, 10, 10, 10, 10],
    specialEffect: 'shuffle_board'
  },

  // Complex Interactions
  'fire-synergy-chain': {
    name: 'Fire Synergy Chain',
    description: 'Tests complex fire token interactions',
    board: [
      { name: 'Magmaduke', level: 1 },
      { name: 'Magmaduke', level: 1 },
      { name: 'Pyrrhus', level: 1 },
      { name: 'Magmaduke', level: 1 },
      null
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { fire: 5 },
    expectedScores: [12, 16, 10, 20]
  },

  'token-conversion-chain': {
    name: 'Token Conversion Chain',
    description: 'Tests sequential token conversions',
    board: [
      { name: 'Aquara', level: 1 },
      { name: 'Aquara', level: 1 },
      { name: 'Escarglow', level: 1 },
      { name: 'Tempest', level: 1 },
      null
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { air: 3, water: 0, fire: 0 },
    expectedScores: [15, 25, 10, 10]
  },

  'strength-multiplier-stack': {
    name: 'Strength Multiplier Stacking',
    description: 'Tests multiple strength tokens affecting scoring',
    board: [
      { name: 'Manaclite', level: 1 },
      { name: 'Sapphungus', level: 1 },
      { name: 'Manaclite', level: 1 },
      { name: 'TestCreature', level: 1 },
      { name: 'TestCreature', level: 1 }
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { strength: 4, earth: 2 },
    expectedScores: [10, 20, 30, 50, 50]
  },

  // Shadow and Light
  'serafuzz-purge-shadow': {
    name: 'Serafuzz Purge Shadow',
    description: 'Tests Serafuzz purging shadow tokens for bonus PP',
    board: [
      { name: 'Stitchhead', level: 1 },
      { name: 'Serafuzz', level: 1 },
      null,
      null,
      null
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { shadow: 0, light: 1 },
    expectedScores: [10, 50]
  },

  // Special Abilities
  'fred-chain': {
    name: 'Fred Multiplier Chain',
    description: 'Tests Fred multiplying each subsequent Fred',
    board: [
      { name: 'Fred', level: 1 },
      { name: 'Fred', level: 1 },
      { name: 'Fred', level: 1 },
      { name: 'Fred', level: 1 },
      { name: 'Fred', level: 1 }
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: {},
    expectedScores: [10, 20, 30, 40, 50]
  },

  'elwick-tech-double': {
    name: 'Elwick Tech Double Trigger',
    description: 'Tests Elwick making next card generate double tokens',
    board: [
      { name: 'Elwick', level: 1 },
      { name: 'Manaclite', level: 1 },
      { name: 'Magmaduke', level: 1 },
      null,
      null
    ],
    tokens: {},
    dreamEffects: [],
    expectedTokens: { tech: 1, strength: 2, fire: 2 },
    expectedScores: [10, 30, 26]
  },

  // Dream Effects
  'dream-multiplication': {
    name: 'Dream of Multiplication',
    description: 'Tests dream effect multiplying all cards',
    board: [
      { name: 'TestCreature', level: 1 },
      { name: 'Manaclite', level: 1 },
      { name: 'TestCreature', level: 1 },
      null,
      null
    ],
    tokens: {},
    dreamEffects: [{
      name: 'Dream of Multiplication',
      effect: { type: 'all_cards_multiplier', multiplier: 2 }
    }],
    expectedTokens: { strength: 1 },
    expectedScores: [20, 20, 40]
  },

  'dream-abundance': {
    name: 'Dream of Abundance',
    description: 'Tests dream effect adding flat bonus',
    board: [
      { name: 'TestCreature', level: 1 },
      { name: 'TestCreature', level: 1 },
      null,
      null,
      null
    ],
    tokens: {},
    dreamEffects: [{
      name: 'Dream of Abundance',
      effect: { type: 'flat_bonus', value: 5 }
    }],
    expectedTokens: {},
    expectedScores: [15, 15]
  },

  // Edge Cases
  'all-token-types': {
    name: 'All Token Types',
    description: 'Tests Lumlin with all token types present',
    board: [
      { name: 'Lumlin', level: 1 },
      null,
      null,
      null,
      null
    ],
    tokens: {
      strength: 1, fire: 1, water: 1, earth: 1, air: 1,
      shadow: 1, light: 1, chaos: 1, order: 1, wild: 1,
      tech: 1, void: 1
    },
    dreamEffects: [],
    expectedTokens: {
      strength: 1, fire: 1, water: 1, earth: 1, air: 1,
      shadow: 1, light: 1, chaos: 1, order: 1, wild: 1,
      tech: 1, void: 1
    },
    expectedScores: [240] // 10 base + 10*12 types, * 2 (strength)
  }
};

// Helper to create a creature card from scenario data
export const createCreatureFromScenario = (creatureData) => {
  if (!creatureData) return null;
  
  return {
    id: `${creatureData.name.toLowerCase()}_test_${Date.now()}_${Math.random()}`,
    name: creatureData.name,
    ppValue: creatureData.ppValue || 10,
    level: creatureData.level || 1,
    generation: creatureData.generation || 'Gen1',
    xp: 0,
    xpToNextLevel: 100,
    arcana: 'creature'
  };
};

// Helper to load a scenario into game state
export const loadTestScenario = (scenarioId) => {
  const scenario = TEST_SCENARIOS[scenarioId];
  if (!scenario) {
    console.error(`Test scenario '${scenarioId}' not found`);
    return null;
  }
  
  return {
    board: scenario.board.map(createCreatureFromScenario),
    initialTokens: scenario.tokens || {},
    dreamEffects: scenario.dreamEffects || [],
    expectedResults: {
      tokens: scenario.expectedTokens,
      scores: scenario.expectedScores,
      specialEffect: scenario.specialEffect
    },
    metadata: {
      name: scenario.name,
      description: scenario.description,
      scenarioId
    }
  };
};