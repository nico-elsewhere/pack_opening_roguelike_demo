export const CREATURE_EFFECTS = {
  // FIRE CREATURES
  'Pyrrhus': {
    ability: 'Double all Fire tokens',
    effect: {
      type: 'multiply_tokens',
      token: 'fire',
      multiplier: 2
    }
  },
  'Magmaduke': {
    ability: 'Gain 1 Fire. +2 PP per Fire token',
    effect: {
      type: 'complex',
      effects: [
        { type: 'gain_token', token: 'fire', amount: 1 },
        { type: 'score_per_token', token: 'fire', ppPerToken: 2 }
      ]
    }
  },
  'Escarglow': {
    ability: 'Convert 2 Water to 3 Fire',
    effect: {
      type: 'convert_tokens',
      from: { token: 'water', amount: 2 },
      to: { token: 'fire', amount: 3 }
    }
  },
  
  // WATER CREATURES
  'Aquara': {
    ability: 'Gain 1 Water. +5 PP per Water token',
    effect: {
      type: 'complex',
      effects: [
        { type: 'gain_token', token: 'water', amount: 1 },
        { type: 'score_per_token', token: 'water', ppPerToken: 5 }
      ]
    }
  },
  'Buuevo': {
    ability: 'Gain Water equal to position (1-5)',
    effect: {
      type: 'gain_token_position',
      token: 'water',
      multiplier: 1
    }
  },
  'Hippeye': {
    ability: 'If 3+ Water: Score x3',
    effect: {
      type: 'conditional_multiplier',
      condition: { type: 'token_threshold', token: 'water', amount: 3 },
      multiplier: 3
    }
  },
  
  // EARTH CREATURES
  'Sapphungus': {
    ability: 'Gain 2 Earth. Earth tokens give +1 Strength',
    effect: {
      type: 'complex',
      effects: [
        { type: 'gain_token', token: 'earth', amount: 2 },
        { type: 'token_conversion', from: 'earth', to: 'strength', rate: 1 }
      ]
    }
  },
  'Lumlin': {
    ability: 'Score +10 for each different token type',
    effect: {
      type: 'token_diversity_bonus',
      ppPerType: 10
    }
  },
  'Rachmite': {
    ability: 'Gain 1 Earth. Adjacent cards score +5',
    effect: {
      type: 'complex',
      effects: [
        { type: 'gain_token', token: 'earth', amount: 1 },
        { type: 'adjacent_bonus', bonus: 5 }
      ]
    }
  },
  
  // AIR CREATURES
  'Tempest': {
    ability: 'Convert all tokens to Air',
    effect: {
      type: 'convert_all_to',
      token: 'air'
    }
  },
  'Lileye': {
    ability: 'Gain 1 Air. Shuffle positions if 5+ Air',
    effect: {
      type: 'complex',
      effects: [
        { type: 'gain_token', token: 'air', amount: 1 },
        { type: 'conditional_shuffle', condition: { token: 'air', amount: 5 } }
      ]
    }
  },
  
  // SHADOW CREATURES
  'Stitchhead': {
    ability: 'Gain 2 Shadow. Shadow = -1 PP but x2 effects',
    effect: {
      type: 'complex',
      effects: [
        { type: 'gain_token', token: 'shadow', amount: 2 },
        { type: 'shadow_modifier' }
      ]
    }
  },
  'Siameow': {
    ability: 'Clone leftmost card\'s tokens',
    effect: {
      type: 'clone_tokens',
      position: 'leftmost'
    }
  },
  
  // LIGHT CREATURES
  'Serafuzz': {
    ability: 'Gain 1 Light. Light purges Shadow for +20 PP each',
    effect: {
      type: 'complex',
      effects: [
        { type: 'gain_token', token: 'light', amount: 1 },
        { type: 'purge_bonus', from: 'shadow', to: 'light', ppPerPurge: 20 }
      ]
    }
  },
  'Kelvian': {
    ability: 'Double value of cards with no tokens',
    effect: {
      type: 'no_token_multiplier',
      multiplier: 2
    }
  },
  
  // CHAOS CREATURES
  'Chewie': {
    ability: 'Gain 1-3 random tokens',
    effect: {
      type: 'random_tokens',
      min: 1,
      max: 3
    }
  },
  'Boastun': {
    ability: 'Score = total tokens x5 (base 0 PP)',
    effect: {
      type: 'tokens_as_score',
      multiplier: 5
    }
  },
  
  // SPECIAL SYNERGY CREATURES
  'Fred': {
    ability: 'Fredmaxxing - Each Fred x2 the next',
    effect: {
      type: 'fredmaxxing'
    }
  },
  'Loopine': {
    ability: 'Time Loop - Rescore from this position',
    effect: {
      type: 'time_loop'
    }
  },
  'Manaclite': {
    ability: 'Gain 1 Strength',
    effect: {
      type: 'gain_token',
      token: 'strength',
      amount: 1
    }
  },
  'Elwick': {
    ability: 'Gain 1 Tech. Tech tokens trigger abilities twice',
    effect: {
      type: 'complex',
      effects: [
        { type: 'gain_token', token: 'tech', amount: 1 },
        { type: 'tech_double_trigger' }
      ]
    }
  }
};

export const getCreatureEffect = (creatureName) => {
  return CREATURE_EFFECTS[creatureName] || null;
};

export const getCreatureAbilityText = (creatureName) => {
  const effect = CREATURE_EFFECTS[creatureName];
  return effect?.ability || null;
};

// Process effects from ability text (for fused creatures with combined abilities)
const parseAndProcessAbilities = (abilityText, currentTokens, boardContext) => {
  const result = {
    tokensGained: {},
    scoreModifier: 0,
    specialEffect: null
  };
  
  // If no ability text, return empty result
  if (!abilityText) return result;
  
  // Split combined abilities
  const abilities = abilityText.split(' & ');
  
  // Process each ability
  abilities.forEach(ability => {
    // Find matching effect in CREATURE_EFFECTS
    const matchingCreature = Object.keys(CREATURE_EFFECTS).find(
      creatureName => CREATURE_EFFECTS[creatureName].ability === ability.trim()
    );
    
    if (matchingCreature) {
      const effect = CREATURE_EFFECTS[matchingCreature].effect;
      const subResult = processEffectData(effect, currentTokens, boardContext);
      
      // Merge results
      Object.entries(subResult.tokensGained).forEach(([token, amount]) => {
        result.tokensGained[token] = (result.tokensGained[token] || 0) + amount;
      });
      
      result.scoreModifier += subResult.scoreModifier;
      
      // Handle special effects (may need more complex merging logic)
      if (subResult.specialEffect && !result.specialEffect) {
        result.specialEffect = subResult.specialEffect;
      }
    }
  });
  
  return result;
};

export const processCreatureEffect = (card, currentTokens, boardContext = {}) => {
  // First try to get effect by card name (for base creatures)
  const effect = getCreatureEffect(card.name);
  
  // If no effect found by name but card has ability text, parse it
  if (!effect && card.ability) {
    return parseAndProcessAbilities(card.ability, currentTokens, boardContext);
  }
  
  if (!effect) return { tokensGained: {}, scoreModifier: 0, specialEffect: null };
  
  return processEffectData(effect.effect, currentTokens, boardContext);
};

// Separate function to process effect data
const processEffectData = (effectData, currentTokens, boardContext) => {
  const result = {
    tokensGained: {},
    scoreModifier: 0,
    specialEffect: null
  };
  
  const processEffect = (eff) => {
    switch (eff.type) {
      case 'gain_token':
        result.tokensGained[eff.token] = (result.tokensGained[eff.token] || 0) + eff.amount;
        break;
        
      case 'gain_token_position':
        if (boardContext.position !== undefined) {
          result.tokensGained[eff.token] = (boardContext.position + 1) * eff.multiplier;
        }
        break;
        
      case 'multiply_tokens':
        if (currentTokens[eff.token]) {
          result.tokensGained[eff.token] = currentTokens[eff.token];
        }
        break;
        
      case 'convert_tokens':
        if (currentTokens[eff.from.token] >= eff.from.amount) {
          result.tokensGained[eff.from.token] = -eff.from.amount;
          result.tokensGained[eff.to.token] = eff.to.amount;
        }
        break;
        
      case 'convert_all_to':
        const totalTokens = Object.values(currentTokens).reduce((sum, val) => sum + val, 0);
        if (totalTokens > 0) {
          // Clear all tokens
          Object.keys(currentTokens).forEach(token => {
            if (currentTokens[token] > 0) {
              result.tokensGained[token] = -currentTokens[token];
            }
          });
          // Add all as target token
          result.tokensGained[eff.token] = totalTokens;
        }
        break;
        
      case 'score_per_token':
        if (currentTokens[eff.token]) {
          result.scoreModifier += currentTokens[eff.token] * eff.ppPerToken;
        }
        break;
        
      case 'conditional_multiplier':
        if (eff.condition.type === 'token_threshold' && 
            currentTokens[eff.condition.token] >= eff.condition.amount) {
          result.specialEffect = { type: 'multiplier', value: eff.multiplier };
        }
        break;
        
      case 'token_diversity_bonus':
        const uniqueTokens = Object.keys(currentTokens).filter(token => currentTokens[token] > 0).length;
        result.scoreModifier += uniqueTokens * eff.ppPerType;
        break;
        
      case 'tokens_as_score':
        const totalTokenCount = Object.values(currentTokens).reduce((sum, val) => sum + val, 0);
        result.specialEffect = { type: 'override_score', value: totalTokenCount * eff.multiplier };
        break;
        
      case 'random_tokens':
        const tokenTypes = ['fire', 'water', 'earth', 'air', 'shadow', 'light', 'chaos', 'order', 'wild'];
        const numTokens = Math.floor(Math.random() * (eff.max - eff.min + 1)) + eff.min;
        for (let i = 0; i < numTokens; i++) {
          const randomToken = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
          result.tokensGained[randomToken] = (result.tokensGained[randomToken] || 0) + 1;
        }
        break;
        
      case 'clone_tokens':
        if (boardContext.leftmostTokens) {
          Object.entries(boardContext.leftmostTokens).forEach(([token, amount]) => {
            result.tokensGained[token] = (result.tokensGained[token] || 0) + amount;
          });
        }
        break;
        
      case 'adjacent_bonus':
        result.specialEffect = { type: 'adjacent_bonus', value: eff.bonus };
        break;
        
      case 'no_token_multiplier':
        result.specialEffect = { type: 'no_token_multiplier', value: eff.multiplier };
        break;
        
      case 'shadow_modifier':
        result.specialEffect = { type: 'shadow_modifier' };
        break;
        
      case 'purge_bonus':
        if (currentTokens[eff.from] > 0 && currentTokens[eff.to] > 0) {
          const purgeAmount = Math.min(currentTokens[eff.from], currentTokens[eff.to]);
          result.tokensGained[eff.from] = -purgeAmount;
          result.scoreModifier += purgeAmount * eff.ppPerPurge;
        }
        break;
        
      case 'token_conversion':
        if (currentTokens[eff.from] > 0) {
          result.tokensGained[eff.to] = currentTokens[eff.from] * eff.rate;
        }
        break;
        
      case 'tech_double_trigger':
        result.specialEffect = { type: 'tech_double_trigger' };
        break;
        
      case 'conditional_shuffle':
        if (currentTokens[eff.condition.token] >= eff.condition.amount) {
          result.specialEffect = { type: 'shuffle_board' };
        }
        break;
        
      case 'fredmaxxing':
        result.specialEffect = { type: 'fredmaxxing' };
        break;
        
      case 'time_loop':
        result.specialEffect = { type: 'time_loop' };
        break;
        
      case 'complex':
        eff.effects.forEach(subEffect => processEffect(subEffect));
        break;
    }
  };
  
  processEffect(effectData);
  
  return result;
};

// Get all tokens that would be generated by a card (for preview/planning)
export const getTokensFromCard = (card) => {
  const effect = getCreatureEffect(card.name);
  if (!effect) return {};
  
  const tokens = {};
  
  const processEffect = (eff) => {
    if (eff.type === 'gain_token') {
      tokens[eff.token] = eff.amount;
    } else if (eff.type === 'complex') {
      eff.effects.forEach(subEffect => {
        if (subEffect.type === 'gain_token') {
          tokens[subEffect.token] = subEffect.amount;
        }
      });
    }
  };
  
  processEffect(effect.effect);
  return tokens;
};