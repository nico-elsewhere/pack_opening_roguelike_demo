// Creature passive effects definitions
// Maps creature names to their passive abilities

export const CREATURE_PASSIVES = {
  // Fred and Fred-related creatures
  'Fred': {
    name: 'Fredmaxxing',
    description: 'Multiplies score of all Fred and Fred descendants by the number of Freds in the pack',
    type: 'pack_multiplier',
    effect: (card, allCardsInPack, allCreatures) => {
      // Count all Freds (including descendants) in the pack
      const fredCount = allCardsInPack.filter(c => 
        c.name === 'Fred' || 
        isDescendantOf(c, 'Fred', allCreatures)
      ).length;
      
      // Check if this card is Fred or a Fred descendant
      const isFredRelated = card.name === 'Fred' || 
        isDescendantOf(card, 'Fred', allCreatures);
      
      if (isFredRelated && fredCount > 0) {
        return {
          multiplier: fredCount,
          message: `Fredmaxxing! ${fredCount}x multiplier`
        };
      }
      
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