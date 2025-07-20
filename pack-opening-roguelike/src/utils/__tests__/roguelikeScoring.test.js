import { describe, test, expect, vi, beforeEach } from 'vitest';
import { calculateDynamicScores } from '../dynamicScoring';
import { processCreatureEffect } from '../creatureEffects';

describe('Roguelike Scoring System', () => {
  // Helper to create a creature card
  const createCreature = (name, options = {}) => ({
    id: `${name.toLowerCase()}_${Date.now()}_${Math.random()}`,
    name,
    ppValue: options.ppValue ?? 10,
    level: options.level ?? 1,
    generation: options.generation ?? 'Gen1',
    ability: options.ability,
    arcana: 'creature'
  });

  // Helper to calculate scores with default parameters
  const scoreCards = (cards, options = {}) => {
    const allCards = options.allCards || cards;
    const justRevealedIndex = options.justRevealedIndex ?? cards.length - 1;
    const existingTokens = options.tokens || {};
    const dreamEffects = options.dreamEffects || [];
    
    return calculateDynamicScores(
      cards,
      allCards,
      [], // runes
      {}, // collection
      dreamEffects,
      existingTokens,
      justRevealedIndex
    );
  };

  describe('Basic Scoring Without Abilities', () => {
    test('single creature scores base PP', () => {
      const cards = [createCreature('TestCreature')];
      const result = scoreCards(cards);
      
      expect(result.scores).toHaveLength(1);
      expect(result.scores[0].baseValue).toBe(10);
      expect(result.scores[0].currentValue).toBe(10);
      expect(result.tokensGained).toEqual({});
    });

    test('level 2 creature scores double', () => {
      const cards = [createCreature('TestCreature', { level: 2 })];
      const result = scoreCards(cards);
      
      expect(result.scores[0].baseValue).toBe(20);
      expect(result.scores[0].currentValue).toBe(20);
    });

    test('multiple creatures score independently', () => {
      const cards = [
        createCreature('Creature1'),
        createCreature('Creature2', { ppValue: 15 }),
        createCreature('Creature3', { level: 2 })
      ];
      const result = scoreCards(cards);
      
      expect(result.scores[0].currentValue).toBe(10);
      expect(result.scores[1].currentValue).toBe(15);
      expect(result.scores[2].currentValue).toBe(20);
    });
  });

  describe('Token Generation', () => {
    test('Manaclite generates 1 strength token', () => {
      const cards = [createCreature('Manaclite')];
      const result = scoreCards(cards);
      
      expect(result.tokensGained).toEqual({ strength: 1 });
      expect(result.scores[0].tokensGenerated).toEqual({ strength: 1 });
    });

    test('multiple token generators accumulate', () => {
      const cards = [
        createCreature('Manaclite'),
        createCreature('Aquara'),
        createCreature('Magmaduke')
      ];
      
      // Simulate revealing each card
      let tokens = {};
      cards.forEach((_, index) => {
        const revealed = cards.slice(0, index + 1);
        const result = scoreCards(revealed, { 
          tokens,
          justRevealedIndex: index 
        });
        
        // Accumulate tokens
        Object.entries(result.tokensGained).forEach(([type, amount]) => {
          tokens[type] = (tokens[type] || 0) + amount;
        });
      });
      
      expect(tokens).toEqual({
        strength: 1,
        water: 1,
        fire: 1
      });
    });

    test('tokens persist across card reveals', () => {
      const cards = [
        createCreature('Manaclite'),
        createCreature('TestCreature')
      ];
      
      // First reveal Manaclite
      const result1 = scoreCards([cards[0]], { 
        allCards: cards,
        justRevealedIndex: 0 
      });
      expect(result1.tokensGained).toEqual({ strength: 1 });
      
      // Then reveal second card with existing tokens
      const result2 = scoreCards(cards, { 
        tokens: { strength: 1 },
        justRevealedIndex: 1 
      });
      
      // Second card should be affected by strength
      expect(result2.scores[1].tokenMultiplier).toBe(2); // 1 + 1 strength
      expect(result2.scores[1].currentValue).toBe(20); // 10 * 2
    });
  });

  describe('Strength Token Multiplier', () => {
    test('strength affects all future cards', () => {
      const cards = [
        createCreature('Manaclite'),
        createCreature('Creature1'),
        createCreature('Creature2')
      ];
      
      // Simulate full reveal sequence
      let tokens = {};
      const finalScores = [];
      
      cards.forEach((_, index) => {
        const revealed = cards.slice(0, index + 1);
        const result = scoreCards(revealed, { 
          tokens,
          allCards: cards,
          justRevealedIndex: index 
        });
        
        // Update tokens
        Object.entries(result.tokensGained).forEach(([type, amount]) => {
          tokens[type] = (tokens[type] || 0) + amount;
        });
        
        finalScores[index] = result.scores[index].currentValue;
      });
      
      expect(finalScores[0]).toBe(10); // Manaclite: no strength yet
      expect(finalScores[1]).toBe(20); // Creature1: 10 * (1+1 strength)
      expect(finalScores[2]).toBe(20); // Creature2: 10 * (1+1 strength)
    });

    test('multiple strength tokens stack', () => {
      const cards = [
        createCreature('Manaclite'),
        createCreature('Manaclite'),
        createCreature('TestCreature')
      ];
      
      // Simulate reveals with token accumulation
      const tokens = { strength: 2 }; // After 2 Manaclites
      const result = scoreCards(cards, { 
        tokens,
        justRevealedIndex: 2 
      });
      
      expect(result.scores[2].tokenMultiplier).toBe(3); // 1 + 2 strength
      expect(result.scores[2].currentValue).toBe(30); // 10 * 3
    });
  });

  describe('Token Values in Final Score', () => {
    test('fire tokens add 10 PP each', () => {
      const cards = [createCreature('Magmaduke')];
      const result = scoreCards(cards);
      
      expect(result.tokensGained).toEqual({ fire: 1 });
      expect(result.tokenValues).toEqual({ fire: 10 });
      expect(result.totalTokenValue).toBe(10);
    });

    test('shadow tokens subtract 1 PP each', () => {
      const cards = [createCreature('Stitchhead')];
      const result = scoreCards(cards);
      
      expect(result.tokensGained).toEqual({ shadow: 2 });
      expect(result.tokenValues).toEqual({ shadow: -2 }); // 2 * -1
      expect(result.totalTokenValue).toBe(-2);
    });

    test('mixed tokens calculate correctly', () => {
      const tokens = {
        fire: 2,
        water: 1,
        shadow: 3,
        strength: 1 // Strength has no PP value
      };
      
      const result = scoreCards([], { tokens });
      
      expect(result.tokenValues).toEqual({
        fire: 20,   // 2 * 10
        water: 10,  // 1 * 10
        shadow: -3  // 3 * -1
      });
      expect(result.totalTokenValue).toBe(27); // 20 + 10 - 3
    });
  });

  describe('Progressive Reveal Scoring', () => {
    test('cards revealed one by one maintain correct state', () => {
      const cards = [
        createCreature('Manaclite'),
        createCreature('Aquara'),
        createCreature('Hippeye')
      ];
      
      const revealSequence = [];
      let tokens = {};
      
      // Simulate the actual game reveal sequence
      cards.forEach((_, index) => {
        const revealed = cards.slice(0, index + 1);
        const result = scoreCards(revealed, {
          tokens,
          allCards: cards,
          justRevealedIndex: index
        });
        
        // Track the sequence
        revealSequence.push({
          cardIndex: index,
          cardName: cards[index].name,
          score: result.scores[index].currentValue,
          tokensGenerated: result.scores[index].tokensGenerated || {},
          totalTokens: { ...tokens, ...result.tokensGained }
        });
        
        // Update tokens
        Object.entries(result.tokensGained).forEach(([type, amount]) => {
          tokens[type] = (tokens[type] || 0) + amount;
        });
      });
      
      // Verify the sequence
      expect(revealSequence[0]).toMatchObject({
        cardName: 'Manaclite',
        score: 10,
        tokensGenerated: { strength: 1 },
        totalTokens: { strength: 1 }
      });
      
      expect(revealSequence[1]).toMatchObject({
        cardName: 'Aquara',
        score: 25, // 10 base + 5/water, * 2 (strength)
        tokensGenerated: { water: 1 },
        totalTokens: { strength: 1, water: 1 }
      });
      
      expect(revealSequence[2]).toMatchObject({
        cardName: 'Hippeye',
        score: 20, // 10 base * 2 (strength), no x3 yet (only 1 water)
        tokensGenerated: {},
        totalTokens: { strength: 1, water: 1 }
      });
    });
  });

  describe('Error Handling', () => {
    test('handles cards with no abilities gracefully', () => {
      const cards = [
        createCreature('Unknown'),
        createCreature('AlsoUnknown')
      ];
      const result = scoreCards(cards);
      
      expect(result.scores[0].currentValue).toBe(10);
      expect(result.scores[1].currentValue).toBe(10);
      expect(result.tokensGained).toEqual({});
    });

    test('handles null/undefined values', () => {
      const cards = [
        createCreature('Test', { ppValue: null }),
        createCreature('Test2', { ppValue: undefined }),
        createCreature('Test3', { level: 0 })
      ];
      const result = scoreCards(cards);
      
      expect(result.scores[0].currentValue).toBe(0);
      expect(result.scores[1].currentValue).toBe(10); // Default
      expect(result.scores[2].currentValue).toBe(10); // Level 0 → 1
    });
  });

  describe('Dream Effects Integration', () => {
    test('flat bonus dream effect', () => {
      const cards = [createCreature('TestCreature')];
      const dreamEffects = [{
        name: 'Dream of Abundance',
        effect: { type: 'flat_bonus', value: 5 }
      }];
      
      const result = scoreCards(cards, { dreamEffects });
      
      expect(result.scores[0].dreamAddition).toBe(5);
      expect(result.scores[0].currentValue).toBe(15); // 10 + 5
    });

    test('dream effects apply before tokens', () => {
      const cards = [createCreature('TestCreature')];
      const dreamEffects = [{
        name: 'Dream of Multiplication',
        effect: { type: 'all_cards_multiplier', multiplier: 2 }
      }];
      
      const result = scoreCards(cards, { 
        dreamEffects,
        tokens: { strength: 1 }
      });
      
      expect(result.scores[0].dreamMultiplier).toBe(2);
      expect(result.scores[0].tokenMultiplier).toBe(2); // 1 + 1 strength
      expect(result.scores[0].currentValue).toBe(40); // 10 * 2 * 2
    });
  });
});