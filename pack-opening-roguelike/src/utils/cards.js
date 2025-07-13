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
    pack.push({ ...randomCard });
  }
  return pack;
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