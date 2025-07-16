export const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      const baseValue = rank === 'A' ? 11 : rank === 'K' || rank === 'Q' || rank === 'J' ? 10 : parseInt(rank);
      const isFaceCard = ['J', 'Q', 'K', 'A'].includes(rank);
      deck.push({
        id: `${rank}-${suit}`,
        rank,
        suit,
        name: `${rank} of ${suit}`,
        ppValue: baseValue,
        isRune: isFaceCard,
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

export const calculateCardPP = (card, runeEffects = [], cardsInPack = []) => {
  let ppValue = card.ppValue * card.level;
  
  runeEffects.forEach(rune => {
    const effect = rune.effect;
    if (effect.type === 'suit_bonus' && effect.suit === card.suit) {
      ppValue *= effect.multiplier;
    }
    if (effect.type === 'suit_count_mult' && effect.suit === card.suit) {
      // Count cards of the same suit in the pack
      const suitCount = cardsInPack.filter(c => c.suit === card.suit).length;
      ppValue *= (1 + (effect.multiplierPerCard * suitCount));
    }
  });
  
  return Math.floor(ppValue);
};