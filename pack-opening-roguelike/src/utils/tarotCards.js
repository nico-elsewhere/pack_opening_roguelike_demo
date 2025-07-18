// Major Arcana Cards with effects based on provided mechanics
export const MAJOR_ARCANA = [
  {
    id: 'major-0',
    name: 'The Fool',
    arcana: 'major',
    number: 0,
    baseValue: 100,
    rarity: 'rare',
    effect: {
      type: 'random_turnout',
      description: 'When pulled: Next 3 packs have random bonus PP (50-200%)',
      onPull: (gameState) => {
        gameState.randomTurnoutStacks = 3;
        return { message: 'The Fool brings chaos! Next 3 packs have random bonuses!' };
      }
    }
  },
  {
    id: 'major-1',
    name: 'The Magician',
    arcana: 'major',
    number: 1,
    baseValue: 150,
    rarity: 'rare',
    effect: {
      type: 'skinwalker',
      description: 'Copies the effect of the last card pulled',
      onPull: (gameState, lastCard) => {
        if (lastCard && lastCard.effect) {
          return lastCard.effect.onPull(gameState);
        }
        return { message: 'The Magician has nothing to copy...' };
      }
    }
  },
  {
    id: 'major-2',
    name: 'The High Priestess',
    arcana: 'major',
    number: 2,
    baseValue: 120,
    rarity: 'rare',
    effect: {
      type: 'teacher',
      description: 'All cards in this pack gain +50% XP',
      onPull: (gameState) => {
        gameState.teacherBonus = 1.5;
        return { message: 'The High Priestess shares her wisdom!' };
      }
    }
  },
  {
    id: 'major-3',
    name: 'The Empress',
    arcana: 'major',
    number: 3,
    baseValue: 140,
    rarity: 'epic',
    effect: {
      type: 'parental_instinct',
      description: 'Doubles PP for each duplicate card in collection',
      onPull: (gameState, card, collection) => {
        const duplicates = collection.filter(c => c.name === card.name).length;
        const bonus = Math.pow(2, duplicates - 1);
        return { ppMultiplier: bonus, message: `The Empress nurtures! ${bonus}x PP!` };
      }
    }
  },
  {
    id: 'major-4',
    name: 'The Emperor',
    arcana: 'major',
    number: 4,
    baseValue: 160,
    rarity: 'epic',
    effect: {
      type: 'rich_get_richer',
      description: 'PP bonus based on current PP (1% per 1000 PP)',
      onPull: (gameState) => {
        const bonus = 1 + (gameState.pp / 100000);
        return { ppMultiplier: bonus, message: `The Emperor rewards wealth! ${bonus.toFixed(2)}x PP!` };
      }
    }
  },
  {
    id: 'major-5',
    name: 'The Hierophant',
    arcana: 'major',
    number: 5,
    baseValue: 130,
    rarity: 'rare',
    effect: {
      type: 'affinity',
      description: 'Next 5 cards of same suit give +100% PP',
      onPull: (gameState, card) => {
        gameState.affinityActive = { suit: card.suit, count: 5 };
        return { message: 'The Hierophant blesses your path!' };
      }
    }
  },
  {
    id: 'major-6',
    name: 'The Lovers',
    arcana: 'major',
    number: 6,
    baseValue: 140,
    rarity: 'epic',
    effect: {
      type: 'gemini',
      description: 'If you pull a pair in this pack, triple their PP',
      onPull: (gameState) => {
        gameState.geminiActive = true;
        return { message: 'The Lovers seek their match!' };
      }
    }
  },
  {
    id: 'major-7',
    name: 'The Chariot',
    arcana: 'major',
    number: 7,
    baseValue: 150,
    rarity: 'rare',
    effect: {
      type: 'early_bird',
      description: 'First 3 cards in pack give +200% PP',
      onPull: (gameState) => {
        if (gameState.cardsInCurrentPack <= 3) {
          return { ppMultiplier: 3, message: 'The Chariot charges forth!' };
        }
        return { message: 'The Chariot has already passed...' };
      }
    }
  },
  {
    id: 'major-8',
    name: 'Strength',
    arcana: 'major',
    number: 8,
    baseValue: 170,
    rarity: 'epic',
    effect: {
      type: 'power_in_numbers',
      description: '+10% PP for each card in collection (max 500%)',
      onPull: (gameState, card, collection) => {
        const bonus = Math.min(1 + (collection.length * 0.1), 6);
        return { ppMultiplier: bonus, message: `Strength in unity! ${bonus.toFixed(1)}x PP!` };
      }
    }
  },
  {
    id: 'major-9',
    name: 'The Hermit',
    arcana: 'major',
    number: 9,
    baseValue: 110,
    rarity: 'rare',
    effect: {
      type: 'quality_not_quantity',
      description: 'If this is the only rare+ in pack, +400% PP',
      onPull: (gameState, card, collection, packCards) => {
        const rareCount = packCards.filter(c => ['rare', 'epic', 'legendary'].includes(c.rarity)).length;
        if (rareCount === 1) {
          return { ppMultiplier: 5, message: 'The Hermit walks alone! 5x PP!' };
        }
        return { message: 'The Hermit is not alone...' };
      }
    }
  },
  {
    id: 'major-10',
    name: 'Wheel of Fortune',
    arcana: 'major',
    number: 10,
    baseValue: 200,
    rarity: 'legendary',
    effect: {
      type: 'hail_mary',
      description: '10% chance for 10x PP, 90% chance for 0.1x PP',
      onPull: (gameState) => {
        const lucky = Math.random() < 0.1;
        if (lucky) {
          return { ppMultiplier: 10, message: 'FORTUNE SMILES! 10x PP!' };
        }
        return { ppMultiplier: 0.1, message: 'The wheel turns against you... 0.1x PP' };
      }
    }
  },
  {
    id: 'major-11',
    name: 'Justice',
    arcana: 'major',
    number: 11,
    baseValue: 140,
    rarity: 'rare',
    effect: {
      type: 'scaling_order',
      description: 'Cards pulled in ascending order get +50% PP each',
      onPull: (gameState) => {
        gameState.scalingOrderActive = true;
        gameState.lastCardValue = 0;
        return { message: 'Justice demands order!' };
      }
    }
  },
  {
    id: 'major-12',
    name: 'The Hanged Man',
    arcana: 'major',
    number: 12,
    baseValue: 130,
    rarity: 'rare',
    effect: {
      type: 'investment',
      description: 'Lose 50% PP now, next pack gives +200% PP',
      onPull: (gameState) => {
        gameState.pp *= 0.5;
        gameState.investmentBonus = 3;
        return { message: 'The Hanged Man sacrifices for the future!' };
      }
    }
  },
  {
    id: 'major-13',
    name: 'Death',
    arcana: 'major',
    number: 13,
    baseValue: 180,
    rarity: 'epic',
    effect: {
      type: 'mulligan',
      description: 'Destroy lowest value card, pull 2 new cards',
      onPull: (gameState, card, collection) => {
        gameState.mulliganActive = true;
        return { message: 'Death brings transformation!' };
      }
    }
  },
  {
    id: 'major-14',
    name: 'Temperance',
    arcana: 'major',
    number: 14,
    baseValue: 140,
    rarity: 'rare',
    effect: {
      type: 'monochroma',
      description: 'If all cards in pack are same color, +300% PP',
      onPull: (gameState) => {
        gameState.monochromaCheck = true;
        return { message: 'Temperance seeks balance!' };
      }
    }
  },
  {
    id: 'major-15',
    name: 'The Devil',
    arcana: 'major',
    number: 15,
    baseValue: 160,
    rarity: 'epic',
    effect: {
      type: 'evil_twin',
      description: 'Creates negative duplicate of next card (steals PP)',
      onPull: (gameState) => {
        gameState.evilTwinActive = true;
        return { message: 'The Devil corrupts the next card!' };
      }
    }
  },
  {
    id: 'major-16',
    name: 'The Tower',
    arcana: 'major',
    number: 16,
    baseValue: 190,
    rarity: 'epic',
    effect: {
      type: 'critical_hit',
      description: '20% chance for 5x PP on all cards this pack',
      onPull: (gameState) => {
        if (Math.random() < 0.2) {
          gameState.criticalMultiplier = 5;
          return { message: 'THE TOWER CRITS! All cards 5x PP!' };
        }
        return { message: 'The Tower stands firm...' };
      }
    }
  },
  {
    id: 'major-17',
    name: 'The Star',
    arcana: 'major',
    number: 17,
    baseValue: 170,
    rarity: 'epic',
    effect: {
      type: 'rise_and_grind',
      description: 'Each common card increases rare+ chance by 5%',
      onPull: (gameState) => {
        gameState.riseAndGrindActive = true;
        return { message: 'The Star guides your path!' };
      }
    }
  },
  {
    id: 'major-18',
    name: 'The Moon',
    arcana: 'major',
    number: 18,
    baseValue: 150,
    rarity: 'rare',
    effect: {
      type: 'night_owl',
      description: 'Last 3 cards in pack give +200% PP',
      onPull: (gameState) => {
        gameState.nightOwlActive = true;
        return { message: 'The Moon awaits the end!' };
      }
    }
  },
  {
    id: 'major-19',
    name: 'The Sun',
    arcana: 'major',
    number: 19,
    baseValue: 180,
    rarity: 'epic',
    effect: {
      type: 'polychromia',
      description: 'Each different color in pack adds +100% PP',
      onPull: (gameState) => {
        gameState.polychromiaActive = true;
        return { message: 'The Sun illuminates diversity!' };
      }
    }
  },
  {
    id: 'major-20',
    name: 'Judgement',
    arcana: 'major',
    number: 20,
    baseValue: 200,
    rarity: 'legendary',
    effect: {
      type: 'promotion',
      description: 'Upgrades lowest rarity card to next tier',
      onPull: (gameState) => {
        gameState.promotionActive = true;
        return { message: 'Judgement elevates the worthy!' };
      }
    }
  },
  {
    id: 'major-21',
    name: 'The World',
    arcana: 'major',
    number: 21,
    baseValue: 250,
    rarity: 'legendary',
    effect: {
      type: 'happy_family',
      description: 'If you have 3+ cards of same suit, all get +500% PP',
      onPull: (gameState, card, collection, packCards) => {
        const suitCounts = {};
        packCards.forEach(c => {
          if (c.suit) {
            suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
          }
        });
        
        const hasFamily = Object.values(suitCounts).some(count => count >= 3);
        if (hasFamily) {
          return { ppMultiplier: 6, message: 'The World celebrates unity! 6x PP!' };
        }
        return { message: 'The World awaits completion...' };
      }
    }
  }
];

// Minor Arcana structure (56 cards - 14 per suit)
export const MINOR_ARCANA_SUITS = ['Wands', 'Cups', 'Swords', 'Pentacles'];
export const MINOR_ARCANA_RANKS = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Page', 'Knight', 'Queen', 'King'];

export const generateMinorArcana = () => {
  const minorArcana = [];
  
  MINOR_ARCANA_SUITS.forEach((suit, suitIndex) => {
    MINOR_ARCANA_RANKS.forEach((rank, rankIndex) => {
      const card = {
        id: `minor-${suit.toLowerCase()}-${rankIndex}`,
        name: `${rank} of ${suit}`,
        arcana: 'minor',
        suit: suit.toLowerCase(),
        rank: rank,
        rankValue: rankIndex + 1,
        baseValue: 10 + (rankIndex * 5),
        rarity: rankIndex <= 9 ? 'common' : rankIndex <= 11 ? 'uncommon' : 'rare',
        effect: null
      };
      
      // Add special effects for court cards
      if (rank === 'Page') {
        card.effect = {
          type: 'stowaway',
          description: '25% chance to duplicate when pulled',
          onPull: (gameState) => {
            if (Math.random() < 0.25) {
              gameState.stowawayTrigger = true;
              return { message: `The ${rank} of ${suit} brings a friend!` };
            }
            return null;
          }
        };
      } else if (rank === 'Knight') {
        card.effect = {
          type: 'underdog',
          description: 'If lowest value in pack, +300% PP',
          onPull: (gameState, card, collection, packCards) => {
            const isLowest = !packCards.some(c => c.baseValue < card.baseValue);
            if (isLowest) {
              return { ppMultiplier: 4, message: `The ${rank} of ${suit} proves their worth! 4x PP!` };
            }
            return null;
          }
        };
      } else if (rank === 'Queen') {
        card.effect = {
          type: 'good_company',
          description: '+50% PP for each card of same suit',
          onPull: (gameState, card, collection, packCards) => {
            const suitCount = packCards.filter(c => c.suit === card.suit).length;
            const multiplier = 1 + (suitCount * 0.5);
            return { ppMultiplier: multiplier, message: `The ${rank} of ${suit} gathers her court! ${multiplier}x PP!` };
          }
        };
      } else if (rank === 'King') {
        card.effect = {
          type: 'bear_market',
          description: 'All cards this pack minimum 50 PP',
          onPull: (gameState) => {
            gameState.bearMarketActive = true;
            gameState.bearMarketMinimum = 50;
            return { message: `The ${rank} of ${suit} ensures prosperity!` };
          }
        };
      } else if (rank === 'Ace') {
        card.effect = {
          type: 'joker',
          description: 'Counts as any suit for bonuses',
          onPull: (gameState) => {
            gameState.jokerCards = (gameState.jokerCards || 0) + 1;
            return { message: `The ${rank} of ${suit} adapts to your needs!` };
          }
        };
      }
      
      minorArcana.push(card);
    });
  });
  
  return minorArcana;
};

// Helper function to apply effects
export const applyCardEffect = (card, gameState, collection, packCards) => {
  if (!card.effect || !card.effect.onPull) return null;
  
  return card.effect.onPull(gameState, card, collection, packCards);
};

// Export all tarot cards
export const ALL_TAROT_CARDS = [...MAJOR_ARCANA, ...generateMinorArcana()];