import { generateRuneEffect } from './cards';

// Define fusion suit combinations
export const FUSION_RECIPES = {
  'fire-earth': 'magma',
  'earth-fire': 'magma',
  'fire-water': 'steam',
  'water-fire': 'steam',
  'fire-air': 'lightning',
  'air-fire': 'lightning',
  'earth-water': 'mud',
  'water-earth': 'mud',
  'earth-air': 'dust',
  'air-earth': 'dust',
  'water-air': 'ice',
  'air-water': 'ice'
};

// Fusion suit properties
export const FUSION_SUITS = {
  magma: {
    symbol: '🌋',
    color: '#ff4500',
    name: 'Magma',
    description: 'Molten rock forged from Fire and Earth'
  },
  steam: {
    symbol: '💨',
    color: '#87ceeb',
    name: 'Steam',
    description: 'Vapor born from Fire and Water'
  },
  lightning: {
    symbol: '⚡',
    color: '#ffd700',
    name: 'Lightning',
    description: 'Electric energy from Fire and Air'
  },
  mud: {
    symbol: '🟫',
    color: '#8b4513',
    name: 'Mud',
    description: 'Rich soil created from Earth and Water'
  },
  dust: {
    symbol: '🌪️',
    color: '#daa520',
    name: 'Dust',
    description: 'Sandy particles of Earth and Air'
  },
  ice: {
    symbol: '❄️',
    color: '#00bfff',
    name: 'Ice',
    description: 'Frozen crystals of Water and Air'
  }
};

// Function to generate fusion names for Major + Major
const generateMajorFusionName = (card1Name, card2Name) => {
  // Some special predefined combinations
  const specialCombos = {
    'The Fool-The Magician': { name: 'The Trickster', symbol: '🎭', description: 'Master of chaos and illusion' },
    'Death-The Tower': { name: 'The Apocalypse', symbol: '☄️', description: 'Ultimate destruction and rebirth' },
    'The Sun-The Moon': { name: 'Eclipse', symbol: '🌑', description: 'Balance of light and shadow' },
    'The Empress-The High Priestess': { name: 'Divine Feminine', symbol: '👸', description: 'Wisdom and nurturing power' },
    'The Emperor-The Hierophant': { name: 'Divine Order', symbol: '⚖️', description: 'Authority and tradition combined' },
    'The Devil-Justice': { name: 'Karmic Retribution', symbol: '⚡', description: 'What goes around comes around' },
    'The Lovers-The Devil': { name: 'Temptation', symbol: '🍎', description: 'The allure of forbidden desires' },
    'The Hermit-The Fool': { name: 'Wandering Sage', symbol: '🔮', description: 'Wisdom found in endless journeys' },
    'Strength-The Chariot': { name: 'Unstoppable Force', symbol: '💪', description: 'Inner and outer power united' },
    'The Star-The Moon': { name: 'Celestial Harmony', symbol: '✨', description: 'Dreams guided by hope' },
    'The World-The Fool': { name: 'Eternal Cycle', symbol: '♾️', description: 'Endings become new beginnings' },
    'Death-The Sun': { name: 'Phoenix Rising', symbol: '🔥', description: 'Rebirth through transformation' },
    'The Tower-The Star': { name: 'Hope from Ashes', symbol: '🌟', description: 'Finding light in darkness' },
    'Temperance-The Devil': { name: 'Inner Conflict', symbol: '⚖️', description: 'The battle between restraint and desire' },
    'The Hanged Man-The World': { name: 'Transcendence', symbol: '🌀', description: 'Sacrifice leading to enlightenment' }
  };
  
  // Check both orderings
  const key1 = `${card1Name}-${card2Name}`;
  const key2 = `${card2Name}-${card1Name}`;
  
  if (specialCombos[key1]) return specialCombos[key1];
  if (specialCombos[key2]) return specialCombos[key2];
  
  // Generic fusion name - create shorter name
  const shortName1 = card1Name.replace('The ', '');
  const shortName2 = card2Name.replace('The ', '');
  
  return { 
    name: `${shortName1} & ${shortName2}`, 
    symbol: '🌌',
    description: `The combined powers of ${card1Name} and ${card2Name}`
  };
};

// Special tarot fusion combinations
export const TAROT_FUSIONS = {
  // This will be populated dynamically
};

// Check if two cards can be fused
export const canFuseCards = (card1, card2) => {
  if (!card1 || !card2) return false;
  
  // Cannot fuse the same card with itself
  if (card1.id === card2.id) return false;
  
  // Check for tarot fusion
  if (card1.arcana || card2.arcana) {
    return canFuseTarotCards(card1, card2);
  }
  
  // Regular elemental fusion rules
  // Must be same rank
  if (card1.rank !== card2.rank) return false;
  
  // Must be different base suits
  if (card1.suit === card2.suit) return false;
  
  // Must be base elemental suits (not already fused)
  const baseSuits = ['fire', 'earth', 'water', 'air'];
  if (!baseSuits.includes(card1.suit) || !baseSuits.includes(card2.suit)) return false;
  
  // Check if fusion recipe exists
  const fusionKey = `${card1.suit}-${card2.suit}`;
  return FUSION_RECIPES.hasOwnProperty(fusionKey);
};

// Check if two tarot cards can be fused
const canFuseTarotCards = (card1, card2) => {
  // Major + Major fusion - ALL combinations allowed
  if (card1.arcana === 'major' && card2.arcana === 'major') {
    return true;
  }
  
  // Major + Minor fusion - ALL combinations allowed
  if ((card1.arcana === 'major' && card2.arcana === 'minor') ||
      (card1.arcana === 'minor' && card2.arcana === 'major')) {
    return true;
  }
  
  // Major + Element fusion (any elemental card)
  if ((card1.arcana === 'major' && ['fire', 'earth', 'water', 'air'].includes(card2.suit)) ||
      (card2.arcana === 'major' && ['fire', 'earth', 'water', 'air'].includes(card1.suit))) {
    return true;
  }
  
  // Minor + Minor fusion - ALL combinations allowed (not just same suit)
  if (card1.arcana === 'minor' && card2.arcana === 'minor') {
    return true;
  }
  
  return false;
};

// Generate fused card from two source cards
export const generateFusedCard = (card1, card2) => {
  if (!canFuseCards(card1, card2)) return null;
  
  // Handle tarot fusion
  if (card1.arcana || card2.arcana) {
    return generateTarotFusedCard(card1, card2);
  }
  
  // Regular elemental fusion
  const fusionKey = `${card1.suit}-${card2.suit}`;
  const fusedSuit = FUSION_RECIPES[fusionKey];
  const fusedSuitData = FUSION_SUITS[fusedSuit];
  
  const fusedCard = {
    id: `${card1.rank}-${fusedSuit}`,
    rank: card1.rank,
    suit: fusedSuit,
    name: `${card1.rank} of ${fusedSuitData.name}`,
    ppValue: card1.ppValue + card2.ppValue,
    isRune: card1.isRune || card2.isRune,
    isFused: true,
    fusionRecipe: [card1.id, card2.id],
    level: 1,
    xp: 0,
    xpToNextLevel: 150, // Higher XP requirement for fused cards
    rarity: upgradeRarity(card1.rarity || 'common'),
    arcana: 'fusion'
  };
  
  // Combine effects for face cards
  if (fusedCard.isRune) {
    fusedCard.effects = combineEffects(card1, card2, fusedCard);
  }
  
  return fusedCard;
};

// Generate tarot fused card
const generateTarotFusedCard = (card1, card2) => {
  let fusionKey, fusionData, fusedCard;
  
  // Major + Major fusion
  if (card1.arcana === 'major' && card2.arcana === 'major') {
    fusionKey = [card1.id, card2.id].sort().join('-');
    fusionData = generateMajorFusionName(card1.name, card2.name);
    
    fusedCard = {
      id: `fusion-${fusionKey}`,
      name: fusionData.name,
      arcana: 'transcendent',
      symbol: fusionData.symbol,
      rank: 'Transcendent', // Add rank for compatibility
      ppValue: card1.ppValue + card2.ppValue,
      baseValue: card1.baseValue + card2.baseValue,
      isRune: true,
      isFused: true,
      fusionRecipe: [card1.id, card2.id],
      level: 1,
      xp: 0,
      xpToNextLevel: 300,
      rarity: 'legendary',
      description: fusionData.description
    };
    
    // Combine major arcana effects
    if (card1.effect && card2.effect) {
      fusedCard.effect = {
        type: 'combined_major',
        effects: [card1.effect, card2.effect],
        description: `Combined powers: ${card1.effect.description} AND ${card2.effect.description}`
      };
    }
  }
  // Major + Minor or Major + Element fusion
  else if ((card1.arcana === 'major' && card2.arcana === 'minor') ||
           (card2.arcana === 'major' && card1.arcana === 'minor') ||
           (card1.arcana === 'major' && ['fire', 'earth', 'water', 'air'].includes(card2.suit)) ||
           (card2.arcana === 'major' && ['fire', 'earth', 'water', 'air'].includes(card1.suit))) {
    const majorCard = card1.arcana === 'major' ? card1 : card2;
    const minorCard = card1.arcana === 'major' ? card2 : card1;
    
    // Generate fusion name based on combination
    const suitName = minorCard.suit || 'energy';
    const suitSymbols = {
      'wands': '🔥', 'cups': '💧', 'swords': '⚔️', 'pentacles': '🪙',
      'fire': '🔥', 'water': '💧', 'air': '🌪️', 'earth': '🌍'
    };
    
    fusionKey = `${majorCard.id}-${minorCard.id || minorCard.suit}`;
    fusionData = {
      name: `${majorCard.name} of ${suitName.charAt(0).toUpperCase() + suitName.slice(1)}`,
      symbol: suitSymbols[suitName] || '✨',
      description: `${majorCard.name} infused with ${suitName} energy`
    };
    
    fusedCard = {
      id: `empowered-${fusionKey}`,
      name: fusionData.name,
      arcana: 'empowered',
      symbol: fusionData.symbol,
      rank: 'Empowered', // Add rank for compatibility
      ppValue: Math.floor((majorCard.ppValue || majorCard.baseValue || 100) * 1.5) + (minorCard.ppValue || minorCard.baseValue || 10),
      baseValue: Math.floor((majorCard.baseValue || majorCard.ppValue || 100) * 1.5),
      isRune: true,
      isFused: true,
      fusionRecipe: [card1.id, card2.id],
      level: 1,
      xp: 0,
      xpToNextLevel: 200,
      rarity: 'epic',
      description: fusionData.description
    };
    
    // Enhanced major arcana effect
    if (majorCard.effect) {
      fusedCard.effect = {
        ...majorCard.effect,
        empowered: true,
        description: `EMPOWERED: ${majorCard.effect.description}`
      };
    }
  }
  // Minor + Minor fusion (any suits)
  else if (card1.arcana === 'minor' && card2.arcana === 'minor') {
    fusionKey = `${card1.id}-${card2.id}`;
    
    // Same suit fusion
    if (card1.suit === card2.suit) {
      const suitNames = {
        'wands': { name: 'Blazing Wands', symbol: '🔥' },
        'cups': { name: 'Overflowing Cups', symbol: '🏆' },
        'swords': { name: 'Crossed Blades', symbol: '⚔️' },
        'pentacles': { name: 'Golden Coins', symbol: '💰' }
      };
      fusionData = suitNames[card1.suit] || { name: `Twin ${card1.suit}`, symbol: '🌟' };
      fusionData.description = fusionData.description || `Doubled ${card1.suit} energy`;
    } else {
      // Different suits - create hybrid
      const hybridNames = {
        'wands-cups': { name: 'Steam', symbol: '💨' },
        'wands-swords': { name: 'Forged Blade', symbol: '🗡️' },
        'wands-pentacles': { name: 'Molten Gold', symbol: '🏆' },
        'cups-swords': { name: 'Frozen Tear', symbol: '❄️' },
        'cups-pentacles': { name: 'Holy Grail', symbol: '🏆' },
        'swords-pentacles': { name: 'Diamond Edge', symbol: '💎' }
      };
      
      const key1 = `${card1.suit}-${card2.suit}`;
      const key2 = `${card2.suit}-${card1.suit}`;
      
      fusionData = hybridNames[key1] || hybridNames[key2] || {
        name: `${card1.suit} & ${card2.suit} Union`,
        symbol: '🌟'
      };
      fusionData.description = fusionData.description || `Fusion of ${card1.suit} and ${card2.suit} energies`;
    }
    
    fusedCard = {
      id: `enhanced-${card1.suit}-${card1.number || card1.rank || card1.name || '0'}-${card2.number || card2.rank || card2.name || '0'}`,
      name: `${fusionData.name}`,
      arcana: 'enhanced-minor',
      symbol: fusionData.symbol,
      suit: card1.suit || card2.suit,
      rank: 'Fused', // Add a rank property for compatibility
      ppValue: Math.floor(((card1.ppValue || card1.baseValue || 10) + (card2.ppValue || card2.baseValue || 10)) * 1.5),
      baseValue: Math.floor(((card1.baseValue || card1.ppValue || 10) + (card2.baseValue || card2.ppValue || 10)) * 1.5),
      isRune: true,
      isFused: true,
      fusionRecipe: [card1.id, card2.id],
      level: 1,
      xp: 0,
      xpToNextLevel: 150,
      rarity: 'rare',
      description: fusionData.description
    };
    
    // Add combined effects if both cards have effects
    if (card1.effect || card2.effect) {
      const effects = [];
      if (card1.effect) effects.push(card1.effect);
      if (card2.effect) effects.push(card2.effect);
      
      fusedCard.effect = {
        type: 'combined_minor',
        effects: effects,
        description: `Combined minor arcana powers`
      };
    }
  }
  
  return fusedCard;
};

// Upgrade rarity when fusing
const upgradeRarity = (currentRarity) => {
  const rarityProgression = {
    'common': 'uncommon',
    'uncommon': 'rare',
    'rare': 'epic',
    'epic': 'legendary',
    'legendary': 'legendary' // Max rarity
  };
  return rarityProgression[currentRarity] || 'uncommon';
};

// Combine effects for face cards
const combineEffects = (card1, card2, fusedCard) => {
  const effects = [];
  
  // Get individual effects
  const effect1 = card1.effect || generateRuneEffect(card1);
  const effect2 = card2.effect || generateRuneEffect(card2);
  
  // For fusion cards, we create a dual effect
  if (effect1.type !== 'none') effects.push(effect1);
  if (effect2.type !== 'none' && effect2.type !== effect1.type) effects.push(effect2);
  
  // Create combined effect description
  const descriptions = [];
  if (effect1.type === 'suit_bonus') {
    descriptions.push(`${effect1.suit} cards +${Math.round((effect1.multiplier - 1) * 100)}% PP`);
  }
  if (effect2.type === 'suit_bonus' && effect2.suit !== effect1.suit) {
    descriptions.push(`${effect2.suit} cards +${Math.round((effect2.multiplier - 1) * 100)}% PP`);
  }
  if (effect1.type === 'pp_generation' || effect2.type === 'pp_generation') {
    const totalBonus = (effect1.type === 'pp_generation' ? effect1.bonusPP : 0) + 
                      (effect2.type === 'pp_generation' ? effect2.bonusPP : 0);
    descriptions.push(`+${totalBonus.toFixed(1)} PP/sec`);
  }
  
  fusedCard.effect = {
    type: 'fusion',
    effects: effects,
    description: descriptions.join(' & ')
  };
  
  return effects;
};

// Get all possible fusion combinations for display
export const getAllFusionCombinations = () => {
  const combinations = [];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  Object.entries(FUSION_RECIPES).forEach(([recipe, result]) => {
    // Only add one entry per unique fusion (skip reverse combinations)
    if (combinations.some(c => c.result === result)) return;
    
    const [suit1, suit2] = recipe.split('-');
    
    ranks.forEach(rank => {
      combinations.push({
        card1: { rank, suit: suit1 },
        card2: { rank, suit: suit2 },
        result: { rank, suit: result }
      });
    });
  });
  
  return combinations;
};

// Calculate fusion cost based on card properties
export const calculateFusionCost = (card1, card2) => {
  const baseCost = 100;
  
  // Tarot fusion costs more
  if (card1.arcana || card2.arcana) {
    const tarotMultiplier = (card1.arcana === 'major' && card2.arcana === 'major') ? 3 : 2;
    const rarityMultiplier = 
      (card1.rarity === 'legendary' || card2.rarity === 'legendary') ? 2 :
      (card1.rarity === 'epic' || card2.rarity === 'epic') ? 1.5 : 1;
    
    return Math.floor(baseCost * tarotMultiplier * rarityMultiplier);
  }
  
  // Regular fusion cost
  const rankMultiplier = card1.rank === 'A' ? 2 : card1.rank === 'K' || card1.rank === 'Q' || card1.rank === 'J' ? 1.5 : 1;
  const levelMultiplier = (card1.level + card2.level) / 2;
  
  return Math.floor(baseCost * rankMultiplier * levelMultiplier);
};