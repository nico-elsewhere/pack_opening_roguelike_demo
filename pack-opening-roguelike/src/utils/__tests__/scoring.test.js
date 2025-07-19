import { calculateDynamicScores } from '../dynamicScoring';
import { CREATURE_PASSIVES } from '../creaturePassives';

describe('Gen1 Creature Scoring Tests', () => {
  // Mock creature data based on the Gen1 creatures we know
  const mockCreatures = {
    'fred_id': { id: 'fred_id', name: 'Fred', ppValue: 10, level: 1 },
    'loopine_id': { id: 'loopine_id', name: 'Loopine', ppValue: 10, level: 1 },
    'lumlin_id': { id: 'lumlin_id', name: 'Lumlin', ppValue: 10, level: 1 },
    'rachmite_id': { id: 'rachmite_id', name: 'Rachmite', ppValue: 10, level: 1 },
    'stitchhead_id': { id: 'stitchhead_id', name: 'Stitchhead', ppValue: 10, level: 1 },
    'siameow_id': { id: 'siameow_id', name: 'Siameow', ppValue: 10, level: 1 },
    'buuevo_id': { id: 'buuevo_id', name: 'Buuevo', ppValue: 10, level: 1 },
    'kelvian_id': { id: 'kelvian_id', name: 'Kelvian', ppValue: 10, level: 1 },
    'elwick_id': { id: 'elwick_id', name: 'Elwick', ppValue: 10, level: 1 },
    'escarglow_id': { id: 'escarglow_id', name: 'Escarglow', ppValue: 10, level: 1 },
    'hippeye_id': { id: 'hippeye_id', name: 'Hippeye', ppValue: 10, level: 1 },
    'lileye_id': { id: 'lileye_id', name: 'Lileye', ppValue: 10, level: 1 },
    'magmaduke_id': { id: 'magmaduke_id', name: 'Magmaduke', ppValue: 10, level: 1 },
    'manaclite_id': { id: 'manaclite_id', name: 'Manaclite', ppValue: 10, level: 1 },
    'serafuzz_id': { id: 'serafuzz_id', name: 'Serafuzz', ppValue: 10, level: 1 },
    'chewie_id': { id: 'chewie_id', name: 'Chewie', ppValue: 10, level: 1 },
    'boastun_id': { id: 'boastun_id', name: 'Boastun', ppValue: 0, level: 1 }, // 0 PP creature
    'sapphungus_id': { id: 'sapphungus_id', name: 'Sapphungus', ppValue: 10, level: 1 },
  };

  // Helper to create creature cards
  const createCard = (name, level = 1, ppValue = 10) => {
    const id = `${name.toLowerCase()}_id`;
    return { 
      id, 
      name, 
      ppValue, 
      level,
      _revealIndex: undefined // Will be set during scoring
    };
  };

  describe('Basic Scoring', () => {
    test('Single creature scores base PP', () => {
      const cards = [createCard('Lumlin')];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores).toHaveLength(1);
      expect(scores[0].baseValue).toBe(10);
      expect(scores[0].currentValue).toBe(10);
    });

    test('Multiple creatures without passives score correctly', () => {
      const cards = [
        createCard('Lumlin'),
        createCard('Rachmite'),
        createCard('Stitchhead')
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores).toHaveLength(3);
      expect(scores[0].currentValue).toBe(10);
      expect(scores[1].currentValue).toBe(10);
      expect(scores[2].currentValue).toBe(10);
    });

    test('Level 2 creature scores double', () => {
      const cards = [createCard('Lumlin', 2)];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores[0].baseValue).toBe(20);
      expect(scores[0].currentValue).toBe(20);
    });

    test('0 PP creature scores 0', () => {
      const cards = [createCard('Boastun', 1, 0)];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores[0].baseValue).toBe(0);
      expect(scores[0].currentValue).toBe(0);
    });
  });

  describe('Fredmaxxing Tests', () => {
    test('Single Fred gets no multiplier', () => {
      const cards = [createCard('Fred')];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores[0].passiveMultiplier).toBe(1);
      expect(scores[0].currentValue).toBe(10);
    });

    test('Two Freds - second gets 2x', () => {
      const cards = [
        createCard('Fred'),
        createCard('Fred')
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores[0].passiveMultiplier).toBe(1);
      expect(scores[0].currentValue).toBe(10);
      expect(scores[1].passiveMultiplier).toBe(2);
      expect(scores[1].currentValue).toBe(20);
    });

    test('Three Freds - progressive multipliers', () => {
      const cards = [
        createCard('Fred'),
        createCard('Fred'),
        createCard('Fred')
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores[0].currentValue).toBe(10);  // 1x
      expect(scores[1].currentValue).toBe(20);  // 2x
      expect(scores[2].currentValue).toBe(30);  // 3x
    });

    test('Five Freds - full sequence', () => {
      const cards = [
        createCard('Fred'),
        createCard('Fred'),
        createCard('Fred'),
        createCard('Fred'),
        createCard('Fred')
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores[0].currentValue).toBe(10);   // 1x
      expect(scores[1].currentValue).toBe(20);   // 2x
      expect(scores[2].currentValue).toBe(30);   // 3x
      expect(scores[3].currentValue).toBe(40);   // 4x
      expect(scores[4].currentValue).toBe(50);   // 5x
      
      // Total should be 150
      const total = scores.reduce((sum, score) => sum + score.currentValue, 0);
      expect(total).toBe(150);
    });

    test('Fred with level 2 gets multiplier on base value', () => {
      const cards = [
        createCard('Fred', 1),
        createCard('Fred', 2)  // Level 2 Fred
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores[0].currentValue).toBe(10);   // Level 1, 1x
      expect(scores[1].baseValue).toBe(20);      // Level 2 base
      expect(scores[1].passiveMultiplier).toBe(2);
      expect(scores[1].currentValue).toBe(40);   // Level 2, 2x
    });

    test('Mixed creatures with Freds', () => {
      const cards = [
        createCard('Lumlin'),
        createCard('Fred'),
        createCard('Rachmite'),
        createCard('Fred'),
        createCard('Stitchhead')
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores[0].currentValue).toBe(10);  // Lumlin
      expect(scores[1].currentValue).toBe(10);  // First Fred (1x)
      expect(scores[2].currentValue).toBe(10);  // Rachmite
      expect(scores[3].currentValue).toBe(20);  // Second Fred (2x)
      expect(scores[4].currentValue).toBe(10);  // Stitchhead
    });
  });

  describe('Edge Cases', () => {
    test('Empty pack scores nothing', () => {
      const cards = [];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores).toHaveLength(0);
    });

    test('Pack with only 0 PP creatures', () => {
      const cards = [
        createCard('Boastun', 1, 0),
        createCard('Boastun', 1, 0),
        createCard('Boastun', 1, 0)
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      const total = scores.reduce((sum, score) => sum + score.currentValue, 0);
      expect(total).toBe(0);
    });

    test('Fred at different positions', () => {
      const cards = [
        createCard('Fred'),
        createCard('Lumlin'),
        createCard('Fred'),
        createCard('Rachmite'),
        createCard('Fred')
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      // First Fred: 1x = 10
      expect(scores[0].currentValue).toBe(10);
      // Lumlin: no multiplier = 10
      expect(scores[1].currentValue).toBe(10);
      // Second Fred: 2x = 20
      expect(scores[2].currentValue).toBe(20);
      // Rachmite: no multiplier = 10
      expect(scores[3].currentValue).toBe(10);
      // Third Fred: 3x = 30
      expect(scores[4].currentValue).toBe(30);
    });

    test('Different level Freds', () => {
      const cards = [
        createCard('Fred', 2),  // Level 2
        createCard('Fred', 1),  // Level 1
        createCard('Fred', 3)   // Level 3
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores[0].currentValue).toBe(20);  // Level 2, 1x = 20
      expect(scores[1].currentValue).toBe(20);  // Level 1, 2x = 20
      expect(scores[2].currentValue).toBe(90);  // Level 3, 3x = 90
    });
  });

  describe('Complex Scoring Scenarios', () => {
    test('Full 5-card pack with mixed creatures', () => {
      const cards = [
        createCard('Fred', 2),
        createCard('Lumlin', 1),
        createCard('Boastun', 1, 0),
        createCard('Fred', 1),
        createCard('Rachmite', 3)
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores[0].currentValue).toBe(20);  // Fred L2, 1x
      expect(scores[1].currentValue).toBe(10);  // Lumlin L1
      expect(scores[2].currentValue).toBe(0);   // Boastun 0 PP
      expect(scores[3].currentValue).toBe(20);  // Fred L1, 2x
      expect(scores[4].currentValue).toBe(30);  // Rachmite L3
      
      const total = scores.reduce((sum, score) => sum + score.currentValue, 0);
      expect(total).toBe(80);
    });

    test('Maximum Fredmaxxing scenario', () => {
      const cards = Array(5).fill(null).map(() => createCard('Fred', 2));
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores[0].currentValue).toBe(20);   // L2, 1x = 20
      expect(scores[1].currentValue).toBe(40);   // L2, 2x = 40
      expect(scores[2].currentValue).toBe(60);   // L2, 3x = 60
      expect(scores[3].currentValue).toBe(80);   // L2, 4x = 80
      expect(scores[4].currentValue).toBe(100);  // L2, 5x = 100
      
      const total = scores.reduce((sum, score) => sum + score.currentValue, 0);
      expect(total).toBe(300);
    });
  });

  describe('Loopine Time Loop (Note)', () => {
    test('Loopine presence is detected but loop logic is handled elsewhere', () => {
      const cards = [
        createCard('Lumlin'),
        createCard('Loopine'),
        createCard('Rachmite')
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      // Loopine itself just scores normally in this calculation
      expect(scores[0].currentValue).toBe(10);
      expect(scores[1].currentValue).toBe(10);
      expect(scores[2].currentValue).toBe(10);
      
      // The actual loop logic is handled in UnifiedPackOpening component
    });
  });

  describe('Reveal Order Tests', () => {
    test('Cards revealed one by one maintain correct Fred multipliers', () => {
      const allCards = [
        createCard('Fred'),
        createCard('Fred'),
        createCard('Fred')
      ];
      
      // Simulate revealing cards one by one
      for (let i = 1; i <= allCards.length; i++) {
        const revealedSoFar = allCards.slice(0, i);
        const { scores } = calculateDynamicScores(revealedSoFar, allCards, [], mockCreatures);
        
        // Check the last revealed card
        const lastScore = scores[scores.length - 1];
        expect(lastScore.passiveMultiplier).toBe(i);
        expect(lastScore.currentValue).toBe(10 * i);
      }
    });

    test('Progressive reveal with mixed creatures', () => {
      const allCards = [
        createCard('Fred'),
        createCard('Lumlin'),
        createCard('Fred'),
        createCard('Rachmite'),
        createCard('Fred')
      ];
      
      // Test each reveal stage
      const expectedMultipliers = [1, 1, 2, 1, 3];
      const expectedValues = [10, 10, 20, 10, 30];
      
      for (let i = 1; i <= allCards.length; i++) {
        const revealedSoFar = allCards.slice(0, i);
        const { scores } = calculateDynamicScores(revealedSoFar, allCards, [], mockCreatures);
        
        const lastScore = scores[scores.length - 1];
        expect(lastScore.passiveMultiplier).toBe(expectedMultipliers[i-1]);
        expect(lastScore.currentValue).toBe(expectedValues[i-1]);
      }
    });
  });

  describe('Undefined and Edge Value Tests', () => {
    test('Card with undefined ppValue defaults to 10', () => {
      const card = { id: 'test', name: 'Test', level: 1 }; // No ppValue
      const { scores } = calculateDynamicScores([card], [card], [], {});
      
      expect(scores[0].baseValue).toBe(10);
      expect(scores[0].currentValue).toBe(10);
    });

    test('Card with null ppValue scores 0', () => {
      const card = { id: 'test', name: 'Test', ppValue: null, level: 1 };
      const { scores } = calculateDynamicScores([card], [card], [], {});
      
      expect(scores[0].baseValue).toBe(0);
      expect(scores[0].currentValue).toBe(0);
    });

    test('Card with ppValue 0 scores 0', () => {
      const card = { id: 'test', name: 'Test', ppValue: 0, level: 1 };
      const { scores } = calculateDynamicScores([card], [card], [], {});
      
      expect(scores[0].baseValue).toBe(0);
      expect(scores[0].currentValue).toBe(0);
    });

    test('Card with undefined level defaults to 1', () => {
      const card = { id: 'test', name: 'Test', ppValue: 20 }; // No level
      const { scores } = calculateDynamicScores([card], [card], [], {});
      
      expect(scores[0].baseValue).toBe(20);
      expect(scores[0].currentValue).toBe(20);
    });

    test('Card with level 0 defaults to 1', () => {
      const card = { id: 'test', name: 'Test', ppValue: 20, level: 0 };
      const { scores } = calculateDynamicScores([card], [card], [], {});
      
      expect(scores[0].baseValue).toBe(20);
      expect(scores[0].currentValue).toBe(20);
    });
  });

  describe('Performance Tests', () => {
    test('Large pack with all Freds calculates correctly', () => {
      const cards = Array(10).fill(null).map(() => createCard('Fred'));
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      // Check each Fred gets correct multiplier
      scores.forEach((score, index) => {
        expect(score.passiveMultiplier).toBe(index + 1);
        expect(score.currentValue).toBe(10 * (index + 1));
      });
      
      // Total should be 10 + 20 + 30 + ... + 100 = 550
      const total = scores.reduce((sum, score) => sum + score.currentValue, 0);
      expect(total).toBe(550);
    });
  });

  describe('Real Game Scenarios', () => {
    test('Typical Gen1 pack scoring', () => {
      const cards = [
        createCard('Buuevo', 1),
        createCard('Kelvian', 1),
        createCard('Fred', 1),
        createCard('Hippeye', 1),
        createCard('Lileye', 1)
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      const total = scores.reduce((sum, score) => sum + score.currentValue, 0);
      expect(total).toBe(50); // All 10 PP each
    });

    test('Lucky Fred pack', () => {
      const cards = [
        createCard('Fred', 1),
        createCard('Fred', 2),
        createCard('Boastun', 1, 0),
        createCard('Fred', 1),
        createCard('Fred', 1)
      ];
      const { scores } = calculateDynamicScores(cards, cards, [], mockCreatures);
      
      expect(scores[0].currentValue).toBe(10);   // Fred L1, 1x
      expect(scores[1].currentValue).toBe(40);   // Fred L2, 2x
      expect(scores[2].currentValue).toBe(0);    // Boastun
      expect(scores[3].currentValue).toBe(30);   // Fred L1, 3x
      expect(scores[4].currentValue).toBe(40);   // Fred L1, 4x
      
      const total = scores.reduce((sum, score) => sum + score.currentValue, 0);
      expect(total).toBe(120);
    });
  });
});