import { API_CONFIG } from '../config/api';

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

// Convert creature data to game card format
const creatureToCard = (creature) => {
  console.log('Converting creature:', creature); // Debug log
  return {
    id: creature.cardId,
    name: creature.name,
    ppValue: creature.cost * 10, // Convert cost to PP value
    maxHp: creature.maxHp,
    rarity: getRarityName(creature.rarity),
    generation: creature.generation,
    generationIndex: creature.generationIndex,
    parentCardId1: creature.parentCardId1,
    parentCardId2: creature.parentCardId2,
    challengeRating: creature.challengeRating,
    flavorText: creature.flavorText,
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