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
  'Judgement-The World': { name: 'The Great Work', symbol: '🔯', description: 'All is complete' }
};

// Major + Elemental/Minor fusions
const MAJOR_MINOR_FUSIONS = {
  // The Fool + Fire combinations
  'The Fool-A-fire': { name: 'The Spark of Chaos', symbol: '🔥', description: 'New flames of possibility' },
  'The Fool-2-fire': { name: 'The Dancing Flame', symbol: '🕺', description: 'Playful destruction' },
  'The Fool-3-fire': { name: 'The Wild Celebration', symbol: '🎉', description: 'Uncontrolled joy' },
  'The Fool-4-fire': { name: 'The Restless Spirit', symbol: '👻', description: 'Peace disturbed' },
  'The Fool-5-fire': { name: 'The Jester\'s Quarrel', symbol: '🃏', description: 'Conflict without purpose' },
  'The Fool-6-fire': { name: 'The Innocent Victor', symbol: '🏆', description: 'Accidental triumph' },
  'The Fool-7-fire': { name: 'The Reckless Defender', symbol: '🛡️', description: 'Brave but foolish' },
  'The Fool-8-fire': { name: 'The Swift Wanderer', symbol: '💨', description: 'Speed without destination' },
  'The Fool-9-fire': { name: 'The Last Stand', symbol: '🏰', description: 'Defending nothing' },
  'The Fool-10-fire': { name: 'The Burden of Freedom', symbol: '⛓️', description: 'Weight of possibilities' },
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
  
  // Death + Water combinations
  'Death-A-water': { name: 'The First Tear', symbol: '💧', description: 'Grief begins' },
  'Death-2-water': { name: 'The Final Meeting', symbol: '🤝', description: 'Last partnership' },
  'Death-3-water': { name: 'The Wake', symbol: '🍷', description: 'Mourning together' },
  'Death-4-water': { name: 'The Void\'s Echo', symbol: '🕳️', description: 'Emptiness reflects' },
  'Death-5-water': { name: 'The Bitter End', symbol: '☠️', description: 'Loss and regret' },
  'Death-6-water': { name: 'The Ferryman', symbol: '⛵', description: 'Crossing over' },
  'Death-7-water': { name: 'The Last Dream', symbol: '💭', description: 'Visions fade' },
  'Death-8-water': { name: 'The Abandoned Shore', symbol: '🏖️', description: 'Left behind' },
  'Death-9-water': { name: 'The Final Wish', symbol: '🌟', description: 'Last desires' },
  'Death-10-water': { name: 'The Cycle Complete', symbol: '🔄', description: 'End meets beginning' },
  
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
  
  // The Tower + all suits
  'The Tower-A-fire': { name: 'The First Spark', symbol: '⚡', description: 'Destruction begins' },
  'The Tower-5-fire': { name: 'The Burning Revolt', symbol: '🔥', description: 'Chaos erupts' },
  'The Tower-10-fire': { name: 'The Final Collapse', symbol: '💥', description: 'Complete destruction' },
  'The Tower-K-fire': { name: 'The Fallen King', symbol: '👑', description: 'Power toppled' },
  'The Tower-A-earth': { name: 'The First Crack', symbol: '💔', description: 'Foundation fails' },
  'The Tower-K-earth': { name: 'The Ruined Kingdom', symbol: '🏚️', description: 'Empire\'s end' },
  'The Tower-A-water': { name: 'The Breaking Dam', symbol: '🌊', description: 'Emotions unleashed' },
  'The Tower-A-air': { name: 'The Shattered Mind', symbol: '🌪️', description: 'Sanity breaks' },
  
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
  
  // The Sun + all suits
  'The Sun-A-fire': { name: 'The Dawn\'s First Light', symbol: '🌅', description: 'New day begins' },
  'The Sun-3-fire': { name: 'The Solar Festival', symbol: '🎊', description: 'Joy multiplied' },
  'The Sun-6-fire': { name: 'The Victorious Dawn', symbol: '🏆', description: 'Success illuminated' },
  'The Sun-K-fire': { name: 'The Solar King', symbol: '☀️', description: 'Radiant rule' },
  'The Sun-Q-fire': { name: 'The Light Bearer', symbol: '👸', description: 'Joy\'s empress' },
  'The Sun-A-water': { name: 'The Rainbow', symbol: '🌈', description: 'Joy after tears' },
  'The Sun-A-earth': { name: 'The Golden Seed', symbol: '🌻', description: 'Prosperity planted' },
  'The Sun-K-earth': { name: 'The Midas', symbol: '👑', description: 'Golden touch' },
  'The Sun-A-air': { name: 'The Clear Sky', symbol: '☀️', description: 'Clarity dawns' },
  
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
  'The World-A-earth': { name: 'The Philosopher\'s Stone', symbol: '💎', description: 'Ultimate transformation' }
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
    const key = `${majorCard.name}-${minorCard.rank || minorCard.number}-${minorCard.suit}`;
    
    if (MAJOR_MINOR_FUSIONS[key]) {
      return MAJOR_MINOR_FUSIONS[key];
    }
    
    // Fallback for combinations not pre-defined
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