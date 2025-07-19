// Apply dream effects to card scoring

export function applyDreamEffects(baseValue, cardIndex, card, allCards, dreamEffects) {
  let modifiedValue = baseValue;
  
  dreamEffects.forEach(effect => {
    switch (effect.effect.type) {
      case 'flat_bonus':
        // All cards score +X
        modifiedValue += effect.effect.value;
        break;
        
      case 'duplicate_multiplier':
        // Check if this card is a duplicate
        const isDuplicate = allCards.filter(c => c.id === card.id).length > 1;
        if (isDuplicate) {
          modifiedValue *= effect.effect.multiplier;
        }
        break;
        
      case 'position_scaling':
        // Cards at the end score +X per position
        modifiedValue += cardIndex * effect.effect.scale;
        break;
        
      case 'suit_chain_multiplier':
        // Check if previous card has same suit
        if (cardIndex > 0 && allCards[cardIndex - 1].suit === card.suit) {
          modifiedValue *= effect.effect.multiplier;
        }
        break;
        
      case 'fusion_multiplier':
        // Check if card is fused (has parent cards)
        if (card.parentCardId1 || card.parentCardId2) {
          modifiedValue *= effect.effect.multiplier;
        }
        break;
        
      case 'cumulative_bonus':
        // Each card adds +X to the next
        modifiedValue += cardIndex * effect.effect.value;
        break;
        
      // Nightmare effects
      case 'value_reduction':
        modifiedValue *= effect.effect.multiplier;
        break;
        
      case 'value_inversion':
        // High value cards score less, low value more
        const avgValue = 20; // Average card value
        if (baseValue > avgValue) {
          modifiedValue = avgValue - (baseValue - avgValue) * 0.5;
        } else {
          modifiedValue = avgValue + (avgValue - baseValue) * 1.5;
        }
        break;
        
      case 'hand_limit':
        // This is handled at the hand level, not per card
        break;
        
      case 'disable_abilities':
        // This would need to be handled in the main scoring logic
        break;
        
      case 'threshold_multiplier':
        // This affects the threshold, not individual card scores
        break;
    }
  });
  
  return Math.floor(modifiedValue);
}

export function shouldDisableAbilities(dreamEffects) {
  return dreamEffects.some(effect => effect.effect.type === 'disable_abilities');
}

export function getHandLimit(dreamEffects) {
  const limitEffect = dreamEffects.find(effect => effect.effect.type === 'hand_limit');
  return limitEffect ? limitEffect.effect.limit : null;
}

export function shouldShuffleHand(dreamEffects) {
  return dreamEffects.some(effect => effect.effect.type === 'shuffle_hand');
}