import { useState, useEffect, useRef } from 'react';
import { createDeck, generatePack, calculateCardPP } from '../utils/cards';

const INITIAL_PP = 100;
const PP_PER_SECOND = 0.5;
const PACK_COST = 50;

export const useGameState = () => {
  const [pp, setPP] = useState(INITIAL_PP);
  const [collection, setCollection] = useState({});
  const [equippedRunes, setEquippedRunes] = useState([]);
  const [deckTemplate] = useState(createDeck());
  const [currentPack, setCurrentPack] = useState(null);
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
    setCurrentPack(pack);
    
    let totalPPGained = 0;
    const newCollection = { ...collection };
    
    pack.forEach(card => {
      const cardId = card.id;
      if (newCollection[cardId]) {
        newCollection[cardId].xp += 50;
        if (newCollection[cardId].xp >= newCollection[cardId].xpToNextLevel) {
          newCollection[cardId].level += 1;
          newCollection[cardId].xp = 0;
          newCollection[cardId].xpToNextLevel = newCollection[cardId].level * 100;
        }
      } else {
        newCollection[cardId] = { ...card };
      }
      
      const ppGained = calculateCardPP(newCollection[cardId], equippedRunes);
      totalPPGained += ppGained;
    });
    
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
      const runeEffect = generateRuneEffect(card);
      setEquippedRunes([...equippedRunes, { ...card, effect: runeEffect }]);
    }
    
    return true;
  };
  
  const generateRuneEffect = (card) => {
    const effectTypes = ['suit_bonus', 'rank_bonus', 'pp_generation'];
    const type = effectTypes[Math.floor(Math.random() * effectTypes.length)];
    
    switch (type) {
      case 'suit_bonus':
        return { type, suit: card.suit, multiplier: 1 + (0.2 * card.level) };
      case 'rank_bonus':
        return { type, rank: card.rank, multiplier: 1 + (0.3 * card.level) };
      case 'pp_generation':
        return { type, bonusPP: 0.1 * card.level };
      default:
        return { type: 'none' };
    }
  };
  
  return {
    pp: Math.floor(pp),
    collection,
    equippedRunes,
    currentPack,
    totalCardsOpened,
    canOpenPack: pp >= PACK_COST,
    packCost: PACK_COST,
    openPack,
    equipRune,
    setCurrentPack
  };
};