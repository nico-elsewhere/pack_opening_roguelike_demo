import { API_CONFIG } from '../config/api';
import { CREATURE_EFFECTS, getCardEffectText } from './creatureEffects';

// Helper to convert numeric rarity to string
const getRarityName = (rarityNum) => {
  switch(rarityNum) {
    case 0: return 'common'; // Handle 0 as common
    case 1: return 'common';
    case 2: return 'uncommon';
    case 3: return 'rare';
    case 4: return 'epic';
    case 5: return 'legendary';
    default: return 'common';
  }
};

// Clean up garbled text from API
const cleanFlavorText = (text) => {
  if (!text) return '';
  
  // Remove excessive spaces and fix common garbled patterns
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .replace(/\s*,\s*/g, ', ') // Fix comma spacing
    .replace(/\s*\.\s*/g, '. ') // Fix period spacing
    .replace(/\s+([.,!?])/g, '$1') // Remove space before punctuation
    .trim();
};

// Convert creature data to game card format
const creatureToCard = (creature) => {
  console.log('Converting creature:', creature); // Debug log
  const card = {
    id: creature.cardId,
    name: creature.name,
    ppValue: 10, // All creatures have base PP of 10
    maxHp: creature.maxHp,
    rarity: getRarityName(creature.rarity),
    generation: creature.generation,
    generationIndex: creature.generationIndex,
    parentCardId1: creature.parentCardId1,
    parentCardId2: creature.parentCardId2,
    challengeRating: creature.challengeRating,
    flavorText: cleanFlavorText(creature.flavorText),
    imageUrl: creature.imageUrl,
    artists: creature.artists,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    isRune: false, // Can be expanded later
    arcana: 'creature',
    // Original data preserved
    _originalCost: creature.cost
  };
  
  // Add effect text for Gen1 creatures
  if (creature.generation === 'Gen1') {
    const effectText = getCardEffectText(card);
    if (effectText) {
      card.effect = effectText;
    }
  }
  
  // Special case for Boastun - 0 PP
  if (creature.name === 'Boastun') {
    card.ppValue = 0;
  }
  
  return card;
};

// Fetch a single creature by ID
export const getCreature = async (cardId) => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getCard}?cardId=${cardId}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch creature: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.card) {
      throw new Error('No card data in response');
    }
    
    return creatureToCard(data.card);
  } catch (error) {
    console.error('Error fetching creature:', error);
    throw error;
  }
};

// Fetch multiple creatures by IDs (max 50)
export const getCreatures = async (cardIds) => {
  if (!cardIds || cardIds.length === 0) {
    return [];
  }
  
  // Limit to max allowed
  const limitedIds = cardIds.slice(0, API_CONFIG.maxCardIds);
  
  try {
    console.log('Fetching creatures with IDs:', limitedIds);
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getCards}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardIds: limitedIds })
      }
    );
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch creatures: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response:', data); // Debug log
    
    // Handle the nested response structure
    const cards = data.response?.cards || data.cards || [];
    if (!cards || cards.length === 0) {
      console.error('Response data structure:', data);
      throw new Error('No cards data in response');
    }
    
    console.log(`Found ${cards.length} cards`);
    return cards.map(creatureToCard);
  } catch (error) {
    console.error('Error fetching creatures:', error);
    throw error;
  }
};

// Breed two creatures to create a new one
export const breedCreatures = async (cardId1, cardId2, parent1Data = null, parent2Data = null) => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.breed}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId1, cardId2 })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to breed creatures: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.card) {
      throw new Error('No card data in response');
    }
    
    const fusedCard = creatureToCard(data.card);
    
    // Handle effect inheritance
    if (parent1Data && parent2Data) {
      fusedCard.inheritedEffects = [];
      
      // Inherit from parent 1
      if (parent1Data.generation === 'Gen1' && CREATURE_EFFECTS[parent1Data.name]) {
        fusedCard.inheritedEffects.push({
          name: parent1Data.name,
          effect: CREATURE_EFFECTS[parent1Data.name].effect
        });
      } else if (parent1Data.inheritedEffects) {
        fusedCard.inheritedEffects.push(...parent1Data.inheritedEffects);
      }
      
      // Inherit from parent 2
      if (parent2Data.generation === 'Gen1' && CREATURE_EFFECTS[parent2Data.name]) {
        fusedCard.inheritedEffects.push({
          name: parent2Data.name,
          effect: CREATURE_EFFECTS[parent2Data.name].effect
        });
      } else if (parent2Data.inheritedEffects) {
        fusedCard.inheritedEffects.push(...parent2Data.inheritedEffects);
      }
      
      // Set PP value as sum of parents
      fusedCard.ppValue = (parent1Data.ppValue || 10) + (parent2Data.ppValue || 10);
      
      // Set effect text
      if (fusedCard.inheritedEffects.length > 0) {
        fusedCard.effect = fusedCard.inheritedEffects.map(e => e.effect).join(' & ');
      }
    }
    
    return fusedCard;
  } catch (error) {
    console.error('Error breeding creatures:', error);
    throw error;
  }
};

// Get a list of Gen1 creature IDs to use as the base deck
export const getGen1CreatureIds = (count = 50) => {
  const ids = [];
  for (let i = 1; i <= count; i++) {
    // Format with leading zeros (assuming 10 digits total after Gen1_)
    const paddedId = String(i).padStart(10, '0');
    ids.push(`Gen1_${paddedId}`);
  }
  return ids;
};