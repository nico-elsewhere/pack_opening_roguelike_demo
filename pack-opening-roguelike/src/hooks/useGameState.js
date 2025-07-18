import { useState, useEffect, useRef } from 'react';
import { createDeck, generatePack, calculateCardPP, generateRuneEffect } from '../utils/cards';
import { applyCardEffect } from '../utils/tarotCards';

const INITIAL_PP = 100;
const PP_PER_SECOND = 0.5;
const PACK_COST = 50;

export const useGameState = () => {
  const [pp, setPP] = useState(INITIAL_PP);
  const [collection, setCollection] = useState({});
  const [equippedRunes, setEquippedRunes] = useState([]);
  const [deckTemplate] = useState(createDeck(true)); // Enable tarot cards
  const [currentPack, setCurrentPack] = useState(null);
  const [currentPackPPValues, setCurrentPackPPValues] = useState([]);
  const [stagedPacks, setStagedPacks] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);
  const [totalCardsOpened, setTotalCardsOpened] = useState(0);
  const [ownedPacks, setOwnedPacks] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [packSlots, setPackSlots] = useState(1);
  const [runeSlots, setRuneSlots] = useState(3);
  const [gameModifiers, setGameModifiers] = useState({});
  const [selectedPackType, setSelectedPackType] = useState('basic');
  const [packTypes] = useState([
    {
      id: 'basic',
      name: 'Basic Pack',
      description: 'Standard pack with 5 cards',
      icon: '📦',
      cardsPerPack: 5,
      rarityBonus: 0,
      unlocked: true
    },
    {
      id: 'elemental',
      name: 'Elemental Pack',
      description: 'Higher chance of elemental synergies',
      icon: '🌟',
      cardsPerPack: 5,
      rarityBonus: 10,
      unlocked: false,
      unlockRequirement: 'Unlock in shop'
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      description: 'Guaranteed rare or better',
      icon: '💎',
      cardsPerPack: 5,
      rarityBonus: 25,
      unlocked: false,
      unlockRequirement: 'Reach level 10'
    }
  ]);
  
  const lastUpdateTime = useRef(Date.now());
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateTime.current) / 1000;
      lastUpdateTime.current = now;
      
      setPP(prevPP => {
        let newPP = prevPP + (PP_PER_SECOND * deltaTime);
        
        equippedRunes.forEach(rune => {
          if (rune.effect.type === 'pp_generation') {
            newPP += rune.effect.bonusPP * deltaTime;
          }
        });
        
        return newPP;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [equippedRunes]);
  
  const buyPack = () => {
    if (pp < PACK_COST) return false;
    setPP(prevPP => prevPP - PACK_COST);
    setOwnedPacks(prevPacks => prevPacks + 1);
    return true;
  };
  
  const openPack = () => {
    if (ownedPacks <= 0) return false;
    
    setOwnedPacks(prevPacks => prevPacks - 1);
    
    // Apply any active modifiers to pack generation
    let rarityWeights = null;
    if (gameModifiers.riseAndGrindActive) {
      // Increase rare chances based on commons
      const commonCount = Object.values(collection).filter(c => c.rarity === 'common').length;
      const bonus = commonCount * 0.05;
      rarityWeights = {
        common: 0.65 - bonus,
        uncommon: 0.20,
        rare: 0.10 + (bonus * 0.5),
        epic: 0.04 + (bonus * 0.3),
        legendary: 0.01 + (bonus * 0.2)
      };
    }
    
    const pack = generatePack(5, deckTemplate, rarityWeights);
    
    let totalPPGained = 0;
    const newCollection = { ...collection };
    const packPPValues = [];
    const packEffectMessages = [];
    let localGameState = { ...gameModifiers, cardsInCurrentPack: 0 };
    
    // Apply investment bonus if active
    if (localGameState.investmentBonus) {
      totalPPGained *= localGameState.investmentBonus;
      setGameModifiers(prev => ({ ...prev, investmentBonus: null }));
    }
    
    pack.forEach((card, index) => {
      localGameState.cardsInCurrentPack = index + 1;
      const cardId = card.id;
      if (newCollection[cardId]) {
        // Preserve existing effect for runes
        const existingEffect = newCollection[cardId].effect;
        newCollection[cardId].xp += 50;
        if (newCollection[cardId].xp >= newCollection[cardId].xpToNextLevel) {
          newCollection[cardId].level += 1;
          newCollection[cardId].xp = 0;
          newCollection[cardId].xpToNextLevel = newCollection[cardId].level * 100;
          // Update effect multipliers/values when leveling up
          if (existingEffect) {
            if (existingEffect.type === 'suit_bonus') {
              existingEffect.multiplier = 1 + (0.3 * newCollection[cardId].level);
            } else if (existingEffect.type === 'pp_generation') {
              existingEffect.bonusPP = 0.2 * newCollection[cardId].level;
            } else if (existingEffect.type === 'suit_count_mult') {
              existingEffect.multiplierPerCard = 0.1 * newCollection[cardId].level;
            } else if (existingEffect.type === 'suit_chance') {
              existingEffect.chanceBonus = 0.15 * newCollection[cardId].level;
            }
          }
        }
        newCollection[cardId].effect = existingEffect;
      } else {
        newCollection[cardId] = { ...card };
      }
      
      // Apply tarot card effects
      if (card.effect && card.effect.onPull) {
        const effectResult = applyCardEffect(card, localGameState, Object.values(newCollection), pack);
        if (effectResult) {
          if (effectResult.message) {
            packEffectMessages.push(effectResult.message);
          }
          if (effectResult.ppMultiplier) {
            localGameState.currentCardMultiplier = effectResult.ppMultiplier;
          }
          // Update game state based on effect
          Object.keys(effectResult).forEach(key => {
            if (key !== 'message' && key !== 'ppMultiplier') {
              localGameState[key] = effectResult[key];
            }
          });
        }
      }
      
      let ppGained = calculateCardPP(newCollection[cardId], equippedRunes, pack, localGameState);
      
      // Apply card-specific multipliers
      if (localGameState.currentCardMultiplier) {
        ppGained *= localGameState.currentCardMultiplier;
        localGameState.currentCardMultiplier = null;
      }
      
      // Apply pack-wide multipliers
      if (localGameState.randomTurnoutStacks > 0) {
        const randomMult = 0.5 + (Math.random() * 1.5);
        ppGained *= randomMult;
      }
      
      // Early bird bonus
      if (localGameState.earlyBirdActive && index < 3) {
        ppGained *= 3;
      }
      
      // Night owl bonus
      if (localGameState.nightOwlActive && index >= pack.length - 3) {
        ppGained *= 3;
      }
      
      // Scaling order bonus
      if (localGameState.scalingOrderActive) {
        if (card.ppValue > localGameState.lastCardValue) {
          ppGained *= 1.5;
        }
        localGameState.lastCardValue = card.ppValue;
      }
      
      packPPValues.push(Math.floor(ppGained));
      totalPPGained += Math.floor(ppGained);
    });
    
    // Apply end-of-pack effects
    if (localGameState.randomTurnoutStacks > 0) {
      setGameModifiers(prev => ({ ...prev, randomTurnoutStacks: prev.randomTurnoutStacks - 1 }));
    }
    
    // Check for monochroma bonus
    if (localGameState.monochromaCheck) {
      const colors = new Set(pack.filter(c => c.suit).map(c => ['hearts', 'diamonds'].includes(c.suit) ? 'red' : 'black'));
      if (colors.size === 1) {
        totalPPGained *= 4;
        packEffectMessages.push('Monochroma bonus! 4x PP!');
      }
    }
    
    // Check for polychromia bonus
    if (localGameState.polychromiaActive) {
      const colors = new Set(pack.filter(c => c.suit).map(c => ['hearts', 'diamonds'].includes(c.suit) ? 'red' : 'black'));
      const colorBonus = 1 + (colors.size * 1);
      totalPPGained *= colorBonus;
      packEffectMessages.push(`Polychromia bonus! ${colorBonus}x PP!`);
    }
    
    // Apply teacher bonus to XP gains
    if (localGameState.teacherBonus) {
      // XP already applied with bonus in the loop
      setGameModifiers(prev => ({ ...prev, teacherBonus: null }));
    }
    
    setCurrentPack(pack);
    setCurrentPackPPValues(packPPValues);
    setPP(prevPP => prevPP + totalPPGained);
    setCollection(newCollection);
    setTotalCardsOpened(prev => prev + pack.length);
    
    // Update persistent game modifiers
    const persistentModifiers = ['randomTurnoutStacks', 'riseAndGrindActive', 'investmentBonus'];
    const newModifiers = {};
    persistentModifiers.forEach(key => {
      if (localGameState[key] !== undefined) {
        newModifiers[key] = localGameState[key];
      }
    });
    setGameModifiers(newModifiers);
    
    return { pack, totalPPGained, messages: packEffectMessages };
  };
  
  const equipRune = (cardId) => {
    const card = collection[cardId];
    if (!card || !card.isRune) return false;
    
    if (equippedRunes.find(r => r.id === cardId)) {
      setEquippedRunes(equippedRunes.filter(r => r.id !== cardId));
    } else if (equippedRunes.length < runeSlots) {
      // Use the existing effect from the card
      setEquippedRunes([...equippedRunes, { ...card }]);
    }
    
    return true;
  };
  
  const buyPackSlot = () => {
    const cost = 100 * Math.pow(2, packSlots - 1); // 100, 200, 400, etc.
    if (pp >= cost) {
      setPP(pp - cost);
      setPackSlots(packSlots + 1);
      return true;
    }
    return false;
  };
  
  const buyRuneSlot = () => {
    const cost = 150 * Math.pow(2, runeSlots - 3); // 150, 300, 600, etc.
    if (pp >= cost) {
      setPP(pp - cost);
      setRuneSlots(runeSlots + 1);
      return true;
    }
    return false;
  };
  
  const stagePack = () => {
    if (ownedPacks > 0 && stagedPacks.length < packSlots) {
      setStagedPacks([...stagedPacks, { id: Date.now() }]);
      setOwnedPacks(ownedPacks - 1);
      return true;
    }
    return false;
  };
  
  const unstagePack = (packId) => {
    setStagedPacks(stagedPacks.filter(p => p.id !== packId));
    setOwnedPacks(ownedPacks + 1);
  };
  
  const openAllStagedPacks = () => {
    if (stagedPacks.length === 0) return null;
    
    const allCards = [];
    const allPPValues = [];
    let totalPPGained = 0;
    const newCollection = { ...collection };
    
    // Generate all packs
    stagedPacks.forEach(() => {
      const pack = generatePack(5, deckTemplate);
      allCards.push(...pack);
    });
    
    // Calculate PP for all cards
    allCards.forEach(card => {
      const cardId = card.id;
      if (newCollection[cardId]) {
        const existingEffect = newCollection[cardId].effect;
        newCollection[cardId].xp += 50;
        if (newCollection[cardId].xp >= newCollection[cardId].xpToNextLevel) {
          newCollection[cardId].level += 1;
          newCollection[cardId].xp = 0;
          newCollection[cardId].xpToNextLevel = newCollection[cardId].level * 100;
          if (existingEffect) {
            if (existingEffect.type === 'suit_bonus') {
              existingEffect.multiplier = 1 + (0.3 * newCollection[cardId].level);
            } else if (existingEffect.type === 'pp_generation') {
              existingEffect.bonusPP = 0.2 * newCollection[cardId].level;
            } else if (existingEffect.type === 'suit_count_mult') {
              existingEffect.multiplierPerCard = 0.1 * newCollection[cardId].level;
            } else if (existingEffect.type === 'suit_chance') {
              existingEffect.chanceBonus = 0.15 * newCollection[cardId].level;
            }
          }
        }
        newCollection[cardId].effect = existingEffect;
      } else {
        newCollection[cardId] = { ...card };
      }
      
      const ppGained = calculateCardPP(newCollection[cardId], equippedRunes, allCards);
      allPPValues.push(ppGained);
      totalPPGained += ppGained;
    });
    
    setOpenedCards(allCards);
    setCurrentPackPPValues(allPPValues);
    setPP(prevPP => prevPP + totalPPGained);
    setCollection(newCollection);
    setTotalCardsOpened(prev => prev + allCards.length);
    setStagedPacks([]);
    
    return { cards: allCards, totalPPGained, ppValues: allPPValues };
  };
  
  const clearOpenedCards = () => {
    setOpenedCards([]);
    setCurrentPackPPValues([]);
  };
  
  const selectPackType = (packType) => {
    if (packType.unlocked) {
      setSelectedPackType(packType.id);
    }
  };
  
  
  return {
    pp: Math.floor(pp),
    ppPerSecond: PP_PER_SECOND + equippedRunes.reduce((acc, rune) => 
      rune.effect.type === 'pp_generation' ? acc + rune.effect.bonusPP : acc, 0),
    collection,
    equippedRunes,
    currentPack,
    currentPackPPValues,
    totalCardsOpened,
    ownedPacks,
    currentScreen,
    setCurrentScreen,
    packSlots,
    runeSlots,
    canBuyPack: pp >= PACK_COST,
    canOpenPack: ownedPacks > 0,
    packCost: PACK_COST,
    packSlotCost: 100 * Math.pow(2, packSlots - 1),
    runeSlotCost: 150 * Math.pow(2, runeSlots - 3),
    buyPack,
    openPack,
    equipRune,
    setCurrentPack,
    buyPackSlot,
    buyRuneSlot,
    stagedPacks,
    openedCards,
    stagePack,
    unstagePack,
    openAllStagedPacks,
    clearOpenedCards,
    packTypes,
    selectedPackType,
    selectPackType
  };
};