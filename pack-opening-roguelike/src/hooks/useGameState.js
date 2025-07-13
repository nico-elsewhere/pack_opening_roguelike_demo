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
  const [totalCardsOpened, setTotalCardsOpened] = useState(0);
  
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
  
  const openPack = () => {
    if (pp < PACK_COST) return false;
    
    setPP(prevPP => prevPP - PACK_COST);
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
              existingEffect.multiplier = 1 + (0.2 * newCollection[cardId].level);
            } else if (existingEffect.type === 'rank_bonus') {
              existingEffect.multiplier = 1 + (0.3 * newCollection[cardId].level);
            } else if (existingEffect.type === 'pp_generation') {
              existingEffect.bonusPP = 0.1 * newCollection[cardId].level;
            }
          }
        }
        newCollection[cardId].effect = existingEffect;
      } else {
        newCollection[cardId] = { ...card };
      }
      
      const ppGained = calculateCardPP(newCollection[cardId], equippedRunes);
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
    } else {
      // Use the existing effect from the card
      setEquippedRunes([...equippedRunes, { ...card }]);
    }
    
    return true;
  };
  
  
  return {
    pp: Math.floor(pp),
    collection,
    equippedRunes,
    currentPack,
    currentPackPPValues,
    totalCardsOpened,
    canOpenPack: pp >= PACK_COST,
    packCost: PACK_COST,
    openPack,
    equipRune,
    setCurrentPack
  };
};