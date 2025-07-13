export const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      const baseValue = rank === 'A' ? 11 : rank === 'K' || rank === 'Q' || rank === 'J' ? 10 : parseInt(rank);
      deck.push({
        id: `${rank}-${suit}`,
        rank,
        suit,
        name: `${rank} of ${suit}`,
        ppValue: baseValue,
        isRune: Math.random() < 0.15,
        level: 1,
        xp: 0,
        xpToNextLevel: 100
      });
    }
  }
  return deck;
};

export const generatePack = (packSize = 5, deckTemplate) => {
  const pack = [];
  for (let i = 0; i < packSize; i++) {
    const randomCard = deckTemplate[Math.floor(Math.random() * deckTemplate.length)];
    const card = { ...randomCard };
    
    // Generate rune effect once when creating the pack
    if (card.isRune) {
      card.effect = generateRuneEffect(card);
    }
    
    pack.push(card);
  }
  return pack;
};

export const generateRuneEffect = (card) => {
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

export const calculateCardPP = (card, runeEffects = []) => {
  let ppValue = card.ppValue * card.level;
  
  runeEffects.forEach(effect => {
    if (effect.type === 'suit_bonus' && effect.suit === card.suit) {
      ppValue *= effect.multiplier;
    }
    if (effect.type === 'rank_bonus' && effect.rank === card.rank) {
      ppValue *= effect.multiplier;
    }
  });
  
  return Math.floor(ppValue);
};