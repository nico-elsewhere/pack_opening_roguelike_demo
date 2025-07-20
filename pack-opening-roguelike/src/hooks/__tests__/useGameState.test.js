import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '../useGameState'

// Mock the card utilities
vi.mock('../../utils/cards', () => ({
  createDeck: vi.fn(() => Promise.resolve([
    { id: '1', rank: '5', suit: 'fire', ppValue: 5, level: 1, isRune: false },
    { id: '2', rank: '6', suit: 'water', ppValue: 6, level: 1, isRune: false },
    { id: '3', rank: '7', suit: 'earth', ppValue: 7, level: 1, isRune: false },
    { id: '4', rank: '8', suit: 'air', ppValue: 8, level: 1, isRune: false },
    { id: '5', rank: 'Q', suit: 'fire', ppValue: 10, level: 1, isRune: true }
  ])),
  generatePack: vi.fn(() => [
    { id: '1-pack', rank: '5', suit: 'fire', ppValue: 5, level: 1, isRune: false }
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
    level: 1,
    generation: 'Gen2'
  })),
  calculateFusionCost: vi.fn(() => 100)
}))

vi.mock('../../utils/creatureEffects', () => ({
  getCreatureAbilityText: vi.fn(() => 'Test ability')
}))

describe('useGameState Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useGameState())
      
      expect(result.current.pp).toBe(2000)
      expect(result.current.collection).toEqual({})
      expect(result.current.equippedRunes).toEqual([])
      expect(result.current.stagedPacks).toEqual([])
      expect(result.current.totalCardsOpened).toBe(0)
      expect(result.current.currentScreen).toBe('home')
      expect(result.current.gameMode).toBe('classic')
    })
  })

  describe('Pack Management', () => {
    it('should buy and stage a pack when having enough PP', () => {
      const { result } = renderHook(() => useGameState())
      
      act(() => {
        result.current.buyAndStagePack()
      })
      
      expect(result.current.pp).toBe(1950) // 2000 - 50
      expect(result.current.stagedPacks).toHaveLength(1)
    })

    it('should not buy a pack when PP insufficient', () => {
      const { result } = renderHook(() => useGameState())
      
      // Set PP to less than pack cost
      act(() => {
        result.current.setPP(20)
      })
      
      act(() => {
        result.current.buyAndStagePack()
      })
      
      expect(result.current.pp).toBe(20)
      expect(result.current.stagedPacks).toHaveLength(0)
    })

    it('should open a pack', () => {
      const { result } = renderHook(() => useGameState())
      
      act(() => {
        result.current.openPack()
      })
      
      expect(result.current.currentPack).toBeDefined()
      expect(result.current.currentPackPPValues).toBeDefined()
      expect(result.current.totalCardsOpened).toBe(5) // Default pack size
    })

    it('should open all staged packs', () => {
      const { result } = renderHook(() => useGameState())
      
      // Stage multiple packs
      act(() => {
        result.current.buyAndStagePack()
        result.current.buyAndStagePack()
      })
      
      expect(result.current.stagedPacks).toHaveLength(2)
      
      act(() => {
        result.current.openAllStagedPacks()
      })
      
      expect(result.current.stagedPacks).toHaveLength(0)
      expect(result.current.openedCards.length).toBeGreaterThan(0)
    })
  })

  describe('Screen Navigation', () => {
    it('should change screens', () => {
      const { result } = renderHook(() => useGameState())
      
      act(() => {
        result.current.setCurrentScreen('packs')
      })
      
      expect(result.current.currentScreen).toBe('packs')
    })
  })

  describe('Rune Management', () => {
    it('should equip a rune', async () => {
      const { result } = renderHook(() => useGameState())
      
      // Wait for deck to load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })
      
      const rune = { 
        id: 'rune-1', 
        rank: 'Q', 
        suit: 'fire', 
        isRune: true,
        effect: { type: 'pp_generation', bonusPP: 1 }
      }
      
      // Add rune to collection first
      act(() => {
        result.current.setCollection({
          'rune-1': { ...rune, count: 1 }
        })
      })
      
      act(() => {
        result.current.equipRune(rune, 0)
      })
      
      expect(result.current.equippedRunes[0]).toEqual(rune)
    })
  })

  describe('Fusion System', () => {
    it('should fuse two cards', () => {
      const { result } = renderHook(() => useGameState())
      
      const card1 = { id: 'card-1', name: 'Card 1', ppValue: 10 }
      const card2 = { id: 'card-2', name: 'Card 2', ppValue: 15 }
      
      // Add cards to collection
      act(() => {
        result.current.setCollection({
          'card-1': { ...card1, count: 1 },
          'card-2': { ...card2, count: 1 }
        })
      })
      
      act(() => {
        result.current.fuseCards(card1, card2)
      })
      
      expect(result.current.pp).toBe(1900) // 2000 - 100 fusion cost
    })

    it('should not fuse without enough PP', () => {
      const { result } = renderHook(() => useGameState())
      
      const card1 = { id: 'card-1', name: 'Card 1', ppValue: 10 }
      const card2 = { id: 'card-2', name: 'Card 2', ppValue: 15 }
      
      act(() => {
        result.current.setPP(50) // Less than fusion cost
      })
      
      const fusedCard = result.current.fuseCards(card1, card2)
      
      expect(fusedCard).toBeNull()
      expect(result.current.pp).toBe(50) // Unchanged
    })
  })

  describe('Roguelike Mode', () => {
    it('should start roguelike mode', () => {
      const { result } = renderHook(() => useGameState())
      
      act(() => {
        result.current.startRoguelikeMode({ id: 'scholar', name: 'Scholar' })
      })
      
      expect(result.current.gameMode).toBe('roguelike')
      expect(result.current.selectedArchetype.name).toBe('Scholar')
      expect(result.current.currentDream).toBe(1)
      expect(result.current.dreamScore).toBe(0)
    })

    it('should open pack to hand in roguelike mode', () => {
      const { result } = renderHook(() => useGameState())
      
      act(() => {
        result.current.setGameMode('roguelike')
        result.current.openPackToHand()
      })
      
      expect(result.current.hand.length).toBeGreaterThan(0)
      expect(result.current.packsOpenedThisRoom).toBe(1)
    })

    it('should start new dream', () => {
      const { result } = renderHook(() => useGameState())
      
      act(() => {
        result.current.setGameMode('roguelike')
        result.current.setCurrentDream(1)
        result.current.startNewDream()
      })
      
      expect(result.current.currentDream).toBe(2)
      expect(result.current.dreamScore).toBe(0)
      expect(result.current.packsOpenedThisRoom).toBe(0)
    })
  })

  describe('Card XP System', () => {
    it('should apply XP to cards', () => {
      const { result } = renderHook(() => useGameState())
      
      const card = { 
        id: 'card-1', 
        name: 'Test Card', 
        xp: 0, 
        xpToNextLevel: 100,
        level: 1
      }
      
      act(() => {
        result.current.setCollection({
          'card-1': { ...card, count: 1 }
        })
      })
      
      act(() => {
        result.current.applyCardXP(['card-1'])
      })
      
      expect(result.current.collection['card-1'].xp).toBe(10)
    })
  })
})