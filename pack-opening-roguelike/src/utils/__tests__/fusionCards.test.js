import { describe, it, expect } from 'vitest'
import { 
  canFuseCards, 
  generateFusedCard, 
  calculateFusionCost,
  FUSION_RECIPES,
  FUSION_SUITS,
  TAROT_FUSIONS,
  getAllFusionCombinations
} from '../fusionCards'

describe('Fusion System', () => {
  describe('canFuseCards', () => {
    it('should allow fusion of same rank elemental cards', () => {
      const card1 = { rank: '5', suit: 'fire', arcana: 'playing' }
      const card2 = { rank: '5', suit: 'water', arcana: 'playing' }
      
      expect(canFuseCards(card1, card2)).toBe(true)
    })

    it('should not allow fusion of different rank cards', () => {
      const card1 = { rank: '5', suit: 'fire', arcana: 'playing' }
      const card2 = { rank: '7', suit: 'fire', arcana: 'playing' }
      
      expect(canFuseCards(card1, card2)).toBe(false)
    })

    it('should allow fusion of same tarot cards', () => {
      const card1 = { name: 'The Tower', arcana: 'major' }
      const card2 = { name: 'The Tower', arcana: 'major' }
      
      expect(canFuseCards(card1, card2)).toBe(true)
    })

    it('should allow fusion of different major arcana', () => {
      const card1 = { name: 'The Tower', arcana: 'major' }
      const card2 = { name: 'The Sun', arcana: 'major' }
      
      expect(canFuseCards(card1, card2)).toBe(true)
    })

    it('should allow fusion of major arcana with minor arcana', () => {
      const major = { name: 'The Fool', arcana: 'major' }
      const minor = { name: '3 of Cups', arcana: 'minor', suit: 'cups', number: 3 }
      
      expect(canFuseCards(major, minor)).toBe(true)
    })

    it('should allow fusion of major arcana with elemental cards', () => {
      const major = { name: 'The Tower', arcana: 'major' }
      const elemental = { rank: '5', suit: 'fire', arcana: 'playing' }
      
      expect(canFuseCards(major, elemental)).toBe(true)
    })

    it('should allow fusion of transcendent/empowered cards', () => {
      const trans1 = { name: 'The Cosmic Order', arcana: 'transcendent' }
      const trans2 = { name: 'The Divine Comedy', arcana: 'transcendent' }
      
      expect(canFuseCards(trans1, trans2)).toBe(true)
    })
  })

  describe('generateFusedCard', () => {
    it('should return correct fusion for elemental cards', () => {
      const card1 = { id: '1', rank: '5', suit: 'fire', arcana: 'playing', ppValue: 5, level: 1 }
      const card2 = { id: '2', rank: '5', suit: 'water', arcana: 'playing', ppValue: 5, level: 1 }
      
      const result = generateFusedCard(card1, card2)
      expect(result.suit).toBe('steam')
      expect(result.rank).toBe('5')
      expect(result.isRune).toBe(true)
    })

    it('should handle all elemental combinations', () => {
      const combinations = [
        { suits: ['fire', 'water'], result: 'steam' },
        { suits: ['fire', 'earth'], result: 'magma' },
        { suits: ['fire', 'air'], result: 'lightning' },
        { suits: ['water', 'earth'], result: 'mud' },
        { suits: ['water', 'air'], result: 'ice' },
        { suits: ['earth', 'air'], result: 'dust' }
      ]

      combinations.forEach(({ suits, result }) => {
        const card1 = { id: '1', rank: 'A', suit: suits[0], arcana: 'playing', ppValue: 11, level: 1 }
        const card2 = { id: '2', rank: 'A', suit: suits[1], arcana: 'playing', ppValue: 11, level: 1 }
        
        const fusion = generateFusedCard(card1, card2)
        expect(fusion.suit).toBe(result)
      })
    })

    it('should return transcendent arcana for major + major fusion', () => {
      const tower = { id: '1', name: 'The Tower', arcana: 'major', ppValue: 40, level: 1 }
      const sun = { id: '2', name: 'The Sun', arcana: 'major', ppValue: 50, level: 1 }
      
      const result = generateFusedCard(tower, sun)
      expect(result.arcana).toBe('transcendent')
      expect(result.rarity).toBe('legendary')
    })

    it('should return empowered arcana for major + minor fusion', () => {
      const fool = { id: '1', name: 'The Fool', arcana: 'major', ppValue: 35, level: 1 }
      const cups = { id: '2', name: '3 of Cups', arcana: 'minor', suit: 'cups', number: 3, ppValue: 6, level: 1 }
      
      const result = generateFusedCard(fool, cups)
      expect(result.arcana).toBe('empowered')
      expect(result.rarity).toBe('epic')
    })

    it('should have unique names for number-specific combinations', () => {
      const tower = { id: '1', name: 'The Tower', arcana: 'major', ppValue: 40, level: 1 }
      const fire1 = { id: '2', rank: '1', suit: 'fire', arcana: 'playing', ppValue: 1, level: 1 }
      const fire2 = { id: '3', rank: '2', suit: 'fire', arcana: 'playing', ppValue: 2, level: 1 }
      
      const result1 = generateFusedCard(tower, fire1)
      const result2 = generateFusedCard(tower, fire2)
      
      expect(result1.name).not.toBe(result2.name)
      expect(result1.name).toBe('The First Strike')
      expect(result2.name).toBe('The Twin Towers')
    })

    it('should combine PP values correctly', () => {
      const card1 = { id: '1', rank: '5', suit: 'fire', arcana: 'playing', ppValue: 5, level: 2 }
      const card2 = { id: '2', rank: '5', suit: 'water', arcana: 'playing', ppValue: 5, level: 3 }
      
      const result = generateFusedCard(card1, card2)
      
      // Should combine base PP values and average levels
      expect(result.ppValue).toBeGreaterThan(10)
      expect(result.level).toBe(2) // Floor of average (2.5)
    })
  })

  describe('calculateFusionCost', () => {
    it('should calculate base cost for regular cards', () => {
      const card1 = { rank: '5', suit: 'fire', level: 1, arcana: 'playing' }
      const card2 = { rank: '5', suit: 'water', level: 1, arcana: 'playing' }
      
      const cost = calculateFusionCost(card1, card2)
      expect(cost).toBe(100)
    })

    it('should increase cost for face cards', () => {
      const card1 = { rank: 'K', suit: 'fire', level: 1, arcana: 'playing' }
      const card2 = { rank: 'K', suit: 'water', level: 1, arcana: 'playing' }
      
      const cost = calculateFusionCost(card1, card2)
      expect(cost).toBe(150)
    })

    it('should increase cost for Ace cards', () => {
      const card1 = { rank: 'A', suit: 'fire', level: 1, arcana: 'playing' }
      const card2 = { rank: 'A', suit: 'water', level: 1, arcana: 'playing' }
      
      const cost = calculateFusionCost(card1, card2)
      expect(cost).toBe(200)
    })

    it('should increase cost for tarot fusions', () => {
      const card1 = { name: 'The Tower', arcana: 'major', rarity: 'rare' }
      const card2 = { rank: '5', suit: 'fire', arcana: 'playing' }
      
      const cost = calculateFusionCost(card1, card2)
      expect(cost).toBeGreaterThan(100)
    })

    it('should have highest cost for major + major fusion', () => {
      const card1 = { name: 'The Tower', arcana: 'major', rarity: 'rare' }
      const card2 = { name: 'The Sun', arcana: 'major', rarity: 'rare' }
      
      const cost = calculateFusionCost(card1, card2)
      expect(cost).toBe(300)
    })

    it('should handle legendary rarity multiplier', () => {
      const card1 = { name: 'The World', arcana: 'major', rarity: 'legendary' }
      const card2 = { name: 'The Fool', arcana: 'major', rarity: 'legendary' }
      
      const cost = calculateFusionCost(card1, card2)
      expect(cost).toBe(600) // 100 * 3 * 2
    })
  })

  describe('Fusion Constants', () => {
    it('should have all elemental fusion recipes', () => {
      expect(FUSION_RECIPES).toHaveProperty('fire+water', 'steam')
      expect(FUSION_RECIPES).toHaveProperty('fire+earth', 'magma')
      expect(FUSION_RECIPES).toHaveProperty('fire+air', 'lightning')
      expect(FUSION_RECIPES).toHaveProperty('water+earth', 'mud')
      expect(FUSION_RECIPES).toHaveProperty('water+air', 'ice')
      expect(FUSION_RECIPES).toHaveProperty('earth+air', 'dust')
    })

    it('should have fusion suit properties', () => {
      const fusionSuits = ['steam', 'magma', 'lightning', 'mud', 'ice', 'dust']
      
      fusionSuits.forEach(suit => {
        expect(FUSION_SUITS).toHaveProperty(suit)
        expect(FUSION_SUITS[suit]).toHaveProperty('symbol')
        expect(FUSION_SUITS[suit]).toHaveProperty('ppMultiplier')
        expect(FUSION_SUITS[suit]).toHaveProperty('effect')
      })
    })
  })

  describe('getAllFusionCombinations', () => {
    it('should return array of fusion combinations', () => {
      const combinations = getAllFusionCombinations()
      
      expect(Array.isArray(combinations)).toBe(true)
      expect(combinations.length).toBeGreaterThan(0)
      
      // Check structure of combinations
      combinations.forEach(combo => {
        expect(combo).toHaveProperty('cards')
        expect(combo).toHaveProperty('result')
        expect(combo.cards).toHaveLength(2)
      })
    })
  })

  describe('Tarot Fusion Integration', () => {
    it('should handle tarot card objects correctly', () => {
      const tower = {
        id: '1',
        name: 'The Tower',
        arcana: 'major',
        number: 16,
        symbol: '🏰',
        ppValue: 40,
        rarity: 'rare',
        level: 1
      }
      
      const sun = {
        id: '2',
        name: 'The Sun',
        arcana: 'major',
        number: 19,
        symbol: '☀️',
        ppValue: 50,
        rarity: 'epic',
        level: 1
      }
      
      expect(canFuseCards(tower, sun)).toBe(true)
      
      const result = generateFusedCard(tower, sun)
      expect(result).toBeDefined()
      expect(result.arcana).toBe('transcendent')
    })

    it('should find fusion recipe for Tower + Hierophant', () => {
      const key = 'The Tower+The Hierophant'
      const reverseKey = 'The Hierophant+The Tower'
      
      // Should work with either order
      const hasRecipe = TAROT_FUSIONS.hasOwnProperty(key) || TAROT_FUSIONS.hasOwnProperty(reverseKey)
      expect(hasRecipe).toBe(true)
    })
  })
})