import { describe, test, expect, vi } from 'vitest';
import { calculateDynamicScores } from '../dynamicScoring';
import { CREATURE_EFFECTS, processCreatureEffect } from '../creatureEffects';

describe('Token System', () => {
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

  // Helper to calculate token values
  const getTokenValues = (tokens) => {
    const tokenPPValues = {
      fire: 10,
      water: 10,
      earth: 10,
      air: 10,
      shadow: -1,
      light: 10,
      chaos: 10,
      order: 10,
      wild: 10,
      tech: 10,
      void: 10
    };

    const values = {};
    let total = 0;
    
    Object.entries(tokens).forEach(([type, count]) => {
      if (type !== 'strength' && tokenPPValues[type] !== undefined) {
        const value = count * tokenPPValues[type];
        values[type] = value;
        total += value;
      }
    });

    return { values, total };
  };

  describe('Token PP Values', () => {
    test('basic tokens worth 10 PP each', () => {
      const tokens = { fire: 2, water: 3, earth: 1 };
      const { values, total } = getTokenValues(tokens);
      
      expect(values).toEqual({
        fire: 20,
        water: 30,
        earth: 10
      });
      expect(total).toBe(60);
    });

    test('shadow tokens have negative value', () => {
      const tokens = { shadow: 5 };
      const { values, total } = getTokenValues(tokens);
      
      expect(values).toEqual({ shadow: -5 });
      expect(total).toBe(-5);
    });

    test('strength tokens have no PP value', () => {
      const tokens = { strength: 10 };
      const { values, total } = getTokenValues(tokens);
      
      expect(values).toEqual({});
      expect(total).toBe(0);
    });

    test('mixed positive and negative tokens', () => {
      const tokens = { fire: 3, shadow: 2, water: 1 };
      const { values, total } = getTokenValues(tokens);
      
      expect(values).toEqual({
        fire: 30,
        shadow: -2,
        water: 10
      });
      expect(total).toBe(38); // 30 - 2 + 10
    });
  });

  describe('Token Conversion', () => {
    test('Escarglow converts water to fire', () => {
      const initialTokens = { water: 2 };
      const boardContext = { position: 0 };
      
      const result = processCreatureEffect(
        createCreature('Escarglow'),
        initialTokens,
        boardContext
      );
      
      expect(result.specialEffect).toEqual({
        type: 'token_conversion',
        from: 'water',
        to: 'fire',
        amount: 2,
        multiplier: 1.5
      });
    });

    test('Tempest converts all tokens to air', () => {
      const initialTokens = { fire: 2, water: 1, earth: 3 };
      const boardContext = { position: 0 };
      
      const result = processCreatureEffect(
        createCreature('Tempest'),
        initialTokens,
        boardContext
      );
      
      expect(result.specialEffect).toEqual({
        type: 'convert_all_to_air'
      });
    });

    test('Sapphungus auto-converts earth to strength', () => {
      const boardContext = { position: 0 };
      
      const result = processCreatureEffect(
        createCreature('Sapphungus'),
        {},
        boardContext
      );
      
      expect(result.tokensGained).toEqual({ earth: 2 });
      expect(result.specialEffect).toEqual({
        type: 'auto_convert',
        from: 'earth',
        to: 'strength'
      });
    });
  });

  describe('Token Interactions', () => {
    test('Pyrrhus doubles fire tokens', () => {
      const initialTokens = { fire: 3 };
      const boardContext = { position: 0 };
      
      const result = processCreatureEffect(
        createCreature('Pyrrhus'),
        initialTokens,
        boardContext
      );
      
      expect(result.specialEffect).toEqual({
        type: 'double_tokens',
        tokenType: 'fire'
      });
    });

    test('Serafuzz purges shadow tokens', () => {
      const initialTokens = { shadow: 4 };
      const boardContext = { position: 0 };
      
      const result = processCreatureEffect(
        createCreature('Serafuzz'),
        initialTokens,
        boardContext
      );
      
      expect(result.tokensGained).toEqual({ light: 1 });
      expect(result.scoreModifier).toBe(80); // 4 shadow * 20 PP each
    });

    test('Tech tokens double creature effects', () => {
      // With tech token, Manaclite should generate 2 strength instead of 1
      const initialTokens = { tech: 1 };
      const cards = [createCreature('Elwick'), createCreature('Manaclite')];
      
      // Simulate revealing Manaclite with tech already present
      const result = calculateDynamicScores(
        cards,
        cards,
        [],
        {},
        [],
        initialTokens,
        1 // Manaclite just revealed
      );
      
      // Manaclite's token generation should be doubled
      expect(result.scores[1].tokensGenerated).toEqual({ strength: 2 });
    });
  });

  describe('Token-Based Scoring', () => {
    test('Magmaduke scores extra per fire token', () => {
      const initialTokens = { fire: 3 };
      const boardContext = { position: 0 };
      
      const result = processCreatureEffect(
        createCreature('Magmaduke'),
        initialTokens,
        boardContext
      );
      
      // Generates 1 fire, then scores with 4 total
      expect(result.tokensGained).toEqual({ fire: 1 });
      expect(result.scoreModifier).toBe(8); // 4 fire * 2 PP each
    });

    test('Aquara scores extra per water token', () => {
      const initialTokens = { water: 2 };
      const boardContext = { position: 0 };
      
      const result = processCreatureEffect(
        createCreature('Aquara'),
        initialTokens,
        boardContext
      );
      
      // Generates 1 water, then scores with 3 total
      expect(result.tokensGained).toEqual({ water: 1 });
      expect(result.scoreModifier).toBe(15); // 3 water * 5 PP each
    });

    test('Lumlin scores based on token diversity', () => {
      const initialTokens = { 
        fire: 1, 
        water: 1, 
        earth: 1, 
        air: 1,
        tech: 1
      };
      const boardContext = { position: 0 };
      
      const result = processCreatureEffect(
        createCreature('Lumlin'),
        initialTokens,
        boardContext
      );
      
      expect(result.scoreModifier).toBe(50); // 5 types * 10 PP each
    });

    test('Boastun scores based on total tokens', () => {
      const initialTokens = { 
        fire: 2, 
        water: 3, 
        shadow: 1,
        strength: 2 // Should count all tokens
      };
      const boardContext = { position: 0 };
      
      const creature = createCreature('Boastun', { ppValue: 0 });
      const result = processCreatureEffect(
        creature,
        initialTokens,
        boardContext
      );
      
      expect(result.specialEffect).toEqual({
        type: 'override_score',
        value: 40 // 8 tokens * 5 PP each
      });
    });
  });

  describe('Position-Based Token Generation', () => {
    test('Buuevo generates tokens based on position', () => {
      for (let pos = 0; pos < 5; pos++) {
        const result = processCreatureEffect(
          createCreature('Buuevo'),
          {},
          { position: pos }
        );
        
        expect(result.tokensGained).toEqual({ water: pos + 1 });
      }
    });

    test('Siameow clones leftmost card tokens', () => {
      const boardContext = {
        position: 2,
        leftmostTokens: { fire: 1, water: 1 }
      };
      
      const result = processCreatureEffect(
        createCreature('Siameow'),
        {},
        boardContext
      );
      
      // Should clone all leftmost tokens
      expect(result.tokensGained).toEqual({ fire: 1, water: 1 });
    });
  });

  describe('Conditional Token Effects', () => {
    test('Hippeye multiplier requires 3+ water', () => {
      // Less than 3 water - no multiplier
      let result = processCreatureEffect(
        createCreature('Hippeye'),
        { water: 2 },
        { position: 0 }
      );
      expect(result.specialEffect).toBeUndefined();
      
      // 3+ water - x3 multiplier
      result = processCreatureEffect(
        createCreature('Hippeye'),
        { water: 3 },
        { position: 0 }
      );
      expect(result.specialEffect).toEqual({
        type: 'multiplier',
        value: 3
      });
    });

    test('Lileye shuffle requires 5+ air', () => {
      // Less than 5 air - no shuffle
      let result = processCreatureEffect(
        createCreature('Lileye'),
        { air: 3 },
        { position: 0 }
      );
      expect(result.tokensGained).toEqual({ air: 1 });
      expect(result.specialEffect).toBeUndefined();
      
      // 5+ air (4 existing + 1 generated) - triggers shuffle
      result = processCreatureEffect(
        createCreature('Lileye'),
        { air: 4 },
        { position: 0 }
      );
      expect(result.tokensGained).toEqual({ air: 1 });
      expect(result.specialEffect).toEqual({
        type: 'shuffle_board'
      });
    });

    test('Escarglow requires 2 water to convert', () => {
      // Not enough water
      let result = processCreatureEffect(
        createCreature('Escarglow'),
        { water: 1 },
        { position: 0 }
      );
      expect(result.specialEffect).toBeUndefined();
      
      // Enough water
      result = processCreatureEffect(
        createCreature('Escarglow'),
        { water: 2 },
        { position: 0 }
      );
      expect(result.specialEffect?.type).toBe('token_conversion');
    });
  });

  describe('Shadow Token Mechanics', () => {
    test('shadow tokens apply negative PP but double effects', () => {
      const initialTokens = { shadow: 3 };
      const boardContext = { position: 0, shadowTokens: 3 };
      
      const result = processCreatureEffect(
        createCreature('TestCreature'),
        initialTokens,
        boardContext
      );
      
      // Base creature gets shadow modifier
      expect(result.specialEffect).toEqual({
        type: 'shadow_modifier'
      });
    });

    test('Stitchhead generates shadow tokens', () => {
      const result = processCreatureEffect(
        createCreature('Stitchhead'),
        {},
        { position: 0 }
      );
      
      expect(result.tokensGained).toEqual({ shadow: 2 });
    });
  });

  describe('Token Accumulation', () => {
    test('tokens accumulate across card reveals', () => {
      const cards = [
        createCreature('Manaclite'),   // +1 strength
        createCreature('Magmaduke'),   // +1 fire
        createCreature('Aquara'),      // +1 water
        createCreature('Sapphungus'),  // +2 earth (converts to strength)
        createCreature('Lileye')       // +1 air
      ];
      
      let tokens = {};
      const allTokens = [];
      
      // Simulate progressive reveal
      cards.forEach((_, index) => {
        const revealed = cards.slice(0, index + 1);
        const result = calculateDynamicScores(
          revealed,
          cards,
          [],
          {},
          [],
          tokens,
          index
        );
        
        // Update tokens
        tokens = result.tokensGained;
        allTokens.push({ ...tokens });
      });
      
      // Final token state
      expect(tokens).toEqual({
        strength: 3, // 1 from Manaclite + 2 from Sapphungus
        fire: 1,
        water: 1,
        earth: 2,
        air: 1
      });
    });

    test('token order matters for conversions', () => {
      const cards = [
        createCreature('Aquara'),     // +1 water
        createCreature('Aquara'),     // +1 water
        createCreature('Escarglow'),  // Convert 2 water to 3 fire
        createCreature('Pyrrhus')     // Double fire tokens
      ];
      
      let tokens = {};
      
      // Reveal all cards
      cards.forEach((_, index) => {
        const revealed = cards.slice(0, index + 1);
        const result = calculateDynamicScores(
          revealed,
          cards,
          [],
          {},
          [],
          tokens,
          index
        );
        tokens = result.tokensGained;
      });
      
      // Should have 6 fire (3 converted, then doubled)
      // and 0 water (all converted)
      expect(tokens.fire).toBe(6);
      expect(tokens.water).toBe(0);
    });
  });

  describe('Random Token Effects', () => {
    test('Chewie generates 1-3 random tokens', () => {
      const mockRandom = vi.spyOn(Math, 'random');
      
      // Test min tokens (1)
      mockRandom.mockReturnValueOnce(0.1); // 1 token
      mockRandom.mockReturnValueOnce(0.1); // Fire token
      
      let result = processCreatureEffect(
        createCreature('Chewie'),
        {},
        { position: 0 }
      );
      
      const totalTokens = Object.values(result.tokensGained)
        .reduce((sum, val) => sum + val, 0);
      expect(totalTokens).toBe(1);
      
      // Test max tokens (3)
      mockRandom.mockReturnValueOnce(0.9); // 3 tokens
      mockRandom.mockReturnValueOnce(0.1); // Fire
      mockRandom.mockReturnValueOnce(0.2); // Water
      mockRandom.mockReturnValueOnce(0.3); // Earth
      
      result = processCreatureEffect(
        createCreature('Chewie'),
        {},
        { position: 0 }
      );
      
      const totalTokens2 = Object.values(result.tokensGained)
        .reduce((sum, val) => sum + val, 0);
      expect(totalTokens2).toBe(3);
      
      mockRandom.mockRestore();
    });

    test('Smilie generates wild or void randomly', () => {
      const mockRandom = vi.spyOn(Math, 'random');
      
      // Test wild token
      mockRandom.mockReturnValueOnce(0.3); // < 0.5 = wild
      let result = processCreatureEffect(
        createCreature('Smilie'),
        {},
        { position: 0 }
      );
      expect(result.tokensGained).toEqual({ wild: 1 });
      
      // Test void token
      mockRandom.mockReturnValueOnce(0.7); // >= 0.5 = void
      result = processCreatureEffect(
        createCreature('Smilie'),
        {},
        { position: 0 }
      );
      expect(result.tokensGained).toEqual({ void: 1 });
      
      mockRandom.mockRestore();
    });
  });
});