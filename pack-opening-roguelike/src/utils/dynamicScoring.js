// Dynamic scoring system that calculates effects as cards are revealed
import { calculateCardPP } from './cards';
import { CREATURE_PASSIVES } from './creaturePassives';
import { CREATURE_EFFECTS, processCardEffects } from './creatureEffects';
import { applyDreamEffects, shouldDisableAbilities } from './dreamEffects';

// Calculate PP values for all revealed cards, considering cascading effects
export function calculateDynamicScores(revealedCards, allCardsInPack, equippedRunes, collection, dreamEffects = [], currentTokens = null) {
  const scores = [];
  let tokens = currentTokens || {
    fire: 0,
    water: 0,
    earth: 0,
    air: 0,
    light: 0,
    shadow: 0,
    arcane: 0,
    nature: 0
  };
  let tokenValueModifiers = {};
  
  // For each revealed card, calculate its current score considering all revealed cards so far
  revealedCards.forEach((card, index) => {
    // Calculate base PP with rune effects but without passive creature effects
    const ppValue = card.ppValue !== undefined ? card.ppValue : 10; // Default to 10 only if undefined
    const level = card.level || 1;
    const baseValue = ppValue * level;
    
    let runeMultiplier = 1;
    
    // Apply equipped rune effects
    equippedRunes.forEach(rune => {
      const effect = rune.effect;
      if (!effect) return;
      
      if (effect.type === 'suit_bonus' && effect.suit === card.suit) {
        runeMultiplier *= effect.multiplier;
      }
      if (effect.type === 'suit_count_mult' && effect.suit === card.suit) {
        const suitCount = revealedCards.filter(c => c.suit === card.suit).length;
        runeMultiplier *= (1 + (effect.multiplierPerCard * suitCount));
      }
    });
    
    const baseWithRunes = Math.floor(baseValue * runeMultiplier);
    
    // Now check for passive effects
    const revealedSoFar = revealedCards;
    let passiveMultiplier = 1;
    const cardEffects = [];
    
    // Check if abilities are disabled by nightmare effect
    const abilitiesDisabled = shouldDisableAbilities(dreamEffects);
    
    if (!abilitiesDisabled) {
      // Process new creature effects system
      const effectResult = processCardEffects(card, revealedSoFar, allCardsInPack, tokens, index);
      
      // Update tokens
      if (effectResult.tokens) {
        tokens = effectResult.tokens;
      }
      
      // Apply multipliers
      if (effectResult.multiplier && effectResult.multiplier > 1) {
        passiveMultiplier *= effectResult.multiplier;
      }
      
      // Add bonus PP
      if (effectResult.bonusPP) {
        baseWithRunes += effectResult.bonusPP;
      }
      
      // Store token value modifiers
      if (effectResult.tokenValueModifier) {
        Object.assign(tokenValueModifiers, effectResult.tokenValueModifier);
      }
      
      // Legacy passive system (for backwards compatibility)
      const cardPassive = CREATURE_PASSIVES[card.name];
      if (cardPassive && cardPassive.effect) {
        const modifiedCard = { ...card, _revealIndex: index };
        const result = cardPassive.effect(modifiedCard, revealedSoFar, collection);
        if (result && result.multiplier) {
          passiveMultiplier *= result.multiplier;
          cardEffects.push({
            source: card.name,
            target: card.name,
            passiveName: cardPassive.name,
            multiplier: result.multiplier,
            message: result.message
          });
        }
      }
    }
    
    // In the future, we might check other cards' passives that affect this card
    // But for now, Fredmaxxing only affects the Fred being revealed
    
    let currentValue = Math.floor(baseWithRunes * passiveMultiplier);
    
    // Apply dream effects
    currentValue = applyDreamEffects(currentValue, index, card, revealedCards, dreamEffects);
    
    scores.push({
      cardIndex: index,
      baseValue: baseWithRunes,
      currentValue,
      passiveMultiplier,
      effects: cardEffects
    });
  });
  
  // Find newly triggered effects by comparing with previous state
  const findNewEffects = (currentRevealedCount) => {
    const newEffects = [];
    
    // When a new card is revealed, check if it affects previous cards
    if (currentRevealedCount > 1) {
      const previousRevealed = revealedCards.slice(0, currentRevealedCount - 1);
      const currentRevealed = revealedCards.slice(0, currentRevealedCount);
      
      // Check each previously revealed card to see if its score should change
      for (let i = 0; i < previousRevealed.length; i++) {
        const targetCard = previousRevealed[i];
        
        // Calculate old score with previous revealed cards
        const oldScores = calculateDynamicScores(previousRevealed, allCardsInPack, equippedRunes, collection, dreamEffects);
        const oldScore = oldScores.scores[i];
        
        // Calculate new score with current revealed cards
        const newScores = calculateDynamicScores(currentRevealed, allCardsInPack, equippedRunes, collection, dreamEffects);
        const newScore = newScores.scores[i];
        
        // If score changed, find which passive caused it
        if (oldScore.currentValue !== newScore.currentValue) {
          // The new card must have a passive that affects this card
          const newCard = revealedCards[currentRevealedCount - 1];
          const passive = CREATURE_PASSIVES[newCard.name];
          
          if (passive) {
            // Calculate the new multiplier
            const newMultiplier = newScore.passiveMultiplier;
            
            newEffects.push({
              type: 'retroactive',
              source: newCard.name,
              sourceIndex: currentRevealedCount - 1,
              target: targetCard.name,
              targetIndex: i,
              passiveName: passive.name,
              multiplier: newMultiplier,
              previousValue: oldScore.currentValue,
              newValue: newScore.currentValue
            });
          }
        }
      }
    }
    
    return newEffects;
  };
  
  return {
    scores,
    findNewEffects,
    newTokens: tokens
  };
}

// Generate floating text animations for a scoring event
export function generateScoringAnimations(scoringEvent) {
  const animations = [];
  
  if (scoringEvent.type === 'initial') {
    // Initial card reveal - show base PP
    animations.push({
      type: 'pp',
      text: `+${scoringEvent.value}`,
      delay: 0,
      duration: 2000
    });
  } else if (scoringEvent.type === 'retroactive') {
    // Effect triggered on previously revealed card
    animations.push({
      type: 'ability',
      text: scoringEvent.passiveName,
      delay: 0,
      duration: 1500
    });
    
    animations.push({
      type: 'multiplier',
      text: `×${scoringEvent.multiplier}`,
      delay: 500,
      duration: 1500
    });
    
    animations.push({
      type: 'update',
      text: `${scoringEvent.previousValue} → ${scoringEvent.newValue}`,
      delay: 1000,
      duration: 2000
    });
  }
  
  return animations;
}