import { describe, test, expect, vi, beforeEach } from 'vitest';
import { calculateDynamicScores } from '../dynamicScoring';
import { CREATURE_EFFECTS, processCreatureEffect } from '../creatureEffects';

describe('Creature Abilities', () => {
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

  // Helper to score a board of creatures
  const scoreBoard = (creatureNames, options = {}) => {
    const cards = creatureNames.map(name => 
      typeof name === 'string' ? createCreature(name) : name
    );
    
    // Simulate progressive reveal
    let tokens = options.initialTokens || {};
    const results = [];
    
    cards.forEach((_, index) => {
      const revealed = cards.slice(0, index + 1);
      const result = calculateDynamicScores(
        revealed,
        cards,
        [], // runes
        {}, // collection
        options.dreamEffects || [],
        tokens,
        index // justRevealedIndex
      );
      
      results.push({
        card: cards[index].name,
        score: result.scores[index].currentValue,
        tokensGenerated: result.scores[index].tokensGenerated || {},
        specialEffect: result.scores[index].specialEffect
      });
      
      // Update tokens to the current state after this card
      tokens = { ...result.tokensGained };
    });
    
    return { results, finalTokens: tokens };
  };

  describe('Fire Creatures', () => {
    test('Pyrrhus doubles all fire tokens', () => {
      const { results, finalTokens } = scoreBoard([
        'Magmaduke',  // +1 fire
        'Magmaduke',  // +1 fire
        'Pyrrhus'     // Double fire tokens
      ]);
      
      console.log('Results:', results);
      console.log('Final tokens:', finalTokens);
      
      expect(finalTokens.fire).toBe(4); // 2 fire doubled to 4
    });

    test('Magmaduke generates fire and scores per fire token', () => {
      const { results } = scoreBoard(['Magmaduke']);
      
      expect(results[0].tokensGenerated).toEqual({ fire: 1 });
      expect(results[0].score).toBe(12); // 10 base + 2 per fire (1 fire)
    });

    test('Magmaduke with existing fire tokens', () => {
      const { results } = scoreBoard(['Magmaduke'], {
        initialTokens: { fire: 3 }
      });
      
      // Should score with 4 fire (3 existing + 1 generated)
      expect(results[0].score).toBe(18); // 10 base + 2*4 fire
    });

    test('Escarglow converts water to fire', () => {
      const { results, finalTokens } = scoreBoard([
        'Aquara',     // +1 water
        'Aquara',     // +1 water
        'Escarglow'   // Convert 2 water → 3 fire
      ]);
      
      expect(finalTokens.water).toBe(0);
      expect(finalTokens.fire).toBe(3);
    });

    test('Escarglow without enough water', () => {
      const { results, finalTokens } = scoreBoard([
        'Aquara',     // +1 water
        'Escarglow'   // Can't convert (need 2 water)
      ]);
      
      expect(finalTokens.water).toBe(1);
      expect(finalTokens.fire).toBe(0);
    });
  });

  describe('Water Creatures', () => {
    test('Aquara generates water and scores per water', () => {
      const { results } = scoreBoard(['Aquara']);
      
      expect(results[0].tokensGenerated).toEqual({ water: 1 });
      expect(results[0].score).toBe(15); // 10 base + 5 per water
    });

    test('Buuevo generates water based on position', () => {
      const { results } = scoreBoard([
        'Buuevo',     // Position 1: +1 water
        'Buuevo',     // Position 2: +2 water
        'Buuevo',     // Position 3: +3 water
        'Buuevo',     // Position 4: +4 water
        'Buuevo'      // Position 5: +5 water
      ]);
      
      expect(results[0].tokensGenerated).toEqual({ water: 1 });
      expect(results[1].tokensGenerated).toEqual({ water: 2 });
      expect(results[2].tokensGenerated).toEqual({ water: 3 });
      expect(results[3].tokensGenerated).toEqual({ water: 4 });
      expect(results[4].tokensGenerated).toEqual({ water: 5 });
    });

    test('Hippeye x3 multiplier with 3+ water', () => {
      const { results } = scoreBoard([
        'Aquara',     // +1 water
        'Aquara',     // +1 water
        'Hippeye',    // Not enough water yet (2)
        'Aquara',     // +1 water
        'Hippeye'     // Now has 3+ water!
      ]);
      
      expect(results[2].score).toBe(10); // No multiplier (only 2 water)
      expect(results[4].score).toBe(30); // 10 * 3 (has 3 water)
    });
  });

  describe('Earth Creatures', () => {
    test('Sapphungus generates earth and converts to strength', () => {
      const { results, finalTokens } = scoreBoard(['Sapphungus']);
      
      expect(results[0].tokensGenerated).toEqual({ earth: 2 });
      expect(finalTokens).toEqual({ earth: 2, strength: 2 });
    });

    test('Lumlin scores based on token diversity', () => {
      const { results } = scoreBoard(['Lumlin'], {
        initialTokens: { fire: 1, water: 1, earth: 1, air: 1 }
      });
      
      expect(results[0].score).toBe(50); // 10 base + 10*4 token types
    });

    test('Rachmite generates earth and gives adjacent bonus', () => {
      const { results } = scoreBoard([
        'TestCreature',
        'Rachmite',
        'TestCreature'
      ]);
      
      expect(results[0].score).toBe(15); // 10 + 5 adjacent bonus
      expect(results[1].tokensGenerated).toEqual({ earth: 1 });
      expect(results[2].score).toBe(15); // 10 + 5 adjacent bonus
    });

    test('Rachmite at edge positions', () => {
      const { results } = scoreBoard([
        'Rachmite',      // Only affects position 1
        'TestCreature',
        'TestCreature',
        'TestCreature',
        'Rachmite'       // Only affects position 3
      ]);
      
      expect(results[1].score).toBe(15); // Adjacent to first Rachmite
      expect(results[2].score).toBe(10); // Not adjacent
      expect(results[3].score).toBe(15); // Adjacent to last Rachmite
    });
  });

  describe('Air Creatures', () => {
    test('Tempest converts all tokens to air', () => {
      const { results, finalTokens } = scoreBoard([
        'Magmaduke',   // +1 fire
        'Aquara',      // +1 water
        'Sapphungus',  // +2 earth
        'Tempest'      // Convert all to air
      ]);
      
      expect(finalTokens).toEqual({ 
        air: 6, // 1 fire + 1 water + 2 earth + 2 strength from earth
        fire: 0,
        water: 0,
        earth: 0,
        strength: 0
      });
    });

    test('Lileye generates air but no shuffle under 5', () => {
      const { results } = scoreBoard([
        'Lileye',  // +1 air
        'Lileye',  // +1 air
        'Lileye',  // +1 air
        'Lileye'   // +1 air (total 4, no shuffle)
      ]);
      
      results.forEach(r => {
        expect(r.tokensGenerated).toEqual({ air: 1 });
        expect(r.specialEffect).toBeUndefined();
      });
    });

    test('Lileye triggers shuffle at 5+ air', () => {
      const { results } = scoreBoard(['Lileye'], {
        initialTokens: { air: 4 }
      });
      
      expect(results[0].specialEffect).toEqual({ type: 'shuffle_board' });
    });
  });

  describe('Shadow and Light', () => {
    test('Stitchhead generates shadow with negative value', () => {
      const { results, finalTokens } = scoreBoard(['Stitchhead']);
      
      expect(results[0].tokensGenerated).toEqual({ shadow: 2 });
      expect(finalTokens.shadow).toBe(2);
      // Shadow effect is -1 PP per token but x2 other effects
    });

    test('Serafuzz purges shadow for bonus PP', () => {
      const { results } = scoreBoard([
        'Stitchhead',  // +2 shadow
        'Serafuzz'     // +1 light, purge shadow
      ]);
      
      expect(results[1].tokensGenerated).toEqual({ light: 1 });
      expect(results[1].score).toBe(50); // 10 base + 20*2 purged shadow
    });

    test('Serafuzz without shadow to purge', () => {
      const { results } = scoreBoard(['Serafuzz']);
      
      expect(results[0].tokensGenerated).toEqual({ light: 1 });
      expect(results[0].score).toBe(10); // No bonus
    });

    test('Kelvian doubles cards with no tokens', () => {
      const { results } = scoreBoard([
        'TestCreature',  // No tokens generated
        'Manaclite',     // Generates tokens
        'Kelvian'        // Should only double first creature
      ]);
      
      expect(results[0].score).toBe(20); // 10 * 2 (Kelvian's effect)
      expect(results[1].score).toBe(10); // Not doubled (has tokens)
    });
  });

  describe('Chaos and Special', () => {
    test('Chewie generates random tokens', () => {
      // Mock random to be predictable
      const mockRandom = vi.spyOn(Math, 'random');
      mockRandom.mockReturnValueOnce(0.3); // 1 token
      mockRandom.mockReturnValueOnce(0.5); // Token type selection
      
      const { results } = scoreBoard(['Chewie']);
      
      expect(Object.values(results[0].tokensGenerated).reduce((a, b) => a + b, 0))
        .toBeGreaterThanOrEqual(1);
      expect(Object.values(results[0].tokensGenerated).reduce((a, b) => a + b, 0))
        .toBeLessThanOrEqual(3);
      
      mockRandom.mockRestore();
    });

    test('Boastun scores based on total tokens', () => {
      const creature = createCreature('Boastun', { ppValue: 0 });
      const { results } = scoreBoard([creature], {
        initialTokens: { fire: 2, water: 3, earth: 1 }
      });
      
      expect(results[0].score).toBe(30); // 6 tokens * 5
    });

    test('Siameow clones leftmost card tokens', () => {
      const { results, finalTokens } = scoreBoard([
        'Magmaduke',   // +1 fire (leftmost)
        'Aquara',      // +1 water
        'Siameow'      // Clone leftmost (fire)
      ]);
      
      expect(results[2].tokensGenerated).toEqual({ fire: 1 });
      expect(finalTokens).toEqual({ fire: 2, water: 1 });
    });

    test('Elwick generates tech and enables double triggers', () => {
      const { results, finalTokens } = scoreBoard([
        'Elwick',      // +1 tech
        'Manaclite'    // Should generate 2 strength (doubled)
      ]);
      
      expect(results[0].tokensGenerated).toEqual({ tech: 1 });
      expect(results[1].tokensGenerated).toEqual({ strength: 2 }); // Doubled!
    });
  });

  describe('Complex Interactions', () => {
    test('Fire synergy chain', () => {
      const { results, finalTokens } = scoreBoard([
        'Magmaduke',   // +1 fire, +2 PP/fire
        'Magmaduke',   // +1 fire, +2 PP/fire
        'Pyrrhus',     // Double fire (2→4)
        'Magmaduke'    // +1 fire, +2 PP/fire (5 total)
      ]);
      
      expect(finalTokens.fire).toBe(5);
      expect(results[3].score).toBe(20); // 10 + 2*5 fire
    });

    test('Water threshold combo', () => {
      const { results } = scoreBoard([
        'Buuevo',      // +1 water (pos 1)
        'Buuevo',      // +2 water (pos 2)
        'Hippeye',     // x3 multiplier (3 water)
        'Aquara'       // +1 water, +5/water
      ]);
      
      expect(results[2].score).toBe(30); // 10 * 3
      expect(results[3].score).toBe(35); // 10 + 5*5 water
    });

    test('Token conversion chain', () => {
      const { finalTokens } = scoreBoard([
        'Aquara',      // +1 water
        'Aquara',      // +1 water
        'Escarglow',   // 2 water → 3 fire
        'Tempest'      // All → air
      ]);
      
      expect(finalTokens).toEqual({ 
        air: 3,
        water: 0,
        fire: 0
      });
    });

    test('Strength affects all scoring', () => {
      const { results } = scoreBoard([
        'Manaclite',   // +1 strength
        'Sapphungus',  // +2 earth, +2 strength
        'TestCreature' // Should have x4 multiplier
      ]);
      
      expect(results[2].score).toBe(40); // 10 * (1 + 3 strength)
    });
  });

  describe('Fred and Loopine', () => {
    test('Fred multiplier chain', () => {
      const { results } = scoreBoard([
        'Fred',
        'Fred',
        'Fred',
        'Fred',
        'Fred'
      ]);
      
      expect(results[0].score).toBe(10);  // 1x
      expect(results[1].score).toBe(20);  // 2x
      expect(results[2].score).toBe(30);  // 3x
      expect(results[3].score).toBe(40);  // 4x
      expect(results[4].score).toBe(50);  // 5x
    });

    test('Loopine time loop marker', () => {
      const { results } = scoreBoard([
        'TestCreature',
        'Loopine',
        'TestCreature'
      ]);
      
      // Loopine itself scores normally
      expect(results[1].score).toBe(10);
      expect(results[1].specialEffect).toEqual({ type: 'time_loop' });
    });
  });

  describe('Edge Cases', () => {
    test('all token types at once', () => {
      const tokens = {
        strength: 1,
        fire: 1,
        water: 1,
        earth: 1,
        air: 1,
        shadow: 1,
        light: 1,
        chaos: 1,
        order: 1,
        wild: 1,
        tech: 1,
        void: 1
      };
      
      const { results } = scoreBoard(['Lumlin'], { initialTokens: tokens });
      
      expect(results[0].score).toBe(240); // 10 + 10*12 types, * 2 (strength)
    });

    test('maximum token accumulation', () => {
      const board = Array(5).fill('Manaclite');
      const { finalTokens } = scoreBoard(board);
      
      expect(finalTokens.strength).toBe(5);
    });

    test('no token generators with consumers', () => {
      const { results } = scoreBoard([
        'Hippeye',     // Needs water
        'Magmaduke',   // Needs fire
        'Escarglow'    // Needs water
      ]);
      
      // All should score base only
      expect(results[0].score).toBe(10);
      expect(results[1].score).toBe(12); // Gets its own fire
      expect(results[2].score).toBe(10);
    });
  });
});