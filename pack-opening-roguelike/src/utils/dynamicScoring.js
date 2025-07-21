// Dynamic scoring system that calculates effects as cards are revealed
import { calculateCardPP } from './cards';
import { CREATURE_PASSIVES } from './creaturePassives';
import { applyDreamEffects, shouldDisableAbilities } from './dreamEffects';
import { processCreatureEffect } from './creatureEffects';

// Calculate PP values for all revealed cards, considering cascading effects
export function calculateDynamicScores(revealedCards, allCardsInPack, equippedRunes, collection, dreamEffects = [], currentTokens = { earth: 0 }, justRevealedIndex = -1) {
  const scores = [];
  let cumulativeTokens = { ...currentTokens }; // Track cumulative tokens as we go
  
  // Track special state for complex effects
  const boardState = {
    hasLoopine: false,
    loopinePosition: -1,
    arcaneTokens: 0,
    shadowTokens: 0
  };
  
  // First pass: identify special cards
  revealedCards.forEach((card, index) => {
    if (card.name === 'Loopine') {
      boardState.hasLoopine = true;
      boardState.loopinePosition = index;
    }
  });
  
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
      // Check if THIS card has a passive that applies to itself
      const cardPassive = CREATURE_PASSIVES[card.name];
      if (cardPassive && cardPassive.effect) {
        // For Fredmaxxing, we pass the current index so it knows which card it is
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
    const baseValueBeforeEffects = currentValue;
    
    // Apply dream effects
    const valueBeforeDream = currentValue;
    currentValue = applyDreamEffects(currentValue, index, card, revealedCards, dreamEffects);
    const dreamMultiplier = currentValue / valueBeforeDream;
    const dreamAddition = currentValue - valueBeforeDream;
    
    // Determine if the dream effect is additive or multiplicative
    const dreamEffectType = dreamEffects.length > 0 && dreamEffects[0].effect ? dreamEffects[0].effect.type : null;
    const isAdditiveDream = dreamEffectType === 'flat_bonus' || dreamEffectType === 'position_scaling' || dreamEffectType === 'cumulative_bonus';
    
    // Store base value before any creature effects
    const baseValueBeforeCreatureEffects = currentValue;
    
    // Build board context for creature effects
    const boardContext = {
      position: index,
      leftmostTokens: index > 0 ? getTokensGeneratedByCard(revealedCards[0], cumulativeTokens) : {},
      arcaneTokens: cumulativeTokens.arcane || 0,
      shadowTokens: cumulativeTokens.shadow || 0
    };
    
    // Process creature effects for scoring (not token generation yet)
    let creatureScoreModifier = 0;
    let creatureMultiplier = 1;
    let overrideScore = null;
    
    if (!abilitiesDisabled) {
      const creatureResult = processCreatureEffect(card, cumulativeTokens, boardContext);
      
      // Apply score modifiers
      creatureScoreModifier = creatureResult.scoreModifier || 0;
      
      // Handle special effects
      if (creatureResult.specialEffect) {
        switch (creatureResult.specialEffect.type) {
          case 'multiplier':
            creatureMultiplier *= creatureResult.specialEffect.value;
            break;
            
          case 'override_score':
            overrideScore = creatureResult.specialEffect.value;
            break;
            
          case 'adjacent_bonus':
            // Apply bonus to adjacent cards (will be handled in a second pass)
            break;
        }
      }
    }
    
    // Apply creature score modifiers
    if (overrideScore !== null) {
      currentValue = overrideScore;
    } else {
      currentValue = Math.floor((currentValue + creatureScoreModifier) * creatureMultiplier);
    }
    
    // Store base value before token multipliers
    const baseValueBeforeTokens = currentValue;
    
    // Apply earth multiplier from tokens accumulated so far
    if (cumulativeTokens.earth > 0) {
      const earthMultiplier = 1 + cumulativeTokens.earth;
      currentValue = Math.floor(currentValue * earthMultiplier);
    }
    
    // Apply shadow/light modifiers to creature scoring
    if (cumulativeTokens.shadow > 0) {
      currentValue -= cumulativeTokens.shadow * 5; // -5 per shadow token
    }
    if (cumulativeTokens.light > 0) {
      currentValue += cumulativeTokens.light * 5; // +5 per light token
    }
    
    // Ensure score doesn't go below 0
    currentValue = Math.max(0, currentValue);
    
    // Process this card's creature effect (add tokens) - only for the just revealed card
    let cardTokensGenerated = {};
    let specialEffectTriggered = null;
    
    if (!abilitiesDisabled && index === justRevealedIndex) {
      const creatureResult = processCreatureEffect(card, cumulativeTokens, boardContext);
      cardTokensGenerated = creatureResult.tokensGained || {};
      
      // Handle arcane double trigger
      if (cumulativeTokens.arcane > 0 && creatureResult.tokensGained) {
        Object.keys(creatureResult.tokensGained).forEach(token => {
          if (creatureResult.tokensGained[token] > 0) {
            creatureResult.tokensGained[token] *= 2;
          }
        });
        cardTokensGenerated = creatureResult.tokensGained;
      }
      
      // Apply the tokens from this card
      Object.entries(cardTokensGenerated).forEach(([tokenType, amount]) => {
        cumulativeTokens[tokenType] = (cumulativeTokens[tokenType] || 0) + amount;
      });
      
      // Track special effects that need board-level handling
      if (creatureResult.specialEffect) {
        specialEffectTriggered = creatureResult.specialEffect;
        
        // Handle special token manipulation effects immediately
        switch (specialEffectTriggered.type) {
          case 'double_tokens':
            // Pyrrhus effect - double specific token type
            if (cumulativeTokens[specialEffectTriggered.tokenType]) {
              cumulativeTokens[specialEffectTriggered.tokenType] *= 2;
            }
            break;
            
            
          case 'token_conversion':
            // Escarglow effect - convert specific tokens
            if (cumulativeTokens[specialEffectTriggered.from] >= specialEffectTriggered.amount) {
              cumulativeTokens[specialEffectTriggered.from] -= specialEffectTriggered.amount;
              cumulativeTokens[specialEffectTriggered.to] = (cumulativeTokens[specialEffectTriggered.to] || 0) + 
                Math.floor(specialEffectTriggered.amount * specialEffectTriggered.multiplier);
            }
            break;
            
        }
      }
    }
    
    // Add tokens from previously revealed cards (not including current)
    if (index < justRevealedIndex) {
      const prevCard = revealedCards[index];
      if (!abilitiesDisabled) {
        const prevContext = { ...boardContext, position: index };
        const { tokensGained: prevTokens } = processCreatureEffect(prevCard, {}, prevContext);
        for (const [tokenType, amount] of Object.entries(prevTokens)) {
          cumulativeTokens[tokenType] = (cumulativeTokens[tokenType] || 0) + amount;
        }
      }
    }
    
    scores.push({
      cardIndex: index,
      baseValue: baseWithRunes,
      baseValueBeforeEffects,
      baseValueBeforeTokens, // Store this for animation
      baseValueBeforeCreatureEffects,
      currentValue,
      passiveMultiplier,
      creatureMultiplier,
      dreamMultiplier: dreamMultiplier !== 1 ? dreamMultiplier : null,
      dreamAddition: dreamAddition !== 0 ? dreamAddition : null,
      isAdditiveDream,
      effects: cardEffects,
      tokenMultiplier: cumulativeTokens.earth > 0 ? (1 + cumulativeTokens.earth) : 1,
      tokensGenerated: cardTokensGenerated,
      wasJustRevealed: index === justRevealedIndex,
      specialEffect: specialEffectTriggered
    });
  });
  
  // Second pass: Apply position-dependent effects (like adjacent bonuses)
  scores.forEach((score, index) => {
    const card = revealedCards[index];
    if (!shouldDisableAbilities(dreamEffects)) {
      // Check for adjacent bonus effects
      if (index > 0) {
        const leftCard = revealedCards[index - 1];
        const leftEffect = processCreatureEffect(leftCard, cumulativeTokens, { position: index - 1 });
        if (leftEffect.specialEffect?.type === 'adjacent_bonus') {
          scores[index].currentValue += leftEffect.specialEffect.value;
        }
      }
      if (index < revealedCards.length - 1) {
        const rightCard = revealedCards[index + 1];
        const rightEffect = processCreatureEffect(rightCard, cumulativeTokens, { position: index + 1 });
        if (rightEffect.specialEffect?.type === 'adjacent_bonus') {
          scores[index].currentValue += rightEffect.specialEffect.value;
        }
      }
    }
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
        const oldScores = calculateDynamicScores(previousRevealed, allCardsInPack, equippedRunes, collection, dreamEffects, currentTokens);
        const oldScore = oldScores.scores[i];
        
        // Calculate new score with current revealed cards
        const newScores = calculateDynamicScores(currentRevealed, allCardsInPack, equippedRunes, collection, dreamEffects, currentTokens);
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
    tokensGained: cumulativeTokens, // Return the cumulative tokens
    boardState
  };
}

// Helper function to get tokens generated by a specific card
function getTokensGeneratedByCard(card, existingTokens) {
  const result = processCreatureEffect(card, existingTokens, { position: 0 });
  return result.tokensGained || {};
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