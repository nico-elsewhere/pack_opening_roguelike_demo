import { describe, it, expect } from 'vitest'
import { 
  SUITS,
  RANKS,
  createDeck,
  generatePack,
  generateRuneEffect,
  calculateCardPP
} from '../cards'

describe('Card System', () => {
  describe('Constants', () => {
    it('should have correct suits', () => {
      expect(SUITS).toEqual(['fire', 'earth', 'water', 'air'])
    })

    it('should have correct ranks', () => {
      expect(RANKS).toEqual(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'])
    })
  })

  describe('createDeck', () => {
    it('should create deck with tarot cards when enabled', () => {
      const deck = createDeck(true)
      
      // Should have tarot cards + 52 regular cards
      expect(deck.length).toBeGreaterThan(52)
      
      // Check for tarot cards
      const tarotCards = deck.filter(card => card.arcana && card.arcana !== 'playing')
      expect(tarotCards.length).toBeGreaterThan(0)
    })

    it('should create deck without tarot cards when disabled', () => {
      const deck = createDeck(false)
      
      // Should have exactly 52 regular cards (4 suits × 13 ranks)
      expect(deck).toHaveLength(52)
      
      // All should be playing cards
      const playingCards = deck.filter(card => card.arcana === 'playing')
      expect(playingCards).toHaveLength(52)
    })

    it('should create cards with correct properties', () => {
      const deck = createDeck(false)
      
      deck.forEach(card => {
        expect(card).toHaveProperty('id')
        expect(card).toHaveProperty('rank')
        expect(card).toHaveProperty('suit')
        expect(card).toHaveProperty('name')
        expect(card).toHaveProperty('ppValue')
        expect(card).toHaveProperty('isRune')
        expect(card).toHaveProperty('level')
        expect(card).toHaveProperty('xp')
        expect(card).toHaveProperty('xpToNextLevel')
      })
    })

    it('should mark face cards as runes', () => {
      const deck = createDeck(false)
      const faceCards = deck.filter(card => ['J', 'Q', 'K', 'A'].includes(card.rank))
      
      faceCards.forEach(card => {
        expect(card.isRune).toBe(true)
      })
    })
  })

  describe('generatePack', () => {
    it('should generate pack of specified size', () => {
      const deck = createDeck(false)
      const pack = generatePack(5, deck)
      
      expect(pack).toHaveLength(5)
    })

    it('should not include duplicate cards', () => {
      const deck = createDeck(false)
      const pack = generatePack(10, deck)
      
      const ids = pack.map(card => card.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should generate unique IDs for pack cards', () => {
      const deck = createDeck(false)
      const pack = generatePack(5, deck)
      
      pack.forEach(card => {
        expect(card.id).toContain('-pack-')
      })
    })
  })

  describe('generateRuneEffect', () => {
    it('should generate suit bonus for Jacks', () => {
      const jack = { rank: 'J', suit: 'fire', level: 1 }
      const effect = generateRuneEffect(jack)
      
      expect(effect.type).toBe('suit_bonus')
      expect(effect.suit).toBe('fire')
      expect(effect.multiplier).toBeGreaterThan(1)
    })

    it('should generate PP generation for Queens', () => {
      const queen = { rank: 'Q', suit: 'water', level: 1 }
      const effect = generateRuneEffect(queen)
      
      expect(effect.type).toBe('pp_generation')
      expect(effect.bonusPP).toBeGreaterThan(0)
    })

    it('should generate suit count multiplier for Kings', () => {
      const king = { rank: 'K', suit: 'earth', level: 1 }
      const effect = generateRuneEffect(king)
      
      expect(effect.type).toBe('suit_count_mult')
      expect(effect.suit).toBe('earth')
      expect(effect.multiplierPerCard).toBeGreaterThan(0)
    })

    it('should generate suit chance for Aces', () => {
      const ace = { rank: 'A', suit: 'air', level: 1 }
      const effect = generateRuneEffect(ace)
      
      expect(effect.type).toBe('suit_chance')
      expect(effect.suit).toBe('air')
      expect(effect.chanceBonus).toBeGreaterThan(0)
    })

    it('should scale effects with card level', () => {
      const jack1 = { rank: 'J', suit: 'fire', level: 1 }
      const jack2 = { rank: 'J', suit: 'fire', level: 2 }
      
      const effect1 = generateRuneEffect(jack1)
      const effect2 = generateRuneEffect(jack2)
      
      expect(effect2.multiplier).toBeGreaterThan(effect1.multiplier)
    })
  })

  describe('calculateCardPP', () => {
    it('should calculate base PP value', () => {
      const card = { ppValue: 10, level: 1, suit: 'fire' }
      const pp = calculateCardPP(card)
      
      expect(pp).toBe(10)
    })

    it('should scale PP with card level', () => {
      const card = { ppValue: 10, level: 3, suit: 'fire' }
      const pp = calculateCardPP(card)
      
      expect(pp).toBe(30)
    })

    it('should apply suit bonus from runes', () => {
      const card = { ppValue: 10, level: 1, suit: 'fire' }
      const rune = { 
        effect: { 
          type: 'suit_bonus', 
          suit: 'fire', 
          multiplier: 1.5 
        } 
      }
      
      const pp = calculateCardPP(card, [rune])
      
      expect(pp).toBe(15)
    })

    it('should apply suit count multiplier', () => {
      const card = { ppValue: 10, level: 1, suit: 'water' }
      const rune = { 
        effect: { 
          type: 'suit_count_mult', 
          suit: 'water', 
          multiplierPerCard: 0.1 
        } 
      }
      const cardsInPack = [
        { suit: 'water' },
        { suit: 'water' },
        { suit: 'fire' }
      ]
      
      const pp = calculateCardPP(card, [rune], cardsInPack)
      
      // Base 10 * (1 + (0.1 * 2 water cards)) = 10 * 1.2 = 12
      expect(pp).toBe(12)
    })

    it('should stack multiple rune effects', () => {
      const card = { ppValue: 10, level: 1, suit: 'fire' }
      const runes = [
        { effect: { type: 'suit_bonus', suit: 'fire', multiplier: 1.5 } },
        { effect: { type: 'suit_bonus', suit: 'fire', multiplier: 1.2 } }
      ]
      
      const pp = calculateCardPP(card, runes)
      
      // Base 10 * 1.5 * 1.2 = 18
      expect(pp).toBe(18)
    })

    it('should handle game state modifiers', () => {
      const card = { ppValue: 10, level: 1, suit: 'fire' }
      const gameState = { criticalMultiplier: 2 }
      
      const pp = calculateCardPP(card, [], [], gameState)
      
      expect(pp).toBe(20)
    })

    it('should apply bear market minimum', () => {
      const card = { ppValue: 5, level: 1, suit: 'fire' }
      const gameState = { 
        bearMarketActive: true, 
        bearMarketMinimum: 10 
      }
      
      const pp = calculateCardPP(card, [], [], gameState)
      
      expect(pp).toBe(10)
    })
  })
})