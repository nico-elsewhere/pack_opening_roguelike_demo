import { describe, it, expect } from 'vitest'
import { 
  MAJOR_ARCANA,
  MINOR_ARCANA_SUITS,
  MINOR_ARCANA_RANKS,
  generateMinorArcana,
  applyCardEffect,
  ALL_TAROT_CARDS
} from '../tarotCards'

describe('Tarot Card System', () => {
  describe('Major Arcana', () => {
    it('should have 22 major arcana cards', () => {
      expect(MAJOR_ARCANA).toHaveLength(22)
    })

    it('should have correct properties for each major arcana', () => {
      MAJOR_ARCANA.forEach(card => {
        expect(card).toHaveProperty('name')
        expect(card).toHaveProperty('number')
        expect(card).toHaveProperty('symbol')
        expect(card).toHaveProperty('baseValue')
        expect(card).toHaveProperty('rarity')
        expect(card).toHaveProperty('effect')
        expect(card).toHaveProperty('description')
        expect(card).toHaveProperty('arcana', 'major')
      })
    })

    it('should have The Fool as first card', () => {
      expect(MAJOR_ARCANA[0].name).toBe('The Fool')
      expect(MAJOR_ARCANA[0].number).toBe(0)
    })

    it('should have The World as last card', () => {
      expect(MAJOR_ARCANA[21].name).toBe('The World')
      expect(MAJOR_ARCANA[21].number).toBe(21)
    })

    it('should have unique card numbers', () => {
      const numbers = MAJOR_ARCANA.map(card => card.number)
      const uniqueNumbers = new Set(numbers)
      expect(uniqueNumbers.size).toBe(22)
    })

    it('should have appropriate rarity distribution', () => {
      const rarities = MAJOR_ARCANA.map(card => card.rarity)
      
      // All major arcana should be at least rare
      expect(rarities.every(r => ['rare', 'epic', 'legendary'].includes(r))).toBe(true)
      
      // Should have some legendary cards
      expect(rarities.filter(r => r === 'legendary').length).toBeGreaterThan(0)
    })
  })

  describe('Minor Arcana', () => {
    it('should have correct suits', () => {
      expect(MINOR_ARCANA_SUITS).toEqual(['Wands', 'Cups', 'Swords', 'Pentacles'])
    })

    it('should have correct ranks', () => {
      expect(MINOR_ARCANA_RANKS).toEqual([
        'Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10',
        'Page', 'Knight', 'Queen', 'King'
      ])
    })

    it('should generate 56 minor arcana cards', () => {
      const minorArcana = generateMinorArcana()
      expect(minorArcana).toHaveLength(56) // 4 suits × 14 ranks
    })

    it('should have correct properties for minor arcana', () => {
      const minorArcana = generateMinorArcana()
      
      minorArcana.forEach(card => {
        expect(card).toHaveProperty('name')
        expect(card).toHaveProperty('suit')
        expect(card).toHaveProperty('rank')
        expect(card).toHaveProperty('symbol')
        expect(card).toHaveProperty('baseValue')
        expect(card).toHaveProperty('rarity')
        expect(card).toHaveProperty('effect')
        expect(card).toHaveProperty('description')
        expect(card).toHaveProperty('arcana', 'minor')
      })
    })

    it('should assign correct symbols to suits', () => {
      const minorArcana = generateMinorArcana()
      
      const wandsCard = minorArcana.find(card => card.suit === 'Wands')
      const cupsCard = minorArcana.find(card => card.suit === 'Cups')
      const swordsCard = minorArcana.find(card => card.suit === 'Swords')
      const pentaclesCard = minorArcana.find(card => card.suit === 'Pentacles')
      
      expect(wandsCard.symbol).toBe('🏑')
      expect(cupsCard.symbol).toBe('🏆')
      expect(swordsCard.symbol).toBe('⚔️')
      expect(pentaclesCard.symbol).toBe('🪙')
    })

    it('should calculate correct base values', () => {
      const minorArcana = generateMinorArcana()
      
      // Check Ace
      const ace = minorArcana.find(card => card.rank === 'Ace')
      expect(ace.baseValue).toBe(18)
      
      // Check number cards
      const two = minorArcana.find(card => card.rank === '2')
      expect(two.baseValue).toBe(4)
      
      // Check court cards
      const page = minorArcana.find(card => card.rank === 'Page')
      expect(page.baseValue).toBe(14)
      
      const king = minorArcana.find(card => card.rank === 'King')
      expect(king.baseValue).toBe(20)
    })
  })

  describe('Card Effects', () => {
    it('should have effects for major arcana', () => {
      MAJOR_ARCANA.forEach(card => {
        expect(card.effect).toBeDefined()
        expect(card.effect).toHaveProperty('type')
        expect(card.effect).toHaveProperty('value')
      })
    })

    it('should have effects for court cards', () => {
      const minorArcana = generateMinorArcana()
      const courtCards = minorArcana.filter(card => 
        ['Page', 'Knight', 'Queen', 'King'].includes(card.rank)
      )
      
      courtCards.forEach(card => {
        expect(card.effect).not.toBeNull()
        expect(card.effect).toHaveProperty('type')
        expect(card.effect).toHaveProperty('value')
      })
    })

    it('should have null effects for number cards', () => {
      const minorArcana = generateMinorArcana()
      const numberCards = minorArcana.filter(card => 
        !['Ace', 'Page', 'Knight', 'Queen', 'King'].includes(card.rank)
      )
      
      numberCards.forEach(card => {
        expect(card.effect).toBeNull()
      })
    })
  })

  describe('applyCardEffect', () => {
    it('should apply chaos effect from The Fool', () => {
      const fool = MAJOR_ARCANA.find(card => card.name === 'The Fool')
      const gameState = { pp: 100 }
      const collection = []
      const packCards = []
      
      const result = applyCardEffect(fool, gameState, collection, packCards)
      
      // Chaos effect should modify PP (50% chance to double or halve)
      expect(result.pp).not.toBe(100)
      expect([50, 200]).toContain(result.pp)
    })

    it('should apply wheel effect', () => {
      const card = { effect: { type: 'wheel' } }
      const gameState = { pp: 100 }
      
      const result = applyCardEffect(card, gameState, [], [])
      
      // Wheel gives random PP bonus between 0-99
      expect(result.pp).toBeGreaterThanOrEqual(100)
      expect(result.pp).toBeLessThanOrEqual(199)
    })

    it('should handle cards without effects', () => {
      const card = { effect: null }
      const gameState = { pp: 100 }
      
      const result = applyCardEffect(card, gameState, [], [])
      
      expect(result).toBe(gameState)
      expect(result.pp).toBe(100)
    })
  })

  describe('ALL_TAROT_CARDS', () => {
    it('should contain all 78 tarot cards', () => {
      expect(ALL_TAROT_CARDS).toHaveLength(78) // 22 major + 56 minor
    })

    it('should have unique card names', () => {
      const names = ALL_TAROT_CARDS.map(card => card.name)
      const uniqueNames = new Set(names)
      expect(uniqueNames.size).toBe(78)
    })

    it('should properly combine major and minor arcana', () => {
      const majorCount = ALL_TAROT_CARDS.filter(card => card.arcana === 'major').length
      const minorCount = ALL_TAROT_CARDS.filter(card => card.arcana === 'minor').length
      
      expect(majorCount).toBe(22)
      expect(minorCount).toBe(56)
    })
  })

  describe('Rarity Distribution', () => {
    it('should have appropriate rarity for minor arcana', () => {
      const minorArcana = generateMinorArcana()
      
      // Aces and court cards should be at least uncommon
      const specialCards = minorArcana.filter(card => 
        ['Ace', 'Page', 'Knight', 'Queen', 'King'].includes(card.rank)
      )
      
      specialCards.forEach(card => {
        expect(['uncommon', 'rare']).toContain(card.rarity)
      })
      
      // Number cards can be common
      const numberCards = minorArcana.filter(card => 
        !['Ace', 'Page', 'Knight', 'Queen', 'King'].includes(card.rank)
      )
      
      expect(numberCards.some(card => card.rarity === 'common')).toBe(true)
    })
  })
})