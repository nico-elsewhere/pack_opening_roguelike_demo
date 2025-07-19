export const CREATURE_EFFECTS = {
  'Manaclite': {
    ability: 'Gain 1 Strength',
    effect: {
      type: 'gain_token',
      token: 'strength',
      amount: 1
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

export const processCreatureEffect = (card, tokens) => {
  const effect = getCreatureEffect(card.name);
  if (!effect) return { tokensGained: {} };
  
  const tokensGained = {};
  
  if (effect.effect.type === 'gain_token') {
    tokensGained[effect.effect.token] = effect.effect.amount;
  }
  
  return { tokensGained };
};