import { ALL_TAROT_CARDS } from './tarotCards.js';

export const SUITS = ['fire', 'earth', 'water', 'air'];
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (useTarot = true) => {
  const deck = [];
  
  // TEMPORARILY: Only return a single test card
  deck.push({
    id: 'test-card',
    name: 'Test',
    ppValue: 10,
    isRune: false,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    rarity: 'common',
    arcana: 'test'
  });
  
  return deck;
};

export const generatePack = (packSize = 5, deckTemplate, rarityWeights = null) => {
  const pack = [];
  
  // Default rarity weights if not provided
  const weights = rarityWeights || {
    common: 0.65,
    uncommon: 0.20,
    rare: 0.10,
    epic: 0.04,
    legendary: 0.01
  };
  
  for (let i = 0; i < packSize; i++) {
    let selectedCard;
    
    // Roll for rarity
    const roll = Math.random();
    let rarity;
    if (roll < weights.legendary) rarity = 'legendary';
    else if (roll < weights.legendary + weights.epic) rarity = 'epic';
    else if (roll < weights.legendary + weights.epic + weights.rare) rarity = 'rare';
    else if (roll < weights.legendary + weights.epic + weights.rare + weights.uncommon) rarity = 'uncommon';
    else rarity = 'common';
    
    // Filter cards by rarity
    const cardsOfRarity = deckTemplate.filter(c => (c.rarity || 'common') === rarity);
    
    if (cardsOfRarity.length > 0) {
      selectedCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
    } else {
      // Fallback to any card if no cards of that rarity
      selectedCard = deckTemplate[Math.floor(Math.random() * deckTemplate.length)];
    }
    
    const card = { ...selectedCard };
    
    // Generate rune effect for playing cards or use tarot effect
    if (card.isRune && !card.effect) {
      card.effect = generateRuneEffect(card);
    }
    
    pack.push(card);
  }
  return pack;
};

export const generateRuneEffect = (card) => {
  // Effects based on face card type
  switch (card.rank) {
    case 'J': // Jack - higher score for suit
      return { type: 'suit_bonus', suit: card.suit, multiplier: 1 + (0.3 * card.level) };
    case 'Q': // Queen - pp per second
      return { type: 'pp_generation', bonusPP: 0.2 * card.level };
    case 'K': // King - mult for each of suit in a pack
      return { type: 'suit_count_mult', suit: card.suit, multiplierPerCard: 0.1 * card.level };
    case 'A': // Ace - increases chance of suit appearing
      return { type: 'suit_chance', suit: card.suit, chanceBonus: 0.15 * card.level };
    default:
      return { type: 'none' };
  }
};

export const calculateCardPP = (card, runeEffects = [], cardsInPack = [], gameState = {}) => {
  let ppValue = card.ppValue * card.level;
  let multiplier = 1;
  
  // Apply equipped rune effects
  runeEffects.forEach(rune => {
    const effect = rune.effect;
    if (!effect) return; // Skip if no effect
    
    if (effect.type === 'suit_bonus' && effect.suit === card.suit) {
      multiplier *= effect.multiplier;
    }
    if (effect.type === 'suit_count_mult' && effect.suit === card.suit) {
      const suitCount = cardsInPack.filter(c => c.suit === card.suit).length;
      multiplier *= (1 + (effect.multiplierPerCard * suitCount));
    }
  });
  
  // Apply game state modifiers
  if (gameState.criticalMultiplier) {
    multiplier *= gameState.criticalMultiplier;
  }
  
  if (gameState.bearMarketActive && ppValue < gameState.bearMarketMinimum) {
    ppValue = gameState.bearMarketMinimum;
  }
  
  return Math.floor(ppValue * multiplier);
};