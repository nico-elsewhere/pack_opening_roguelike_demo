import { generateRuneEffect } from './cards';

// Define fusion suit combinations
export const FUSION_RECIPES = {
  'fire-earth': 'magma',
  'earth-fire': 'magma',
  'fire-water': 'steam',
  'water-fire': 'steam',
  'fire-air': 'lightning',
  'air-fire': 'lightning',
  'earth-water': 'mud',
  'water-earth': 'mud',
  'earth-air': 'dust',
  'air-earth': 'dust',
  'water-air': 'ice',
  'air-water': 'ice'
};

// Fusion suit properties
export const FUSION_SUITS = {
  magma: {
    symbol: '🌋',
    color: '#ff4500',
    name: 'Magma',
    description: 'Molten rock forged from Fire and Earth'
  },
  steam: {
    symbol: '💨',
    color: '#87ceeb',
    name: 'Steam',
    description: 'Vapor born from Fire and Water'
  },
  lightning: {
    symbol: '⚡',
    color: '#ffd700',
    name: 'Lightning',
    description: 'Electric energy from Fire and Air'
  },
  mud: {
    symbol: '🟫',
    color: '#8b4513',
    name: 'Mud',
    description: 'Rich soil created from Earth and Water'
  },
  dust: {
    symbol: '🌪️',
    color: '#daa520',
    name: 'Dust',
    description: 'Sandy particles of Earth and Air'
  },
  ice: {
    symbol: '❄️',
    color: '#00bfff',
    name: 'Ice',
    description: 'Frozen crystals of Water and Air'
  }
};

// Comprehensive fusion name mappings
const MAJOR_MAJOR_FUSIONS = {
  // The Fool combinations
  'The Fool-The Magician': { name: 'The Trickster', symbol: '🎭', description: 'Master of chaos and illusion' },
  'The Fool-The High Priestess': { name: 'The Oracle of Chaos', symbol: '🔮', description: 'Intuition born from innocence' },
  'The Fool-The Empress': { name: 'The Wild Child', symbol: '🌺', description: 'Nature\'s innocent creation' },
  'The Fool-The Emperor': { name: 'The Mad King', symbol: '👑', description: 'Authority without wisdom' },
  'The Fool-The Hierophant': { name: 'The Heretic', symbol: '⚡', description: 'Sacred rebellion' },
  'The Fool-The Lovers': { name: 'The Innocent Heart', symbol: '💞', description: 'Love without boundaries' },
  'The Fool-The Chariot': { name: 'The Reckless Journey', symbol: '🎢', description: 'Speed without direction' },
  'The Fool-Strength': { name: 'The Primal Force', symbol: '🦁', description: 'Raw power unleashed' },
  'The Fool-The Hermit': { name: 'The Wandering Sage', symbol: '🔮', description: 'Wisdom found in endless journeys' },
  'The Fool-Wheel of Fortune': { name: 'The Chaos Wheel', symbol: '🎰', description: 'Fortune\'s wild dance' },
  'The Fool-Justice': { name: 'The Blind Judge', symbol: '⚖️', description: 'Justice without prejudice' },
  'The Fool-The Hanged Man': { name: 'The Suspended Dream', symbol: '🌀', description: 'Reality inverted' },
  'The Fool-Death': { name: 'The Void Walker', symbol: '💀', description: 'Dancing with oblivion' },
  'The Fool-Temperance': { name: 'The Wild Alchemist', symbol: '🧪', description: 'Chaos in balance' },
  'The Fool-The Devil': { name: 'The Laughing Demon', symbol: '😈', description: 'Mischief incarnate' },
  'The Fool-The Tower': { name: 'The Catalyst', symbol: '💥', description: 'The spark of destruction' },
  'The Fool-The Star': { name: 'The Dreamer', symbol: '💫', description: 'Hope without reason' },
  'The Fool-The Moon': { name: 'The Lunatic', symbol: '🌙', description: 'Madness under moonlight' },
  'The Fool-The Sun': { name: 'The Solar Child', symbol: '☀️', description: 'Joy unbound' },
  'The Fool-Judgement': { name: 'The Reborn', symbol: '🔄', description: 'New beginnings from endings' },
  'The Fool-The World': { name: 'The Eternal Cycle', symbol: '♾️', description: 'Endings become new beginnings' },
  
  // The Magician combinations
  'The Magician-The High Priestess': { name: 'The Mystic', symbol: '✨', description: 'Will meets intuition' },
  'The Magician-The Empress': { name: 'The Creator', symbol: '🌟', description: 'Manifestation of life' },
  'The Magician-The Emperor': { name: 'The Architect', symbol: '🏛️', description: 'Will shapes reality' },
  'The Magician-The Hierophant': { name: 'The High Priest', symbol: '📿', description: 'Sacred knowledge manifest' },
  'The Magician-The Lovers': { name: 'The Enchanter', symbol: '💘', description: 'Love\'s spell caster' },
  'The Magician-The Chariot': { name: 'The War Mage', symbol: '⚔️', description: 'Will in motion' },
  'The Magician-Strength': { name: 'The Force Wielder', symbol: '💪', description: 'Power channeled' },
  'The Magician-The Hermit': { name: 'The Sage of Secrets', symbol: '📖', description: 'Hidden knowledge revealed' },
  'The Magician-Wheel of Fortune': { name: 'The Fate Weaver', symbol: '🕸️', description: 'Destiny\'s architect' },
  'The Magician-Justice': { name: 'The Law Bringer', symbol: '⚖️', description: 'Will becomes law' },
  'The Magician-The Hanged Man': { name: 'The Reality Bender', symbol: '🌀', description: 'Perception altered' },
  'The Magician-Death': { name: 'The Necromancer', symbol: '💀', description: 'Master of transformation' },
  'The Magician-Temperance': { name: 'The Grand Alchemist', symbol: '⚗️', description: 'Perfect transmutation' },
  'The Magician-The Devil': { name: 'The Dark Sorcerer', symbol: '🔮', description: 'Power corrupted' },
  'The Magician-The Tower': { name: 'The Chaos Mage', symbol: '⚡', description: 'Destructive creation' },
  'The Magician-The Star': { name: 'The Wish Granter', symbol: '🌟', description: 'Hope made manifest' },
  'The Magician-The Moon': { name: 'The Illusionist', symbol: '🎭', description: 'Master of deception' },
  'The Magician-The Sun': { name: 'The Light Bringer', symbol: '☀️', description: 'Illumination incarnate' },
  'The Magician-Judgement': { name: 'The Resurrector', symbol: '⚡', description: 'Will over death' },
  'The Magician-The World': { name: 'The Master', symbol: '🌍', description: 'Complete manifestation' },
  
  // More Major+Major combinations...
  'The High Priestess-The Empress': { name: 'The Divine Feminine', symbol: '👸', description: 'Sacred motherhood' },
  'The Emperor-The Hierophant': { name: 'The Divine Order', symbol: '⚖️', description: 'Authority and tradition' },
  'The Tower-The Hierophant': { name: 'The Fallen Temple', symbol: '⛪', description: 'Faith shattered' },
  'Death-The Tower': { name: 'The Apocalypse', symbol: '☄️', description: 'Ultimate destruction' },
  'The Sun-The Moon': { name: 'Eclipse', symbol: '🌑', description: 'Light and shadow united' },
  'The Devil-Justice': { name: 'Karmic Retribution', symbol: '⚡', description: 'What goes around comes around' },
  'The Lovers-The Devil': { name: 'Temptation', symbol: '🍎', description: 'Forbidden desires' },
  'Strength-The Chariot': { name: 'Unstoppable Force', symbol: '💪', description: 'Inner and outer power' },
  'The Star-The Moon': { name: 'Celestial Harmony', symbol: '✨', description: 'Dreams and hope' },
  'Death-The Sun': { name: 'Phoenix Rising', symbol: '🔥', description: 'Rebirth in flames' },
  'The Tower-The Star': { name: 'Hope from Ashes', symbol: '🌟', description: 'Light after destruction' },
  'Temperance-The Devil': { name: 'Inner Conflict', symbol: '⚖️', description: 'Balance versus desire' },
  'The Hanged Man-The World': { name: 'Transcendence', symbol: '🌀', description: 'Sacrifice completes the cycle' },
  'Strength-Temperance': { name: 'The Gentle Giant', symbol: '🕊️', description: 'Power in restraint' },
  'The Hermit-Death': { name: 'The Final Wisdom', symbol: '💀', description: 'Solitude\'s end' },
  'Judgement-The World': { name: 'The Great Work', symbol: '🔯', description: 'All is complete' },
  'The Tower-The Magician': { name: 'The Shattered Will', symbol: '💥', description: 'Power destroyed' },
  'The Tower-Death': { name: 'Total Annihilation', symbol: '☠️', description: 'Complete ending' },
  'The Tower-The Devil': { name: 'Hell Unleashed', symbol: '👹', description: 'Chaos and corruption' },
  'The Tower-The Emperor': { name: 'The Coup', symbol: '🗡️', description: 'Authority overthrown' },
  'The Tower-The Empress': { name: 'The Barren Land', symbol: '🏜️', description: 'Fertility destroyed' },
  'The Tower-The High Priestess': { name: 'The Veil Torn', symbol: '🌪️', description: 'Secrets exposed' },
  'The Tower-The Lovers': { name: 'The Bitter Divorce', symbol: '💔', description: 'Love destroyed' },
  'The Tower-Strength': { name: 'The Broken Will', symbol: '⛓️', description: 'Power shattered' },
  'The Tower-The Hermit': { name: 'The Forced Emergence', symbol: '🏚️', description: 'Solitude ended' },
  'The Tower-Wheel of Fortune': { name: 'The Wheel Breaks', symbol: '💥', description: 'Fate disrupted' },
  'The Tower-Justice': { name: 'The Corrupt Court', symbol: '⚖️', description: 'Justice fails' },
  'The Tower-The Hanged Man': { name: 'The Violent Release', symbol: '⛓️', description: 'Suspension ends' },
  'The Tower-Temperance': { name: 'The Extreme Reaction', symbol: '🌋', description: 'Balance lost' },
  'The Tower-The Sun': { name: 'The Eclipse', symbol: '🌑', description: 'Light extinguished' },
  'The Tower-The Moon': { name: 'The Nightmare Made Real', symbol: '😱', description: 'Fears manifest' },
  'The Tower-Judgement': { name: 'The False Apocalypse', symbol: '🎺', description: 'Premature ending' },
  'The Tower-The World': { name: 'The End of Everything', symbol: '🌍', description: 'Completion destroyed' }
};

// Major + Elemental/Minor fusions
const MAJOR_MINOR_FUSIONS = {
  // The Fool + Fire combinations (1-10)
  'The Fool-1-fire': { name: 'The Spark of Chaos', symbol: '🔥', description: 'New flames of possibility' },
  'The Fool-2-fire': { name: 'The Dancing Flame', symbol: '🕺', description: 'Playful destruction' },
  'The Fool-3-fire': { name: 'The Wild Celebration', symbol: '🎉', description: 'Uncontrolled joy' },
  'The Fool-4-fire': { name: 'The Restless Spirit', symbol: '👻', description: 'Peace disturbed' },
  'The Fool-5-fire': { name: 'The Jester\'s Quarrel', symbol: '🃏', description: 'Conflict without purpose' },
  'The Fool-6-fire': { name: 'The Innocent Victor', symbol: '🏆', description: 'Accidental triumph' },
  'The Fool-7-fire': { name: 'The Reckless Defender', symbol: '🛡️', description: 'Brave but foolish' },
  'The Fool-8-fire': { name: 'The Swift Wanderer', symbol: '💨', description: 'Speed without destination' },
  'The Fool-9-fire': { name: 'The Last Stand', symbol: '🏰', description: 'Defending nothing' },
  'The Fool-10-fire': { name: 'The Burden of Freedom', symbol: '⛓️', description: 'Weight of possibilities' },
  
  // The Fool + Water combinations (1-10)
  'The Fool-1-water': { name: 'The First Drop', symbol: '💧', description: 'Innocence meets emotion' },
  'The Fool-2-water': { name: 'The Naive Partnership', symbol: '🤝', description: 'Trust without wisdom' },
  'The Fool-3-water': { name: 'The Carefree Toast', symbol: '🥂', description: 'Celebrating nothing' },
  'The Fool-4-water': { name: 'The Drifting Dream', symbol: '💭', description: 'Aimless contemplation' },
  'The Fool-5-water': { name: 'The Spilled Cup', symbol: '😢', description: 'Careless loss' },
  'The Fool-6-water': { name: 'The Lucky Voyage', symbol: '⛵', description: 'Blessed ignorance' },
  'The Fool-7-water': { name: 'The Dreamer\'s Stand', symbol: '🌙', description: 'Defending illusions' },
  'The Fool-8-water': { name: 'The Wandering Stream', symbol: '🌊', description: 'Path abandoned' },
  'The Fool-9-water': { name: 'The Wishing Fool', symbol: '⭐', description: 'Dreams without plans' },
  'The Fool-10-water': { name: 'The Ocean\'s Jest', symbol: '🌊', description: 'Overwhelmed naivety' },
  
  // The Fool + Earth combinations (1-10)
  'The Fool-1-earth': { name: 'The Seedling\'s Chance', symbol: '🌱', description: 'Random growth' },
  'The Fool-2-earth': { name: 'The Shaky Ground', symbol: '🏔️', description: 'Unstable partnership' },
  'The Fool-3-earth': { name: 'The Accidental Harvest', symbol: '🌾', description: 'Unearned abundance' },
  'The Fool-4-earth': { name: 'The Wanderer\'s Rest', symbol: '🏕️', description: 'Temporary grounding' },
  'The Fool-5-earth': { name: 'The Crumbling Path', symbol: '🏚️', description: 'Foundation lost' },
  'The Fool-6-earth': { name: 'The Fool\'s Gold', symbol: '💰', description: 'False prosperity' },
  'The Fool-7-earth': { name: 'The Hollow Defense', symbol: '🗿', description: 'Protecting nothing' },
  'The Fool-8-earth': { name: 'The Nomad\'s Trail', symbol: '👣', description: 'Leaving no roots' },
  'The Fool-9-earth': { name: 'The Empty Fortress', symbol: '🏰', description: 'Solitude by chance' },
  'The Fool-10-earth': { name: 'The Weightless Burden', symbol: '🎒', description: 'Carrying nothing' },
  
  // The Fool + Air combinations (1-10)
  'The Fool-1-air': { name: 'The First Breath', symbol: '💨', description: 'Life without purpose' },
  'The Fool-2-air': { name: 'The Empty Dialogue', symbol: '💬', description: 'Words without meaning' },
  'The Fool-3-air': { name: 'The Laughing Wind', symbol: '🌪️', description: 'Joy in chaos' },
  'The Fool-4-air': { name: 'The Still Breeze', symbol: '🍃', description: 'Motion paused' },
  'The Fool-5-air': { name: 'The Arguing Echo', symbol: '📢', description: 'Fighting oneself' },
  'The Fool-6-air': { name: 'The Lucky Gust', symbol: '🌬️', description: 'Chance favors fools' },
  'The Fool-7-air': { name: 'The Windmill Tilt', symbol: '🌀', description: 'Fighting imagination' },
  'The Fool-8-air': { name: 'The Scattered Mind', symbol: '🌪️', description: 'Thoughts abandoned' },
  'The Fool-9-air': { name: 'The Final Jest', symbol: '💭', description: 'Last laugh' },
  'The Fool-10-air': { name: 'The Hurricane\'s Eye', symbol: '🌀', description: 'Calm in chaos' },
  
  // The Fool + Face cards
  'The Fool-J-fire': { name: 'The Wild Page', symbol: '📜', description: 'Messages of chaos' },
  'The Fool-Q-fire': { name: 'The Mad Queen', symbol: '👸', description: 'Passion unhinged' },
  'The Fool-K-fire': { name: 'The Anarchist King', symbol: '👑', description: 'Rule by chaos' },
  
  // The Lovers + Fire combinations
  'The Lovers-A-fire': { name: 'The Scorned Lover', symbol: '💔', description: 'Passion\'s first wound' },
  'The Lovers-2-fire': { name: 'The Passionate Dance', symbol: '💃', description: 'Love in balance' },
  'The Lovers-3-fire': { name: 'The Wedding Pyre', symbol: '🔥', description: 'Celebration of union' },
  'The Lovers-4-fire': { name: 'The Lonely Lover', symbol: '😢', description: 'Passion at rest' },
  'The Lovers-5-fire': { name: 'The Jealous Heart', symbol: '😠', description: 'Love\'s conflict' },
  'The Lovers-6-fire': { name: 'The Triumphant Union', symbol: '💑', description: 'Love victorious' },
  'The Lovers-7-fire': { name: 'The Devoted Guardian', symbol: '🛡️', description: 'Love defends' },
  'The Lovers-8-fire': { name: 'The Rushed Romance', symbol: '💨', description: 'Love in haste' },
  'The Lovers-9-fire': { name: 'The Eternal Flame', symbol: '🕯️', description: 'Love endures' },
  'The Lovers-10-fire': { name: 'The Heavy Heart', symbol: '💔', description: 'Love\'s burden' },
  
  // Death + Fire combinations (1-10)
  'Death-1-fire': { name: 'The Final Spark', symbol: '🔥', description: 'Life\'s last flame' },
  'Death-2-fire': { name: 'The Severed Bond', symbol: '💔', description: 'Partnership ends' },
  'Death-3-fire': { name: 'The Funeral Pyre', symbol: '🔥', description: 'Celebration becomes mourning' },
  'Death-4-fire': { name: 'The Eternal Rest', symbol: '⚰️', description: 'Peace through ending' },
  'Death-5-fire': { name: 'The Fatal Conflict', symbol: '⚔️', description: 'Fighting to the end' },
  'Death-6-fire': { name: 'The Pyrrhic End', symbol: '🏆', description: 'Victory in death' },
  'Death-7-fire': { name: 'The Last Stand', symbol: '🛡️', description: 'Defense until death' },
  'Death-8-fire': { name: 'The Swift End', symbol: '💨', description: 'Quick demise' },
  'Death-9-fire': { name: 'The Final Guardian', symbol: '🏰', description: 'Dying defender' },
  'Death-10-fire': { name: 'The Complete Burnout', symbol: '💀', description: 'Total exhaustion' },
  
  // Death + Water combinations (1-10)
  'Death-1-water': { name: 'The First Tear', symbol: '💧', description: 'Grief begins' },
  'Death-2-water': { name: 'The Final Meeting', symbol: '🤝', description: 'Last partnership' },
  'Death-3-water': { name: 'The Wake', symbol: '🍷', description: 'Mourning together' },
  'Death-4-water': { name: 'The Void\'s Echo', symbol: '🕳️', description: 'Emptiness reflects' },
  'Death-5-water': { name: 'The Bitter End', symbol: '☠️', description: 'Loss and regret' },
  'Death-6-water': { name: 'The Ferryman', symbol: '⛵', description: 'Crossing over' },
  'Death-7-water': { name: 'The Last Dream', symbol: '💭', description: 'Visions fade' },
  'Death-8-water': { name: 'The Abandoned Shore', symbol: '🏖️', description: 'Left behind' },
  'Death-9-water': { name: 'The Final Wish', symbol: '🌟', description: 'Last desires' },
  'Death-10-water': { name: 'The Cycle Complete', symbol: '🔄', description: 'End meets beginning' },
  
  // Death + Earth combinations (1-10)
  'Death-1-earth': { name: 'The First Grave', symbol: '⚰️', description: 'Beginning of end' },
  'Death-2-earth': { name: 'The Broken Ground', symbol: '🪦', description: 'Partnership buried' },
  'Death-3-earth': { name: 'The Harvest\'s End', symbol: '🌾', description: 'Abundance dies' },
  'Death-4-earth': { name: 'The Silent Stone', symbol: '🗿', description: 'Peaceful grave' },
  'Death-5-earth': { name: 'The Battlefield', symbol: '⚔️', description: 'Where many fell' },
  'Death-6-earth': { name: 'The Unmarked Grave', symbol: '🪦', description: 'Forgotten victory' },
  'Death-7-earth': { name: 'The Last Fortress', symbol: '🏰', description: 'Defense dies' },
  'Death-8-earth': { name: 'The Mass Exodus', symbol: '👣', description: 'All must leave' },
  'Death-9-earth': { name: 'The Ancient Tomb', symbol: '🏛️', description: 'Long solitude' },
  'Death-10-earth': { name: 'The Earth Reclaims', symbol: '🌍', description: 'Return to dust' },
  
  // Death + Air combinations (1-10)
  'Death-1-air': { name: 'The Last Breath', symbol: '💨', description: 'Life expires' },
  'Death-2-air': { name: 'The Final Words', symbol: '💬', description: 'Last conversation' },
  'Death-3-air': { name: 'The Silenced Laughter', symbol: '🤐', description: 'Joy dies' },
  'Death-4-air': { name: 'The Still Air', symbol: '🌫️', description: 'Breath stops' },
  'Death-5-air': { name: 'The Death Rattle', symbol: '💀', description: 'Final argument' },
  'Death-6-air': { name: 'The Ghost Ship', symbol: '⛵', description: 'Journey to nowhere' },
  'Death-7-air': { name: 'The Phantom Guard', symbol: '👻', description: 'Defending nothing' },
  'Death-8-air': { name: 'The Spirit\'s Flight', symbol: '🕊️', description: 'Soul departs' },
  'Death-9-air': { name: 'The Final Thought', symbol: '💭', description: 'Last idea' },
  'Death-10-air': { name: 'The Suffocation', symbol: '🌪️', description: 'Overwhelmed by end' },
  
  // Strength + Earth combinations
  'Strength-A-earth': { name: 'The Mountain\'s Heart', symbol: '⛰️', description: 'Solid foundation' },
  'Strength-2-earth': { name: 'The Steady Hand', symbol: '🤝', description: 'Reliable partnership' },
  'Strength-3-earth': { name: 'The Harvest Festival', symbol: '🌾', description: 'Abundance celebrated' },
  'Strength-4-earth': { name: 'The Guardian Stone', symbol: '🗿', description: 'Eternal watch' },
  'Strength-5-earth': { name: 'The Crumbling Pillar', symbol: '🏛️', description: 'Strength tested' },
  'Strength-6-earth': { name: 'The Provider', symbol: '🌱', description: 'Nurturing power' },
  'Strength-7-earth': { name: 'The Fortress', symbol: '🏰', description: 'Impenetrable defense' },
  'Strength-8-earth': { name: 'The Avalanche', symbol: '🏔️', description: 'Unstoppable momentum' },
  'Strength-9-earth': { name: 'The Ancient Oak', symbol: '🌳', description: 'Enduring might' },
  'Strength-10-earth': { name: 'The Atlas', symbol: '🌍', description: 'World bearer' },
  'Strength-J-earth': { name: 'The Young Titan', symbol: '💪', description: 'Growing power' },
  'Strength-Q-earth': { name: 'The Earth Mother', symbol: '👸', description: 'Nurturing strength' },
  'Strength-K-earth': { name: 'The Mountain King', symbol: '👑', description: 'Unshakeable rule' },
  
  // The Emperor + all suits
  'The Emperor-A-fire': { name: 'The Conquering Flame', symbol: '🔥', description: 'Authority ignites' },
  'The Emperor-K-fire': { name: 'The Warlord', symbol: '⚔️', description: 'Power through conflict' },
  'The Emperor-Q-fire': { name: 'The Iron Empress', symbol: '👸', description: 'Feminine authority' },
  'The Emperor-J-fire': { name: 'The Young Prince', symbol: '🤴', description: 'Heir to power' },
  'The Emperor-A-earth': { name: 'The Foundation Stone', symbol: '🏛️', description: 'Empire\'s beginning' },
  'The Emperor-K-earth': { name: 'The Sovereign', symbol: '👑', description: 'Absolute dominion' },
  'The Emperor-Q-earth': { name: 'The Matriarch', symbol: '👸', description: 'Nurturing rule' },
  'The Emperor-A-water': { name: 'The Naval Commander', symbol: '⚓', description: 'Seas under control' },
  'The Emperor-K-water': { name: 'The Ocean King', symbol: '🔱', description: 'Tides obey' },
  'The Emperor-A-air': { name: 'The Sky Lord', symbol: '🦅', description: 'Domain of heights' },
  'The Emperor-K-air': { name: 'The Storm King', symbol: '⛈️', description: 'Weather bends to will' },
  
  // The High Priestess + all suits
  'The High Priestess-A-water': { name: 'The First Intuition', symbol: '💧', description: 'Wisdom\'s source' },
  'The High Priestess-2-water': { name: 'The Sacred Union', symbol: '🤝', description: 'Mystical partnership' },
  'The High Priestess-3-water': { name: 'The Coven', symbol: '🌙', description: 'Sisterhood of secrets' },
  'The High Priestess-Q-water': { name: 'The Oracle Queen', symbol: '🔮', description: 'Prophecy embodied' },
  'The High Priestess-K-water': { name: 'The Mystic King', symbol: '👑', description: 'Hidden knowledge rules' },
  'The High Priestess-A-air': { name: 'The First Thought', symbol: '💭', description: 'Mind\'s awakening' },
  'The High Priestess-Q-air': { name: 'The Wise Woman', symbol: '🦉', description: 'Knowledge personified' },
  'The High Priestess-A-fire': { name: 'The Sacred Flame', symbol: '🕯️', description: 'Illuminated mysteries' },
  'The High Priestess-A-earth': { name: 'The Hidden Treasure', symbol: '💎', description: 'Buried wisdom' },
  
  // The Devil + all suits
  'The Devil-A-fire': { name: 'The First Sin', symbol: '🔥', description: 'Temptation ignites' },
  'The Devil-5-fire': { name: 'The Infernal Conflict', symbol: '👹', description: 'Demons battle' },
  'The Devil-7-fire': { name: 'The Hellguard', symbol: '🔱', description: 'Defending darkness' },
  'The Devil-K-fire': { name: 'The Demon King', symbol: '👹', description: 'Hell\'s throne' },
  'The Devil-Q-fire': { name: 'The Succubus Queen', symbol: '😈', description: 'Seductive power' },
  'The Devil-A-water': { name: 'The Poisoned Cup', symbol: '☠️', description: 'Corrupted emotions' },
  'The Devil-5-water': { name: 'The Bitter Draught', symbol: '🍷', description: 'Sorrow\'s addiction' },
  'The Devil-A-earth': { name: 'The Cursed Coin', symbol: '🪙', description: 'Greed\'s beginning' },
  'The Devil-K-earth': { name: 'The Plutocrat', symbol: '💰', description: 'Wealth corrupts absolutely' },
  'The Devil-A-air': { name: 'The Whispered Lie', symbol: '🐍', description: 'Deception\'s birth' },
  
  // The Tower + Fire combinations (1-10)
  'The Tower-1-fire': { name: 'The First Spark', symbol: '⚡', description: 'Destruction begins' },
  'The Tower-2-fire': { name: 'The Splitting Flame', symbol: '🔥', description: 'Division burns' },
  'The Tower-3-fire': { name: 'The Celebration\'s End', symbol: '💥', description: 'Joy becomes ash' },
  'The Tower-4-fire': { name: 'The Shattered Peace', symbol: '🏚️', description: 'Stability burns' },
  'The Tower-5-fire': { name: 'The Burning Revolt', symbol: '🔥', description: 'Chaos erupts' },
  'The Tower-6-fire': { name: 'The Pyrrhic Victory', symbol: '🏆', description: 'Win through loss' },
  'The Tower-7-fire': { name: 'The Fallen Defender', symbol: '🛡️', description: 'Protection fails' },
  'The Tower-8-fire': { name: 'The Rapid Collapse', symbol: '💨', description: 'Swift destruction' },
  'The Tower-9-fire': { name: 'The Final Bastion', symbol: '🏰', description: 'Last defense falls' },
  'The Tower-10-fire': { name: 'The Final Collapse', symbol: '💥', description: 'Complete destruction' },
  
  // The Tower + Water combinations (1-10)
  'The Tower-1-water': { name: 'The Breaking Dam', symbol: '🌊', description: 'Emotions unleashed' },
  'The Tower-2-water': { name: 'The Severed Bond', symbol: '💔', description: 'Partnership shattered' },
  'The Tower-3-water': { name: 'The Poisoned Well', symbol: '☠️', description: 'Celebration ruined' },
  'The Tower-4-water': { name: 'The Disrupted Flow', symbol: '🌊', description: 'Peace disturbed' },
  'The Tower-5-water': { name: 'The Bitter Flood', symbol: '😢', description: 'Sorrow overflows' },
  'The Tower-6-water': { name: 'The Shipwreck', symbol: '🚢', description: 'Journey ends badly' },
  'The Tower-7-water': { name: 'The Broken Dream', symbol: '💭', description: 'Illusions shattered' },
  'The Tower-8-water': { name: 'The Abandoned Shore', symbol: '🏖️', description: 'Left in ruins' },
  'The Tower-9-water': { name: 'The Last Tear', symbol: '💧', description: 'Final sorrow' },
  'The Tower-10-water': { name: 'The Tsunami', symbol: '🌊', description: 'Total emotional destruction' },
  
  // The Tower + Earth combinations (1-10)
  'The Tower-1-earth': { name: 'The First Crack', symbol: '💔', description: 'Foundation fails' },
  'The Tower-2-earth': { name: 'The Split Ground', symbol: '🏔️', description: 'Unity breaks' },
  'The Tower-3-earth': { name: 'The Ruined Harvest', symbol: '🌾', description: 'Abundance destroyed' },
  'The Tower-4-earth': { name: 'The Earthquake', symbol: '🏚️', description: 'Stability shattered' },
  'The Tower-5-earth': { name: 'The Landslide', symbol: '🏔️', description: 'Conflict buries all' },
  'The Tower-6-earth': { name: 'The Fool\'s Paradise Lost', symbol: '🏚️', description: 'False success crumbles' },
  'The Tower-7-earth': { name: 'The Siege\'s End', symbol: '🏰', description: 'Defenses fall' },
  'The Tower-8-earth': { name: 'The Exodus', symbol: '👣', description: 'Forced abandonment' },
  'The Tower-9-earth': { name: 'The Last Stone', symbol: '🗿', description: 'Final structure falls' },
  'The Tower-10-earth': { name: 'The Complete Ruin', symbol: '🏚️', description: 'Total material loss' },
  
  // The Tower + Air combinations (1-10)
  'The Tower-1-air': { name: 'The Shattered Mind', symbol: '🌪️', description: 'Sanity breaks' },
  'The Tower-2-air': { name: 'The Broken Word', symbol: '💬', description: 'Communication fails' },
  'The Tower-3-air': { name: 'The Silenced Joy', symbol: '🤐', description: 'Celebration stops' },
  'The Tower-4-air': { name: 'The Mental Break', symbol: '🧠', description: 'Thoughts fragment' },
  'The Tower-5-air': { name: 'The Screaming Wind', symbol: '🌪️', description: 'Arguments destroy' },
  'The Tower-6-air': { name: 'The False Victory', symbol: '💨', description: 'Success evaporates' },
  'The Tower-7-air': { name: 'The Shattered Shield', symbol: '🛡️', description: 'Mental defenses fail' },
  'The Tower-8-air': { name: 'The Scattered Thoughts', symbol: '🌪️', description: 'Ideas destroyed' },
  'The Tower-9-air': { name: 'The Final Word', symbol: '💭', description: 'Last thought before fall' },
  'The Tower-10-air': { name: 'The Mental Collapse', symbol: '🌀', description: 'Complete breakdown' },
  
  // The Tower + Wands combinations (1-10)
  'The Tower-1-wands': { name: 'The Broken Wand', symbol: '🔥', description: 'Power shattered' },
  'The Tower-2-wands': { name: 'The Severed Alliance', symbol: '🤝', description: 'Partnership burns' },
  'The Tower-3-wands': { name: 'The Failed Enterprise', symbol: '📉', description: 'Plans collapse' },
  'The Tower-4-wands': { name: 'The Ruined Celebration', symbol: '🎉', description: 'Joy destroyed' },
  'The Tower-5-wands': { name: 'The Escalated Conflict', symbol: '⚔️', description: 'Fighting intensifies' },
  'The Tower-6-wands': { name: 'The False Triumph', symbol: '🏆', description: 'Victory crumbles' },
  'The Tower-7-wands': { name: 'The Overwhelmed Defense', symbol: '🛡️', description: 'Stand fails' },
  'The Tower-8-wands': { name: 'The Halted Message', symbol: '📨', description: 'News brings ruin' },
  'The Tower-9-wands': { name: 'The Final Defense', symbol: '🏰', description: 'Last stand falls' },
  'The Tower-10-wands': { name: 'The Crushing Burden', symbol: '⛓️', description: 'Weight destroys' },
  
  // The Tower + Cups combinations (1-10)
  'The Tower-1-cups': { name: 'The Shattered Heart', symbol: '💔', description: 'Love destroyed' },
  'The Tower-2-cups': { name: 'The Broken Bond', symbol: '💔', description: 'Union severed' },
  'The Tower-3-cups': { name: 'The Party\'s End', symbol: '🍷', description: 'Celebration ruined' },
  'The Tower-4-cups': { name: 'The Awakening Shock', symbol: '😱', description: 'Apathy shattered' },
  'The Tower-5-cups': { name: 'The Deepened Loss', symbol: '😢', description: 'Grief multiplied' },
  'The Tower-6-cups': { name: 'The Lost Innocence', symbol: '👶', description: 'Childhood ends' },
  'The Tower-7-cups': { name: 'The Shattered Illusion', symbol: '💭', description: 'Dreams destroyed' },
  'The Tower-8-cups': { name: 'The Forced Departure', symbol: '🚪', description: 'Must abandon all' },
  'The Tower-9-cups': { name: 'The Ruined Wish', symbol: '⭐', description: 'Happiness lost' },
  'The Tower-10-cups': { name: 'The Family Tragedy', symbol: '🏠', description: 'Home destroyed' },
  
  // The Tower + Swords combinations (1-10)
  'The Tower-1-swords': { name: 'The Blade Fortress', symbol: '🗡️', description: 'Mental breakthrough' },
  'The Tower-2-swords': { name: 'The Forced Decision', symbol: '⚖️', description: 'Choice destroyed' },
  'The Tower-3-swords': { name: 'The Deepest Cut', symbol: '💔', description: 'Heartbreak intensified' },
  'The Tower-4-swords': { name: 'The Rude Awakening', symbol: '⏰', description: 'Rest shattered' },
  'The Tower-5-swords': { name: 'The Pyrrhic Defeat', symbol: '⚔️', description: 'Loss upon loss' },
  'The Tower-6-swords': { name: 'The Crashed Journey', symbol: '🚢', description: 'Escape fails' },
  'The Tower-7-swords': { name: 'The Exposed Thief', symbol: '🦹', description: 'Deception revealed' },
  'The Tower-8-swords': { name: 'The Prison Break', symbol: '⛓️', description: 'Bondage shattered' },
  'The Tower-9-swords': { name: 'The Nightmare Reality', symbol: '😱', description: 'Fears manifest' },
  'The Tower-10-swords': { name: 'The Final Blow', symbol: '⚔️', description: 'Utter defeat' },
  
  // The Tower + Pentacles combinations (1-10)
  'The Tower-1-pentacles': { name: 'The Lost Fortune', symbol: '💰', description: 'Wealth destroyed' },
  'The Tower-2-pentacles': { name: 'The Imbalanced Fall', symbol: '⚖️', description: 'Juggling fails' },
  'The Tower-3-pentacles': { name: 'The Collapsed Project', symbol: '🏗️', description: 'Work ruined' },
  'The Tower-4-pentacles': { name: 'The Forced Release', symbol: '🤲', description: 'Must let go' },
  'The Tower-5-pentacles': { name: 'The Complete Ruin', symbol: '🏚️', description: 'Total poverty' },
  'The Tower-6-pentacles': { name: 'The Charity\'s End', symbol: '🤲', description: 'Giving stops' },
  'The Tower-7-pentacles': { name: 'The Wasted Effort', symbol: '🌱', description: 'Work for nothing' },
  'The Tower-8-pentacles': { name: 'The Craft Destroyed', symbol: '🔨', description: 'Skills useless' },
  'The Tower-9-pentacles': { name: 'The Lost Paradise', symbol: '🏡', description: 'Comfort ends' },
  'The Tower-10-pentacles': { name: 'The Dynasty\'s Fall', symbol: '👑', description: 'Legacy ruined' },
  
  // The Tower + Face cards  
  'The Tower-J-wands': { name: 'The Fallen Messenger', symbol: '📜', description: 'Bad news arrives' },
  'The Tower-Q-wands': { name: 'The Dethroned Queen', symbol: '👸', description: 'Passion overthrown' },
  'The Tower-K-wands': { name: 'The Conquered King', symbol: '👑', description: 'Leadership fails' },
  'The Tower-J-cups': { name: 'The Broken Heart', symbol: '💔', description: 'Young love ends' },
  'The Tower-Q-cups': { name: 'The Fallen Empress', symbol: '👸', description: 'Emotion overwhelms' },
  'The Tower-K-cups': { name: 'The Drowned King', symbol: '🌊', description: 'Feelings destroy' },
  'The Tower-J-swords': { name: 'The Failed Spy', symbol: '🕵️', description: 'Schemes exposed' },
  'The Tower-Q-swords': { name: 'The Mad Queen', symbol: '👸', description: 'Logic breaks' },
  'The Tower-K-swords': { name: 'The Tyrant\'s End', symbol: '⚔️', description: 'Justice arrives' },
  'The Tower-J-pentacles': { name: 'The Ruined Student', symbol: '📚', description: 'Learning stops' },
  'The Tower-Q-pentacles': { name: 'The Bankrupt Queen', symbol: '👸', description: 'Wealth vanishes' },
  'The Tower-K-pentacles': { name: 'The Midas Curse', symbol: '💰', description: 'Gold becomes ash' },
  'The Tower-K-fire': { name: 'The Fallen King', symbol: '👑', description: 'Power toppled' },
  'The Tower-K-earth': { name: 'The Ruined Kingdom', symbol: '🏚️', description: 'Empire\'s end' },
  
  // The Star + all suits
  'The Star-A-water': { name: 'The Wishing Well', symbol: '⭐', description: 'Hope\'s source' },
  'The Star-3-water': { name: 'The Celebration of Dreams', symbol: '🎉', description: 'Joy and hope unite' },
  'The Star-9-water': { name: 'The Granted Wish', symbol: '🌟', description: 'Dreams fulfilled' },
  'The Star-Q-water': { name: 'The Star Maiden', symbol: '👸', description: 'Hope personified' },
  'The Star-A-air': { name: 'The First Inspiration', symbol: '💫', description: 'Ideas dawn' },
  'The Star-K-air': { name: 'The Visionary King', symbol: '👑', description: 'Dreams guide rule' },
  'The Star-A-fire': { name: 'The Guiding Light', symbol: '🌟', description: 'Hope\'s beacon' },
  'The Star-A-earth': { name: 'The Lucky Penny', symbol: '🪙', description: 'Fortune\'s favor' },
  
  // The Moon + all suits
  'The Moon-A-water': { name: 'The First Nightmare', symbol: '🌙', description: 'Fear begins' },
  'The Moon-2-water': { name: 'The Haunted Lovers', symbol: '👻', description: 'Illusion in partnership' },
  'The Moon-7-water': { name: 'The Dream Guardian', symbol: '🛡️', description: 'Protecting sleep' },
  'The Moon-9-water': { name: 'The Prophetic Dream', symbol: '🔮', description: 'Visions manifest' },
  'The Moon-Q-water': { name: 'The Lunar Queen', symbol: '👸', description: 'Mistress of illusions' },
  'The Moon-K-water': { name: 'The Nightmare King', symbol: '👑', description: 'Lord of dreams' },
  'The Moon-A-air': { name: 'The Mad Thought', symbol: '🌀', description: 'Confusion\'s seed' },
  'The Moon-A-fire': { name: 'The Witch\'s Fire', symbol: '🔥', description: 'Supernatural flame' },
  'The Moon-A-earth': { name: 'The Buried Secret', symbol: '⚰️', description: 'Hidden truths' },
  
  // The Sun + Fire combinations (1-10)
  'The Sun-1-fire': { name: 'The Dawn\'s First Light', symbol: '🌅', description: 'New day begins' },
  'The Sun-2-fire': { name: 'The Radiant Partnership', symbol: '☀️', description: 'Joy shared' },
  'The Sun-3-fire': { name: 'The Solar Festival', symbol: '🎊', description: 'Joy multiplied' },
  'The Sun-4-fire': { name: 'The Peaceful Glow', symbol: '🌞', description: 'Contentment shines' },
  'The Sun-5-fire': { name: 'The Blazing Contest', symbol: '🔥', description: 'Competition in light' },
  'The Sun-6-fire': { name: 'The Victorious Dawn', symbol: '🏆', description: 'Success illuminated' },
  'The Sun-7-fire': { name: 'The Guardian Sun', symbol: '🛡️', description: 'Protection through light' },
  'The Sun-8-fire': { name: 'The Swift Sunrise', symbol: '🌅', description: 'Quick enlightenment' },
  'The Sun-9-fire': { name: 'The Eternal Day', symbol: '☀️', description: 'Light endures' },
  'The Sun-10-fire': { name: 'The Solar Crown', symbol: '👑', description: 'Burden of brilliance' },
  
  // The Sun + Water combinations (1-10)
  'The Sun-1-water': { name: 'The Rainbow', symbol: '🌈', description: 'Joy after tears' },
  'The Sun-2-water': { name: 'The Sparkling Union', symbol: '💑', description: 'Love in light' },
  'The Sun-3-water': { name: 'The Beach Party', symbol: '🏖️', description: 'Joy by water' },
  'The Sun-4-water': { name: 'The Reflection Pool', symbol: '💧', description: 'Peace mirrors joy' },
  'The Sun-5-water': { name: 'The Evaporating Tears', symbol: '☀️', description: 'Sorrow dried' },
  'The Sun-6-water': { name: 'The Sunny Voyage', symbol: '⛵', description: 'Blessed journey' },
  'The Sun-7-water': { name: 'The Clear Vision', symbol: '🔮', description: 'Illusions dispelled' },
  'The Sun-8-water': { name: 'The Tide Retreat', symbol: '🌊', description: 'Waters recede' },
  'The Sun-9-water': { name: 'The Fountain of Joy', symbol: '⛲', description: 'Happiness flows' },
  'The Sun-10-water': { name: 'The Ocean Mirror', symbol: '🌊', description: 'Joy reflects endlessly' },
  
  // The Sun + Earth combinations (1-10)
  'The Sun-1-earth': { name: 'The Golden Seed', symbol: '🌻', description: 'Prosperity planted' },
  'The Sun-2-earth': { name: 'The Fertile Partnership', symbol: '🤝', description: 'Growth together' },
  'The Sun-3-earth': { name: 'The Harvest Dance', symbol: '🌾', description: 'Abundance celebrated' },
  'The Sun-4-earth': { name: 'The Garden Paradise', symbol: '🏡', description: 'Peaceful growth' },
  'The Sun-5-earth': { name: 'The Drought', symbol: '🏜️', description: 'Too much sun' },
  'The Sun-6-earth': { name: 'The Bountiful Garden', symbol: '🌻', description: 'Success blooms' },
  'The Sun-7-earth': { name: 'The Greenhouse', symbol: '🏡', description: 'Protected growth' },
  'The Sun-8-earth': { name: 'The Quick Bloom', symbol: '🌺', description: 'Rapid flowering' },
  'The Sun-9-earth': { name: 'The Golden Field', symbol: '🌾', description: 'Endless abundance' },
  'The Sun-10-earth': { name: 'The Midas Touch', symbol: '👑', description: 'Everything turns gold' },
  
  // The Sun + Air combinations (1-10)
  'The Sun-1-air': { name: 'The Clear Sky', symbol: '☀️', description: 'Clarity dawns' },
  'The Sun-2-air': { name: 'The Bright Conversation', symbol: '💬', description: 'Clear communication' },
  'The Sun-3-air': { name: 'The Joyful Song', symbol: '🎵', description: 'Happiness expressed' },
  'The Sun-4-air': { name: 'The Calm Breeze', symbol: '🍃', description: 'Peaceful thoughts' },
  'The Sun-5-air': { name: 'The Heated Debate', symbol: '🔥', description: 'Arguments in light' },
  'The Sun-6-air': { name: 'The Victory Cry', symbol: '📢', description: 'Success announced' },
  'The Sun-7-air': { name: 'The Clear Mind', symbol: '🧠', description: 'Mental protection' },
  'The Sun-8-air': { name: 'The Quick Insight', symbol: '💡', description: 'Fast understanding' },
  'The Sun-9-air': { name: 'The Endless Day', symbol: '☀️', description: 'Clarity continues' },
  'The Sun-10-air': { name: 'The Blinding Light', symbol: '🌞', description: 'Too much clarity' },

  // The Sun + Wands combinations (1-10)
  'The Sun-1-wands': { name: 'The Solar Wand', symbol: '☀️', description: 'Creative dawn' },
  'The Sun-2-wands': { name: 'The Bright Path', symbol: '🛤️', description: 'Clear choices' },
  'The Sun-3-wands': { name: 'The Expanding Light', symbol: '🌅', description: 'Horizons brighten' },
  'The Sun-4-wands': { name: 'The Summer Festival', symbol: '🎊', description: 'Pure celebration' },
  'The Sun-5-wands': { name: 'The Playful Contest', symbol: '🤺', description: 'Joyful competition' },
  'The Sun-6-wands': { name: 'The Victory Parade', symbol: '🎉', description: 'Success celebrated' },
  'The Sun-7-wands': { name: 'The Bright Defense', symbol: '🛡️', description: 'Optimistic stand' },
  'The Sun-8-wands': { name: 'The Speed of Light', symbol: '💫', description: 'Swift joy' },
  'The Sun-9-wands': { name: 'The Last Light', symbol: '🌇', description: 'Joy persists' },
  'The Sun-10-wands': { name: 'The Heavy Crown', symbol: '👑', description: 'Joyful burden' },

  // The Sun + Cups combinations (1-10)
  'The Sun-1-cups': { name: 'The Cup of Joy', symbol: '🏆', description: 'Happiness begins' },
  'The Sun-2-cups': { name: 'The Sunny Union', symbol: '💑', description: 'Love in light' },
  'The Sun-3-cups': { name: 'The Celebration', symbol: '🥂', description: 'Shared happiness' },
  'The Sun-4-cups': { name: 'The Bright Apathy', symbol: '😑', description: 'Too much good' },
  'The Sun-5-cups': { name: 'The Dried Tears', symbol: '☀️', description: 'Grief fades' },
  'The Sun-6-cups': { name: 'The Childhood Sun', symbol: '🌞', description: 'Innocent joy' },
  'The Sun-7-cups': { name: 'The Clear Choice', symbol: '🌈', description: 'Illusions vanish' },
  'The Sun-8-cups': { name: 'The Daybreak Journey', symbol: '🚶', description: 'Leaving darkness' },
  'The Sun-9-cups': { name: 'The Perfect Day', symbol: '🌟', description: 'Wishes fulfilled' },
  'The Sun-10-cups': { name: 'The Family Picnic', symbol: '👨‍👩‍👧‍👦', description: 'Complete joy' },

  // The Sun + Swords combinations (1-10)
  'The Sun-1-swords': { name: 'The Brilliant Mind', symbol: '💡', description: 'Clear thinking' },
  'The Sun-2-swords': { name: 'The Clear Decision', symbol: '⚖️', description: 'Choice illuminated' },
  'The Sun-3-swords': { name: 'The Healing Light', symbol: '🌞', description: 'Pain fades' },
  'The Sun-4-swords': { name: 'The Peaceful Rest', symbol: '😌', description: 'Calm clarity' },
  'The Sun-5-swords': { name: 'The Exposed Victory', symbol: '⚔️', description: 'Truth of conflict' },
  'The Sun-6-swords': { name: 'The Bright Passage', symbol: '⛵', description: 'Clear sailing' },
  'The Sun-7-swords': { name: 'The Caught Thief', symbol: '🌞', description: 'Deception revealed' },
  'The Sun-8-swords': { name: 'The Liberation', symbol: '🔓', description: 'Freedom dawns' },
  'The Sun-9-swords': { name: 'The Morning After', symbol: '🌅', description: 'Nightmares end' },
  'The Sun-10-swords': { name: 'The New Dawn', symbol: '🌄', description: 'After darkness' },

  // The Sun + Pentacles combinations (1-10)
  'The Sun-1-pentacles': { name: 'The Golden Dawn', symbol: '🌅', description: 'New wealth rises' },
  'The Sun-2-pentacles': { name: 'The Balanced Light', symbol: '⚖️', description: 'Harmony in abundance' },
  'The Sun-3-pentacles': { name: 'The Radiant Workshop', symbol: '🏗️', description: 'Joy in creation' },
  'The Sun-4-pentacles': { name: 'The Solar Vault', symbol: '🏰', description: 'Secured happiness' },
  'The Sun-5-pentacles': { name: 'The Harsh Daylight', symbol: '🌞', description: 'Truth reveals loss' },
  'The Sun-6-pentacles': { name: 'The Generous Sun', symbol: '☀️', description: 'Warmth shared freely' },
  'The Sun-7-pentacles': { name: 'The Patient Light', symbol: '🌻', description: 'Growth awaits' },
  'The Sun-8-pentacles': { name: 'The Apprentice\'s Joy', symbol: '⚒️', description: 'Happy in craft' },
  'The Sun-9-pentacles': { name: 'The Garden of Light', symbol: '🌺', description: 'Luxurious joy' },
  'The Sun-10-pentacles': { name: 'The Solar Dynasty', symbol: '👑', description: 'Inherited joy' },

  // The Moon + Fire combinations (1-10)
  'The Moon-1-fire': { name: 'The Lunar Spark', symbol: '🌙', description: 'Dreams ignite' },
  'The Moon-2-fire': { name: 'The Reflected Flame', symbol: '🔥', description: 'Illusions burn' },
  'The Moon-3-fire': { name: 'The Midnight Torch', symbol: '🕯️', description: 'Light in darkness' },
  'The Moon-4-fire': { name: 'The Dream Hearth', symbol: '🏠', description: 'Comfort in mystery' },
  'The Moon-5-fire': { name: 'The Howling Flame', symbol: '🐺', description: 'Primal fears' },
  'The Moon-6-fire': { name: 'The Astral Fire', symbol: '✨', description: 'Transcendent dreams' },
  'The Moon-7-fire': { name: 'The Mystic Blaze', symbol: '🔮', description: 'Hidden truths burn' },
  'The Moon-8-fire': { name: 'The Lunar Forge', symbol: '🌒', description: 'Dreams take shape' },
  'The Moon-9-fire': { name: 'The Solitary Flame', symbol: '🌘', description: 'Alone with visions' },
  'The Moon-10-fire': { name: 'The Nightmare\'s End', symbol: '🌅', description: 'Dawn breaks illusion' },

  // The Moon + Water combinations (1-10)
  'The Moon-1-water': { name: 'The First Tide', symbol: '🌊', description: 'Emotions rise' },
  'The Moon-2-water': { name: 'The Lunar Reflection', symbol: '🌙', description: 'Mirrored feelings' },
  'The Moon-3-water': { name: 'The Dreaming Waters', symbol: '💫', description: 'Creative flow' },
  'The Moon-4-water': { name: 'The Still Pool', symbol: '🌑', description: 'Deep contemplation' },
  'The Moon-5-water': { name: 'The Turbulent Dream', symbol: '🌪️', description: 'Emotional chaos' },
  'The Moon-6-water': { name: 'The Healing Spring', symbol: '💧', description: 'Dreams restore' },
  'The Moon-7-water': { name: 'The Mystic Lake', symbol: '🔮', description: 'Visions surface' },
  'The Moon-8-water': { name: 'The Moonlit Shore', symbol: '🏖️', description: 'Working with tides' },
  'The Moon-9-water': { name: 'The Dream Ocean', symbol: '🌊', description: 'Vast subconscious' },
  'The Moon-10-water': { name: 'The Cosmic Sea', symbol: '🌌', description: 'Universal dreams' },

  // The Moon + Earth combinations (1-10)
  'The Moon-1-earth': { name: 'The Moonstone', symbol: '💎', description: 'Dreams crystallize' },
  'The Moon-2-earth': { name: 'The Night Garden', symbol: '🌺', description: 'Balance in shadow' },
  'The Moon-3-earth': { name: 'The Dream Builder', symbol: '🏗️', description: 'Manifesting visions' },
  'The Moon-4-earth': { name: 'The Lunar Cave', symbol: '🏔️', description: 'Deep security' },
  'The Moon-5-earth': { name: 'The Barren Night', symbol: '🌑', description: 'Material fears' },
  'The Moon-6-earth': { name: 'The Nocturnal Harvest', symbol: '🌾', description: 'Dreams bear fruit' },
  'The Moon-7-earth': { name: 'The Patient Shadow', symbol: '⏳', description: 'Time reveals' },
  'The Moon-8-earth': { name: 'The Night Craftsman', symbol: '🔨', description: 'Working in dreams' },
  'The Moon-9-earth': { name: 'The Moonlit Grove', symbol: '🌳', description: 'Natural mysteries' },
  'The Moon-10-earth': { name: 'The Ancestral Dream', symbol: '👻', description: 'Legacy of visions' },

  // The Moon + Air combinations (1-10)
  'The Moon-1-air': { name: 'The Dream Whisper', symbol: '💭', description: 'New thoughts arise' },
  'The Moon-2-air': { name: 'The Lunar Dialogue', symbol: '🌙', description: 'Inner conversation' },
  'The Moon-3-air': { name: 'The Night Wind', symbol: '🌬️', description: 'Dreams scatter' },
  'The Moon-4-air': { name: 'The Mental Fog', symbol: '🌫️', description: 'Thoughts unclear' },
  'The Moon-5-air': { name: 'The Howling Mind', symbol: '🐺', description: 'Mental turmoil' },
  'The Moon-6-air': { name: 'The Dream Journey', symbol: '✈️', description: 'Astral travel' },
  'The Moon-7-air': { name: 'The Psychic Wind', symbol: '🔮', description: 'Intuitive thoughts' },
  'The Moon-8-air': { name: 'The Night Scholar', symbol: '📚', description: 'Dream studies' },
  'The Moon-9-air': { name: 'The Solitary Thought', symbol: '💭', description: 'Deep reflection' },
  'The Moon-10-air': { name: 'The Collective Dream', symbol: '🌐', description: 'Shared visions' },

  // The Moon + Wands combinations (1-10)
  'The Moon-1-wands': { name: 'The Dreamer\'s Wand', symbol: '🌙', description: 'Vision begins' },
  'The Moon-2-wands': { name: 'The Lunar Path', symbol: '🛤️', description: 'Choose the dream' },
  'The Moon-3-wands': { name: 'The Night Voyage', symbol: '⛵', description: 'Dreams expand' },
  'The Moon-4-wands': { name: 'The Dream Festival', symbol: '🎭', description: 'Celebrating mystery' },
  'The Moon-5-wands': { name: 'The Shadow Battle', symbol: '⚔️', description: 'Fighting illusions' },
  'The Moon-6-wands': { name: 'The Triumphant Dream', symbol: '🏆', description: 'Vision achieved' },
  'The Moon-7-wands': { name: 'The Guardian of Dreams', symbol: '🛡️', description: 'Defending visions' },
  'The Moon-8-wands': { name: 'The Swift Dream', symbol: '💫', description: 'Rapid visions' },
  'The Moon-9-wands': { name: 'The Weary Dreamer', symbol: '😴', description: 'Almost awakened' },
  'The Moon-10-wands': { name: 'The Dream Burden', symbol: '🎭', description: 'Heavy visions' },

  // The Moon + Cups combinations (1-10)
  'The Moon-1-cups': { name: 'The Lunar Chalice', symbol: '🏆', description: 'Dreams overflow' },
  'The Moon-2-cups': { name: 'The Soul Mirror', symbol: '💑', description: 'Reflected emotions' },
  'The Moon-3-cups': { name: 'The Dream Circle', symbol: '🌙', description: 'Shared visions' },
  'The Moon-4-cups': { name: 'The Melancholy Moon', symbol: '😔', description: 'Dreams unfulfilled' },
  'The Moon-5-cups': { name: 'The Spilled Dreams', symbol: '💧', description: 'Visions lost' },
  'The Moon-6-cups': { name: 'The Memory Moon', symbol: '🌒', description: 'Past resurfaces' },
  'The Moon-7-cups': { name: 'The Illusory Choice', symbol: '🎭', description: 'Dreams or reality' },
  'The Moon-8-cups': { name: 'The Dream Seeker', symbol: '🚶', description: 'Leaving for visions' },
  'The Moon-9-cups': { name: 'The Wish Moon', symbol: '🌟', description: 'Dreams manifest' },
  'The Moon-10-cups': { name: 'The Family Dream', symbol: '👨‍👩‍👧‍👦', description: 'Collective vision' },

  // The Moon + Swords combinations (1-10)
  'The Moon-1-swords': { name: 'The Dream Blade', symbol: '🗡️', description: 'Cutting illusion' },
  'The Moon-2-swords': { name: 'The Blind Choice', symbol: '⚖️', description: 'Decisions in darkness' },
  'The Moon-3-swords': { name: 'The Nightmare\'s Edge', symbol: '💔', description: 'Dreams that wound' },
  'The Moon-4-swords': { name: 'The Restless Sleep', symbol: '😴', description: 'No peace in dreams' },
  'The Moon-5-swords': { name: 'The Shadow Victory', symbol: '⚔️', description: 'Hollow triumph' },
  'The Moon-6-swords': { name: 'The Dream Passage', symbol: '⛵', description: 'Navigating visions' },
  'The Moon-7-swords': { name: 'The Dream Thief', symbol: '🦹', description: 'Stealing visions' },
  'The Moon-8-swords': { name: 'The Bound Dreamer', symbol: '🔗', description: 'Trapped in illusion' },
  'The Moon-9-swords': { name: 'The Darkest Hour', symbol: '😰', description: 'Nightmares peak' },
  'The Moon-10-swords': { name: 'The Dream\'s End', symbol: '🌅', description: 'Awakening dawns' },

  // The Moon + Pentacles combinations (1-10)
  'The Moon-1-pentacles': { name: 'The Dream Coin', symbol: '🪙', description: 'Visions of wealth' },
  'The Moon-2-pentacles': { name: 'The Lunar Balance', symbol: '⚖️', description: 'Dreams and reality' },
  'The Moon-3-pentacles': { name: 'The Night Mason', symbol: '🏗️', description: 'Building dreams' },
  'The Moon-4-pentacles': { name: 'The Hoarded Dream', symbol: '💰', description: 'Clinging to visions' },
  'The Moon-5-pentacles': { name: 'The Cold Night', symbol: '❄️', description: 'Dreams of loss' },
  'The Moon-6-pentacles': { name: 'The Dream Gift', symbol: '🎁', description: 'Sharing visions' },
  'The Moon-7-pentacles': { name: 'The Patient Dream', symbol: '🌱', description: 'Visions grow slowly' },
  'The Moon-8-pentacles': { name: 'The Dream Craft', symbol: '🔨', description: 'Perfecting visions' },
  'The Moon-9-pentacles': { name: 'The Luxurious Dream', symbol: '💎', description: 'Rich visions' },
  'The Moon-10-pentacles': { name: 'The Ancestral Vision', symbol: '🏰', description: 'Dreams inherited' },

  // The Star + Fire combinations (1-10)
  'The Star-1-fire': { name: 'The First Wish', symbol: '⭐', description: 'Hope ignites' },
  'The Star-2-fire': { name: 'The Twin Stars', symbol: '✨', description: 'Shared hope' },
  'The Star-3-fire': { name: 'The Celebration Star', symbol: '🌟', description: 'Hope multiplied' },
  'The Star-4-fire': { name: 'The Steady Light', symbol: '⭐', description: 'Stable inspiration' },
  'The Star-5-fire': { name: 'The Competing Lights', symbol: '💫', description: 'Hopes clash' },
  'The Star-6-fire': { name: 'The Victorious Star', symbol: '🌟', description: 'Hope triumphs' },
  'The Star-7-fire': { name: 'The Guiding Star', symbol: '⭐', description: 'Hope defends' },
  'The Star-8-fire': { name: 'The Shooting Star', symbol: '💫', description: 'Swift inspiration' },
  'The Star-9-fire': { name: 'The Eternal Star', symbol: '✨', description: 'Hope endures' },
  'The Star-10-fire': { name: 'The Star Burden', symbol: '🌟', description: 'Heavy expectations' },

  // The Star + Water combinations (1-10)
  'The Star-1-water': { name: 'The Wishing Well', symbol: '💧', description: 'Hope flows' },
  'The Star-2-water': { name: 'The Reflected Stars', symbol: '🌟', description: 'Love\'s hope' },
  'The Star-3-water': { name: 'The Starlit Pool', symbol: '💫', description: 'Shared dreams' },
  'The Star-4-water': { name: 'The Still Waters', symbol: '⭐', description: 'Quiet hope' },
  'The Star-5-water': { name: 'The Fallen Star', symbol: '💧', description: 'Hope spilled' },
  'The Star-6-water': { name: 'The Star Stream', symbol: '🌊', description: 'Hope\'s journey' },
  'The Star-7-water': { name: 'The Constellation', symbol: '✨', description: 'Many hopes' },
  'The Star-8-water': { name: 'The Star Seeker', symbol: '🚶', description: 'Following hope' },
  'The Star-9-water': { name: 'The Wish Fulfilled', symbol: '🌟', description: 'Hope realized' },
  'The Star-10-water': { name: 'The Cosmic Ocean', symbol: '🌌', description: 'Universal hope' },

  // The Star + Earth combinations (1-10)
  'The Star-1-earth': { name: 'The Star Seed', symbol: '🌱', description: 'Hope planted' },
  'The Star-2-earth': { name: 'The Balanced Hope', symbol: '⚖️', description: 'Grounded dreams' },
  'The Star-3-earth': { name: 'The Star Garden', symbol: '🌺', description: 'Hope cultivated' },
  'The Star-4-earth': { name: 'The Stone Star', symbol: '💎', description: 'Solid hope' },
  'The Star-5-earth': { name: 'The Barren Sky', symbol: '🏜️', description: 'Hope challenged' },
  'The Star-6-earth': { name: 'The Harvest Star', symbol: '🌾', description: 'Hope bears fruit' },
  'The Star-7-earth': { name: 'The Patient Star', symbol: '⏳', description: 'Hope waits' },
  'The Star-8-earth': { name: 'The Star Smith', symbol: '⚒️', description: 'Crafting hope' },
  'The Star-9-earth': { name: 'The Abundant Star', symbol: '💰', description: 'Hope prospers' },
  'The Star-10-earth': { name: 'The Star Legacy', symbol: '🏰', description: 'Hope inherited' },

  // The Star + Air combinations (1-10)
  'The Star-1-air': { name: 'The First Breath', symbol: '💨', description: 'Hope begins' },
  'The Star-2-air': { name: 'The Star Dialogue', symbol: '💬', description: 'Hope shared' },
  'The Star-3-air': { name: 'The Star Song', symbol: '🎵', description: 'Hope expressed' },
  'The Star-4-air': { name: 'The Clear Night', symbol: '🌟', description: 'Peaceful hope' },
  'The Star-5-air': { name: 'The Star Storm', symbol: '🌪️', description: 'Hope tested' },
  'The Star-6-air': { name: 'The Star Message', symbol: '📨', description: 'Hope travels' },
  'The Star-7-air': { name: 'The Star Vision', symbol: '👁️', description: 'Hope seen clearly' },
  'The Star-8-air': { name: 'The Swift Star', symbol: '💫', description: 'Hope arrives quickly' },
  'The Star-9-air': { name: 'The Lone Star', symbol: '⭐', description: 'Solitary hope' },
  'The Star-10-air': { name: 'The Star Network', symbol: '🌐', description: 'Connected hopes' },

  // The Star + Wands combinations (1-10)
  'The Star-1-wands': { name: 'The Wishing Wand', symbol: '🌟', description: 'Hope\'s tool' },
  'The Star-2-wands': { name: 'The Star Path', symbol: '✨', description: 'Hope\'s direction' },
  'The Star-3-wands': { name: 'The Star Horizon', symbol: '🌅', description: 'Hope expands' },
  'The Star-4-wands': { name: 'The Star Celebration', symbol: '🎊', description: 'Hope rejoices' },
  'The Star-5-wands': { name: 'The Star Conflict', symbol: '⚔️', description: 'Hopes compete' },
  'The Star-6-wands': { name: 'The Star Victory', symbol: '🏆', description: 'Hope wins' },
  'The Star-7-wands': { name: 'The Star Guardian', symbol: '🛡️', description: 'Hope protected' },
  'The Star-8-wands': { name: 'The Meteor', symbol: '☄️', description: 'Hope speeds' },
  'The Star-9-wands': { name: 'The Weary Star', symbol: '😔', description: 'Hope persists' },
  'The Star-10-wands': { name: 'The Star Atlas', symbol: '🗺️', description: 'Many hopes carried' },

  // The Star + Cups combinations (1-10)
  'The Star-1-cups': { name: 'The Star Chalice', symbol: '🏆', description: 'Hope overflows' },
  'The Star-2-cups': { name: 'The Star Lovers', symbol: '💑', description: 'Hopeful union' },
  'The Star-3-cups': { name: 'The Star Circle', symbol: '🌟', description: 'Hopes shared' },
  'The Star-4-cups': { name: 'The Dimmed Star', symbol: '😔', description: 'Hope overlooked' },
  'The Star-5-cups': { name: 'The Lost Star', symbol: '💧', description: 'Hope grieved' },
  'The Star-6-cups': { name: 'The Childhood Star', symbol: '⭐', description: 'Innocent hope' },
  'The Star-7-cups': { name: 'The Star Dream', symbol: '💭', description: 'Hope\'s illusion' },
  'The Star-8-cups': { name: 'The Star Quest', symbol: '🚶', description: 'Seeking hope' },
  'The Star-9-cups': { name: 'The Star Wish', symbol: '🌠', description: 'Hope granted' },
  'The Star-10-cups': { name: 'The Star Family', symbol: '👨‍👩‍👧‍👦', description: 'Collective hope' },

  // The Star + Swords combinations (1-10)
  'The Star-1-swords': { name: 'The Star Blade', symbol: '⚔️', description: 'Hope cuts through' },
  'The Star-2-swords': { name: 'The Star Choice', symbol: '⚖️', description: 'Hope decides' },
  'The Star-3-swords': { name: 'The Pierced Star', symbol: '💔', description: 'Hope wounded' },
  'The Star-4-swords': { name: 'The Star Rest', symbol: '😴', description: 'Hope recovers' },
  'The Star-5-swords': { name: 'The Stolen Star', symbol: '🌟', description: 'Hope taken' },
  'The Star-6-swords': { name: 'The Star Journey', symbol: '⛵', description: 'Hope moves on' },
  'The Star-7-swords': { name: 'The Hidden Star', symbol: '🌟', description: 'Secret hope' },
  'The Star-8-swords': { name: 'The Trapped Star', symbol: '🔗', description: 'Hope bound' },
  'The Star-9-swords': { name: 'The Dark Star', symbol: '😰', description: 'Hope fears' },
  'The Star-10-swords': { name: 'The Star Dawn', symbol: '🌅', description: 'Hope after defeat' },

  // The Star + Pentacles combinations (1-10)
  'The Star-1-pentacles': { name: 'The Lucky Coin', symbol: '🪙', description: 'Hope manifests' },
  'The Star-2-pentacles': { name: 'The Star Balance', symbol: '⚖️', description: 'Hope juggled' },
  'The Star-3-pentacles': { name: 'The Star Workshop', symbol: '🏗️', description: 'Hope built' },
  'The Star-4-pentacles': { name: 'The Hoarded Star', symbol: '💰', description: 'Hope held tight' },
  'The Star-5-pentacles': { name: 'The Cold Star', symbol: '❄️', description: 'Hope in hardship' },
  'The Star-6-pentacles': { name: 'The Star Gift', symbol: '🎁', description: 'Hope shared' },
  'The Star-7-pentacles': { name: 'The Growing Star', symbol: '🌱', description: 'Hope cultivated' },
  'The Star-8-pentacles': { name: 'The Star Craft', symbol: '⚒️', description: 'Hope perfected' },
  'The Star-9-pentacles': { name: 'The Star Garden', symbol: '🌺', description: 'Hope luxuriant' },
  'The Star-10-pentacles': { name: 'The Star Dynasty', symbol: '👑', description: 'Hope established' },

  // The Emperor + Fire combinations (1-10)
  'The Emperor-1-fire': { name: 'The First Command', symbol: '🔥', description: 'Authority ignites' },
  'The Emperor-2-fire': { name: 'The War Council', symbol: '⚔️', description: 'Strategic alliance' },
  'The Emperor-3-fire': { name: 'The Victory March', symbol: '🎺', description: 'Triumphant rule' },
  'The Emperor-4-fire': { name: 'The Fortress', symbol: '🏰', description: 'Secure dominion' },
  'The Emperor-5-fire': { name: 'The Rebellion', symbol: '🔥', description: 'Authority challenged' },
  'The Emperor-6-fire': { name: 'The Conquering Hero', symbol: '🏆', description: 'Victorious rule' },
  'The Emperor-7-fire': { name: 'The Iron Throne', symbol: '👑', description: 'Power defended' },
  'The Emperor-8-fire': { name: 'The Blitzkrieg', symbol: '⚡', description: 'Swift conquest' },
  'The Emperor-9-fire': { name: 'The Eternal Empire', symbol: '🌅', description: 'Enduring power' },
  'The Emperor-10-fire': { name: 'The Heavy Crown', symbol: '👑', description: 'Burden of rule' },

  // The Emperor + Water combinations (1-10)
  'The Emperor-1-water': { name: 'The Naval Command', symbol: '⚓', description: 'Sea power begins' },
  'The Emperor-2-water': { name: 'The Royal Marriage', symbol: '💑', description: 'Strategic union' },
  'The Emperor-3-water': { name: 'The Court Feast', symbol: '🍷', description: 'Emotional control' },
  'The Emperor-4-water': { name: 'The Still Throne', symbol: '👑', description: 'Calm authority' },
  'The Emperor-5-water': { name: 'The Tears of War', symbol: '💧', description: 'Cost of power' },
  'The Emperor-6-water': { name: 'The Benevolent King', symbol: '👑', description: 'Caring rule' },
  'The Emperor-7-water': { name: 'The Dream Empire', symbol: '🏰', description: 'Visionary rule' },
  'The Emperor-8-water': { name: 'The Exile King', symbol: '🚢', description: 'Power departs' },
  'The Emperor-9-water': { name: 'The Golden Age', symbol: '🌟', description: 'Prosperous reign' },
  'The Emperor-10-water': { name: 'The Dynasty', symbol: '👨‍👩‍👧‍👦', description: 'Family empire' },

  // The Emperor + Earth combinations (1-10)
  'The Emperor-1-earth': { name: 'The First Stone', symbol: '🗿', description: 'Empire founded' },
  'The Emperor-2-earth': { name: 'The Trade Alliance', symbol: '🤝', description: 'Economic power' },
  'The Emperor-3-earth': { name: 'The Master Builder', symbol: '🏗️', description: 'Creating empire' },
  'The Emperor-4-earth': { name: 'The Treasure Vault', symbol: '💰', description: 'Hoarded power' },
  'The Emperor-5-earth': { name: 'The Crumbling Throne', symbol: '🏚️', description: 'Power erodes' },
  'The Emperor-6-earth': { name: 'The Provider King', symbol: '🌾', description: 'Generous rule' },
  'The Emperor-7-earth': { name: 'The Patient Ruler', symbol: '⏳', description: 'Enduring reign' },
  'The Emperor-8-earth': { name: 'The Empire Builder', symbol: '🏰', description: 'Systematic growth' },
  'The Emperor-9-earth': { name: 'The Golden Throne', symbol: '💎', description: 'Wealthy empire' },
  'The Emperor-10-earth': { name: 'The Ancient Dynasty', symbol: '🏛️', description: 'Legacy of power' },

  // The Emperor + Air combinations (1-10)
  'The Emperor-1-air': { name: 'The First Decree', symbol: '📜', description: 'Law begins' },
  'The Emperor-2-air': { name: 'The Royal Court', symbol: '⚖️', description: 'Balanced rule' },
  'The Emperor-3-air': { name: 'The Proclamation', symbol: '📢', description: 'Authority speaks' },
  'The Emperor-4-air': { name: 'The Quiet Throne', symbol: '🤫', description: 'Silent power' },
  'The Emperor-5-air': { name: 'The War of Words', symbol: '⚔️', description: 'Verbal conflict' },
  'The Emperor-6-air': { name: 'The Victory Speech', symbol: '🎤', description: 'Triumphant words' },
  'The Emperor-7-air': { name: 'The Strategic Mind', symbol: '🧠', description: 'Intellectual rule' },
  'The Emperor-8-air': { name: 'The Swift Decree', symbol: '💨', description: 'Quick commands' },
  'The Emperor-9-air': { name: 'The Lone Ruler', symbol: '👑', description: 'Isolated power' },
  'The Emperor-10-air': { name: 'The Bureaucracy', symbol: '🏛️', description: 'Complex rule' },

  // The Emperor + Wands combinations (1-10)
  'The Emperor-1-wands': { name: 'The Scepter', symbol: '🔱', description: 'Power\'s tool' },
  'The Emperor-2-wands': { name: 'The Empire\'s Edge', symbol: '🗺️', description: 'Expanding rule' },
  'The Emperor-3-wands': { name: 'The Colonial Throne', symbol: '🚢', description: 'Distant power' },
  'The Emperor-4-wands': { name: 'The Victory Parade', symbol: '🎊', description: 'Celebrating rule' },
  'The Emperor-5-wands': { name: 'The Civil War', symbol: '⚔️', description: 'Internal strife' },
  'The Emperor-6-wands': { name: 'The Triumphant Return', symbol: '🏆', description: 'Victory secured' },
  'The Emperor-7-wands': { name: 'The Defended Throne', symbol: '🛡️', description: 'Power protected' },
  'The Emperor-8-wands': { name: 'The Lightning Campaign', symbol: '⚡', description: 'Rapid expansion' },
  'The Emperor-9-wands': { name: 'The War-Weary King', symbol: '😔', description: 'Tired ruler' },
  'The Emperor-10-wands': { name: 'The Imperial Burden', symbol: '👑', description: 'Heavy empire' },

  // The Emperor + Cups combinations (1-10)
  'The Emperor-1-cups': { name: 'The Royal Cup', symbol: '🏆', description: 'Emotional control' },
  'The Emperor-2-cups': { name: 'The Political Marriage', symbol: '💍', description: 'Strategic love' },
  'The Emperor-3-cups': { name: 'The Royal Banquet', symbol: '🍷', description: 'Controlled joy' },
  'The Emperor-4-cups': { name: 'The Bored Monarch', symbol: '😑', description: 'Jaded power' },
  'The Emperor-5-cups': { name: 'The Fallen Crown', symbol: '👑', description: 'Lost authority' },
  'The Emperor-6-cups': { name: 'The Young Prince', symbol: '🤴', description: 'Inherited power' },
  'The Emperor-7-cups': { name: 'The Emperor\'s Dreams', symbol: '💭', description: 'Power\'s illusions' },
  'The Emperor-8-cups': { name: 'The Abdication', symbol: '🚶', description: 'Leaving throne' },
  'The Emperor-9-cups': { name: 'The Satisfied King', symbol: '😊', description: 'Content ruler' },
  'The Emperor-10-cups': { name: 'The Royal Family', symbol: '👨‍👩‍👧‍👦', description: 'Dynasty complete' },

  // The Emperor + Swords combinations (1-10)
  'The Emperor-1-swords': { name: 'The Royal Decree', symbol: '⚔️', description: 'Law\'s edge' },
  'The Emperor-2-swords': { name: 'The Difficult Choice', symbol: '⚖️', description: 'Royal decision' },
  'The Emperor-3-swords': { name: 'The Betrayed King', symbol: '💔', description: 'Power wounded' },
  'The Emperor-4-swords': { name: 'The Tomb King', symbol: '⚰️', description: 'Death\'s rule' },
  'The Emperor-5-swords': { name: 'The Tyrant', symbol: '👿', description: 'Cruel victory' },
  'The Emperor-6-swords': { name: 'The Exiled Emperor', symbol: '⛵', description: 'Power flees' },
  'The Emperor-7-swords': { name: 'The Secret King', symbol: '🤫', description: 'Hidden rule' },
  'The Emperor-8-swords': { name: 'The Imprisoned Emperor', symbol: '🔗', description: 'Power bound' },
  'The Emperor-9-swords': { name: 'The Paranoid King', symbol: '😰', description: 'Fearful rule' },
  'The Emperor-10-swords': { name: 'The Fallen Empire', symbol: '🗡️', description: 'Power ends' },

  // The Emperor + Pentacles combinations (1-10)
  'The Emperor-1-pentacles': { name: 'The First Coin', symbol: '🪙', description: 'Wealth begins' },
  'The Emperor-2-pentacles': { name: 'The Trade Emperor', symbol: '⚖️', description: 'Economic balance' },
  'The Emperor-3-pentacles': { name: 'The Master Architect', symbol: '🏗️', description: 'Building empire' },
  'The Emperor-4-pentacles': { name: 'The Miser King', symbol: '💰', description: 'Hoarding ruler' },
  'The Emperor-5-pentacles': { name: 'The Bankrupt Crown', symbol: '💸', description: 'Power impoverished' },
  'The Emperor-6-pentacles': { name: 'The Generous Emperor', symbol: '🎁', description: 'Sharing wealth' },
  'The Emperor-7-pentacles': { name: 'The Patient Investor', symbol: '🌱', description: 'Growing empire' },
  'The Emperor-8-pentacles': { name: 'The Working King', symbol: '⚒️', description: 'Hands-on rule' },
  'The Emperor-9-pentacles': { name: 'The Merchant King', symbol: '💎', description: 'Wealthy ruler' },
  'The Emperor-10-pentacles': { name: 'The Empire\'s Legacy', symbol: '🏰', description: 'Dynastic wealth' },

  // The Empress + Fire combinations (1-10)
  'The Empress-1-fire': { name: 'The Sacred Flame', symbol: '🔥', description: 'Creation ignites' },
  'The Empress-2-fire': { name: 'The Passionate Union', symbol: '❤️‍🔥', description: 'Creative partnership' },
  'The Empress-3-fire': { name: 'The Harvest Festival', symbol: '🎊', description: 'Abundance celebrated' },
  'The Empress-4-fire': { name: 'The Hearth Goddess', symbol: '🏠', description: 'Nurturing warmth' },
  'The Empress-5-fire': { name: 'The Birth Pains', symbol: '🔥', description: 'Creative struggle' },
  'The Empress-6-fire': { name: 'The Fertile Victory', symbol: '🏆', description: 'Abundance triumphs' },
  'The Empress-7-fire': { name: 'The Protected Garden', symbol: '🛡️', description: 'Guarded growth' },
  'The Empress-8-fire': { name: 'The Quick Birth', symbol: '⚡', description: 'Rapid creation' },
  'The Empress-9-fire': { name: 'The Eternal Mother', symbol: '👑', description: 'Enduring nurture' },
  'The Empress-10-fire': { name: 'The Overwhelmed Mother', symbol: '😰', description: 'Too much growth' },

  // The Empress + Water combinations (1-10)
  'The Empress-1-water': { name: 'The First Spring', symbol: '💧', description: 'Life flows' },
  'The Empress-2-water': { name: 'The Loving Mother', symbol: '💑', description: 'Emotional nurture' },
  'The Empress-3-water': { name: 'The Celebration', symbol: '🥂', description: 'Joy overflows' },
  'The Empress-4-water': { name: 'The Still Waters', symbol: '🌊', description: 'Peaceful abundance' },
  'The Empress-5-water': { name: 'The Mourning Mother', symbol: '😢', description: 'Loss grieves' },
  'The Empress-6-water': { name: 'The Flowing River', symbol: '🌊', description: 'Abundance moves' },
  'The Empress-7-water': { name: 'The Dream Garden', symbol: '🌺', description: 'Imagined beauty' },
  'The Empress-8-water': { name: 'The Departing Mother', symbol: '🚶‍♀️', description: 'Leaving nest' },
  'The Empress-9-water': { name: 'The Satisfied Mother', symbol: '🌟', description: 'Fulfilled creation' },
  'The Empress-10-water': { name: 'The Family Matriarch', symbol: '👨‍👩‍👧‍👦', description: 'Complete nurture' },

  // The Empress + Earth combinations (1-10)
  'The Empress-1-earth': { name: 'The First Seed', symbol: '🌱', description: 'Life begins' },
  'The Empress-2-earth': { name: 'The Balanced Garden', symbol: '⚖️', description: 'Harmonious growth' },
  'The Empress-3-earth': { name: 'The Master Gardener', symbol: '🌺', description: 'Skillful creation' },
  'The Empress-4-earth': { name: 'The Walled Garden', symbol: '🏰', description: 'Protected abundance' },
  'The Empress-5-earth': { name: 'The Barren Field', symbol: '🏜️', description: 'Growth challenged' },
  'The Empress-6-earth': { name: 'The Generous Harvest', symbol: '🌾', description: 'Sharing abundance' },
  'The Empress-7-earth': { name: 'The Patient Gardener', symbol: '⏳', description: 'Slow growth' },
  'The Empress-8-earth': { name: 'The Working Mother', symbol: '⚒️', description: 'Creating beauty' },
  'The Empress-9-earth': { name: 'The Abundant Garden', symbol: '💎', description: 'Rich fertility' },
  'The Empress-10-earth': { name: 'The Earth Mother', symbol: '🌍', description: 'Complete abundance' },

  // The Empress + Air combinations (1-10)
  'The Empress-1-air': { name: 'The First Breath', symbol: '💨', description: 'Life inspires' },
  'The Empress-2-air': { name: 'The Creative Dialogue', symbol: '💬', description: 'Nurturing words' },
  'The Empress-3-air': { name: 'The Song of Life', symbol: '🎵', description: 'Creative expression' },
  'The Empress-4-air': { name: 'The Quiet Garden', symbol: '🤫', description: 'Peaceful growth' },
  'The Empress-5-air': { name: 'The Storm Mother', symbol: '🌪️', description: 'Turbulent creation' },
  'The Empress-6-air': { name: 'The Message of Life', symbol: '📨', description: 'Growth spreads' },
  'The Empress-7-air': { name: 'The Creative Vision', symbol: '👁️', description: 'Seeing beauty' },
  'The Empress-8-air': { name: 'The Swift Growth', symbol: '💨', description: 'Quick creation' },
  'The Empress-9-air': { name: 'The Solitary Garden', symbol: '🌸', description: 'Alone in beauty' },
  'The Empress-10-air': { name: 'The Mother\'s Network', symbol: '🌐', description: 'Connected growth' },

  // The Empress + Wands combinations (1-10)
  'The Empress-1-wands': { name: 'The Creative Spark', symbol: '✨', description: 'Inspiration births' },
  'The Empress-2-wands': { name: 'The Fertile Path', symbol: '🛤️', description: 'Growth chooses' },
  'The Empress-3-wands': { name: 'The Expanding Garden', symbol: '🌍', description: 'Growth spreads' },
  'The Empress-4-wands': { name: 'The Harvest Home', symbol: '🏡', description: 'Celebrating abundance' },
  'The Empress-5-wands': { name: 'The Garden War', symbol: '⚔️', description: 'Growth competes' },
  'The Empress-6-wands': { name: 'The Triumphant Mother', symbol: '🏆', description: 'Nurture wins' },
  'The Empress-7-wands': { name: 'The Garden Guardian', symbol: '🛡️', description: 'Protecting growth' },
  'The Empress-8-wands': { name: 'The Rapid Bloom', symbol: '🌸', description: 'Fast flowering' },
  'The Empress-9-wands': { name: 'The Weary Mother', symbol: '😔', description: 'Tired nurturer' },
  'The Empress-10-wands': { name: 'The Overburdened Mother', symbol: '😰', description: 'Too much care' },

  // The Empress + Cups combinations (1-10)
  'The Empress-1-cups': { name: 'The Mother\'s Love', symbol: '❤️', description: 'Nurture begins' },
  'The Empress-2-cups': { name: 'The Sacred Union', symbol: '💑', description: 'Creative love' },
  'The Empress-3-cups': { name: 'The Mother\'s Joy', symbol: '🥂', description: 'Celebration of life' },
  'The Empress-4-cups': { name: 'The Neglected Garden', symbol: '😔', description: 'Growth overlooked' },
  'The Empress-5-cups': { name: 'The Mother\'s Tears', symbol: '😢', description: 'Creation mourns' },
  'The Empress-6-cups': { name: 'The Childhood Garden', symbol: '🌻', description: 'Innocent growth' },
  'The Empress-7-cups': { name: 'The Garden of Dreams', symbol: '💭', description: 'Imagined abundance' },
  'The Empress-8-cups': { name: 'The Empty Nest', symbol: '🚶‍♀️', description: 'Children leave' },
  'The Empress-9-cups': { name: 'The Happy Mother', symbol: '😊', description: 'Fulfilled nurture' },
  'The Empress-10-cups': { name: 'The Complete Family', symbol: '👨‍👩‍👧‍👦', description: 'Full abundance' },

  // The Empress + Swords combinations (1-10)
  'The Empress-1-swords': { name: 'The Birth Blade', symbol: '⚔️', description: 'Creation cuts' },
  'The Empress-2-swords': { name: 'The Mother\'s Choice', symbol: '⚖️', description: 'Nurture decides' },
  'The Empress-3-swords': { name: 'The Mother\'s Pain', symbol: '💔', description: 'Creation wounds' },
  'The Empress-4-swords': { name: 'The Resting Mother', symbol: '😴', description: 'Growth pauses' },
  'The Empress-5-swords': { name: 'The Stolen Harvest', symbol: '⚔️', description: 'Abundance taken' },
  'The Empress-6-swords': { name: 'The Mother\'s Journey', symbol: '⛵', description: 'Growth moves' },
  'The Empress-7-swords': { name: 'The Secret Garden', symbol: '🤫', description: 'Hidden growth' },
  'The Empress-8-swords': { name: 'The Bound Mother', symbol: '🔗', description: 'Creation trapped' },
  'The Empress-9-swords': { name: 'The Worried Mother', symbol: '😰', description: 'Anxious nurture' },
  'The Empress-10-swords': { name: 'The Devastated Garden', symbol: '🗡️', description: 'Growth ends' },

  // The Empress + Pentacles combinations (1-10)
  'The Empress-1-pentacles': { name: 'The Golden Seed', symbol: '🪙', description: 'Wealth grows' },
  'The Empress-2-pentacles': { name: 'The Balanced Harvest', symbol: '⚖️', description: 'Abundance juggled' },
  'The Empress-3-pentacles': { name: 'The Garden Temple', symbol: '🏛️', description: 'Sacred creation' },
  'The Empress-4-pentacles': { name: 'The Hoarded Garden', symbol: '💰', description: 'Guarded growth' },
  'The Empress-5-pentacles': { name: 'The Poor Mother', symbol: '💸', description: 'Lacking resources' },
  'The Empress-6-pentacles': { name: 'The Sharing Mother', symbol: '🎁', description: 'Generous abundance' },
  'The Empress-7-pentacles': { name: 'The Patient Harvest', symbol: '🌾', description: 'Awaiting fruit' },
  'The Empress-8-pentacles': { name: 'The Crafting Mother', symbol: '⚒️', description: 'Creating beauty' },
  'The Empress-9-pentacles': { name: 'The Wealthy Garden', symbol: '💎', description: 'Luxurious growth' },
  'The Empress-10-pentacles': { name: 'The Family Fortune', symbol: '🏰', description: 'Inherited abundance' },
  
  // The Magician + Numbers (Elements)
  'The Magician-1-fire': { name: 'The First Spark', symbol: '✨', description: 'Will ignites' },
  'The Magician-2-fire': { name: 'The Twin Flames', symbol: '🔥', description: 'Dual manifestation' },
  'The Magician-3-fire': { name: 'The Trinity Spell', symbol: '🌟', description: 'Creative synthesis' },
  'The Magician-4-fire': { name: 'The Sacred Square', symbol: '⬜', description: 'Stable power' },
  'The Magician-5-fire': { name: 'The Pentagram', symbol: '⭐', description: 'Will challenged' },
  'The Magician-6-fire': { name: 'The Victory Spell', symbol: '🏆', description: 'Triumph manifest' },
  'The Magician-7-fire': { name: 'The Mystic Shield', symbol: '🛡️', description: 'Protected will' },
  'The Magician-8-fire': { name: 'The Lightning Rod', symbol: '⚡', description: 'Swift power' },
  'The Magician-9-fire': { name: 'The Eternal Flame', symbol: '🕯️', description: 'Enduring magic' },
  'The Magician-10-fire': { name: 'The Overwhelmed Mage', symbol: '🌋', description: 'Power overload' },
  
  'The Magician-1-water': { name: 'The First Potion', symbol: '🧪', description: 'Emotion channeled' },
  'The Magician-2-water': { name: 'The Mirror Spell', symbol: '🪞', description: 'Reflection magic' },
  'The Magician-3-water': { name: 'The Celebration Charm', symbol: '🎉', description: 'Joy manifested' },
  'The Magician-4-water': { name: 'The Stasis Spell', symbol: '🧊', description: 'Emotions frozen' },
  'The Magician-5-water': { name: 'The Sorrow Hex', symbol: '💧', description: 'Loss transmuted' },
  'The Magician-6-water': { name: 'The Memory Spell', symbol: '🎭', description: 'Past reclaimed' },
  'The Magician-7-water': { name: 'The Illusion Veil', symbol: '🌫️', description: 'Reality obscured' },
  'The Magician-8-water': { name: 'The Abandonment', symbol: '🚪', description: 'Power withdrawn' },
  'The Magician-9-water': { name: 'The Wish Spell', symbol: '🌟', description: 'Dreams realized' },
  'The Magician-10-water': { name: 'The Perfect Enchantment', symbol: '🌈', description: 'Complete magic' },
  
  'The Magician-1-earth': { name: 'The Philosopher\'s Stone', symbol: '💎', description: 'Matter transformed' },
  'The Magician-2-earth': { name: 'The Balance Sigil', symbol: '⚖️', description: 'Resources managed' },
  'The Magician-3-earth': { name: 'The Master\'s Workshop', symbol: '🏛️', description: 'Skills manifested' },
  'The Magician-4-earth': { name: 'The Miser\'s Spell', symbol: '🔒', description: 'Power hoarded' },
  'The Magician-5-earth': { name: 'The Broken Wand', symbol: '🪄', description: 'Magic lost' },
  'The Magician-6-earth': { name: 'The Generous Enchanter', symbol: '✋', description: 'Power shared' },
  'The Magician-7-earth': { name: 'The Patient Working', symbol: '⌛', description: 'Slow manifestation' },
  'The Magician-8-earth': { name: 'The Craftsman\'s Touch', symbol: '🔨', description: 'Skill perfected' },
  'The Magician-9-earth': { name: 'The Accomplished Mage', symbol: '🏆', description: 'Mastery achieved' },
  'The Magician-10-earth': { name: 'The Legacy Spell', symbol: '👑', description: 'Power inherited' },
  
  'The Magician-1-air': { name: 'The First Word', symbol: '💬', description: 'Thought manifests' },
  'The Magician-2-air': { name: 'The Decision Spell', symbol: '🤔', description: 'Choice empowered' },
  'The Magician-3-air': { name: 'The Cutting Charm', symbol: '⚔️', description: 'Truth revealed' },
  'The Magician-4-air': { name: 'The Binding Word', symbol: '🪢', description: 'Mind trapped' },
  'The Magician-5-air': { name: 'The Chaos Incantation', symbol: '🌪️', description: 'Thoughts scattered' },
  'The Magician-6-air': { name: 'The Journey Spell', symbol: '🧭', description: 'Path cleared' },
  'The Magician-7-air': { name: 'The Trickster\'s Gambit', symbol: '🎲', description: 'Cunning manifest' },
  'The Magician-8-air': { name: 'The Binding Contract', symbol: '📜', description: 'Will restricted' },
  'The Magician-9-air': { name: 'The Nightmare Weaver', symbol: '🕸️', description: 'Fear manifested' },
  'The Magician-10-air': { name: 'The Final Spell', symbol: '💀', description: 'Power ends' },
  
  // The Magician + Tarot Suits
  'The Magician-A-wands': { name: 'The Primal Wand', symbol: '🪄', description: 'Pure magical will' },
  'The Magician-2-wands': { name: 'The Dual Focus', symbol: '🎯', description: 'Split intentions' },
  'The Magician-3-wands': { name: 'The Expanding Horizon', symbol: '🌅', description: 'Vision manifested' },
  'The Magician-4-wands': { name: 'The Sacred Circle', symbol: '⭕', description: 'Protected space' },
  'The Magician-5-wands': { name: 'The Battle Mage', symbol: '⚔️', description: 'Conflict channeled' },
  'The Magician-6-wands': { name: 'The Triumphant Spell', symbol: '🎊', description: 'Victory assured' },
  'The Magician-7-wands': { name: 'The Defensive Ward', symbol: '🛡️', description: 'Will protected' },
  'The Magician-8-wands': { name: 'The Swift Casting', symbol: '💫', description: 'Instant magic' },
  'The Magician-9-wands': { name: 'The Guardian Mage', symbol: '🗿', description: 'Persistent power' },
  'The Magician-10-wands': { name: 'The Burdened Wizard', symbol: '⛰️', description: 'Overwhelmed will' },
  
  'The Magician-A-cups': { name: 'The Holy Grail', symbol: '🏆', description: 'Love\'s vessel' },
  'The Magician-2-cups': { name: 'The Love Potion', symbol: '💕', description: 'Hearts bound' },
  'The Magician-3-cups': { name: 'The Celebration Spell', symbol: '🥂', description: 'Joy multiplied' },
  'The Magician-4-cups': { name: 'The Apathy Hex', symbol: '😑', description: 'Emotion blocked' },
  'The Magician-5-cups': { name: 'The Grief Transmuter', symbol: '💔', description: 'Sorrow transformed' },
  'The Magician-6-cups': { name: 'The Memory Palace', symbol: '🏰', description: 'Past retrieved' },
  'The Magician-7-cups': { name: 'The Illusion Master', symbol: '🔮', description: 'Dreams woven' },
  'The Magician-8-cups': { name: 'The Vanishing Act', symbol: '🌙', description: 'Escape manifested' },
  'The Magician-9-cups': { name: 'The Wish Fulfiller', symbol: '⭐', description: 'Desires granted' },
  'The Magician-10-cups': { name: 'The Rainbow Bridge', symbol: '🌈', description: 'Perfect harmony' },
  
  'The Magician-A-swords': { name: 'The Mind Blade', symbol: '🗡️', description: 'Thought weaponized' },
  'The Magician-2-swords': { name: 'The Paradox Spell', symbol: '♾️', description: 'Duality mastered' },
  'The Magician-3-swords': { name: 'The Pain Transmuter', symbol: '💔', description: 'Hurt transformed' },
  'The Magician-4-swords': { name: 'The Stasis Field', symbol: '🧊', description: 'Mind frozen' },
  'The Magician-5-swords': { name: 'The Victory Curse', symbol: '😈', description: 'Hollow triumph' },
  'The Magician-6-swords': { name: 'The Passage Spell', symbol: '⛵', description: 'Journey eased' },
  'The Magician-7-swords': { name: 'The Thief\'s Charm', symbol: '🦊', description: 'Stealth granted' },
  'The Magician-8-swords': { name: 'The Binding Curse', symbol: '⛓️', description: 'Power trapped' },
  'The Magician-9-swords': { name: 'The Nightmare Lord', symbol: '😱', description: 'Fear mastered' },
  'The Magician-10-swords': { name: 'The Final Transformation', symbol: '⚰️', description: 'End becomes beginning' },
  
  'The Magician-A-pentacles': { name: 'The Midas Touch', symbol: '✨', description: 'Matter to gold' },
  'The Magician-2-pentacles': { name: 'The Juggler\'s Spell', symbol: '🎪', description: 'Balance maintained' },
  'The Magician-3-pentacles': { name: 'The Master Builder', symbol: '🏗️', description: 'Skills combined' },
  'The Magician-4-pentacles': { name: 'The Hoarding Hex', symbol: '🔐', description: 'Wealth trapped' },
  'The Magician-5-pentacles': { name: 'The Poverty Curse', symbol: '🕳️', description: 'Lack manifested' },
  'The Magician-6-pentacles': { name: 'The Abundance Spell', symbol: '💰', description: 'Wealth flows' },
  'The Magician-7-pentacles': { name: 'The Growth Charm', symbol: '🌱', description: 'Patient power' },
  'The Magician-8-pentacles': { name: 'The Craftsman\'s Secret', symbol: '🔧', description: 'Skill mastered' },
  'The Magician-9-pentacles': { name: 'The Golden Garden', symbol: '🏆', description: 'Success cultivated' },
  'The Magician-10-pentacles': { name: 'The Dynasty Spell', symbol: '👑', description: 'Legacy created' },
  
  // Face cards
  'The Sun-K-fire': { name: 'The Solar King', symbol: '☀️', description: 'Radiant rule' },
  'The Sun-Q-fire': { name: 'The Light Bearer', symbol: '👸', description: 'Joy\'s empress' },
  'The Sun-K-earth': { name: 'The Midas', symbol: '👑', description: 'Golden touch' },
  
  // Judgement + all suits  
  'Judgement-A-fire': { name: 'The Final Trumpet', symbol: '🎺', description: 'Call to action' },
  'Judgement-K-fire': { name: 'The Judge of Souls', symbol: '⚖️', description: 'Final arbiter' },
  'Judgement-A-water': { name: 'The Cleansing Flood', symbol: '🌊', description: 'Purification begins' },
  'Judgement-A-earth': { name: 'The Opened Grave', symbol: '⚰️', description: 'Past rises' },
  'Judgement-A-air': { name: 'The Final Word', symbol: '📜', description: 'Truth spoken' },
  
  // The World + all suits
  'The World-A-fire': { name: 'The Eternal Flame', symbol: '🔥', description: 'Completion\'s spark' },
  'The World-10-fire': { name: 'The Grand Finale', symbol: '🎆', description: 'All burdens complete' },
  'The World-K-fire': { name: 'The World Emperor', symbol: '🌍', description: 'Universal rule' },
  'The World-Q-water': { name: 'The Universal Mother', symbol: '🌍', description: 'All-embracing love' },
  'The World-K-earth': { name: 'The Master of All', symbol: '👑', description: 'Complete dominion' },
  'The World-A-air': { name: 'The Final Understanding', symbol: '🌍', description: 'All is known' },
  'The World-A-water': { name: 'The Cosmic Ocean', symbol: '🌊', description: 'Universal emotion' },
  'The World-A-earth': { name: 'The Philosopher\'s Stone', symbol: '💎', description: 'Ultimate transformation' },
  
  // Generic Major + Elemental suit combinations (for any number 1-9)
  // The Fool + Elements
  'The Fool-fire': { name: 'The Wild Flame', symbol: '🔥', description: 'Chaos ignited' },
  'The Fool-water': { name: 'The Drifting Current', symbol: '🌊', description: 'Aimless flow' },
  'The Fool-earth': { name: 'The Wandering Stone', symbol: '🗿', description: 'Rootless journey' },
  'The Fool-air': { name: 'The Whimsical Wind', symbol: '🌪️', description: 'Carefree breeze' },
  
  // The Magician + Elements  
  'The Magician-fire': { name: 'The Promethean', symbol: '🔥', description: 'Will shapes flame' },
  'The Magician-water': { name: 'The Flow Master', symbol: '💧', description: 'Emotions directed' },
  'The Magician-earth': { name: 'The Manifestor', symbol: '💎', description: 'Will made solid' },
  'The Magician-air': { name: 'The Mind Shaper', symbol: '🌀', description: 'Thoughts given form' },
  
  // The High Priestess + Elements
  'The High Priestess-fire': { name: 'The Vestal', symbol: '🕯️', description: 'Sacred flame keeper' },
  'The High Priestess-water': { name: 'The Deep Oracle', symbol: '🔮', description: 'Intuition\'s depths' },
  'The High Priestess-earth': { name: 'The Cave Seer', symbol: '🏔️', description: 'Hidden earth wisdom' },
  'The High Priestess-air': { name: 'The Thought Reader', symbol: '💭', description: 'Mental mysteries' },
  
  // The High Priestess + Numbers (Elements)
  'The High Priestess-1-fire': { name: 'The Sacred Spark', symbol: '✨', description: 'Intuition ignites' },
  'The High Priestess-2-fire': { name: 'The Twin Mysteries', symbol: '🕯️', description: 'Dual revelation' },
  'The High Priestess-3-fire': { name: 'The Triple Goddess', symbol: '🌙', description: 'Maiden, mother, crone' },
  'The High Priestess-4-fire': { name: 'The Hidden Temple', symbol: '🏛️', description: 'Sacred foundations' },
  'The High Priestess-5-fire': { name: 'The Veiled Conflict', symbol: '⚔️', description: 'Hidden struggles' },
  'The High Priestess-6-fire': { name: 'The Inner Light', symbol: '💫', description: 'Illuminated wisdom' },
  'The High Priestess-7-fire': { name: 'The Seven Veils', symbol: '🎭', description: 'Layered mysteries' },
  'The High Priestess-8-fire': { name: 'The Eternal Flame', symbol: '🔥', description: 'Undying knowledge' },
  'The High Priestess-9-fire': { name: 'The Hermit\'s Wisdom', symbol: '🏔️', description: 'Solitary enlightenment' },
  'The High Priestess-10-fire': { name: 'The Complete Mystery', symbol: '♾️', description: 'All secrets revealed' },
  
  'The High Priestess-1-water': { name: 'The First Drop', symbol: '💧', description: 'Intuition\'s beginning' },
  'The High Priestess-2-water': { name: 'The Moon Pool', symbol: '🌊', description: 'Reflected wisdom' },
  'The High Priestess-3-water': { name: 'The Sacred Spring', symbol: '⛲', description: 'Emotional depths' },
  'The High Priestess-4-water': { name: 'The Still Waters', symbol: '🏞️', description: 'Deep tranquility' },
  'The High Priestess-5-water': { name: 'The Troubled Depths', symbol: '🌀', description: 'Turbulent intuition' },
  'The High Priestess-6-water': { name: 'The Healing Pool', symbol: '💙', description: 'Emotional wisdom' },
  'The High Priestess-7-water': { name: 'The Dream Stream', symbol: '🌌', description: 'Subconscious flow' },
  'The High Priestess-8-water': { name: 'The Binding Waters', symbol: '🔗', description: 'Emotional bondage' },
  'The High Priestess-9-water': { name: 'The Dark Pool', symbol: '🌑', description: 'Hidden fears' },
  'The High Priestess-10-water': { name: 'The Ocean\'s End', symbol: '🌊', description: 'Final revelation' },
  
  'The High Priestess-1-earth': { name: 'The First Stone', symbol: '💎', description: 'Hidden foundation' },
  'The High Priestess-2-earth': { name: 'The Sacred Grove', symbol: '🌲', description: 'Dual wisdom' },
  'The High Priestess-3-earth': { name: 'The Crystal Cave', symbol: '🔮', description: 'Earth\'s secrets' },
  'The High Priestess-4-earth': { name: 'The Inner Sanctum', symbol: '🏛️', description: 'Stable mysteries' },
  'The High Priestess-5-earth': { name: 'The Shifting Ground', symbol: '🏔️', description: 'Unstable wisdom' },
  'The High Priestess-6-earth': { name: 'The Sacred Garden', symbol: '🌿', description: 'Nurturing secrets' },
  'The High Priestess-7-earth': { name: 'The Seven Stones', symbol: '🗿', description: 'Ancient knowledge' },
  'The High Priestess-8-earth': { name: 'The Sealed Tomb', symbol: '⚰️', description: 'Buried wisdom' },
  'The High Priestess-9-earth': { name: 'The Deep Mine', symbol: '⛏️', description: 'Hidden treasures' },
  'The High Priestess-10-earth': { name: 'The Earth\'s Core', symbol: '🌍', description: 'Ultimate grounding' },
  
  'The High Priestess-1-air': { name: 'The First Whisper', symbol: '💨', description: 'Mental awakening' },
  'The High Priestess-2-air': { name: 'The Binary Mind', symbol: '🧠', description: 'Dual consciousness' },
  'The High Priestess-3-air': { name: 'The Third Eye', symbol: '👁️', description: 'Psychic sight' },
  'The High Priestess-4-air': { name: 'The Four Winds', symbol: '🌬️', description: 'Mental stability' },
  'The High Priestess-5-air': { name: 'The Mental Storm', symbol: '🌪️', description: 'Confused intuition' },
  'The High Priestess-6-air': { name: 'The Clear Mind', symbol: '☁️', description: 'Mental harmony' },
  'The High Priestess-7-air': { name: 'The Seven Thoughts', symbol: '💭', description: 'Complex wisdom' },
  'The High Priestess-8-air': { name: 'The Mental Prison', symbol: '🕸️', description: 'Trapped thoughts' },
  'The High Priestess-9-air': { name: 'The Nightmare Veil', symbol: '😱', description: 'Fearful visions' },
  'The High Priestess-10-air': { name: 'The Final Thought', symbol: '💀', description: 'Mental completion' },
  
  // The High Priestess + Tarot Suits
  'The High Priestess-A-wands': { name: 'The Initiate\'s Wand', symbol: '🪄', description: 'Beginning mysteries' },
  'The High Priestess-2-wands': { name: 'The Divining Rods', symbol: '🎋', description: 'Seeking direction' },
  'The High Priestess-3-wands': { name: 'The Seer\'s Vision', symbol: '🔭', description: 'Future revealed' },
  'The High Priestess-4-wands': { name: 'The Sacred Circle', symbol: '⭕', description: 'Protected wisdom' },
  'The High Priestess-5-wands': { name: 'The Hidden Conflict', symbol: '🎭', description: 'Secret battles' },
  'The High Priestess-6-wands': { name: 'The Veiled Victory', symbol: '🏆', description: 'Hidden triumph' },
  'The High Priestess-7-wands': { name: 'The Mystic\'s Stand', symbol: '🛡️', description: 'Defending secrets' },
  'The High Priestess-8-wands': { name: 'The Swift Revelation', symbol: '⚡', description: 'Rapid insight' },
  'The High Priestess-9-wands': { name: 'The Guardian\'s Vigil', symbol: '🗼', description: 'Protecting wisdom' },
  'The High Priestess-10-wands': { name: 'The Burden of Knowledge', symbol: '📚', description: 'Heavy secrets' },
  
  'The High Priestess-A-cups': { name: 'The Sacred Chalice', symbol: '🏆', description: 'Emotional beginning' },
  'The High Priestess-2-cups': { name: 'The Soul Bond', symbol: '💞', description: 'Mystical union' },
  'The High Priestess-3-cups': { name: 'The Sisterhood', symbol: '👭', description: 'Sacred feminine' },
  'The High Priestess-4-cups': { name: 'The Hidden Cup', symbol: '🍷', description: 'Unseen offerings' },
  'The High Priestess-5-cups': { name: 'The Mourning Veil', symbol: '😢', description: 'Hidden grief' },
  'The High Priestess-6-cups': { name: 'The Memory Pool', symbol: '🌊', description: 'Past wisdom' },
  'The High Priestess-7-cups': { name: 'The Veil of Illusion', symbol: '🎪', description: 'Hidden choices' },
  'The High Priestess-8-cups': { name: 'The Moonlit Path', symbol: '🌙', description: 'Intuitive journey' },
  'The High Priestess-9-cups': { name: 'The Secret Wish', symbol: '⭐', description: 'Hidden desires' },
  'The High Priestess-10-cups': { name: 'The Hidden Rainbow', symbol: '🌈', description: 'Secret joy' },
  
  'The High Priestess-A-swords': { name: 'The Mind\'s Eye', symbol: '👁️', description: 'Mental clarity' },
  'The High Priestess-2-swords': { name: 'The Veiled Choice', symbol: '⚖️', description: 'Hidden decisions' },
  'The High Priestess-3-swords': { name: 'The Secret Sorrow', symbol: '💔', description: 'Hidden pain' },
  'The High Priestess-4-swords': { name: 'The Dream State', symbol: '😴', description: 'Subconscious rest' },
  'The High Priestess-5-swords': { name: 'The Hidden Blade', symbol: '🗡️', description: 'Secret conflict' },
  'The High Priestess-6-swords': { name: 'The Psychic Journey', symbol: '🚣', description: 'Mental passage' },
  'The High Priestess-7-swords': { name: 'The Silent Thief', symbol: '🦊', description: 'Stolen secrets' },
  'The High Priestess-8-swords': { name: 'The Mental Veil', symbol: '🕸️', description: 'Trapped intuition' },
  'The High Priestess-9-swords': { name: 'The Prophetic Nightmare', symbol: '😰', description: 'Dark visions' },
  'The High Priestess-10-swords': { name: 'The Final Mystery', symbol: '⚰️', description: 'Ultimate truth' },
  
  'The High Priestess-A-pentacles': { name: 'The Hidden Seed', symbol: '🌱', description: 'Secret potential' },
  'The High Priestess-2-pentacles': { name: 'The Mystic\'s Balance', symbol: '☯️', description: 'Hidden equilibrium' },
  'The High Priestess-3-pentacles': { name: 'The Secret Society', symbol: '🏛️', description: 'Hidden knowledge' },
  'The High Priestess-4-pentacles': { name: 'The Buried Treasure', symbol: '💰', description: 'Hidden wealth' },
  'The High Priestess-5-pentacles': { name: 'The Hidden Poverty', symbol: '🕳️', description: 'Secret lack' },
  'The High Priestess-6-pentacles': { name: 'The Secret Gift', symbol: '🎁', description: 'Hidden charity' },
  'The High Priestess-7-pentacles': { name: 'The Patient Oracle', symbol: '⏳', description: 'Waiting wisdom' },
  'The High Priestess-8-pentacles': { name: 'The Mystic\'s Craft', symbol: '🔨', description: 'Secret mastery' },
  'The High Priestess-9-pentacles': { name: 'The Hidden Garden', symbol: '🌺', description: 'Secret abundance' },
  'The High Priestess-10-pentacles': { name: 'The Ancient Bloodline', symbol: '🧬', description: 'Hidden legacy' },
  
  // The High Priestess + Face cards
  'The High Priestess-J-wands': { name: 'The Mystic Apprentice', symbol: '🔮', description: 'Learning secrets' },
  'The High Priestess-Q-wands': { name: 'The Oracle of Fire', symbol: '🕯️', description: 'Hidden passion' },
  'The High Priestess-K-wands': { name: 'The Hermetic King', symbol: '👑', description: 'Secret power' },
  'The High Priestess-J-cups': { name: 'The Psychic Youth', symbol: '🌙', description: 'Intuitive awakening' },
  'The High Priestess-Q-cups': { name: 'The Lunar Queen', symbol: '🌙', description: 'Mystic emotions' },
  'The High Priestess-K-cups': { name: 'The Dream Lord', symbol: '💭', description: 'Master of visions' },
  'The High Priestess-J-swords': { name: 'The Truth Seeker', symbol: '🔍', description: 'Unveiling secrets' },
  'The High Priestess-Q-swords': { name: 'The Mind Witch', symbol: '🧙‍♀️', description: 'Mental mysteries' },
  'The High Priestess-K-swords': { name: 'The Shadow Judge', symbol: '⚖️', description: 'Hidden justice' },
  'The High Priestess-J-pentacles': { name: 'The Temple Student', symbol: '📚', description: 'Learning mysteries' },
  'The High Priestess-Q-pentacles': { name: 'The Keeper of Secrets', symbol: '🗝️', description: 'Hidden wealth' },
  'The High Priestess-K-pentacles': { name: 'The Occult Merchant', symbol: '💎', description: 'Trading secrets' },
  
  // The Hierophant + Fire combinations (1-10)
  'The Hierophant-1-fire': { name: 'The First Doctrine', symbol: '📜', description: 'Teaching begins' },
  'The Hierophant-2-fire': { name: 'The Sacred Union', symbol: '🤝', description: 'Blessed partnership' },
  'The Hierophant-3-fire': { name: 'The Holy Celebration', symbol: '⛪', description: 'Sacred joy' },
  'The Hierophant-4-fire': { name: 'The Temple Foundation', symbol: '🏛️', description: 'Stable tradition' },
  'The Hierophant-5-fire': { name: 'The Religious War', symbol: '⚔️', description: 'Faith conflicts' },
  'The Hierophant-6-fire': { name: 'The Divine Victory', symbol: '✝️', description: 'Faith triumphs' },
  'The Hierophant-7-fire': { name: 'The Defender of Faith', symbol: '🛡️', description: 'Protecting dogma' },
  'The Hierophant-8-fire': { name: 'The Missionary', symbol: '🌍', description: 'Spreading doctrine' },
  'The Hierophant-9-fire': { name: 'The Temple Guardian', symbol: '🗿', description: 'Defending tradition' },
  'The Hierophant-10-fire': { name: 'The Burden of Faith', symbol: '⛓️', description: 'Heavy doctrine' },
  
  // The Hierophant + Water combinations (1-10)
  'The Hierophant-1-water': { name: 'The Holy Water', symbol: '💧', description: 'Blessed beginning' },
  'The Hierophant-2-water': { name: 'The Sacred Marriage', symbol: '💑', description: 'Blessed union' },
  'The Hierophant-3-water': { name: 'The Communion', symbol: '🍷', description: 'Sacred gathering' },
  'The Hierophant-4-water': { name: 'The Contemplative', symbol: '🙏', description: 'Peaceful faith' },
  'The Hierophant-5-water': { name: 'The Crisis of Faith', symbol: '😢', description: 'Spiritual loss' },
  'The Hierophant-6-water': { name: 'The Pilgrimage', symbol: '🚶', description: 'Sacred journey' },
  'The Hierophant-7-water': { name: 'The Vision Quest', symbol: '🔮', description: 'Spiritual seeking' },
  'The Hierophant-8-water': { name: 'The Monastery', symbol: '🏔️', description: 'Spiritual retreat' },
  'The Hierophant-9-water': { name: 'The Blessed Life', symbol: '✨', description: 'Divine contentment' },
  'The Hierophant-10-water': { name: 'The Holy Family', symbol: '👨‍👩‍👧‍👦', description: 'Sacred bonds' },
  
  // The Hierophant + Earth combinations (1-10)
  'The Hierophant-1-earth': { name: 'The First Tithe', symbol: '🪙', description: 'Sacred offering' },
  'The Hierophant-2-earth': { name: 'The Church Balance', symbol: '⚖️', description: 'Sacred equilibrium' },
  'The Hierophant-3-earth': { name: 'The Cathedral Builders', symbol: '⛪', description: 'Sacred work' },
  'The Hierophant-4-earth': { name: 'The Church Treasury', symbol: '💰', description: 'Hoarded faith' },
  'The Hierophant-5-earth': { name: 'The Poor Pilgrim', symbol: '🚶', description: 'Faith without means' },
  'The Hierophant-6-earth': { name: 'The Alms Giver', symbol: '🤲', description: 'Sacred charity' },
  'The Hierophant-7-earth': { name: 'The Patient Monk', symbol: '⏳', description: 'Waiting wisdom' },
  'The Hierophant-8-earth': { name: 'The Scripture Scribe', symbol: '📜', description: 'Sacred craft' },
  'The Hierophant-9-earth': { name: 'The Abbey Garden', symbol: '🌿', description: 'Cultivated faith' },
  'The Hierophant-10-earth': { name: 'The Vatican Vault', symbol: '🏛️', description: 'Institutional wealth' },
  
  // The Hierophant + Air combinations (1-10)
  'The Hierophant-1-air': { name: 'The First Sermon', symbol: '💨', description: 'Teaching begins' },
  'The Hierophant-2-air': { name: 'The Sacred Dialogue', symbol: '💬', description: 'Holy conversation' },
  'The Hierophant-3-air': { name: 'The Choir\'s Song', symbol: '🎵', description: 'Joyful worship' },
  'The Hierophant-4-air': { name: 'The Silent Prayer', symbol: '🤐', description: 'Quiet devotion' },
  'The Hierophant-5-air': { name: 'The Theological Debate', symbol: '📚', description: 'Faith argued' },
  'The Hierophant-6-air': { name: 'The Pilgrim\'s Tale', symbol: '🗺️', description: 'Sacred journey' },
  'The Hierophant-7-air': { name: 'The Apologist', symbol: '🛡️', description: 'Defending faith' },
  'The Hierophant-8-air': { name: 'The Gospel Spread', symbol: '📜', description: 'Word travels fast' },
  'The Hierophant-9-air': { name: 'The Hermit Sage', symbol: '🧙', description: 'Solitary wisdom' },
  'The Hierophant-10-air': { name: 'The Dogmatic Mind', symbol: '🧠', description: 'Rigid thinking' },
  
  // The Hierophant + Wands combinations (1-10)
  'The Hierophant-1-wands': { name: 'The Sacred Flame', symbol: '🕯️', description: 'Faith ignited' },
  'The Hierophant-2-wands': { name: 'The Mission Partnership', symbol: '🤝', description: 'Shared faith' },
  'The Hierophant-3-wands': { name: 'The Expanding Church', symbol: '🌍', description: 'Faith spreads' },
  'The Hierophant-4-wands': { name: 'The Temple Festival', symbol: '🎉', description: 'Sacred celebration' },
  'The Hierophant-5-wands': { name: 'The Religious Conflict', symbol: '⚔️', description: 'Faiths clash' },
  'The Hierophant-6-wands': { name: 'The Crusader\'s Return', symbol: '🏆', description: 'Faith victorious' },
  'The Hierophant-7-wands': { name: 'The Faith Defender', symbol: '🛡️', description: 'Beliefs protected' },
  'The Hierophant-8-wands': { name: 'The Divine Message', symbol: '📨', description: 'Sacred news' },
  'The Hierophant-9-wands': { name: 'The Last Believer', symbol: '🕯️', description: 'Faith endures' },
  'The Hierophant-10-wands': { name: 'The Heavy Cross', symbol: '✝️', description: 'Faith\'s burden' },
  
  // The Hierophant + Cups combinations (1-10)
  'The Hierophant-1-cups': { name: 'The Baptism', symbol: '💧', description: 'Sacred beginning' },
  'The Hierophant-2-cups': { name: 'The Wedding Vows', symbol: '💑', description: 'Sacred union' },
  'The Hierophant-3-cups': { name: 'The Holy Communion', symbol: '🍷', description: 'Sacred sharing' },
  'The Hierophant-4-cups': { name: 'The Contemplative Monk', symbol: '🧘', description: 'Spiritual meditation' },
  'The Hierophant-5-cups': { name: 'The Lost Faith', symbol: '😢', description: 'Spiritual grief' },
  'The Hierophant-6-cups': { name: 'The Sunday School', symbol: '👶', description: 'Teaching innocence' },
  'The Hierophant-7-cups': { name: 'The Mystic\'s Vision', symbol: '🔮', description: 'Sacred illusions' },
  'The Hierophant-8-cups': { name: 'The Monastic Retreat', symbol: '🚪', description: 'Leaving worldly' },
  'The Hierophant-9-cups': { name: 'The Blessed Feast', symbol: '🍽️', description: 'Sacred satisfaction' },
  'The Hierophant-10-cups': { name: 'The Parish Family', symbol: '⛪', description: 'Community faith' },
  
  // The Hierophant + Swords combinations (1-10)
  'The Hierophant-1-swords': { name: 'The Doctrine\'s Edge', symbol: '⚔️', description: 'Truth proclaimed' },
  'The Hierophant-2-swords': { name: 'The Moral Dilemma', symbol: '⚖️', description: 'Faith questioned' },
  'The Hierophant-3-swords': { name: 'The Martyr\'s Pain', symbol: '💔', description: 'Sacred suffering' },
  'The Hierophant-4-swords': { name: 'The Monastery Rest', symbol: '🛏️', description: 'Sacred peace' },
  'The Hierophant-5-swords': { name: 'The Heretic\'s Trial', symbol: '⚔️', description: 'Faith betrayed' },
  'The Hierophant-6-swords': { name: 'The Missionary Journey', symbol: '⛵', description: 'Faith travels' },
  'The Hierophant-7-swords': { name: 'The Secret Doctrine', symbol: '🤫', description: 'Hidden teachings' },
  'The Hierophant-8-swords': { name: 'The Dogma Prison', symbol: '⛓️', description: 'Faith restricts' },
  'The Hierophant-9-swords': { name: 'The Dark Night', symbol: '🌙', description: 'Faith tested' },
  'The Hierophant-10-swords': { name: 'The Fallen Church', symbol: '⛪', description: 'Institution fails' },
  
  // The Hierophant + Pentacles combinations (1-10)
  'The Hierophant-1-pentacles': { name: 'The Collection Plate', symbol: '🪙', description: 'Faith\'s coin' },
  'The Hierophant-2-pentacles': { name: 'The Church Accounts', symbol: '⚖️', description: 'Sacred balance' },
  'The Hierophant-3-pentacles': { name: 'The Cathedral Mason', symbol: '🏗️', description: 'Sacred building' },
  'The Hierophant-4-pentacles': { name: 'The Church Miser', symbol: '💰', description: 'Hoarding faith' },
  'The Hierophant-5-pentacles': { name: 'The Sanctuary Seeker', symbol: '🚪', description: 'Faith in poverty' },
  'The Hierophant-6-pentacles': { name: 'The Charitable Church', symbol: '🤲', description: 'Sacred giving' },
  'The Hierophant-7-pentacles': { name: 'The Patient Novice', symbol: '⏳', description: 'Faith grows slowly' },
  'The Hierophant-8-pentacles': { name: 'The Illuminated Manuscript', symbol: '📜', description: 'Sacred craft' },
  'The Hierophant-9-pentacles': { name: 'The Wealthy Abbey', symbol: '🏰', description: 'Faith prospers' },
  'The Hierophant-10-pentacles': { name: 'The Church Dynasty', symbol: '👑', description: 'Institutional legacy' },
  
  // The Hierophant + Face cards
  'The Hierophant-J-wands': { name: 'The Young Priest', symbol: '📿', description: 'Faith\'s messenger' },
  'The Hierophant-Q-wands': { name: 'The High Priestess', symbol: '👸', description: 'Sacred feminine' },
  'The Hierophant-K-wands': { name: 'The Pope', symbol: '👑', description: 'Supreme authority' },
  'The Hierophant-J-cups': { name: 'The Altar Boy', symbol: '👦', description: 'Innocent faith' },
  'The Hierophant-Q-cups': { name: 'The Mother Superior', symbol: '👩', description: 'Nurturing faith' },
  'The Hierophant-K-cups': { name: 'The Compassionate Bishop', symbol: '🧔', description: 'Emotional wisdom' },
  'The Hierophant-J-swords': { name: 'The Seminary Student', symbol: '📚', description: 'Learning doctrine' },
  'The Hierophant-Q-swords': { name: 'The Inquisitor', symbol: '⚖️', description: 'Harsh judgment' },
  'The Hierophant-K-swords': { name: 'The Cardinal', symbol: '👑', description: 'Church law' },
  'The Hierophant-J-pentacles': { name: 'The Monk', symbol: '🧘', description: 'Material renunciation' },
  'The Hierophant-Q-pentacles': { name: 'The Abbess', symbol: '👸', description: 'Sacred resources' },
  'The Hierophant-K-pentacles': { name: 'The Archbishop', symbol: '👑', description: 'Church wealth' },

  // The Lovers + Fire combinations (1-10)
  'The Lovers-1-fire': { name: 'The First Kiss', symbol: '💋', description: 'Love ignites' },
  'The Lovers-2-fire': { name: 'The Passionate Bond', symbol: '🔥', description: 'Hearts ablaze' },
  'The Lovers-3-fire': { name: 'The Wedding Fire', symbol: '🎊', description: 'Union celebrated' },
  'The Lovers-4-fire': { name: 'The Hearth of Love', symbol: '🏠', description: 'Stable passion' },
  'The Lovers-5-fire': { name: 'The Lover\'s Quarrel', symbol: '⚔️', description: 'Passion conflicts' },
  'The Lovers-6-fire': { name: 'The Triumphant Union', symbol: '🏆', description: 'Love conquers' },
  'The Lovers-7-fire': { name: 'The Protected Heart', symbol: '🛡️', description: 'Love defended' },
  'The Lovers-8-fire': { name: 'The Swift Romance', symbol: '💘', description: 'Love arrives quickly' },
  'The Lovers-9-fire': { name: 'The Eternal Flame', symbol: '🔥', description: 'Enduring passion' },
  'The Lovers-10-fire': { name: 'The Burden of Love', symbol: '⛓️', description: 'Heavy commitment' },

  // The Lovers + Water combinations (1-10)
  'The Lovers-1-water': { name: 'The Cup of Eros', symbol: '💝', description: 'Love flows' },
  'The Lovers-2-water': { name: 'The Soul Mates', symbol: '💑', description: 'Perfect union' },
  'The Lovers-3-water': { name: 'The Wedding Cup', symbol: '🥂', description: 'Joy in union' },
  'The Lovers-4-water': { name: 'The Still Waters', symbol: '💧', description: 'Calm partnership' },
  'The Lovers-5-water': { name: 'The Broken Heart', symbol: '💔', description: 'Love\'s sorrow' },
  'The Lovers-6-water': { name: 'The Honeymoon', symbol: '🌊', description: 'Journey together' },
  'The Lovers-7-water': { name: 'The Dream Lover', symbol: '💭', description: 'Romantic illusions' },
  'The Lovers-8-water': { name: 'The Parting Ways', symbol: '👋', description: 'Love departs' },
  'The Lovers-9-water': { name: 'The Blessed Union', symbol: '🌟', description: 'Love fulfilled' },
  'The Lovers-10-water': { name: 'The Family Tree', symbol: '🌳', description: 'Love\'s legacy' },

  // The Lovers + Earth combinations (1-10)
  'The Lovers-1-earth': { name: 'The Promise Ring', symbol: '💍', description: 'Commitment begins' },
  'The Lovers-2-earth': { name: 'The Balanced Partnership', symbol: '⚖️', description: 'Equal union' },
  'The Lovers-3-earth': { name: 'The Wedding Planner', symbol: '📋', description: 'Building together' },
  'The Lovers-4-earth': { name: 'The Shared Wealth', symbol: '💰', description: 'Resources united' },
  'The Lovers-5-earth': { name: 'The Divorce Papers', symbol: '📄', description: 'Material separation' },
  'The Lovers-6-earth': { name: 'The Generous Couple', symbol: '🤲', description: 'Giving together' },
  'The Lovers-7-earth': { name: 'The Patient Love', symbol: '⏳', description: 'Growing slowly' },
  'The Lovers-8-earth': { name: 'The Working Partnership', symbol: '🤝', description: 'Building love' },
  'The Lovers-9-earth': { name: 'The Golden Anniversary', symbol: '💎', description: 'Enduring wealth' },
  'The Lovers-10-earth': { name: 'The Dynasty Makers', symbol: '👑', description: 'Legacy builders' },

  // The Lovers + Air combinations (1-10)
  'The Lovers-1-air': { name: 'The Love Letter', symbol: '💌', description: 'Words of love' },
  'The Lovers-2-air': { name: 'The Marriage Vows', symbol: '💬', description: 'Promises spoken' },
  'The Lovers-3-air': { name: 'The Love Song', symbol: '🎵', description: 'Joy expressed' },
  'The Lovers-4-air': { name: 'The Silent Understanding', symbol: '🤫', description: 'Quiet bond' },
  'The Lovers-5-air': { name: 'The Heated Words', symbol: '🗣️', description: 'Verbal discord' },
  'The Lovers-6-air': { name: 'The Love Declaration', symbol: '📢', description: 'Public commitment' },
  'The Lovers-7-air': { name: 'The Mind Games', symbol: '🧠', description: 'Mental attraction' },
  'The Lovers-8-air': { name: 'The Quick Decision', symbol: '💨', description: 'Swift choice' },
  'The Lovers-9-air': { name: 'The Lone Choice', symbol: '🤔', description: 'Solitary decision' },
  'The Lovers-10-air': { name: 'The Complex Relationship', symbol: '🕸️', description: 'Tangled bonds' },

  // The Lovers + Wands combinations (1-10)
  'The Lovers-1-wands': { name: 'The Cupid\'s Arrow', symbol: '🏹', description: 'Love strikes' },
  'The Lovers-2-wands': { name: 'The Crossroads of Love', symbol: '🛤️', description: 'Choosing partners' },
  'The Lovers-3-wands': { name: 'The Long Distance Love', symbol: '🌍', description: 'Love expands' },
  'The Lovers-4-wands': { name: 'The Marriage Celebration', symbol: '🎉', description: 'Union rejoiced' },
  'The Lovers-5-wands': { name: 'The Love Triangle', symbol: '📐', description: 'Competing hearts' },
  'The Lovers-6-wands': { name: 'The Wedding March', symbol: '🎺', description: 'Love triumphs' },
  'The Lovers-7-wands': { name: 'The Defended Love', symbol: '🛡️', description: 'Protecting union' },
  'The Lovers-8-wands': { name: 'The Whirlwind Romance', symbol: '🌪️', description: 'Fast passion' },
  'The Lovers-9-wands': { name: 'The Tested Bond', symbol: '🔗', description: 'Love endures' },
  'The Lovers-10-wands': { name: 'The Weight of Commitment', symbol: '⛓️', description: 'Love\'s responsibility' },

  // The Lovers + Cups combinations (1-10)
  'The Lovers-1-cups': { name: 'The Chalice of Venus', symbol: '💖', description: 'Love overflows' },
  'The Lovers-2-cups': { name: 'The Twin Flames', symbol: '🔥', description: 'Perfect mirror' },
  'The Lovers-3-cups': { name: 'The Wedding Toast', symbol: '🥂', description: 'Celebrated union' },
  'The Lovers-4-cups': { name: 'The Comfortable Love', symbol: '😌', description: 'Content together' },
  'The Lovers-5-cups': { name: 'The Lost Love', symbol: '😢', description: 'Partnership mourned' },
  'The Lovers-6-cups': { name: 'The Childhood Sweethearts', symbol: '👫', description: 'Young love' },
  'The Lovers-7-cups': { name: 'The Fantasy Romance', symbol: '💭', description: 'Love\'s illusions' },
  'The Lovers-8-cups': { name: 'The Sacred Departure', symbol: '🚪', description: 'Leaving for love' },
  'The Lovers-9-cups': { name: 'The Happily Ever After', symbol: '🌈', description: 'Love\'s wish' },
  'The Lovers-10-cups': { name: 'The Perfect Family', symbol: '👨‍👩‍👧‍👦', description: 'Love multiplied' },

  // The Lovers + Swords combinations (1-10)
  'The Lovers-1-swords': { name: 'The Decision Blade', symbol: '⚔️', description: 'Choice cuts deep' },
  'The Lovers-2-swords': { name: 'The Difficult Choice', symbol: '⚖️', description: 'Love or logic' },
  'The Lovers-3-swords': { name: 'The Betrayed Heart', symbol: '💔', description: 'Love wounds' },
  'The Lovers-4-swords': { name: 'The Peaceful Union', symbol: '🕊️', description: 'Rest in love' },
  'The Lovers-5-swords': { name: 'The Love Betrayal', symbol: '🗡️', description: 'Trust broken' },
  'The Lovers-6-swords': { name: 'The Elopement', symbol: '⛵', description: 'Love escapes' },
  'The Lovers-7-swords': { name: 'The Secret Affair', symbol: '🤐', description: 'Hidden love' },
  'The Lovers-8-swords': { name: 'The Trapped Hearts', symbol: '🔗', description: 'Love binds' },
  'The Lovers-9-swords': { name: 'The Anxious Lovers', symbol: '😰', description: 'Love fears' },
  'The Lovers-10-swords': { name: 'The Love\'s End', symbol: '⚰️', description: 'Partnership dies' },

  // The Lovers + Pentacles combinations (1-10)
  'The Lovers-1-pentacles': { name: 'The Engagement Ring', symbol: '💍', description: 'Material promise' },
  'The Lovers-2-pentacles': { name: 'The Juggling Hearts', symbol: '❤️', description: 'Balancing love' },
  'The Lovers-3-pentacles': { name: 'The Wedding Architect', symbol: '🏛️', description: 'Building union' },
  'The Lovers-4-pentacles': { name: 'The Possessive Love', symbol: '🔒', description: 'Holding tight' },
  'The Lovers-5-pentacles': { name: 'The Poor Lovers', symbol: '🥶', description: 'Love in hardship' },
  'The Lovers-6-pentacles': { name: 'The Generous Hearts', symbol: '💝', description: 'Sharing love' },
  'The Lovers-7-pentacles': { name: 'The Growing Love', symbol: '🌱', description: 'Patient bond' },
  'The Lovers-8-pentacles': { name: 'The Crafted Union', symbol: '💑', description: 'Working on love' },
  'The Lovers-9-pentacles': { name: 'The Luxurious Love', symbol: '💎', description: 'Abundant partnership' },
  'The Lovers-10-pentacles': { name: 'The Love Legacy', symbol: '🏰', description: 'Generational bond' },

  // The Chariot + Fire combinations (1-10)
  'The Chariot-1-fire': { name: 'The Victory Charge', symbol: '🏇', description: 'Conquest begins' },
  'The Chariot-2-fire': { name: 'The Twin Steeds', symbol: '🐎', description: 'Balanced power' },
  'The Chariot-3-fire': { name: 'The Triumphant March', symbol: '🎺', description: 'Victory celebrated' },
  'The Chariot-4-fire': { name: 'The Fortress Chariot', symbol: '🏰', description: 'Secure control' },
  'The Chariot-5-fire': { name: 'The War Machine', symbol: '⚔️', description: 'Conflict mastered' },
  'The Chariot-6-fire': { name: 'The Champion\'s Ride', symbol: '🏆', description: 'Ultimate victory' },
  'The Chariot-7-fire': { name: 'The Defensive Charge', symbol: '🛡️', description: 'Willpower shields' },
  'The Chariot-8-fire': { name: 'The Lightning Chariot', symbol: '⚡', description: 'Swift conquest' },
  'The Chariot-9-fire': { name: 'The Enduring Will', symbol: '💪', description: 'Determination lasts' },
  'The Chariot-10-fire': { name: 'The Burden of Victory', symbol: '👑', description: 'Heavy triumph' },

  // The Chariot + Water combinations (1-10)
  'The Chariot-1-water': { name: 'The Tide Rider', symbol: '🌊', description: 'Emotional control' },
  'The Chariot-2-water': { name: 'The United Will', symbol: '💑', description: 'Partnership drives' },
  'The Chariot-3-water': { name: 'The Victory Toast', symbol: '🥂', description: 'Celebrated triumph' },
  'The Chariot-4-water': { name: 'The Stalled Chariot', symbol: '🚫', description: 'Will blocked' },
  'The Chariot-5-water': { name: 'The Defeated Spirit', symbol: '💔', description: 'Lost control' },
  'The Chariot-6-water': { name: 'The Nostalgic Victor', symbol: '🏅', description: 'Past triumphs' },
  'The Chariot-7-water': { name: 'The Dream Chariot', symbol: '🌙', description: 'Imagined victory' },
  'The Chariot-8-water': { name: 'The Departing Victor', symbol: '🚶', description: 'Moving beyond win' },
  'The Chariot-9-water': { name: 'The Satisfied Conqueror', symbol: '😌', description: 'Goals achieved' },
  'The Chariot-10-water': { name: 'The Dynasty Chariot', symbol: '👨‍👩‍👧‍👦', description: 'Family triumph' },

  // The Chariot + Earth combinations (1-10)
  'The Chariot-1-earth': { name: 'The Golden Chariot', symbol: '🪙', description: 'Material conquest' },
  'The Chariot-2-earth': { name: 'The Balanced Drive', symbol: '⚖️', description: 'Controlled progress' },
  'The Chariot-3-earth': { name: 'The Master\'s Vehicle', symbol: '🏗️', description: 'Skill conquers' },
  'The Chariot-4-earth': { name: 'The Armored Vault', symbol: '🔒', description: 'Protected victory' },
  'The Chariot-5-earth': { name: 'The Broken Wheel', symbol: '💔', description: 'Material defeat' },
  'The Chariot-6-earth': { name: 'The Generous Victor', symbol: '🎁', description: 'Sharing triumph' },
  'The Chariot-7-earth': { name: 'The Patient Conquest', symbol: '⏳', description: 'Slow victory' },
  'The Chariot-8-earth': { name: 'The Determined Craft', symbol: '🔨', description: 'Will perfects' },
  'The Chariot-9-earth': { name: 'The Self-Made Victor', symbol: '💎', description: 'Personal triumph' },
  'The Chariot-10-earth': { name: 'The Imperial Chariot', symbol: '🏰', description: 'Legacy of conquest' },

  // The Chariot + Air combinations (1-10)
  'The Chariot-1-air': { name: 'The Mind Chariot', symbol: '🧠', description: 'Mental conquest' },
  'The Chariot-2-air': { name: 'The Strategic Drive', symbol: '♟️', description: 'Planned victory' },
  'The Chariot-3-air': { name: 'The Victory Cry', symbol: '📢', description: 'Triumph announced' },
  'The Chariot-4-air': { name: 'The Stalled Mind', symbol: '🤔', description: 'Overthinking control' },
  'The Chariot-5-air': { name: 'The Battle of Wills', symbol: '🤺', description: 'Mental conflict' },
  'The Chariot-6-air': { name: 'The Journey\'s Purpose', symbol: '🗺️', description: 'Clear direction' },
  'The Chariot-7-air': { name: 'The Cunning Victory', symbol: '🦊', description: 'Smart conquest' },
  'The Chariot-8-air': { name: 'The Focused Will', symbol: '🎯', description: 'Concentrated power' },
  'The Chariot-9-air': { name: 'The Solitary Victor', symbol: '🏔️', description: 'Lone triumph' },
  'The Chariot-10-air': { name: 'The Mental Fortress', symbol: '🏛️', description: 'Complete control' },

  // The Chariot + Wands combinations (1-10)
  'The Chariot-1-wands': { name: 'The Victory Wand', symbol: '🏆', description: 'Initiative conquers' },
  'The Chariot-2-wands': { name: 'The Chosen Path', symbol: '🛤️', description: 'Direction decided' },
  'The Chariot-3-wands': { name: 'The Conquest Horizon', symbol: '🌅', description: 'Victory expands' },
  'The Chariot-4-wands': { name: 'The Victory Parade', symbol: '🎊', description: 'Triumph celebrated' },
  'The Chariot-5-wands': { name: 'The Battle Chariot', symbol: '⚔️', description: 'Conflict mastery' },
  'The Chariot-6-wands': { name: 'The Hero\'s Return', symbol: '🏅', description: 'Victorious arrival' },
  'The Chariot-7-wands': { name: 'The Defender\'s Stand', symbol: '🛡️', description: 'Will protects' },
  'The Chariot-8-wands': { name: 'The Swift Victory', symbol: '💨', description: 'Rapid conquest' },
  'The Chariot-9-wands': { name: 'The Last Stand', symbol: '🏔️', description: 'Final determination' },
  'The Chariot-10-wands': { name: 'The Victory\'s Weight', symbol: '💪', description: 'Triumph burdens' },

  // The Chariot + Cups combinations (1-10)
  'The Chariot-1-cups': { name: 'The Heart\'s Conquest', symbol: '❤️', description: 'Emotional victory' },
  'The Chariot-2-cups': { name: 'The Union Drive', symbol: '💑', description: 'Love conquers' },
  'The Chariot-3-cups': { name: 'The Victory Feast', symbol: '🎉', description: 'Shared triumph' },
  'The Chariot-4-cups': { name: 'The Unmoved Chariot', symbol: '😐', description: 'Victory ignored' },
  'The Chariot-5-cups': { name: 'The Pyrrhic Victory', symbol: '😢', description: 'Hollow triumph' },
  'The Chariot-6-cups': { name: 'The Childhood Triumph', symbol: '🎠', description: 'Innocent victory' },
  'The Chariot-7-cups': { name: 'The Illusory Victory', symbol: '🎭', description: 'False conquest' },
  'The Chariot-8-cups': { name: 'The Victor\'s Journey', symbol: '🚶', description: 'Moving past win' },
  'The Chariot-9-cups': { name: 'The Wish Chariot', symbol: '🌟', description: 'Dreams conquered' },
  'The Chariot-10-cups': { name: 'The Family Victory', symbol: '👨‍👩‍👧‍👦', description: 'Collective triumph' },

  // The Chariot + Swords combinations (1-10)
  'The Chariot-1-swords': { name: 'The Mind\'s Victory', symbol: '🗡️', description: 'Intellect conquers' },
  'The Chariot-2-swords': { name: 'The Decisive Charge', symbol: '⚖️', description: 'Choice made firm' },
  'The Chariot-3-swords': { name: 'The Painful Victory', symbol: '💔', description: 'Triumph through loss' },
  'The Chariot-4-swords': { name: 'The Strategic Rest', symbol: '🛌', description: 'Victory pauses' },
  'The Chariot-5-swords': { name: 'The Ruthless Victor', symbol: '⚔️', description: 'Win at all costs' },
  'The Chariot-6-swords': { name: 'The Escape Chariot', symbol: '⛵', description: 'Victory through leaving' },
  'The Chariot-7-swords': { name: 'The Cunning Conquest', symbol: '🦹', description: 'Stealth triumphs' },
  'The Chariot-8-swords': { name: 'The Breaking Chains', symbol: '⛓️', description: 'Will breaks free' },
  'The Chariot-9-swords': { name: 'The Dark Victory', symbol: '😰', description: 'Nightmare conquered' },
  'The Chariot-10-swords': { name: 'The Final Conquest', symbol: '🌅', description: 'Victory from defeat' },

  // The Chariot + Pentacles combinations (1-10)
  'The Chariot-1-pentacles': { name: 'The Golden Victory', symbol: '🏆', description: 'Material triumph' },
  'The Chariot-2-pentacles': { name: 'The Juggling Chariot', symbol: '🤹', description: 'Balanced conquest' },
  'The Chariot-3-pentacles': { name: 'The Master\'s Chariot', symbol: '🏗️', description: 'Skilled victory' },
  'The Chariot-4-pentacles': { name: 'The Fortress Victor', symbol: '🏰', description: 'Secured triumph' },
  'The Chariot-5-pentacles': { name: 'The Struggling Chariot', symbol: '❄️', description: 'Victory through hardship' },
  'The Chariot-6-pentacles': { name: 'The Charitable Victor', symbol: '🎁', description: 'Generous triumph' },
  'The Chariot-7-pentacles': { name: 'The Patient Victor', symbol: '🌱', description: 'Slow conquest' },
  'The Chariot-8-pentacles': { name: 'The Crafted Victory', symbol: '🔨', description: 'Perfected triumph' },
  'The Chariot-9-pentacles': { name: 'The Luxurious Chariot', symbol: '💎', description: 'Abundant victory' },
  'The Chariot-10-pentacles': { name: 'The Dynasty Victor', symbol: '👑', description: 'Generational triumph' },
  
  // Strength + Fire combinations (1-10)
  'Strength-1-fire': { name: 'The First Courage', symbol: '🦁', description: 'Bravery awakens' },
  'Strength-2-fire': { name: 'The Gentle Flame', symbol: '🕯️', description: 'Soft power burns' },
  'Strength-3-fire': { name: 'The Lionheart Celebration', symbol: '🎊', description: 'Courage rejoices' },
  'Strength-4-fire': { name: 'The Fortress of Will', symbol: '🏰', description: 'Inner strength secured' },
  'Strength-5-fire': { name: 'The Beast\'s Struggle', symbol: '🔥', description: 'Taming inner fire' },
  'Strength-6-fire': { name: 'The Compassionate Victor', symbol: '🏆', description: 'Gentle triumph' },
  'Strength-7-fire': { name: 'The Patient Flame', symbol: '🛡️', description: 'Enduring courage' },
  'Strength-8-fire': { name: 'The Phoenix Strength', symbol: '🔥', description: 'Power transforms' },
  'Strength-9-fire': { name: 'The Inner Sun', symbol: '☀️', description: 'Self-mastery glows' },
  'Strength-10-fire': { name: 'The Burden of Compassion', symbol: '💪', description: 'Heavy gentleness' },
  // Strength + Water combinations (1-10)
  'Strength-1-water': { name: 'The Calm Waters', symbol: '💧', description: 'Emotional courage' },
  'Strength-2-water': { name: 'The Gentle Bond', symbol: '🤝', description: 'Compassionate union' },
  'Strength-3-water': { name: 'The Joyful Taming', symbol: '🎉', description: 'Happy control' },
  'Strength-4-water': { name: 'The Still Lion', symbol: '🦁', description: 'Patience tested' },
  'Strength-5-water': { name: 'The Tearful Beast', symbol: '😢', description: 'Sorrow tamed' },
  'Strength-6-water': { name: 'The Tender Memory', symbol: '💭', description: 'Past gentleness' },
  'Strength-7-water': { name: 'The Dream Tamer', symbol: '🌙', description: 'Subconscious mastered' },
  'Strength-8-water': { name: 'The Flowing Courage', symbol: '🌊', description: 'Moving past fear' },
  'Strength-9-water': { name: 'The Satisfied Heart', symbol: '😌', description: 'Emotional mastery' },
  'Strength-10-water': { name: 'The Family Courage', symbol: '👨‍👩‍👧‍👦', description: 'Collective strength' },
  // Strength + Earth combinations (1-10)
  'Strength-1-earth': { name: 'The Mountain Lion', symbol: '🦁', description: 'Grounded courage' },
  'Strength-2-earth': { name: 'The Balanced Beast', symbol: '⚖️', description: 'Steady control' },
  'Strength-3-earth': { name: 'The Master Tamer', symbol: '🎪', description: 'Skilled gentleness' },
  'Strength-4-earth': { name: 'The Stone Lion', symbol: '🗿', description: 'Immovable strength' },
  'Strength-5-earth': { name: 'The Hungry Beast', symbol: '🍖', description: 'Material desires tamed' },
  'Strength-6-earth': { name: 'The Generous Lion', symbol: '🎁', description: 'Strength gives freely' },
  'Strength-7-earth': { name: 'The Patient Gardner', symbol: '🌱', description: 'Nurturing power' },
  'Strength-8-earth': { name: 'The Gentle Craftsman', symbol: '🔨', description: 'Tender creation' },
  'Strength-9-earth': { name: 'The Abundant Strength', symbol: '💎', description: 'Rich compassion' },
  'Strength-10-earth': { name: 'The Legacy of Courage', symbol: '🏛️', description: 'Enduring gentleness' },
  // Strength + Air combinations (1-10)
  'Strength-1-air': { name: 'The Mind\'s Courage', symbol: '🧠', description: 'Mental bravery' },
  'Strength-2-air': { name: 'The Peaceful Mind', symbol: '☮️', description: 'Thoughts tamed' },
  'Strength-3-air': { name: 'The Voice of Courage', symbol: '📢', description: 'Speaking strength' },
  'Strength-4-air': { name: 'The Quiet Strength', symbol: '🤫', description: 'Silent power' },
  'Strength-5-air': { name: 'The Mental Beast', symbol: '🌪️', description: 'Thoughts conquered' },
  'Strength-6-air': { name: 'The Clear Purpose', symbol: '🎯', description: 'Focused gentleness' },
  'Strength-7-air': { name: 'The Clever Tamer', symbol: '🦊', description: 'Smart compassion' },
  'Strength-8-air': { name: 'The Mindful Power', symbol: '🧘', description: 'Conscious strength' },
  'Strength-9-air': { name: 'The Solitary Lion', symbol: '🏔️', description: 'Independent courage' },
  'Strength-10-air': { name: 'The Wisdom Fortress', symbol: '🏛️', description: 'Complete self-mastery' },
  // Strength + Wands combinations (1-10)
  'Strength-1-wands': { name: 'The Courage Spark', symbol: '✨', description: 'Bravery ignites' },
  'Strength-2-wands': { name: 'The Gentle Path', symbol: '🛤️', description: 'Compassionate choice' },
  'Strength-3-wands': { name: 'The Brave Horizon', symbol: '🌅', description: 'Courage expands' },
  'Strength-4-wands': { name: 'The Peaceful Victory', symbol: '🕊️', description: 'Gentle celebration' },
  'Strength-5-wands': { name: 'The Tamed Conflict', symbol: '🤝', description: 'Strife overcome' },
  'Strength-6-wands': { name: 'The Hero\'s Heart', symbol: '❤️', description: 'Compassionate triumph' },
  'Strength-7-wands': { name: 'The Gentle Defense', symbol: '🛡️', description: 'Soft protection' },
  'Strength-8-wands': { name: 'The Swift Compassion', symbol: '💨', description: 'Quick kindness' },
  'Strength-9-wands': { name: 'The Last Kindness', symbol: '🌟', description: 'Final gentleness' },
  'Strength-10-wands': { name: 'The Compassion\'s Weight', symbol: '💪', description: 'Heavy tenderness' },
  // Strength + Cups combinations (1-10)
  'Strength-1-cups': { name: 'The Loving Courage', symbol: '❤️', description: 'Heart\'s bravery' },
  'Strength-2-cups': { name: 'The Gentle Union', symbol: '💑', description: 'Tender partnership' },
  'Strength-3-cups': { name: 'The Joyful Strength', symbol: '🥳', description: 'Happy courage' },
  'Strength-4-cups': { name: 'The Patient Heart', symbol: '💤', description: 'Waiting strength' },
  'Strength-5-cups': { name: 'The Grief Tamer', symbol: '😢', description: 'Sorrow mastered' },
  'Strength-6-cups': { name: 'The Innocent Strength', symbol: '🧸', description: 'Childlike courage' },
  'Strength-7-cups': { name: 'The Dream Lion', symbol: '🦁', description: 'Fantasy tamed' },
  'Strength-8-cups': { name: 'The Brave Departure', symbol: '🚶', description: 'Courage to leave' },
  'Strength-9-cups': { name: 'The Gentle Wish', symbol: '🌟', description: 'Compassionate dreams' },
  'Strength-10-cups': { name: 'The Family Lion', symbol: '🦁', description: 'Protective love' },
  // Strength + Swords combinations (1-10)
  'Strength-1-swords': { name: 'The Mind\'s Beast', symbol: '🗡️', description: 'Thoughts tamed' },
  'Strength-2-swords': { name: 'The Gentle Decision', symbol: '⚖️', description: 'Compassionate choice' },
  'Strength-3-swords': { name: 'The Heartbreak Tamer', symbol: '💔', description: 'Pain mastered' },
  'Strength-4-swords': { name: 'The Peaceful Mind', symbol: '🧘', description: 'Thoughts calmed' },
  'Strength-5-swords': { name: 'The Tamed Cruelty', symbol: '🕊️', description: 'Harshness gentled' },
  'Strength-6-swords': { name: 'The Courage Journey', symbol: '⛵', description: 'Brave passage' },
  'Strength-7-swords': { name: 'The Gentle Thief', symbol: '🦝', description: 'Compassionate cunning' },
  'Strength-8-swords': { name: 'The Breaking Chains', symbol: '⛓️', description: 'Gentle liberation' },
  'Strength-9-swords': { name: 'The Nightmare Tamer', symbol: '🌙', description: 'Fear conquered' },
  'Strength-10-swords': { name: 'The Phoenix Courage', symbol: '🔥', description: 'Strength from ruin' },
  // Strength + Pentacles combinations (1-10)
  'Strength-1-pentacles': { name: 'The Golden Lion', symbol: '🦁', description: 'Material courage' },
  'Strength-2-pentacles': { name: 'The Juggling Lion', symbol: '🎪', description: 'Balanced strength' },
  'Strength-3-pentacles': { name: 'The Master\'s Touch', symbol: '👋', description: 'Gentle expertise' },
  'Strength-4-pentacles': { name: 'The Generous Lion', symbol: '🦁', description: 'Strength shares' },
  'Strength-5-pentacles': { name: 'The Courage in Winter', symbol: '❄️', description: 'Strength through hardship' },
  'Strength-6-pentacles': { name: 'The Compassionate Giver', symbol: '🤲', description: 'Gentle generosity' },
  'Strength-7-pentacles': { name: 'The Patient Tender', symbol: '🌱', description: 'Nurturing strength' },
  'Strength-8-pentacles': { name: 'The Gentle Craft', symbol: '🎨', description: 'Tender creation' },
  'Strength-9-pentacles': { name: 'The Graceful Lion', symbol: '🦁', description: 'Elegant strength' },
  'Strength-10-pentacles': { name: 'The Legacy Lion', symbol: '👑', description: 'Ancestral courage' },
  
  // The Empress + Elements
  'The Empress-fire': { name: 'The Hearth Mother', symbol: '🔥', description: 'Nurturing warmth' },
  'The Empress-water': { name: 'The Life Spring', symbol: '💧', description: 'Fertile waters' },
  'The Empress-earth': { name: 'The Great Mother', symbol: '🌍', description: 'Earth\'s abundance' },
  'The Empress-air': { name: 'The Sky Mother', symbol: '☁️', description: 'Breath of life' },
  
  // The Emperor + Elements
  'The Emperor-fire': { name: 'The War Chief', symbol: '🔥', description: 'Commanding flame' },
  'The Emperor-water': { name: 'The Admiral', symbol: '⚓', description: 'Naval dominion' },
  'The Emperor-earth': { name: 'The Land Lord', symbol: '🏰', description: 'Territorial rule' },
  'The Emperor-air': { name: 'The Sky Marshal', symbol: '🦅', description: 'Aerial command' },
  
  // The Hierophant + Elements
  'The Hierophant-fire': { name: 'The Fire Priest', symbol: '🔥', description: 'Sacred flames' },
  'The Hierophant-water': { name: 'The Baptizer', symbol: '💧', description: 'Holy waters' },
  'The Hierophant-earth': { name: 'The Earth Shaman', symbol: '🌿', description: 'Nature\'s clergy' },
  'The Hierophant-air': { name: 'The Sky Preacher', symbol: '☁️', description: 'Divine breath' },
  
  // The Lovers + Elements
  'The Lovers-fire': { name: 'The Passionate Bond', symbol: '❤️‍🔥', description: 'Love ablaze' },
  'The Lovers-water': { name: 'The Soul Mates', symbol: '💑', description: 'Emotional union' },
  'The Lovers-earth': { name: 'The Eternal Vow', symbol: '💍', description: 'Grounded love' },
  'The Lovers-air': { name: 'The Twin Flames', symbol: '👥', description: 'Mental connection' },
  
  // The Chariot + Elements
  'The Chariot-fire': { name: 'The War Machine', symbol: '🔥', description: 'Blazing victory' },
  'The Chariot-water': { name: 'The Wave Rider', symbol: '🌊', description: 'Flowing triumph' },
  'The Chariot-earth': { name: 'The Juggernaut', symbol: '🚂', description: 'Unstoppable force' },
  'The Chariot-air': { name: 'The Storm Rider', symbol: '⛈️', description: 'Wind-swift victory' },
  
  // Strength + Elements
  'Strength-fire': { name: 'The Inner Flame', symbol: '🔥', description: 'Controlled burn' },
  'Strength-water': { name: 'The Gentle Tide', symbol: '🌊', description: 'Soft power' },
  'Strength-earth': { name: 'The Mountain', symbol: '⛰️', description: 'Immovable might' },
  'Strength-air': { name: 'The Calm Storm', symbol: '🌪️', description: 'Contained force' },
  
  // The Hermit + Elements
  'The Hermit-fire': { name: 'The Lighthouse', symbol: '🔥', description: 'Solitary beacon' },
  'The Hermit-water': { name: 'The Deep Diver', symbol: '💧', description: 'Inner depths' },
  'The Hermit-earth': { name: 'The Cave Dweller', symbol: '🏔️', description: 'Mountain solitude' },
  'The Hermit-air': { name: 'The Cloud Walker', symbol: '☁️', description: 'Above it all' },
  
  // Wheel of Fortune + Elements
  'Wheel of Fortune-fire': { name: 'The Spinning Flame', symbol: '🔥', description: 'Fate\'s fire' },
  'Wheel of Fortune-water': { name: 'The Whirlpool', symbol: '🌊', description: 'Swirling destiny' },
  'Wheel of Fortune-earth': { name: 'The Millstone', symbol: '⚙️', description: 'Grinding fate' },
  'Wheel of Fortune-air': { name: 'The Cyclone', symbol: '🌪️', description: 'Spiraling fortune' },
  
  // Justice + Elements
  'Justice-fire': { name: 'The Purifying Flame', symbol: '🔥', description: 'Cleansing justice' },
  'Justice-water': { name: 'The Scales of Truth', symbol: '⚖️', description: 'Balanced flow' },
  'Justice-earth': { name: 'The Bedrock Law', symbol: '🏛️', description: 'Solid justice' },
  'Justice-air': { name: 'The Clear Verdict', symbol: '⚖️', description: 'Transparent truth' },
  
  // The Hanged Man + Elements
  'The Hanged Man-fire': { name: 'The Martyr\'s Flame', symbol: '🔥', description: 'Sacrifice burns' },
  'The Hanged Man-water': { name: 'The Suspended Drop', symbol: '💧', description: 'Paused flow' },
  'The Hanged Man-earth': { name: 'The Buried Seed', symbol: '🌱', description: 'Waiting to grow' },
  'The Hanged Man-air': { name: 'The Held Breath', symbol: '💨', description: 'Suspended moment' },
  
  // Death + Elements
  'Death-fire': { name: 'The Cremation', symbol: '🔥', description: 'Final flames' },
  'Death-water': { name: 'The River Styx', symbol: '💀', description: 'Crossing over' },
  'Death-earth': { name: 'The Grave', symbol: '⚰️', description: 'Return to earth' },
  'Death-air': { name: 'The Last Breath', symbol: '💨', description: 'Final exhale' },
  
  // Temperance + Elements
  'Temperance-fire': { name: 'The Controlled Burn', symbol: '🔥', description: 'Measured heat' },
  'Temperance-water': { name: 'The Perfect Mix', symbol: '💧', description: 'Balanced blend' },
  'Temperance-earth': { name: 'The Steady Ground', symbol: '🌍', description: 'Stable foundation' },
  'Temperance-air': { name: 'The Gentle Breeze', symbol: '🌬️', description: 'Moderate wind' },
  
  // The Devil + Elements
  'The Devil-fire': { name: 'The Hellfire', symbol: '🔥', description: 'Infernal flames' },
  'The Devil-water': { name: 'The Poisoned Well', symbol: '☠️', description: 'Corrupted flow' },
  'The Devil-earth': { name: 'The Cursed Ground', symbol: '👹', description: 'Tainted soil' },
  'The Devil-air': { name: 'The Toxic Fume', symbol: '☠️', description: 'Poisoned breath' },
  
  // The Tower + Elements
  'The Tower-fire': { name: 'The Inferno', symbol: '🔥', description: 'All consuming' },
  'The Tower-water': { name: 'The Tsunami', symbol: '🌊', description: 'Overwhelming force' },
  'The Tower-earth': { name: 'The Earthquake', symbol: '🏚️', description: 'Foundation shattered' },
  'The Tower-air': { name: 'The Hurricane', symbol: '🌪️', description: 'Destructive winds' },
  
  // The Star + Elements
  'The Star-fire': { name: 'The Guiding Light', symbol: '⭐', description: 'Hope\'s beacon' },
  'The Star-water': { name: 'The Wishing Pool', symbol: '💫', description: 'Dreams reflected' },
  'The Star-earth': { name: 'The Sacred Stone', symbol: '💎', description: 'Grounded hope' },
  'The Star-air': { name: 'The Northern Star', symbol: '🌟', description: 'Direction found' },
  
  // The Moon + Elements
  'The Moon-fire': { name: 'The Witch Light', symbol: '🔥', description: 'Deceptive glow' },
  'The Moon-water': { name: 'The Dark Pool', symbol: '🌙', description: 'Hidden depths' },
  'The Moon-earth': { name: 'The Shadow Land', symbol: '🌑', description: 'Uncertain ground' },
  'The Moon-air': { name: 'The Night Mist', symbol: '🌫️', description: 'Confusion spreads' },
  
  // The Sun + Elements
  'The Sun-fire': { name: 'The Solar Flare', symbol: '☀️', description: 'Pure radiance' },
  'The Sun-water': { name: 'The Rainbow Pool', symbol: '🌈', description: 'Joy reflected' },
  'The Sun-earth': { name: 'The Golden Field', symbol: '🌻', description: 'Abundant growth' },
  'The Sun-air': { name: 'The Clear Day', symbol: '☀️', description: 'Perfect clarity' },
  
  // Judgement + Elements
  'Judgement-fire': { name: 'The Phoenix Call', symbol: '🔥', description: 'Rebirth in flame' },
  'Judgement-water': { name: 'The Baptism', symbol: '💧', description: 'Cleansing renewal' },
  'Judgement-earth': { name: 'The Resurrection', symbol: '⚰️', description: 'Rising anew' },
  'Judgement-air': { name: 'The Trumpet\'s Call', symbol: '🎺', description: 'Awakening sound' },
  
  // The World + Elements
  'The World-fire': { name: 'The Eternal Flame', symbol: '🔥', description: 'Complete combustion' },
  'The World-water': { name: 'The Cosmic Ocean', symbol: '🌊', description: 'Universal flow' },
  'The World-earth': { name: 'The Living Planet', symbol: '🌍', description: 'Total manifestation' },
  'The World-air': { name: 'The Infinite Sky', symbol: '🌌', description: 'Boundless breath' },
  
  // Generic Major + Minor Tarot suits (for any number/court card)
  // The Fool + Tarot Suits
  'The Fool-wands': { name: 'The Chaos Wand', symbol: '🎯', description: 'Misdirected energy' },
  'The Fool-cups': { name: 'The Empty Chalice', symbol: '🍷', description: 'Innocence before emotion' },
  'The Fool-swords': { name: 'The Jester\'s Blade', symbol: '🗡️', description: 'Wit without wisdom' },
  'The Fool-pentacles': { name: 'The Beggar\'s Coin', symbol: '🪙', description: 'Fortune\'s first penny' },
  
  // The Magician + Tarot Suits
  'The Magician-wands': { name: 'The Master\'s Staff', symbol: '🔮', description: 'Will channeled' },
  'The Magician-cups': { name: 'The Alchemist\'s Flask', symbol: '⚗️', description: 'Emotions transformed' },
  'The Magician-swords': { name: 'The Mind Blade', symbol: '🗡️', description: 'Thought made sharp' },
  'The Magician-pentacles': { name: 'The Philosopher\'s Gold', symbol: '✨', description: 'Value manifested' },
  
  // The High Priestess + Tarot Suits
  'The High Priestess-wands': { name: 'The Mystic Staff', symbol: '🕯️', description: 'Hidden power' },
  'The High Priestess-cups': { name: 'The Moon Pool', symbol: '🌙', description: 'Intuitive depths' },
  'The High Priestess-swords': { name: 'The Truth Seeker', symbol: '🔍', description: 'Secrets unveiled' },
  'The High Priestess-pentacles': { name: 'The Temple Treasury', symbol: '🏛️', description: 'Sacred wealth' },
  
  // The Empress + Tarot Suits
  'The Empress-wands': { name: 'The Fertile Branch', symbol: '🌿', description: 'Creative growth' },
  'The Empress-cups': { name: 'The Mother\'s Cup', symbol: '🍼', description: 'Nurturing flow' },
  'The Empress-swords': { name: 'The Protective Mother', symbol: '🛡️', description: 'Fierce love' },
  'The Empress-pentacles': { name: 'The Harvest Queen', symbol: '🌾', description: 'Abundant reward' },
  
  // The Emperor + Tarot Suits
  'The Emperor-wands': { name: 'The Scepter of Command', symbol: '👑', description: 'Authority wielded' },
  'The Emperor-cups': { name: 'The Royal Chalice', symbol: '🏆', description: 'Emotional control' },
  'The Emperor-swords': { name: 'The Sovereign Blade', symbol: '⚔️', description: 'Law enforced' },
  'The Emperor-pentacles': { name: 'The Imperial Treasury', symbol: '💰', description: 'Wealth commanded' },
  
  // The Hierophant + Tarot Suits
  'The Hierophant-wands': { name: 'The Sacred Rod', symbol: '🏺', description: 'Spiritual authority' },
  'The Hierophant-cups': { name: 'The Holy Grail', symbol: '🏆', description: 'Divine vessel' },
  'The Hierophant-swords': { name: 'The Doctrine Blade', symbol: '📜', description: 'Truth codified' },
  'The Hierophant-pentacles': { name: 'The Church Coffers', symbol: '⛪', description: 'Sacred treasures' },
  
  // The Lovers + Tarot Suits
  'The Lovers-wands': { name: 'The Passion Play', symbol: '🎭', description: 'Love\'s drama' },
  'The Lovers-cups': { name: 'The Wedding Cup', symbol: '🥂', description: 'Shared emotions' },
  'The Lovers-swords': { name: 'The Lover\'s Quarrel', symbol: '💔', description: 'Love\'s conflicts' },
  'The Lovers-pentacles': { name: 'The Dowry', symbol: '💍', description: 'Love\'s value' },
  
  // The Chariot + Tarot Suits
  'The Chariot-wands': { name: 'The Victory March', symbol: '🎺', description: 'Triumphant advance' },
  'The Chariot-cups': { name: 'The Victor\'s Cup', symbol: '🏆', description: 'Emotional triumph' },
  'The Chariot-swords': { name: 'The War Machine', symbol: '🗡️', description: 'Strategic victory' },
  'The Chariot-pentacles': { name: 'The Spoils of War', symbol: '💎', description: 'Material conquest' },
  
  // Strength + Tarot Suits
  'Strength-wands': { name: 'The Lion\'s Roar', symbol: '🦁', description: 'Courage expressed' },
  'Strength-cups': { name: 'The Gentle Heart', symbol: '💖', description: 'Compassionate power' },
  'Strength-swords': { name: 'The Merciful Blade', symbol: '⚔️', description: 'Restrained force' },
  'Strength-pentacles': { name: 'The Steady Foundation', symbol: '🗿', description: 'Enduring power' },
  
  // The Hermit + Tarot Suits
  'The Hermit-wands': { name: 'The Sage\'s Staff', symbol: '🚶', description: 'Solitary wisdom' },
  'The Hermit-cups': { name: 'The Hermit\'s Well', symbol: '🏺', description: 'Inner emotions' },
  'The Hermit-swords': { name: 'The Philosopher\'s Edge', symbol: '📚', description: 'Isolated thought' },
  'The Hermit-pentacles': { name: 'The Hidden Hoard', symbol: '💰', description: 'Secret wealth' },
  
  // Wheel of Fortune + Tarot Suits
  'Wheel of Fortune-wands': { name: 'The Spinning Staff', symbol: '🎰', description: 'Chaotic energy' },
  'Wheel of Fortune-cups': { name: 'The Cup of Chance', symbol: '🎲', description: 'Random emotions' },
  'Wheel of Fortune-swords': { name: 'The Blade of Fate', symbol: '⚔️', description: 'Destiny cuts' },
  'Wheel of Fortune-pentacles': { name: 'The Lucky Strike', symbol: '🍀', description: 'Fortune\'s favor' },
  
  // Justice + Tarot Suits
  'Justice-wands': { name: 'The Rod of Law', symbol: '⚖️', description: 'Fair action' },
  'Justice-cups': { name: 'The Cup of Truth', symbol: '🏺', description: 'Honest emotions' },
  'Justice-swords': { name: 'The Sword of Themis', symbol: '⚔️', description: 'Blind justice' },
  'Justice-pentacles': { name: 'The Fair Trade', symbol: '💰', description: 'Balanced exchange' },
  
  // The Hanged Man + Tarot Suits
  'The Hanged Man-wands': { name: 'The Suspended Wand', symbol: '🎋', description: 'Paused action' },
  'The Hanged Man-cups': { name: 'The Inverted Cup', symbol: '🍷', description: 'Emotions reversed' },
  'The Hanged Man-swords': { name: 'The Sheathed Blade', symbol: '🗡️', description: 'Action withheld' },
  'The Hanged Man-pentacles': { name: 'The Frozen Asset', symbol: '🧊', description: 'Wealth suspended' },
  
  // Death + Tarot Suits
  'Death-wands': { name: 'The Burnt Staff', symbol: '🦴', description: 'Energy ended' },
  'Death-cups': { name: 'The Empty Vessel', symbol: '⚱️', description: 'Emotions drained' },
  'Death-swords': { name: 'The Reaper\'s Blade', symbol: '💀', description: 'Final cut' },
  'Death-pentacles': { name: 'The Inheritance', symbol: '⚰️', description: 'Wealth transferred' },
  
  // Temperance + Tarot Suits
  'Temperance-wands': { name: 'The Balanced Staff', symbol: '⚖️', description: 'Measured energy' },
  'Temperance-cups': { name: 'The Mixed Chalice', symbol: '🏺', description: 'Blended emotions' },
  'Temperance-swords': { name: 'The Tempered Blade', symbol: '🗡️', description: 'Balanced mind' },
  'Temperance-pentacles': { name: 'The Fair Share', symbol: '💰', description: 'Moderate wealth' },
  
  // The Devil + Tarot Suits
  'The Devil-wands': { name: 'The Infernal Rod', symbol: '🔱', description: 'Corrupted power' },
  'The Devil-cups': { name: 'The Poison Chalice', symbol: '☠️', description: 'Toxic emotions' },
  'The Devil-swords': { name: 'The Demon\'s Edge', symbol: '🗡️', description: 'Malicious thought' },
  'The Devil-pentacles': { name: 'The Blood Money', symbol: '💰', description: 'Tainted wealth' },
  
  // The Tower + Tarot Suits
  'The Tower-wands': { name: 'The Broken Staff', symbol: '💥', description: 'Power shattered' },
  'The Tower-cups': { name: 'The Spilled Cup', symbol: '🌊', description: 'Emotions overflow' },
  'The Tower-swords': { name: 'The Blade Fortress', symbol: '🏰', description: 'Defense crumbles' },
  'The Tower-pentacles': { name: 'The Market Crash', symbol: '📉', description: 'Wealth destroyed' },
  
  // The Star + Tarot Suits
  'The Star-wands': { name: 'The Guiding Torch', symbol: '✨', description: 'Hope lights way' },
  'The Star-cups': { name: 'The Wishing Cup', symbol: '🌟', description: 'Dreams poured' },
  'The Star-swords': { name: 'The Clarity Blade', symbol: '💫', description: 'Hope cuts through' },
  'The Star-pentacles': { name: 'The Lucky Coin', symbol: '🪙', description: 'Fortune\'s promise' },
  
  // The Moon + Tarot Suits
  'The Moon-wands': { name: 'The Shadow Staff', symbol: '🌙', description: 'Illusive power' },
  'The Moon-cups': { name: 'The Dream Chalice', symbol: '🌙', description: 'Subconscious flow' },
  'The Moon-swords': { name: 'The Nightmare Blade', symbol: '🗡️', description: 'Fearful thoughts' },
  'The Moon-pentacles': { name: 'The Fool\'s Gold', symbol: '💰', description: 'False treasure' },
  
  // The Sun + Tarot Suits
  'The Sun-wands': { name: 'The Solar Staff', symbol: '☀️', description: 'Radiant energy' },
  'The Sun-cups': { name: 'The Joy Cup', symbol: '🌞', description: 'Happiness flows' },
  'The Sun-swords': { name: 'The Brilliant Edge', symbol: '⚔️', description: 'Clear thinking' },
  'The Sun-pentacles': { name: 'The Golden Harvest', symbol: '🌻', description: 'Abundant success' },
  
  // Judgement + Tarot Suits
  'Judgement-wands': { name: 'The Phoenix Wand', symbol: '🔥', description: 'Reborn power' },
  'Judgement-cups': { name: 'The Redemption Cup', symbol: '🏆', description: 'Emotions renewed' },
  'Judgement-swords': { name: 'The Final Verdict', symbol: '⚖️', description: 'Truth revealed' },
  'Judgement-pentacles': { name: 'The Reckoning', symbol: '📊', description: 'Accounts settled' },
  
  // The World + Tarot Suits
  'The World-wands': { name: 'The Master\'s Wand', symbol: '🌍', description: 'Complete power' },
  'The World-cups': { name: 'The Universal Cup', symbol: '🌊', description: 'All emotions' },
  'The World-swords': { name: 'The Omniscient Blade', symbol: '⚔️', description: 'Total understanding' },
  'The World-pentacles': { name: 'The Cosmic Treasury', symbol: '💎', description: 'Infinite wealth' }
};

// Minor + Minor different suits and specific rank combinations
const MINOR_MINOR_FUSIONS = {
  // Generic suit combinations
  'wands-cups': { name: 'Steam Ritual', symbol: '💨', description: 'Fire meets water' },
  'wands-swords': { name: 'The Forged Blade', symbol: '🗡️', description: 'Tempered in flame' },
  'wands-pentacles': { name: 'The Golden Forge', symbol: '🏆', description: 'Wealth from fire' },
  'cups-swords': { name: 'Frozen Tears', symbol: '❄️', description: 'Emotion cut cold' },
  'cups-pentacles': { name: 'The Holy Grail', symbol: '🏆', description: 'Sacred abundance' },
  'swords-pentacles': { name: 'The Diamond Edge', symbol: '💎', description: 'Precision and value' },
  
  // Same suit doubles
  'wands-wands': { name: 'The Inferno', symbol: '🔥', description: 'Double the flame' },
  'cups-cups': { name: 'The Overflowing Chalice', symbol: '🏆', description: 'Emotion amplified' },
  'swords-swords': { name: 'The Crossed Blades', symbol: '⚔️', description: 'Mind sharpened' },
  'pentacles-pentacles': { name: 'The Golden Hoard', symbol: '💰', description: 'Wealth multiplied' },
  
  // Specific high-value combinations (Kings, Queens, Knights)
  'K-wands-K-cups': { name: 'The Steam Lord', symbol: '👑', description: 'Master of opposing forces' },
  'K-wands-K-swords': { name: 'The War Forger', symbol: '⚔️', description: 'Creator of conflicts' },
  'K-wands-K-pentacles': { name: 'The Midas', symbol: '🏆', description: 'Fire turns to gold' },
  'K-cups-K-swords': { name: 'The Ice King', symbol: '❄️', description: 'Frozen emotions rule' },
  'K-cups-K-pentacles': { name: 'The Merchant Prince', symbol: '💰', description: 'Wealth flows like water' },
  'K-swords-K-pentacles': { name: 'The Philosopher King', symbol: '👑', description: 'Mind over matter' },
  
  'Q-wands-Q-cups': { name: 'The Mystic Empress', symbol: '👸', description: 'Passion and intuition' },
  'Q-wands-Q-swords': { name: 'The Battle Queen', symbol: '⚔️', description: 'Strategic passion' },
  'Q-wands-Q-pentacles': { name: 'The Golden Empress', symbol: '👸', description: 'Creative abundance' },
  'Q-cups-Q-swords': { name: 'The Winter Queen', symbol: '❄️', description: 'Cold compassion' },
  'Q-cups-Q-pentacles': { name: 'The Mother of Plenty', symbol: '🌾', description: 'Nurturing wealth' },
  'Q-swords-Q-pentacles': { name: 'The Strategic Empress', symbol: '👸', description: 'Calculated prosperity' },
  
  // Aces meeting (powerful beginnings)
  'A-wands-A-cups': { name: 'The Primordial Steam', symbol: '🌋', description: 'Creation\'s first breath' },
  'A-wands-A-swords': { name: 'The First Strike', symbol: '⚡', description: 'Lightning forged' },
  'A-wands-A-pentacles': { name: 'The Seed of Gold', symbol: '🌱', description: 'Wealth\'s beginning' },
  'A-cups-A-swords': { name: 'The First Tear', symbol: '💧', description: 'Sorrow\'s birth' },
  'A-cups-A-pentacles': { name: 'The Wishing Coin', symbol: '🪙', description: 'Dreams made real' },
  'A-swords-A-pentacles': { name: 'The Philosopher\'s Edge', symbol: '💎', description: 'Truth cuts value' },
  
  // Pages/Knights meeting (youth combinations)
  'J-wands-J-cups': { name: 'The Young Lovers', symbol: '💕', description: 'Passion\'s awakening' },
  'J-wands-J-swords': { name: 'The Squire\'s Ambition', symbol: '🗡️', description: 'Eager for battle' },
  'J-cups-J-swords': { name: 'The Poet Warrior', symbol: '📜', description: 'Beauty and conflict' },
  'J-swords-J-pentacles': { name: 'The Scholar\'s Wealth', symbol: '📚', description: 'Knowledge profits' },
  
  // Elemental + Elemental (for base deck)
  'fire-water': { name: 'The Alchemical Wedding', symbol: '🔥', description: 'Opposites unite' },
  'fire-earth': { name: 'The Volcanic Heart', symbol: '🌋', description: 'Molten core' },
  'fire-air': { name: 'The Phoenix Wind', symbol: '🦅', description: 'Flames take flight' },
  'water-earth': { name: 'The Fertile Delta', symbol: '🌊', description: 'Life springs forth' },
  'water-air': { name: 'The Storm Bearer', symbol: '⛈️', description: 'Tempest born' },
  'earth-air': { name: 'The Dust Devil', symbol: '🌪️', description: 'Ground takes flight' },
  
  // Number combinations (special meanings)
  '2-2': { name: 'The Perfect Mirror', symbol: '🪞', description: 'Duality reflected' },
  '3-3': { name: 'The Sacred Hexagon', symbol: '⬡', description: 'Creation multiplied' },
  '4-4': { name: 'The Stable Foundation', symbol: '🏛️', description: 'Structure reinforced' },
  '5-5': { name: 'The Chaos Storm', symbol: '🌪️', description: 'Conflict doubled' },
  '6-6': { name: 'The Devil\'s Number', symbol: '😈', description: 'Temptation multiplied' },
  '7-7': { name: 'The Mystic Portal', symbol: '🌀', description: 'Sacred mysteries' },
  '8-8': { name: 'The Infinite Loop', symbol: '♾️', description: 'Power cycling' },
  '9-9': { name: 'The Final Hour', symbol: '⏰', description: 'Completion approaches' },
  '10-10': { name: 'The Double Burden', symbol: '⛓️', description: 'Weight multiplied' }
};

// Function to get fusion name
const getFusionName = (card1, card2) => {
  // Try Major + Major
  if (card1.arcana === 'major' && card2.arcana === 'major') {
    const key1 = `${card1.name}-${card2.name}`;
    const key2 = `${card2.name}-${card1.name}`;
    return MAJOR_MAJOR_FUSIONS[key1] || MAJOR_MAJOR_FUSIONS[key2] || {
      name: `${card1.name.replace('The ', '')} & ${card2.name.replace('The ', '')}`,
      symbol: '🌌',
      description: `The combined powers of ${card1.name} and ${card2.name}`
    };
  }
  
  // Try Major + Minor/Elemental
  if ((card1.arcana === 'major' && (card2.arcana === 'minor' || card2.suit)) ||
      (card2.arcana === 'major' && (card1.arcana === 'minor' || card1.suit))) {
    const majorCard = card1.arcana === 'major' ? card1 : card2;
    const minorCard = card1.arcana === 'major' ? card2 : card1;
    
    // First try specific rank combination
    const specificKey = `${majorCard.name}-${minorCard.rank || minorCard.number}-${minorCard.suit}`;
    if (MAJOR_MINOR_FUSIONS[specificKey]) {
      return MAJOR_MINOR_FUSIONS[specificKey];
    }
    
    // Then try generic suit combination
    const genericKey = `${majorCard.name}-${minorCard.suit}`;
    if (MAJOR_MINOR_FUSIONS[genericKey]) {
      return MAJOR_MINOR_FUSIONS[genericKey];
    }
    
    // Final fallback
    const suitNames = { 
      'wands': 'Wands', 'cups': 'Cups', 'swords': 'Swords', 'pentacles': 'Pentacles',
      'fire': 'Fire', 'water': 'Water', 'air': 'Air', 'earth': 'Earth'
    };
    return {
      name: `${majorCard.name} of ${suitNames[minorCard.suit] || minorCard.suit}`,
      symbol: '✨',
      description: `${majorCard.name} infused with ${minorCard.suit} energy`
    };
  }
  
  // Try Minor + Minor
  if (card1.suit && card2.suit) {
    // First try specific rank combinations
    const rankKey1 = `${card1.rank}-${card1.suit}-${card2.rank}-${card2.suit}`;
    const rankKey2 = `${card2.rank}-${card2.suit}-${card1.rank}-${card1.suit}`;
    
    if (MINOR_MINOR_FUSIONS[rankKey1]) return MINOR_MINOR_FUSIONS[rankKey1];
    if (MINOR_MINOR_FUSIONS[rankKey2]) return MINOR_MINOR_FUSIONS[rankKey2];
    
    // Try matching numbers (for same rank fusions)
    if (card1.rank === card2.rank && MINOR_MINOR_FUSIONS[`${card1.rank}-${card2.rank}`]) {
      return MINOR_MINOR_FUSIONS[`${card1.rank}-${card2.rank}`];
    }
    
    // Try generic suit combinations
    const suitKey = `${card1.suit}-${card2.suit}`;
    const reverseSuitKey = `${card2.suit}-${card1.suit}`;
    
    if (MINOR_MINOR_FUSIONS[suitKey]) return MINOR_MINOR_FUSIONS[suitKey];
    if (MINOR_MINOR_FUSIONS[reverseSuitKey]) return MINOR_MINOR_FUSIONS[reverseSuitKey];
    
    // Final fallback
    return {
      name: `${card1.suit} & ${card2.suit} Union`,
      symbol: '🌟',
      description: `Fusion of ${card1.suit} and ${card2.suit} energies`
    };
  }
  
  // Default fallback
  return {
    name: 'Unknown Fusion',
    symbol: '❓',
    description: 'A mysterious combination'
  };
};

// Special tarot fusion combinations
export const TAROT_FUSIONS = {
  // This will be populated dynamically
};

// Check if two cards can be fused
export const canFuseCards = (card1, card2) => {
  if (!card1 || !card2) return false;
  
  // Cannot fuse the same card with itself
  if (card1.id === card2.id) return false;
  
  // Check for tarot fusion
  if (card1.arcana || card2.arcana) {
    return canFuseTarotCards(card1, card2);
  }
  
  // Regular elemental fusion rules
  // Must be same rank
  if (card1.rank !== card2.rank) return false;
  
  // Must be different base suits
  if (card1.suit === card2.suit) return false;
  
  // Must be base elemental suits (not already fused)
  const baseSuits = ['fire', 'earth', 'water', 'air'];
  if (!baseSuits.includes(card1.suit) || !baseSuits.includes(card2.suit)) return false;
  
  // Check if fusion recipe exists
  const fusionKey = `${card1.suit}-${card2.suit}`;
  return FUSION_RECIPES.hasOwnProperty(fusionKey);
};

// Check if two tarot cards can be fused
const canFuseTarotCards = (card1, card2) => {
  // Major + Major fusion - ALL combinations allowed
  if (card1.arcana === 'major' && card2.arcana === 'major') {
    return true;
  }
  
  // Major + Minor fusion - ALL combinations allowed
  if ((card1.arcana === 'major' && card2.arcana === 'minor') ||
      (card1.arcana === 'minor' && card2.arcana === 'major')) {
    return true;
  }
  
  // Major + Element fusion (any elemental card)
  if ((card1.arcana === 'major' && ['fire', 'earth', 'water', 'air'].includes(card2.suit)) ||
      (card2.arcana === 'major' && ['fire', 'earth', 'water', 'air'].includes(card1.suit))) {
    return true;
  }
  
  // Minor + Minor fusion - ALL combinations allowed (not just same suit)
  if (card1.arcana === 'minor' && card2.arcana === 'minor') {
    return true;
  }
  
  return false;
};

// Generate fused card from two source cards
export const generateFusedCard = (card1, card2) => {
  if (!canFuseCards(card1, card2)) return null;
  
  // Handle tarot fusion
  if (card1.arcana || card2.arcana) {
    return generateTarotFusedCard(card1, card2);
  }
  
  // Regular elemental fusion
  const fusionKey = `${card1.suit}-${card2.suit}`;
  const fusedSuit = FUSION_RECIPES[fusionKey];
  const fusedSuitData = FUSION_SUITS[fusedSuit];
  
  const fusedCard = {
    id: `${card1.rank}-${fusedSuit}`,
    rank: card1.rank,
    suit: fusedSuit,
    name: `${card1.rank} of ${fusedSuitData.name}`,
    ppValue: card1.ppValue + card2.ppValue,
    isRune: card1.isRune || card2.isRune,
    isFused: true,
    fusionRecipe: [card1.id, card2.id],
    level: 1,
    xp: 0,
    xpToNextLevel: 150, // Higher XP requirement for fused cards
    rarity: upgradeRarity(card1.rarity || 'common'),
    arcana: 'fusion'
  };
  
  // Combine effects for face cards
  if (fusedCard.isRune) {
    fusedCard.effects = combineEffects(card1, card2, fusedCard);
  }
  
  return fusedCard;
};

// Generate tarot fused card
const generateTarotFusedCard = (card1, card2) => {
  let fusionKey, fusionData, fusedCard;
  
  // Get fusion data using the new system
  fusionData = getFusionName(card1, card2);
  
  // Major + Major fusion
  if (card1.arcana === 'major' && card2.arcana === 'major') {
    fusionKey = [card1.id, card2.id].sort().join('-');
    
    fusedCard = {
      id: `fusion-${fusionKey}`,
      name: fusionData.name,
      arcana: 'transcendent',
      symbol: fusionData.symbol,
      rank: 'Transcendent', // Add rank for compatibility
      ppValue: card1.ppValue + card2.ppValue,
      baseValue: card1.baseValue + card2.baseValue,
      isRune: true,
      isFused: true,
      fusionRecipe: [card1.id, card2.id],
      level: 1,
      xp: 0,
      xpToNextLevel: 300,
      rarity: 'legendary',
      description: fusionData.description
    };
    
    // Combine major arcana effects
    if (card1.effect && card2.effect) {
      fusedCard.effect = {
        type: 'combined_major',
        effects: [card1.effect, card2.effect],
        description: `Combined powers: ${card1.effect.description} AND ${card2.effect.description}`
      };
    }
  }
  // Major + Minor or Major + Element fusion
  else if ((card1.arcana === 'major' && card2.arcana === 'minor') ||
           (card2.arcana === 'major' && card1.arcana === 'minor') ||
           (card1.arcana === 'major' && ['fire', 'earth', 'water', 'air'].includes(card2.suit)) ||
           (card2.arcana === 'major' && ['fire', 'earth', 'water', 'air'].includes(card1.suit))) {
    const majorCard = card1.arcana === 'major' ? card1 : card2;
    const minorCard = card1.arcana === 'major' ? card2 : card1;
    
    fusionKey = `${majorCard.id}-${minorCard.id || minorCard.suit}`;
    
    fusedCard = {
      id: `empowered-${fusionKey}`,
      name: fusionData.name,
      arcana: 'empowered',
      symbol: fusionData.symbol,
      rank: 'Empowered', // Add rank for compatibility
      ppValue: Math.floor((majorCard.ppValue || majorCard.baseValue || 100) * 1.5) + (minorCard.ppValue || minorCard.baseValue || 10),
      baseValue: Math.floor((majorCard.baseValue || majorCard.ppValue || 100) * 1.5),
      isRune: true,
      isFused: true,
      fusionRecipe: [card1.id, card2.id],
      level: 1,
      xp: 0,
      xpToNextLevel: 200,
      rarity: 'epic',
      description: fusionData.description
    };
    
    // Enhanced major arcana effect
    if (majorCard.effect) {
      fusedCard.effect = {
        ...majorCard.effect,
        empowered: true,
        description: `EMPOWERED: ${majorCard.effect.description}`
      };
    }
  }
  // Minor + Minor fusion (any suits)
  else if (card1.arcana === 'minor' && card2.arcana === 'minor') {
    fusionKey = `${card1.id}-${card2.id}`;
    
    fusedCard = {
      id: `enhanced-${card1.suit}-${card1.number || card1.rank || card1.name || '0'}-${card2.number || card2.rank || card2.name || '0'}`,
      name: `${fusionData.name}`,
      arcana: 'enhanced-minor',
      symbol: fusionData.symbol,
      suit: card1.suit || card2.suit,
      rank: 'Fused', // Add a rank property for compatibility
      ppValue: Math.floor(((card1.ppValue || card1.baseValue || 10) + (card2.ppValue || card2.baseValue || 10)) * 1.5),
      baseValue: Math.floor(((card1.baseValue || card1.ppValue || 10) + (card2.baseValue || card2.ppValue || 10)) * 1.5),
      isRune: true,
      isFused: true,
      fusionRecipe: [card1.id, card2.id],
      level: 1,
      xp: 0,
      xpToNextLevel: 150,
      rarity: 'rare',
      description: fusionData.description
    };
    
    // Add combined effects if both cards have effects
    if (card1.effect || card2.effect) {
      const effects = [];
      if (card1.effect) effects.push(card1.effect);
      if (card2.effect) effects.push(card2.effect);
      
      fusedCard.effect = {
        type: 'combined_minor',
        effects: effects,
        description: `Combined minor arcana powers`
      };
    }
  }
  
  return fusedCard;
};

// Upgrade rarity when fusing
const upgradeRarity = (currentRarity) => {
  const rarityProgression = {
    'common': 'uncommon',
    'uncommon': 'rare',
    'rare': 'epic',
    'epic': 'legendary',
    'legendary': 'legendary' // Max rarity
  };
  return rarityProgression[currentRarity] || 'uncommon';
};

// Combine effects for face cards
const combineEffects = (card1, card2, fusedCard) => {
  const effects = [];
  
  // Get individual effects
  const effect1 = card1.effect || generateRuneEffect(card1);
  const effect2 = card2.effect || generateRuneEffect(card2);
  
  // For fusion cards, we create a dual effect
  if (effect1.type !== 'none') effects.push(effect1);
  if (effect2.type !== 'none' && effect2.type !== effect1.type) effects.push(effect2);
  
  // Create combined effect description
  const descriptions = [];
  if (effect1.type === 'suit_bonus') {
    descriptions.push(`${effect1.suit} cards +${Math.round((effect1.multiplier - 1) * 100)}% PP`);
  }
  if (effect2.type === 'suit_bonus' && effect2.suit !== effect1.suit) {
    descriptions.push(`${effect2.suit} cards +${Math.round((effect2.multiplier - 1) * 100)}% PP`);
  }
  if (effect1.type === 'pp_generation' || effect2.type === 'pp_generation') {
    const totalBonus = (effect1.type === 'pp_generation' ? effect1.bonusPP : 0) + 
                      (effect2.type === 'pp_generation' ? effect2.bonusPP : 0);
    descriptions.push(`+${totalBonus.toFixed(1)} PP/sec`);
  }
  
  fusedCard.effect = {
    type: 'fusion',
    effects: effects,
    description: descriptions.join(' & ')
  };
  
  return effects;
};

// Get all possible fusion combinations for display
export const getAllFusionCombinations = () => {
  const combinations = [];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  Object.entries(FUSION_RECIPES).forEach(([recipe, result]) => {
    // Only add one entry per unique fusion (skip reverse combinations)
    if (combinations.some(c => c.result === result)) return;
    
    const [suit1, suit2] = recipe.split('-');
    
    ranks.forEach(rank => {
      combinations.push({
        card1: { rank, suit: suit1 },
        card2: { rank, suit: suit2 },
        result: { rank, suit: result }
      });
    });
  });
  
  return combinations;
};

// Calculate fusion cost based on card properties
export const calculateFusionCost = (card1, card2) => {
  const baseCost = 100;
  
  // Tarot fusion costs more
  if (card1.arcana || card2.arcana) {
    const tarotMultiplier = (card1.arcana === 'major' && card2.arcana === 'major') ? 3 : 2;
    const rarityMultiplier = 
      (card1.rarity === 'legendary' || card2.rarity === 'legendary') ? 2 :
      (card1.rarity === 'epic' || card2.rarity === 'epic') ? 1.5 : 1;
    
    return Math.floor(baseCost * tarotMultiplier * rarityMultiplier);
  }
  
  // Regular fusion cost
  const rankMultiplier = card1.rank === 'A' ? 2 : card1.rank === 'K' || card1.rank === 'Q' || card1.rank === 'J' ? 1.5 : 1;
  const levelMultiplier = (card1.level + card2.level) / 2;
  
  return Math.floor(baseCost * rankMultiplier * levelMultiplier);
};