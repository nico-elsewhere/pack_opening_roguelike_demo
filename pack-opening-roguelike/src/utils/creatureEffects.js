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
    ability: 'Gain 2 Fire',
    effect: {
      type: 'gain_token',
      token: 'fire',
      amount: 2
    }
  },
  'Escarglow': {
    ability: '+10 PP per Fire token',
    effect: {
      type: 'score_per_token',
      token: 'fire',
      ppPerToken: 10
    }
  },
  'Snarlboro': {
    ability: 'Gain 3 Fire and 1 Shadow',
    effect: {
      type: 'complex',
      effects: [
        { type: 'gain_token', token: 'fire', amount: 3 },
        { type: 'gain_token', token: 'shadow', amount: 1 }
      ]
    }
  },
  
  // WATER CREATURES
  'Buuevo': {
    ability: 'Gain Water equal to position (1-5)',
    effect: {
      type: 'gain_token_position',
      token: 'water',
      multiplier: 1
    }
  },
  'Hippeye': {
    ability: 'Score x Water tokens',
    effect: {
      type: 'multiply_by_token_count',
      token: 'water'
    }
  },
  
  // EARTH CREATURES
  'Sapphungus': {
    ability: 'Gain 2 Earth',
    effect: {
      type: 'gain_token',
      token: 'earth',
      amount: 2
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
  
  // POSITION-BASED CREATURES
  'Lileye': {
    ability: 'Position 1: Gain 1 Earth. Position 5: Gain 3 Water',
    effect: {
      type: 'position_based_tokens'
    }
  },
  
  // SHADOW CREATURES
  'Stitchhead': {
    ability: 'Gain 2 Shadow',
    effect: {
      type: 'gain_token',
      token: 'shadow',
      amount: 2
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
    ability: 'Gain 1 Light. Light purges Shadow for +50 PP each',
    effect: {
      type: 'complex',
      effects: [
        { type: 'gain_token', token: 'light', amount: 1 },
        { type: 'purge_bonus', from: 'shadow', to: 'light', ppPerPurge: 50 }
      ]
    }
  },
  'Kelvian': {
    ability: 'Gain Shadow equal to position (1-5)',
    effect: {
      type: 'gain_token_position',
      token: 'shadow',
      multiplier: 1
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
    ability: 'Score +5 PP per token',
    effect: {
      type: 'score_per_all_tokens',
      ppPerToken: 5
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
    ability: 'Gain 1 Earth',
    effect: {
      type: 'gain_token',
      token: 'earth',
      amount: 1
    }
  },
  'Elwick': {
    ability: 'Convert 1 Fire to 1 Arcane. Arcane doubles abilities',
    effect: {
      type: 'complex',
      effects: [
        { type: 'convert_tokens', from: { token: 'fire', amount: 1 }, to: { token: 'arcane', amount: 1 } },
        { type: 'arcane_double_trigger' }
      ]
    }
  },
  
  // PLACEHOLDER/DEBUG CREATURES
  'Flitterfin': {
    ability: 'No ability',
    effect: {
      type: 'none'
    }
  },
  'TestCreature': {
    ability: 'No ability',
    effect: {
      type: 'none'
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
        
      case 'position_based_tokens':
        if (boardContext.position === 0) { // First position
          result.tokensGained['earth'] = 1;
        } else if (boardContext.position === 4) { // Last position
          result.tokensGained['water'] = 3;
        }
        break;
        
      case 'multiply_tokens':
        // Return special effect to handle at board level
        result.specialEffect = { 
          type: 'double_tokens', 
          tokenType: eff.token 
        };
        break;
        
      case 'convert_tokens':
        if (currentTokens[eff.from.token] >= eff.from.amount) {
          result.specialEffect = {
            type: 'token_conversion',
            from: eff.from.token,
            to: eff.to.token,
            amount: eff.from.amount,
            multiplier: eff.to.amount / eff.from.amount
          };
        }
        break;
        
        
      case 'score_per_token':
        // Include both existing tokens and any we're about to gain
        const existingTokens = currentTokens[eff.token] || 0;
        const gainingTokens = result.tokensGained[eff.token] || 0;
        const totalTokens = existingTokens + gainingTokens;
        if (totalTokens > 0) {
          result.scoreModifier += totalTokens * eff.ppPerToken;
        }
        break;
        
      case 'conditional_multiplier':
        if (eff.condition.type === 'token_threshold' && 
            currentTokens[eff.condition.token] >= eff.condition.amount) {
          result.specialEffect = { type: 'multiplier', value: eff.multiplier };
        }
        break;
        
      case 'multiply_by_token_count':
        const tokenCount = currentTokens[eff.token] || 0;
        if (tokenCount > 0) {
          result.specialEffect = { type: 'multiplier', value: tokenCount };
        }
        break;
        
      case 'token_diversity_bonus':
        const uniqueTokens = Object.keys(currentTokens).filter(token => currentTokens[token] > 0).length;
        result.scoreModifier += uniqueTokens * eff.ppPerType;
        break;
        
      case 'score_per_all_tokens':
        const tokenSum = Object.values(currentTokens).reduce((sum, val) => sum + val, 0);
        result.scoreModifier += tokenSum * eff.ppPerToken;
        break;
        
      case 'random_tokens':
        const tokenTypes = ['fire', 'water', 'earth', 'shadow', 'light', 'chaos', 'arcane'];
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
        
      case 'purge_bonus':
        if (currentTokens[eff.from] > 0 && currentTokens[eff.to] > 0) {
          const purgeAmount = Math.min(currentTokens[eff.from], currentTokens[eff.to]);
          result.tokensGained[eff.from] = -purgeAmount;
          result.tokensGained[eff.to] = -purgeAmount;
          result.scoreModifier += purgeAmount * eff.ppPerPurge;
        }
        break;
        
        
      case 'arcane_double_trigger':
        result.specialEffect = { type: 'arcane_double_trigger' };
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