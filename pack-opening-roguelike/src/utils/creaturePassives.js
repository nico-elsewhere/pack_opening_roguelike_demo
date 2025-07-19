// Creature passive effects definitions
// Maps creature names to their passive abilities

export const CREATURE_PASSIVES = {
  // Fred and Fred-related creatures
  'Fred': {
    name: 'Fredmaxxing',
    description: 'Each Fred gets a multiplier equal to the number of Freds already revealed + 1',
    type: 'pack_multiplier',
    effect: (card, allCardsInPack, allCreatures) => {
      // Check if this card is Fred or a Fred descendant
      const isFredRelated = card.name === 'Fred' || 
        isDescendantOf(card, 'Fred', allCreatures);
      
      if (!isFredRelated) return null;
      
      // Use the reveal index if provided (from dynamic scoring)
      const thisCardIndex = card._revealIndex !== undefined ? card._revealIndex : 
        allCardsInPack.findIndex(c => c === card);
      
      
      if (thisCardIndex === -1) {
        return null;
      }
      
      const previousCards = allCardsInPack.slice(0, thisCardIndex);
      
      // Count previous Freds
      const previousFredCount = previousCards.filter(c => 
        c.name === 'Fred' || 
        isDescendantOf(c, 'Fred', allCreatures)
      ).length;
      
      
      
      // Always return a result for Fred, even if it's 1x
      const multiplier = previousFredCount + 1;
      
      if (multiplier > 1) {
        return {
          multiplier: multiplier,
          message: `Fredmaxxing! ${multiplier}x multiplier`
        };
      }
      
      // First Fred gets 1x (no effect, but still valid)
      return null;
    }
  },
  
  // Loopine - triggers a second scoring pass
  'Loopine': {
    name: 'Time Loop',
    description: 'After scoring completes, rescore all cards starting from Loopine',
    type: 'rescore_trigger',
    effect: (card, allCardsInPack, allCreatures) => {
      // This passive doesn't modify the score directly
      // It's handled specially in the scoring sequence
      return null;
    }
  }
};

// Helper function to check if a creature is a descendant of another
function isDescendantOf(creature, ancestorName, allCreatures) {
  if (!creature.parentCardId1 && !creature.parentCardId2) {
    return false;
  }
  
  // Check direct parents
  const parent1 = allCreatures[creature.parentCardId1];
  const parent2 = allCreatures[creature.parentCardId2];
  
  if (parent1?.name === ancestorName || parent2?.name === ancestorName) {
    return true;
  }
  
  // Recursively check grandparents
  if (parent1 && isDescendantOf(parent1, ancestorName, allCreatures)) {
    return true;
  }
  if (parent2 && isDescendantOf(parent2, ancestorName, allCreatures)) {
    return true;
  }
  
  return false;
}

// Apply all passive effects to a card's PP value
export function applyPassiveEffects(card, baseValue, allCardsInPack, allCreatures) {
  let finalValue = baseValue;
  let messages = [];
  
  // Check if this card has a passive
  const passive = CREATURE_PASSIVES[card.name];
  
  // Apply passives from all cards in the pack
  allCardsInPack.forEach(packCard => {
    const cardPassive = CREATURE_PASSIVES[packCard.name];
    if (cardPassive && cardPassive.effect) {
      const result = cardPassive.effect(card, allCardsInPack, allCreatures);
      if (result) {
        finalValue *= result.multiplier || 1;
        if (result.message) {
          messages.push(result.message);
        }
      }
    }
  });
  
  return {
    value: Math.floor(finalValue),
    messages
  };
}