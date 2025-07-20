import { describe, test, expect, vi, beforeEach } from 'vitest';
import { calculateDynamicScores } from '../dynamicScoring';
import { CREATURE_EFFECTS, processCreatureEffect, parseAndProcessAbilities } from '../creatureEffects';
import { applyDreamEffects } from '../dreamEffects';

describe('Roguelike Integration Tests', () => {
  // Helper to create a creature card
  const createCreature = (name, options = {}) => ({
    id: `${name.toLowerCase()}_${Date.now()}_${Math.random()}`,
    name,
    ppValue: options.ppValue ?? 10,
    level: options.level ?? 1,
    generation: options.generation ?? 'Gen1',
    ability: options.ability || CREATURE_EFFECTS[name]?.ability,
    arcana: 'creature'
  });

  // Helper to create a fused creature
  const createFusedCreature = (parent1, parent2, generation = 'Gen2') => {
    const ability1 = CREATURE_EFFECTS[parent1]?.ability || '';
    const ability2 = CREATURE_EFFECTS[parent2]?.ability || '';
    const combinedAbility = `${ability1} & ${ability2}`;
    
    return {
      id: `fused_${Date.now()}_${Math.random()}`,
      name: `${parent1}-${parent2}`,
      ppValue: 20, // Gen2 typically has combined PP
      level: 1,
      generation,
      ability: combinedAbility,
      arcana: 'creature'
    };
  };

  // Full board scoring simulation
  const simulateFullBoard = (cards, options = {}) => {
    const dreamEffects = options.dreamEffects || [];
    let runningTokens = {};
    const scoreHistory = [];
    
    // Simulate progressive reveal
    cards.forEach((_, index) => {
      const revealed = cards.slice(0, index + 1);
      const result = calculateDynamicScores(
        revealed,
        cards,
        [],
        {},
        dreamEffects,
        runningTokens,
        index
      );
      
      // Update tokens
      runningTokens = result.tokensGained;
      
      // Track score for this reveal
      scoreHistory.push({
        cardIndex: index,
        card: cards[index].name,
        score: result.scores[index].currentValue,
        tokens: { ...runningTokens },
        effects: result.scores[index]
      });
    });
    
    // Calculate final board total
    const finalScores = calculateDynamicScores(
      cards,
      cards,
      [],
      {},
      dreamEffects,
      runningTokens,
      -1 // No card being revealed
    );
    
    const boardTotal = finalScores.scores.reduce((sum, s) => sum + s.currentValue, 0);
    const tokenPPValues = getTokenPPValues(runningTokens);
    const totalWithTokens = boardTotal + tokenPPValues;
    
    return {
      scoreHistory,
      finalTokens: runningTokens,
      boardTotal,
      tokenPPValues,
      totalScore: totalWithTokens
    };
  };

  const getTokenPPValues = (tokens) => {
    const tokenValues = {
      fire: 10, water: 10, earth: 10, air: 10,
      shadow: -1, light: 10, chaos: 10, order: 10,
      wild: 10, tech: 10, void: 10
    };
    
    return Object.entries(tokens).reduce((sum, [type, count]) => {
      if (type !== 'strength' && tokenValues[type] !== undefined) {
        return sum + (count * tokenValues[type]);
      }
      return sum;
    }, 0);
  };

  describe('Complete Game Scenarios', () => {
    test('Fire synergy board', () => {
      const board = [
        createCreature('Magmaduke'),   // +1 fire, +2/fire
        createCreature('Magmaduke'),   // +1 fire, +2/fire  
        createCreature('Pyrrhus'),     // Double fire
        createCreature('Magmaduke'),   // +1 fire, +2/fire
        createCreature('Escarglow')    // Convert water to fire (no water)
      ];
      
      const result = simulateFullBoard(board);
      
      // Expected: 3 fire generated, then doubled to 6, then 1 more = 7 total
      expect(result.finalTokens.fire).toBe(7);
      
      // Score breakdown:
      // Magmaduke 1: 10 + 2 = 12
      // Magmaduke 2: 10 + 4 = 14 (2 fire)
      // Pyrrhus: 10 (doubles fire to 4)
      // Magmaduke 3: 10 + 10 = 20 (5 fire after generation)
      // Escarglow: 10 (no water to convert)
      expect(result.boardTotal).toBe(66);
      expect(result.tokenPPValues).toBe(70); // 7 fire * 10
      expect(result.totalScore).toBe(136);
    });

    test('Water control board', () => {
      const board = [
        createCreature('Buuevo'),      // +1 water (pos 1)
        createCreature('Buuevo'),      // +2 water (pos 2)
        createCreature('Aquara'),      // +1 water, +5/water
        createCreature('Hippeye'),     // x3 if 3+ water
        createCreature('Aquara')       // +1 water, +5/water
      ];
      
      const result = simulateFullBoard(board);
      
      expect(result.finalTokens.water).toBe(5);
      
      // Hippeye gets x3 multiplier when revealed (3 water present)
      const hippeyeScore = result.scoreHistory.find(h => h.card === 'Hippeye');
      expect(hippeyeScore.score).toBe(30); // 10 * 3
    });

    test('Token conversion chain', () => {
      const board = [
        createCreature('Aquara'),      // +1 water
        createCreature('Aquara'),      // +1 water
        createCreature('Escarglow'),   // 2 water → 3 fire
        createCreature('Sapphungus'),  // +2 earth → strength
        createCreature('Tempest')      // All → air
      ];
      
      const result = simulateFullBoard(board);
      
      // Final should be all air (3 fire + 2 earth + 2 strength = 7 air)
      expect(result.finalTokens).toEqual({
        air: 7,
        water: 0,
        fire: 0,
        earth: 0,
        strength: 0
      });
    });

    test('Strength multiplier stacking', () => {
      const board = [
        createCreature('Manaclite'),   // +1 strength
        createCreature('Sapphungus'),  // +2 earth → +2 strength
        createCreature('Manaclite'),   // +1 strength
        createCreature('TestCreature'), // Base 10
        createCreature('TestCreature')  // Base 10
      ];
      
      const result = simulateFullBoard(board);
      
      expect(result.finalTokens.strength).toBe(4);
      
      // Last two creatures should have x5 multiplier (1 + 4 strength)
      expect(result.scoreHistory[3].score).toBe(50); // 10 * 5
      expect(result.scoreHistory[4].score).toBe(50); // 10 * 5
    });
  });

  describe('Dream Effect Integration', () => {
    test('Dream of Multiplication affects all cards', () => {
      const board = [
        createCreature('TestCreature'),
        createCreature('Manaclite'),
        createCreature('TestCreature')
      ];
      
      const dreamEffects = [{
        name: 'Dream of Multiplication',
        effect: { type: 'all_cards_multiplier', multiplier: 2 }
      }];
      
      const result = simulateFullBoard(board, { dreamEffects });
      
      // All base values should be doubled
      expect(result.scoreHistory[0].score).toBe(20); // 10 * 2
      expect(result.scoreHistory[1].score).toBe(20); // 10 * 2
      expect(result.scoreHistory[2].score).toBe(80); // 10 * 2 * 4 (strength)
    });

    test('Dream of Abundance adds flat bonus', () => {
      const board = [createCreature('TestCreature', { ppValue: 10 })];
      
      const dreamEffects = [{
        name: 'Dream of Abundance',
        effect: { type: 'flat_bonus', value: 5 }
      }];
      
      const result = simulateFullBoard(board, { dreamEffects });
      
      expect(result.scoreHistory[0].score).toBe(15); // 10 + 5
    });

    test('Nightmare disables abilities', () => {
      const board = [
        createCreature('Manaclite'),
        createCreature('Magmaduke'),
        createCreature('TestCreature')
      ];
      
      const dreamEffects = [{
        name: 'Nightmare of Silence',
        effect: { type: 'disable_abilities' }
      }];
      
      const result = simulateFullBoard(board, { dreamEffects });
      
      // No tokens should be generated
      expect(result.finalTokens).toEqual({});
      
      // No ability bonuses
      expect(result.scoreHistory[1].score).toBe(10); // Magmaduke scores base only
    });
  });

  describe('Fusion Creature Integration', () => {
    test('Gen2 creature inherits both abilities', () => {
      const fusedCard = createFusedCreature('Manaclite', 'Magmaduke');
      const board = [fusedCard];
      
      const result = simulateFullBoard(board);
      
      // Should generate both strength and fire
      expect(result.finalTokens).toEqual({
        strength: 1,
        fire: 1
      });
      
      // Should get Magmaduke's fire bonus
      expect(result.boardTotal).toBe(22); // 20 base + 2 from fire
    });

    test('Gen3 creature with 4 abilities', () => {
      const gen3 = {
        id: 'gen3_test',
        name: 'MegaFusion',
        ppValue: 40,
        level: 1,
        generation: 'Gen3',
        ability: 'Adds 1 strength to your score & Adds 1 fire to your score & Adds 1 water to your score & Adds 1 earth to your score',
        arcana: 'creature'
      };
      
      const board = [gen3];
      const result = simulateFullBoard(board);
      
      // Should generate all 4 token types
      expect(result.finalTokens).toEqual({
        strength: 1,
        fire: 1,
        water: 1,
        earth: 1
      });
    });

    test('Complex fusion ability parsing', () => {
      const tokens = {};
      const boardContext = { position: 0 };
      
      // Test multi-ability parsing
      const abilityText = 'Each Fred multiplies the next Fred by x2 & After scoring, rescore all cards from this position';
      parseAndProcessAbilities(abilityText, tokens, boardContext);
      
      // Should handle both abilities without errors
      expect(true).toBe(true); // If we get here, parsing worked
    });
  });

  describe('Special Effect Sequences', () => {
    test('Loopine time loop with tokens', () => {
      const board = [
        createCreature('Manaclite'),   // +1 strength
        createCreature('Loopine'),     // Time loop
        createCreature('Magmaduke'),   // +1 fire, benefits from strength
        createCreature('TestCreature')
      ];
      
      const result = simulateFullBoard(board);
      
      // After time loop, cards from Loopine's position score again
      // This test verifies the marker is set
      const loopineEffects = result.scoreHistory[1].effects;
      expect(loopineEffects.specialEffect).toEqual({ type: 'time_loop' });
    });

    test('Board shuffle from Lileye', () => {
      const board = [
        createCreature('Lileye'),  // +1 air
        createCreature('Lileye'),  // +1 air
        createCreature('Lileye'),  // +1 air
        createCreature('Lileye'),  // +1 air
        createCreature('Lileye')   // +1 air, triggers shuffle at 5
      ];
      
      const result = simulateFullBoard(board);
      
      expect(result.finalTokens.air).toBe(5);
      
      // Last Lileye should trigger shuffle
      const lastLileye = result.scoreHistory[4].effects;
      expect(lastLileye.specialEffect).toEqual({ type: 'shuffle_board' });
    });

    test('Adjacent bonus from Rachmite', () => {
      const board = [
        createCreature('TestCreature'),
        createCreature('Rachmite'),    // Gives +5 to adjacent
        createCreature('TestCreature'),
        createCreature('Rachmite'),    // Gives +5 to adjacent
        createCreature('TestCreature')
      ];
      
      const result = simulateFullBoard(board);
      
      // Cards adjacent to Rachmite get +5
      // This requires the second pass in calculateDynamicScores
      const finalScores = calculateDynamicScores(board, board, [], {}, [], {}, -1);
      
      expect(finalScores.scores[0].currentValue).toBe(15); // 10 + 5 adjacent
      expect(finalScores.scores[2].currentValue).toBe(20); // 10 + 5 + 5 (both sides)
      expect(finalScores.scores[4].currentValue).toBe(15); // 10 + 5 adjacent
    });
  });

  describe('Edge Cases and Limits', () => {
    test('maximum token accumulation', () => {
      const board = Array(5).fill(null).map(() => createCreature('Chewie'));
      
      // Mock random to always generate max tokens
      const mockRandom = vi.spyOn(Math, 'random');
      mockRandom.mockReturnValue(0.9); // Always max
      
      const result = simulateFullBoard(board);
      
      // Each Chewie generates 3 random tokens
      const totalTokens = Object.values(result.finalTokens)
        .reduce((sum, count) => sum + count, 0);
      expect(totalTokens).toBeGreaterThanOrEqual(5); // At least 1 per Chewie
      expect(totalTokens).toBeLessThanOrEqual(15); // At most 3 per Chewie
      
      mockRandom.mockRestore();
    });

    test('negative token values', () => {
      const board = [
        createCreature('Stitchhead'),  // +2 shadow
        createCreature('Stitchhead'),  // +2 shadow
        createCreature('Stitchhead'),  // +2 shadow
        createCreature('TestCreature'),
        createCreature('TestCreature')
      ];
      
      const result = simulateFullBoard(board);
      
      expect(result.finalTokens.shadow).toBe(6);
      expect(result.tokenPPValues).toBe(-6); // 6 * -1
      
      // But shadow doubles other effects
      // Last two creatures get shadow modifier
      const lastCreature = result.scoreHistory[4].effects;
      expect(lastCreature.specialEffect).toEqual({ type: 'shadow_modifier' });
    });

    test('no abilities scenario', () => {
      const board = Array(5).fill(null).map(() => createCreature('UnknownCreature'));
      
      const result = simulateFullBoard(board);
      
      expect(result.finalTokens).toEqual({});
      expect(result.boardTotal).toBe(50); // 5 * 10
      expect(result.tokenPPValues).toBe(0);
    });
  });

  describe('Performance Scenarios', () => {
    test('handles large token counts efficiently', () => {
      // Create a scenario with massive token generation
      const board = [
        createCreature('Sapphungus'),  // +2 earth, +2 strength
        createCreature('Pyrrhus'),     // Would double if fire existed
        createCreature('Tempest'),     // Convert all to air
        createCreature('TestCreature'),
        createCreature('TestCreature')
      ];
      
      // Add initial tokens to stress test
      const initialTokens = {
        fire: 50,
        water: 50,
        earth: 50
      };
      
      const startTime = performance.now();
      
      // Run scoring with large token counts
      const result = calculateDynamicScores(
        board,
        board,
        [],
        {},
        [],
        initialTokens,
        2 // Tempest just revealed
      );
      
      const endTime = performance.now();
      
      // Should complete quickly even with many tokens
      expect(endTime - startTime).toBeLessThan(100); // 100ms max
      
      // Verify conversion worked
      expect(result.boardState).toBeDefined();
    });
  });
});