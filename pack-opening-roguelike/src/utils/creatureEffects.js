// Comprehensive creature effects for all Gen 1 creatures
// Each effect can generate tokens, modify scores, or create synergies

export const CREATURE_EFFECTS = {
  // Token Generators
  'Elwick': {
    name: 'Flame Burst',
    description: 'Add 5 Fire tokens',
    effect: 'Add 5 Fire tokens',
    type: 'token_generator',
    process: (card, revealedCards, allCards, tokens) => {
      const newTokens = { ...tokens };
      newTokens.fire = (newTokens.fire || 0) + 5;
      return { tokens: newTokens };
    }
  },
  
  'Aquara': {
    name: 'Tidal Wave',
    description: 'Add 5 Water tokens',
    effect: 'Add 5 Water tokens',
    type: 'token_generator',
    process: (card, revealedCards, allCards, tokens) => {
      const newTokens = { ...tokens };
      newTokens.water = (newTokens.water || 0) + 5;
      return { tokens: newTokens };
    }
  },
  
  'Terros': {
    name: 'Earth Tremor',
    description: 'Add 5 Earth tokens',
    effect: 'Add 5 Earth tokens',
    type: 'token_generator',
    process: (card, revealedCards, allCards, tokens) => {
      const newTokens = { ...tokens };
      newTokens.earth = (newTokens.earth || 0) + 5;
      return { tokens: newTokens };
    }
  },
  
  'Zephyr': {
    name: 'Wind Gust',
    description: 'Add 5 Air tokens',
    effect: 'Add 5 Air tokens',
    type: 'token_generator',
    process: (card, revealedCards, allCards, tokens) => {
      const newTokens = { ...tokens };
      newTokens.air = (newTokens.air || 0) + 5;
      return { tokens: newTokens };
    }
  },
  
  'Lumlin': {
    name: 'Radiant Glow',
    description: 'Add 3 Light tokens',
    effect: 'Add 3 Light tokens',
    type: 'token_generator',
    process: (card, revealedCards, allCards, tokens) => {
      const newTokens = { ...tokens };
      newTokens.light = (newTokens.light || 0) + 3;
      return { tokens: newTokens };
    }
  },
  
  'Umbrax': {
    name: 'Shadow Veil',
    description: 'Add 3 Shadow tokens',
    effect: 'Add 3 Shadow tokens',
    type: 'token_generator',
    process: (card, revealedCards, allCards, tokens) => {
      const newTokens = { ...tokens };
      newTokens.shadow = (newTokens.shadow || 0) + 3;
      return { tokens: newTokens };
    }
  },
  
  // Token Manipulators
  'Magmaduke': {
    name: 'Pyroclasm',
    description: 'Double all Fire tokens',
    effect: 'Double all Fire tokens',
    type: 'token_manipulator',
    process: (card, revealedCards, allCards, tokens) => {
      const newTokens = { ...tokens };
      newTokens.fire = (newTokens.fire || 0) * 2;
      return { tokens: newTokens };
    }
  },
  
  'Hippeye': {
    name: 'Aqua Transform',
    description: 'Convert all tokens to Water',
    effect: 'Convert all tokens to Water',
    type: 'token_manipulator',
    process: (card, revealedCards, allCards, tokens) => {
      const totalTokens = Object.values(tokens).reduce((sum, count) => sum + count, 0);
      const newTokens = {
        fire: 0,
        water: totalTokens,
        earth: 0,
        air: 0,
        light: 0,
        shadow: 0,
        arcane: 0,
        nature: 0
      };
      return { tokens: newTokens };
    }
  },
  
  'Escarglow': {
    name: 'Earth Enhance',
    description: 'Each Earth token adds +2 PP',
    effect: 'Each Earth token +2 PP',
    type: 'token_bonus',
    process: (card, revealedCards, allCards, tokens) => {
      const earthBonus = (tokens.earth || 0) * 2;
      return { bonusPP: earthBonus };
    }
  },
  
  'Lileye': {
    name: 'Wind Harvest',
    description: 'Gain +5 PP per Air token',
    effect: 'Gain +5 PP per Air token',
    type: 'token_bonus',
    process: (card, revealedCards, allCards, tokens) => {
      const airBonus = (tokens.air || 0) * 5;
      return { bonusPP: airBonus };
    }
  },
  
  // Position & Order Effects
  'Fred': {
    name: 'Fredmaxxing',
    description: 'Each previous Fred multiplies this by 2x',
    effect: 'Each Fred before x2',
    type: 'position_multiplier',
    process: (card, revealedCards, allCards, tokens, cardIndex) => {
      const previousFreds = revealedCards.slice(0, cardIndex).filter(c => 
        c.name === 'Fred' || (c.inheritedEffects && c.inheritedEffects.some(e => e.name === 'Fred'))
      ).length;
      const multiplier = previousFreds > 0 ? Math.pow(2, previousFreds) : 1;
      return { multiplier };
    }
  },
  
  'Loopine': {
    name: 'Time Loop',
    description: 'After scoring, rescore from this position',
    effect: 'Rescore from here',
    type: 'rescore_trigger',
    process: (card, revealedCards, allCards, tokens) => {
      // Handled specially in scoring sequence
      return {};
    }
  },
  
  'Rachmite': {
    name: 'Shield Wall',
    description: 'Cards after this gain +10 PP',
    effect: 'Next cards +10 PP',
    type: 'position_buff',
    process: (card, revealedCards, allCards, tokens, cardIndex) => {
      // This affects cards AFTER this one
      return { afterBonus: 10 };
    }
  },
  
  'Stitchhead': {
    name: 'Patch Up',
    description: 'Gain +5 PP for each card before this',
    effect: '+5 PP per previous card',
    type: 'position_bonus',
    process: (card, revealedCards, allCards, tokens, cardIndex) => {
      const previousCards = cardIndex;
      const bonus = previousCards * 5;
      return { bonusPP: bonus };
    }
  },
  
  // Synergy Effects
  'Siameow': {
    name: 'Copycat',
    description: 'Copy the effect of the previous card',
    effect: 'Copy previous effect',
    type: 'copy_effect',
    process: (card, revealedCards, allCards, tokens, cardIndex) => {
      if (cardIndex > 0) {
        const previousCard = revealedCards[cardIndex - 1];
        const previousEffect = CREATURE_EFFECTS[previousCard.name];
        if (previousEffect && previousEffect.name !== 'Copycat') {
          // Execute the previous card's effect
          return previousEffect.process(card, revealedCards, allCards, tokens, cardIndex);
        }
      }
      return {};
    }
  },
  
  'Buuevo': {
    name: 'Evolution',
    description: 'If next to same type, both gain +20 PP',
    effect: 'Same neighbor +20 PP',
    type: 'neighbor_synergy',
    process: (card, revealedCards, allCards, tokens, cardIndex) => {
      let bonus = 0;
      // Check previous card
      if (cardIndex > 0 && revealedCards[cardIndex - 1].generation === card.generation) {
        bonus = 20;
      }
      // Check next card (if revealed)
      if (cardIndex < revealedCards.length - 1 && revealedCards[cardIndex + 1].generation === card.generation) {
        bonus = 20;
      }
      return { bonusPP: bonus };
    }
  },
  
  'Kelvian': {
    name: 'Frost Touch',
    description: 'If you have Water tokens, freeze time (double all scores)',
    effect: 'Water tokens = x2 all',
    type: 'conditional_multiplier',
    process: (card, revealedCards, allCards, tokens) => {
      if (tokens.water > 0) {
        return { globalMultiplier: 2 };
      }
      return {};
    }
  },
  
  'Chewie': {
    name: 'Consume',
    description: 'Eat all tokens for +3 PP each',
    effect: 'Consume tokens +3 PP',
    type: 'token_consumer',
    process: (card, revealedCards, allCards, tokens) => {
      const totalTokens = Object.values(tokens).reduce((sum, count) => sum + count, 0);
      const bonus = totalTokens * 3;
      // Clear all tokens
      const newTokens = {
        fire: 0,
        water: 0,
        earth: 0,
        air: 0,
        light: 0,
        shadow: 0,
        arcane: 0,
        nature: 0
      };
      return { bonusPP: bonus, tokens: newTokens };
    }
  },
  
  // Special Effects
  'Boastun': {
    name: 'All Talk',
    description: '0 base PP but gains +50 if you have 10+ tokens',
    effect: '10+ tokens = +50 PP',
    type: 'conditional_bonus',
    process: (card, revealedCards, allCards, tokens) => {
      const totalTokens = Object.values(tokens).reduce((sum, count) => sum + count, 0);
      if (totalTokens >= 10) {
        return { bonusPP: 50 };
      }
      return {};
    }
  },
  
  'Serafuzz': {
    name: 'Divine Light',
    description: 'Light tokens are worth 20 PP instead of 10',
    effect: 'Light tokens = 20 PP',
    type: 'token_value_modifier',
    process: (card, revealedCards, allCards, tokens) => {
      // This modifies token values globally
      return { tokenValueModifier: { light: 20 } };
    }
  },
  
  'Manaclite': {
    name: 'Arcane Surge',
    description: 'Add 1 Arcane token per different token type',
    effect: '+1 Arcane per type',
    type: 'token_generator',
    process: (card, revealedCards, allCards, tokens) => {
      const activeTypes = Object.entries(tokens).filter(([type, count]) => 
        type !== 'arcane' && count > 0
      ).length;
      const newTokens = { ...tokens };
      newTokens.arcane = (newTokens.arcane || 0) + activeTypes;
      return { tokens: newTokens };
    }
  },
  
  'Sapphungus': {
    name: 'Nature Growth',
    description: 'Add 2 Nature tokens, they multiply by 1.5x each turn',
    effect: '+2 Nature, x1.5 growth',
    type: 'token_generator',
    process: (card, revealedCards, allCards, tokens) => {
      const newTokens = { ...tokens };
      // Add 2 nature tokens
      newTokens.nature = (newTokens.nature || 0) + 2;
      // Apply growth to existing nature tokens
      if (card._hasProcessedGrowth) {
        newTokens.nature = Math.floor(newTokens.nature * 1.5);
      }
      return { tokens: newTokens };
    }
  }
};

// Get effect text for a card (including inherited effects)
export function getCardEffectText(card) {
  // For Gen 1 cards
  const baseEffect = CREATURE_EFFECTS[card.name];
  if (baseEffect) {
    return baseEffect.effect;
  }
  
  // For fused cards with inherited effects
  if (card.inheritedEffects && card.inheritedEffects.length > 0) {
    return card.inheritedEffects.map(e => e.effect).join(' & ');
  }
  
  return null;
}

// Process all effects for a card
export function processCardEffects(card, revealedCards, allCards, tokens, cardIndex) {
  let result = {
    multiplier: 1,
    bonusPP: 0,
    tokens: { ...tokens },
    globalMultiplier: 1,
    afterBonus: 0,
    tokenValueModifier: {}
  };
  
  // Process base effect
  const baseEffect = CREATURE_EFFECTS[card.name];
  if (baseEffect && baseEffect.process) {
    const effectResult = baseEffect.process(card, revealedCards, allCards, tokens, cardIndex);
    mergeEffectResults(result, effectResult);
  }
  
  // Process inherited effects for fused cards
  if (card.inheritedEffects) {
    card.inheritedEffects.forEach(inheritedEffect => {
      const effect = CREATURE_EFFECTS[inheritedEffect.name];
      if (effect && effect.process) {
        const effectResult = effect.process(card, revealedCards, allCards, result.tokens, cardIndex);
        mergeEffectResults(result, effectResult);
      }
    });
  }
  
  return result;
}

// Merge effect results
function mergeEffectResults(result, newResult) {
  if (newResult.multiplier) {
    result.multiplier *= newResult.multiplier;
  }
  if (newResult.bonusPP) {
    result.bonusPP += newResult.bonusPP;
  }
  if (newResult.tokens) {
    result.tokens = newResult.tokens;
  }
  if (newResult.globalMultiplier) {
    result.globalMultiplier *= newResult.globalMultiplier;
  }
  if (newResult.afterBonus) {
    result.afterBonus += newResult.afterBonus;
  }
  if (newResult.tokenValueModifier) {
    Object.assign(result.tokenValueModifier, newResult.tokenValueModifier);
  }
}