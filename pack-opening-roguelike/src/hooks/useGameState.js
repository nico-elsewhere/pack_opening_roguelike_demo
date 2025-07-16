import { useState, useEffect, useRef } from 'react';
import { createDeck, generatePack, calculateCardPP, generateRuneEffect } from '../utils/cards';

const INITIAL_PP = 100;
const PP_PER_SECOND = 0.5;
const PACK_COST = 50;

export const useGameState = () => {
  const [pp, setPP] = useState(INITIAL_PP);
  const [collection, setCollection] = useState({});
  const [equippedRunes, setEquippedRunes] = useState([]);
  const [deckTemplate] = useState(createDeck());
  const [currentPack, setCurrentPack] = useState(null);
  const [currentPackPPValues, setCurrentPackPPValues] = useState([]);
  const [stagedPacks, setStagedPacks] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);
  const [totalCardsOpened, setTotalCardsOpened] = useState(0);
  const [ownedPacks, setOwnedPacks] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [packSlots, setPackSlots] = useState(1);
  const [runeSlots, setRuneSlots] = useState(3);
  
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
    const pack = generatePack(5, deckTemplate);
    
    let totalPPGained = 0;
    const newCollection = { ...collection };
    const packPPValues = [];
    
    pack.forEach(card => {
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
      
      const ppGained = calculateCardPP(newCollection[cardId], equippedRunes, pack);
      packPPValues.push(ppGained);
      totalPPGained += ppGained;
    });
    
    setCurrentPack(pack);
    setCurrentPackPPValues(packPPValues);
    setPP(prevPP => prevPP + totalPPGained);
    setCollection(newCollection);
    setTotalCardsOpened(prev => prev + pack.length);
    
    return { pack, totalPPGained };
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
    clearOpenedCards
  };
};