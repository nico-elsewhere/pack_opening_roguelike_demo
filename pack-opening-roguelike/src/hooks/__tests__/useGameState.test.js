import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '../useGameState'

// Mock the card utilities
vi.mock('../../utils/cards', () => ({
  createDeck: vi.fn(() => []),
  generatePack: vi.fn(() => [
    { id: '1', rank: '5', suit: 'fire', ppValue: 5, level: 1, isRune: false }
  ]),
  calculateCardPP: vi.fn((card) => card.ppValue * card.level),
  generateRuneEffect: vi.fn(() => ({ type: 'pp_generation', bonusPP: 1 }))
}))

vi.mock('../../utils/tarotCards', () => ({
  applyCardEffect: vi.fn((card, gameState) => gameState)
}))

vi.mock('../../utils/fusionCards', () => ({
  generateFusedCard: vi.fn((card1, card2) => ({
    id: 'fused',
    name: 'Fused Card',
    ppValue: card1.ppValue + card2.ppValue,
    level: 1
  })),
  calculateFusionCost: vi.fn(() => 100)
}))

describe('useGameState Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useGameState())
      
      expect(result.current.pp).toBe(100)
      expect(result.current.collection).toEqual({})
      expect(result.current.equippedRunes).toEqual([])
      expect(result.current.ownedPacks).toBe(0)
      expect(result.current.totalCardsOpened).toBe(0)
    })
  })

  describe('Pack Management', () => {
    it('should buy a pack when having enough PP', () => {
      const { result } = renderHook(() => useGameState())
      
      act(() => {
        result.current.buyPack()
      })
      
      expect(result.current.pp).toBe(50) // 100 - 50
      expect(result.current.ownedPacks).toBe(1)
    })

    it('should not buy a pack when PP insufficient', () => {
      const { result } = renderHook(() => useGameState())
      
      // Spend PP first
      act(() => {
        result.current.setPP(30)
      })
      
      act(() => {
        result.current.buyPack()
      })
      
      expect(result.current.pp).toBe(30) // Unchanged
      expect(result.current.ownedPacks).toBe(0)
    })

    it('should stage a pack', () => {
      const { result } = renderHook(() => useGameState())
      
      act(() => {
        result.current.buyPack()
      })
      
      act(() => {
        result.current.stagePack()
      })
      
      expect(result.current.stagedPacks).toHaveLength(1)
      expect(result.current.ownedPacks).toBe(0)
    })
  })

  describe('Card Collection', () => {
    it('should add cards to collection', () => {
      const { result } = renderHook(() => useGameState())
      
      const card = { id: 'test-1', rank: '5', suit: 'fire' }
      
      act(() => {
        result.current.addCardToCollection(card)
      })
      
      expect(result.current.collection).toHaveProperty('test-1')
      expect(result.current.collection['test-1'].count).toBe(1)
    })

    it('should increment count for duplicate cards', () => {
      const { result } = renderHook(() => useGameState())
      
      const card = { id: 'test-1', rank: '5', suit: 'fire' }
      
      act(() => {
        result.current.addCardToCollection(card)
        result.current.addCardToCollection(card)
      })
      
      expect(result.current.collection['test-1'].count).toBe(2)
    })
  })

  describe('Rune Management', () => {
    it('should equip a rune', () => {
      const { result } = renderHook(() => useGameState())
      
      const rune = { 
        id: 'rune-1', 
        rank: 'Q', 
        suit: 'fire', 
        isRune: true,
        effect: { type: 'pp_generation', bonusPP: 2 }
      }
      
      act(() => {
        result.current.addCardToCollection(rune)
      })
      
      act(() => {
        result.current.equipRune(rune, 0)
      })
      
      expect(result.current.equippedRunes[0]).toBeTruthy()
      expect(result.current.equippedRunes[0].id).toBe('rune-1')
    })

    it('should unequip a rune', () => {
      const { result } = renderHook(() => useGameState())
      
      const rune = { 
        id: 'rune-1', 
        rank: 'Q', 
        suit: 'fire', 
        isRune: true,
        effect: { type: 'pp_generation', bonusPP: 2 }
      }
      
      act(() => {
        result.current.addCardToCollection(rune)
        result.current.equipRune(rune, 0)
      })
      
      act(() => {
        result.current.unequipRune(0)
      })
      
      expect(result.current.equippedRunes[0]).toBeNull()
    })
  })

  describe('Fusion System', () => {
    it('should fuse two cards', () => {
      const { result } = renderHook(() => useGameState())
      
      const card1 = { id: 'card-1', rank: '5', suit: 'fire', ppValue: 5, level: 1 }
      const card2 = { id: 'card-2', rank: '5', suit: 'water', ppValue: 5, level: 1 }
      
      act(() => {
        result.current.addCardToCollection(card1)
        result.current.addCardToCollection(card2)
        result.current.setPP(200)
      })
      
      act(() => {
        result.current.fuseCards(card1, card2)
      })
      
      expect(result.current.pp).toBe(100) // 200 - 100 fusion cost
      expect(result.current.fusedCards).toHaveProperty('fused')
    })

    it('should not fuse without enough PP', () => {
      const { result } = renderHook(() => useGameState())
      
      const card1 = { id: 'card-1', rank: '5', suit: 'fire', ppValue: 5, level: 1 }
      const card2 = { id: 'card-2', rank: '5', suit: 'water', ppValue: 5, level: 1 }
      
      act(() => {
        result.current.addCardToCollection(card1)
        result.current.addCardToCollection(card2)
        result.current.setPP(50)
      })
      
      const fusedBefore = Object.keys(result.current.fusedCards).length
      
      act(() => {
        result.current.fuseCards(card1, card2)
      })
      
      expect(result.current.pp).toBe(50) // Unchanged
      expect(Object.keys(result.current.fusedCards).length).toBe(fusedBefore)
    })
  })

  describe('Screen Navigation', () => {
    it('should change screens', () => {
      const { result } = renderHook(() => useGameState())
      
      expect(result.current.currentScreen).toBe('home')
      
      act(() => {
        result.current.setCurrentScreen('shop')
      })
      
      expect(result.current.currentScreen).toBe('shop')
    })
  })

  describe('PP Generation', () => {
    it('should calculate PP per second from equipped runes', () => {
      const { result } = renderHook(() => useGameState())
      
      const rune = { 
        id: 'rune-1', 
        rank: 'Q', 
        suit: 'fire', 
        isRune: true,
        effect: { type: 'pp_generation', bonusPP: 2.5 }
      }
      
      act(() => {
        result.current.addCardToCollection(rune)
        result.current.equipRune(rune, 0)
      })
      
      // Base 0.5 + 2.5 from rune
      expect(result.current.getPPPerSecond()).toBe(3)
    })
  })
})