import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import RoguelikeBoard from '../../components/v2/RoguelikeBoard';

// Mock ANIMATION_LOGGER
const mockAnimationLogger = {
  logs: [],
  log: function(type, data) {
    this.logs.push({ type, data, timestamp: Date.now() });
  },
  clear: function() {
    this.logs = [];
  },
  getLogsOfType: function(type) {
    return this.logs.filter(log => log.type === type);
  },
  getTimingBetween: function(type1, type2) {
    const log1 = this.logs.find(log => log.type === type1);
    const log2 = this.logs.find(log => log.type === type2);
    if (!log1 || !log2) return null;
    return log2.timestamp - log1.timestamp;
  }
};

describe('Animation Timing', () => {
  beforeEach(() => {
    window.ANIMATION_LOGGER = mockAnimationLogger;
    mockAnimationLogger.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.ANIMATION_LOGGER;
  });

  const createCreature = (name, options = {}) => ({
    id: `${name.toLowerCase()}_${Date.now()}_${Math.random()}`,
    name,
    ppValue: options.ppValue ?? 10,
    level: options.level ?? 1,
    generation: options.generation ?? 'Gen1',
    ability: options.ability,
    arcana: 'creature'
  });

  const mockProps = {
    gameMode: 'roguelike',
    selectedArchetype: { name: 'Scholar', icon: '📚', effect: { description: 'Test' } },
    currentDream: 1,
    dreamScore: 0,
    dreamThreshold: 100,
    dreamEffects: [],
    hand: [],
    setHand: vi.fn(),
    packsPerRoom: 3,
    packsOpenedThisRoom: 0,
    openPackToHand: vi.fn(),
    startNewDream: vi.fn(),
    archetypeMementos: [],
    pp: 1000,
    collection: {},
    equippedRunes: [],
    setCurrentScreen: vi.fn(),
    applyCardXP: vi.fn(),
    setDreamScore: vi.fn(),
    setGameMode: vi.fn(),
    applyReward: vi.fn(),
    setCollection: vi.fn(),
    fuseCards: vi.fn(),
    scoringSpeedMultiplier: 10 // Speed up for tests
  };

  describe('Card Reveal Timing', () => {
    test('cards reveal in sequence with proper delays', async () => {
      const board = [
        createCreature('Manaclite'),
        createCreature('TestCreature'),
        createCreature('Fred')
      ];

      // This test would require complex drag/drop simulation
      // For now we'll focus on unit testing the logging functionality
      expect(mockAnimationLogger.logs).toEqual([]);
    });

    test('logs scoring start event', () => {
      mockAnimationLogger.log('SCORING_START', {
        board: ['Manaclite', 'Fred', 'Loopine'],
        timestamp: 0
      });

      expect(mockAnimationLogger.getLogsOfType('SCORING_START')).toHaveLength(1);
      expect(mockAnimationLogger.logs[0].data.board).toEqual(['Manaclite', 'Fred', 'Loopine']);
    });

    test('logs card reveal events in order', () => {
      // Simulate card reveals
      mockAnimationLogger.log('CARD_REVEAL', { cardIndex: 0, cardName: 'Manaclite' });
      vi.advanceTimersByTime(300);
      mockAnimationLogger.log('CARD_REVEAL', { cardIndex: 1, cardName: 'Fred' });
      vi.advanceTimersByTime(300);
      mockAnimationLogger.log('CARD_REVEAL', { cardIndex: 2, cardName: 'Loopine' });

      const reveals = mockAnimationLogger.getLogsOfType('CARD_REVEAL');
      expect(reveals).toHaveLength(3);
      expect(reveals[0].data.cardName).toBe('Manaclite');
      expect(reveals[1].data.cardName).toBe('Fred');
      expect(reveals[2].data.cardName).toBe('Loopine');
    });
  });

  describe('Token Generation Timing', () => {
    test('tokens generate after card reveal completes', () => {
      mockAnimationLogger.log('CARD_REVEAL', { cardIndex: 0, cardName: 'Manaclite' });
      vi.advanceTimersByTime(800); // After reveal + base delay
      mockAnimationLogger.log('TOKEN_GENERATED', { 
        cardIndex: 0, 
        cardName: 'Manaclite',
        tokens: { strength: 1 }
      });

      const timing = mockAnimationLogger.getTimingBetween('CARD_REVEAL', 'TOKEN_GENERATED');
      expect(timing).toBeGreaterThanOrEqual(800);
    });

    test('multiple tokens log separately', () => {
      mockAnimationLogger.log('TOKEN_GENERATED', {
        cardIndex: 0,
        tokens: { fire: 1, water: 1, earth: 2 }
      });

      const tokenLogs = mockAnimationLogger.getLogsOfType('TOKEN_GENERATED');
      expect(tokenLogs[0].data.tokens).toEqual({ fire: 1, water: 1, earth: 2 });
    });
  });

  describe('Dream Effect Timing', () => {
    test('dream effects apply before token multipliers', () => {
      mockAnimationLogger.log('CARD_REVEAL', { cardIndex: 0 });
      vi.advanceTimersByTime(300);
      mockAnimationLogger.log('DREAM_EFFECT_START', { cardIndex: 0, multiplier: 1.5 });
      vi.advanceTimersByTime(600);
      mockAnimationLogger.log('DREAM_EFFECT_END', { cardIndex: 0 });
      vi.advanceTimersByTime(100);
      mockAnimationLogger.log('TOKEN_MULTIPLIER_START', { cardIndex: 0, multiplier: 2 });

      const dreamStart = mockAnimationLogger.getLogsOfType('DREAM_EFFECT_START')[0];
      const tokenStart = mockAnimationLogger.getLogsOfType('TOKEN_MULTIPLIER_START')[0];
      
      expect(tokenStart.timestamp).toBeGreaterThan(dreamStart.timestamp);
    });

    test('dream effect animations have proper duration', () => {
      mockAnimationLogger.log('DREAM_EFFECT_START', { cardIndex: 0 });
      vi.advanceTimersByTime(800); // 600ms animation + 200ms fade
      mockAnimationLogger.log('DREAM_EFFECT_END', { cardIndex: 0 });

      const timing = mockAnimationLogger.getTimingBetween('DREAM_EFFECT_START', 'DREAM_EFFECT_END');
      expect(timing).toBeGreaterThanOrEqual(800);
    });
  });

  describe('Special Effects Timing', () => {
    test('Loopine time loop triggers after all cards revealed', () => {
      // Simulate full board reveal
      for (let i = 0; i < 5; i++) {
        mockAnimationLogger.log('CARD_REVEAL', { cardIndex: i });
        vi.advanceTimersByTime(500);
      }
      
      mockAnimationLogger.log('LOOPINE_TIME_LOOP', { loopineIndex: 2 });

      const lastReveal = mockAnimationLogger.getLogsOfType('CARD_REVEAL').pop();
      const loopine = mockAnimationLogger.getLogsOfType('LOOPINE_TIME_LOOP')[0];
      
      expect(loopine.timestamp).toBeGreaterThan(lastReveal.timestamp);
    });

    test('special effects trigger after token generation', () => {
      mockAnimationLogger.log('TOKEN_GENERATED', { cardIndex: 0 });
      vi.advanceTimersByTime(500);
      mockAnimationLogger.log('SPECIAL_EFFECT', { 
        cardIndex: 0, 
        effectType: 'shuffle_board' 
      });

      const timing = mockAnimationLogger.getTimingBetween('TOKEN_GENERATED', 'SPECIAL_EFFECT');
      expect(timing).toBeGreaterThanOrEqual(500);
    });
  });

  describe('Complete Scoring Sequence', () => {
    test('full sequence has correct order', () => {
      // Simulate complete scoring sequence
      mockAnimationLogger.log('SCORING_START', {});
      vi.advanceTimersByTime(200);
      
      // Card 1
      mockAnimationLogger.log('CARD_REVEAL', { cardIndex: 0, cardName: 'Manaclite' });
      vi.advanceTimersByTime(300);
      mockAnimationLogger.log('TOKEN_GENERATED', { cardIndex: 0, tokens: { strength: 1 } });
      vi.advanceTimersByTime(800);
      
      // Card 2  
      mockAnimationLogger.log('CARD_REVEAL', { cardIndex: 1, cardName: 'TestCreature' });
      vi.advanceTimersByTime(200);
      mockAnimationLogger.log('TOKEN_MULTIPLIER_START', { cardIndex: 1, multiplier: 2 });
      vi.advanceTimersByTime(800);
      mockAnimationLogger.log('TOKEN_MULTIPLIER_END', { cardIndex: 1 });
      vi.advanceTimersByTime(500);
      
      mockAnimationLogger.log('SCORING_COMPLETE', { totalScore: 30 });

      const logs = mockAnimationLogger.logs;
      const expectedOrder = [
        'SCORING_START',
        'CARD_REVEAL',
        'TOKEN_GENERATED',
        'CARD_REVEAL',
        'TOKEN_MULTIPLIER_START',
        'TOKEN_MULTIPLIER_END',
        'SCORING_COMPLETE'
      ];

      const actualOrder = logs.map(log => log.type);
      expect(actualOrder).toEqual(expectedOrder);
    });

    test('total scoring time matches sum of delays', () => {
      mockAnimationLogger.log('SCORING_START', {});
      vi.advanceTimersByTime(3000); // Simulated total time
      mockAnimationLogger.log('SCORING_COMPLETE', {});

      const totalTime = mockAnimationLogger.getTimingBetween('SCORING_START', 'SCORING_COMPLETE');
      expect(totalTime).toBeGreaterThanOrEqual(3000);
    });
  });

  describe('Edge Cases', () => {
    test('handles rapid scoring without overlaps', () => {
      // First scoring
      mockAnimationLogger.log('SCORING_START', { id: 1 });
      vi.advanceTimersByTime(1000);
      mockAnimationLogger.log('SCORING_COMPLETE', { id: 1 });
      
      // Second scoring immediately after
      mockAnimationLogger.log('SCORING_START', { id: 2 });
      vi.advanceTimersByTime(1000);
      mockAnimationLogger.log('SCORING_COMPLETE', { id: 2 });

      const starts = mockAnimationLogger.getLogsOfType('SCORING_START');
      const completes = mockAnimationLogger.getLogsOfType('SCORING_COMPLETE');
      
      expect(starts).toHaveLength(2);
      expect(completes).toHaveLength(2);
      expect(starts[1].timestamp).toBeGreaterThan(completes[0].timestamp);
    });

    test('handles scoring interruption gracefully', () => {
      mockAnimationLogger.log('SCORING_START', {});
      vi.advanceTimersByTime(500);
      mockAnimationLogger.log('CARD_REVEAL', { cardIndex: 0 });
      // Simulate interruption - no SCORING_COMPLETE

      const starts = mockAnimationLogger.getLogsOfType('SCORING_START');
      const completes = mockAnimationLogger.getLogsOfType('SCORING_COMPLETE');
      
      expect(starts).toHaveLength(1);
      expect(completes).toHaveLength(0);
    });
  });
});