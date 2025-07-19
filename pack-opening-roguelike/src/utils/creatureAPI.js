import { API_CONFIG } from '../config/api';
import { getCreatureAbilityText, CREATURE_EFFECTS } from './creatureEffects';

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

// Get ability text for a creature, handling inheritance for Gen2 and Gen3
const getInheritedAbility = (creature, allCreatures = {}) => {
  // Gen 1 creatures have their own abilities
  if (creature.generation === 1) {
    return getCreatureAbilityText(creature.name);
  }
  
  // Gen 2 creatures inherit both parent abilities
  if (creature.generation === 2 && creature.parentCardId1 && creature.parentCardId2) {
    const parent1 = allCreatures[creature.parentCardId1];
    const parent2 = allCreatures[creature.parentCardId2];
    
    if (parent1 && parent2) {
      const ability1 = getCreatureAbilityText(parent1.name);
      const ability2 = getCreatureAbilityText(parent2.name);
      
      if (ability1 && ability2) {
        return `${ability1} & ${ability2}`;
      }
    }
  }
  
  // Gen 3 creatures inherit all 4 grandparent abilities
  if (creature.generation === 3 && creature.parentCardId1 && creature.parentCardId2) {
    const parent1 = allCreatures[creature.parentCardId1];
    const parent2 = allCreatures[creature.parentCardId2];
    
    if (parent1 && parent2) {
      // Get grandparent abilities
      const abilities = [];
      
      // From parent 1's parents
      if (parent1.parentCardId1 && parent1.parentCardId2) {
        const gp1 = allCreatures[parent1.parentCardId1];
        const gp2 = allCreatures[parent1.parentCardId2];
        if (gp1) abilities.push(getCreatureAbilityText(gp1.name));
        if (gp2) abilities.push(getCreatureAbilityText(gp2.name));
      }
      
      // From parent 2's parents  
      if (parent2.parentCardId1 && parent2.parentCardId2) {
        const gp3 = allCreatures[parent2.parentCardId1];
        const gp4 = allCreatures[parent2.parentCardId2];
        if (gp3) abilities.push(getCreatureAbilityText(gp3.name));
        if (gp4) abilities.push(getCreatureAbilityText(gp4.name));
      }
      
      // Filter out nulls and join
      const validAbilities = abilities.filter(a => a);
      if (validAbilities.length > 0) {
        return validAbilities.join(' & ');
      }
    }
  }
  
  // Fallback to creature's own ability if defined
  return getCreatureAbilityText(creature.name);
};

// Calculate PP value for fused creatures
const calculateFusedPP = (creature, allCreatures = {}) => {
  // Gen 1 creatures have base PP
  if (creature.generation === 1) {
    return 10;
  }
  
  // Gen 2 and Gen 3 sum their parent PP values
  if ((creature.generation === 2 || creature.generation === 3) && 
      creature.parentCardId1 && creature.parentCardId2) {
    const parent1 = allCreatures[creature.parentCardId1];
    const parent2 = allCreatures[creature.parentCardId2];
    
    if (parent1 && parent2) {
      const pp1 = parent1.ppValue || 10;
      const pp2 = parent2.ppValue || 10;
      return pp1 + pp2;
    }
  }
  
  return 10; // Default
};

// Convert creature data to game card format
const creatureToCard = (creature, allCreatures = {}) => {
  console.log('Converting creature:', creature); // Debug log
  
  const inheritedAbility = getInheritedAbility(creature, allCreatures);
  const fusedPP = calculateFusedPP(creature, allCreatures);
  
  return {
    id: creature.cardId,
    name: creature.name,
    ppValue: fusedPP,
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
    ability: inheritedAbility, // Use inherited ability text
    // Original data preserved
    _originalCost: creature.cost
  };
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
    
    // Build creature map for inheritance lookup
    const creatureMap = {};
    cards.forEach(card => {
      creatureMap[card.cardId] = card;
    });
    
    // Convert with inheritance support
    return cards.map(creature => creatureToCard(creature, creatureMap));
  } catch (error) {
    console.error('Error fetching creatures:', error);
    throw error;
  }
};

// Breed two creatures to create a new one
export const breedCreatures = async (cardId1, cardId2) => {
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
    
    return creatureToCard(data.card);
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