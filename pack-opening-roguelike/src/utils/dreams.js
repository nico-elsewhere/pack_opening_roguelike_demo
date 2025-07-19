// Dream and Nightmare definitions for roguelike mode

export const DREAM_EFFECTS = [
  {
    id: 'abundance',
    name: 'Dream of Abundance',
    description: 'All cards score +5',
    effect: { type: 'flat_bonus', value: 5 }
  },
  {
    id: 'multiplication',
    name: 'Dream of Multiplication',
    description: 'Duplicate cards score 2x',
    effect: { type: 'duplicate_multiplier', multiplier: 2 }
  },
  {
    id: 'ascension',
    name: 'Dream of Ascension',
    description: 'Cards at the end score +10 per position',
    effect: { type: 'position_scaling', scale: 10 }
  },
  {
    id: 'synergy',
    name: 'Dream of Synergy',
    description: 'Same suit chains score 1.5x',
    effect: { type: 'suit_chain_multiplier', multiplier: 1.5 }
  },
  {
    id: 'evolution',
    name: 'Dream of Evolution',
    description: 'Fused cards score 3x',
    effect: { type: 'fusion_multiplier', multiplier: 3 }
  },
  {
    id: 'momentum',
    name: 'Dream of Momentum',
    description: 'Each card adds +2 to the next',
    effect: { type: 'cumulative_bonus', value: 2 }
  }
];

export const NIGHTMARE_EFFECTS = [
  {
    id: 'decay',
    name: 'Nightmare of Decay',
    description: 'All cards lose 20% value',
    effect: { type: 'value_reduction', multiplier: 0.8 }
  },
  {
    id: 'chaos',
    name: 'Nightmare of Chaos',
    description: 'Card order is shuffled after arrangement',
    effect: { type: 'shuffle_hand' }
  },
  {
    id: 'limitation',
    name: 'Nightmare of Limitation',
    description: 'Can only use 3 cards from hand',
    effect: { type: 'hand_limit', limit: 3 }
  },
  {
    id: 'inversion',
    name: 'Nightmare of Inversion',
    description: 'High value cards score less, low value cards score more',
    effect: { type: 'value_inversion' }
  },
  {
    id: 'silence',
    name: 'Nightmare of Silence',
    description: 'Card abilities don\'t trigger',
    effect: { type: 'disable_abilities' }
  },
  {
    id: 'hunger',
    name: 'Nightmare of Hunger',
    description: 'Threshold increased by 50%',
    effect: { type: 'threshold_multiplier', multiplier: 1.5 }
  }
];

// Generate dream thresholds based on progression
export function getDreamThreshold(dreamNumber) {
  // Base threshold starts at 100 and increases
  const baseThreshold = 100;
  const scaling = 1.2; // 20% increase per dream
  const flatIncrease = 50; // Additional flat increase
  
  return Math.floor(baseThreshold * Math.pow(scaling, dreamNumber - 1) + (dreamNumber - 1) * flatIncrease);
}

// Get a random dream effect (not nightmare)
export function getRandomDreamEffect() {
  return DREAM_EFFECTS[Math.floor(Math.random() * DREAM_EFFECTS.length)];
}

// Get a random nightmare effect
export function getRandomNightmareEffect() {
  return NIGHTMARE_EFFECTS[Math.floor(Math.random() * NIGHTMARE_EFFECTS.length)];
}

// Check if current dream is a nightmare
export function isNightmare(dreamNumber) {
  return dreamNumber % 6 === 0;
}