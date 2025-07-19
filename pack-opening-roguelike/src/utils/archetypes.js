// Jungian Archetypes for Roguelike Mode

export const ARCHETYPES = {
  ruler: {
    id: 'ruler',
    name: 'The Ruler',
    icon: '👑',
    description: 'Born to lead, you command more resources',
    effect: {
      type: 'extra_packs',
      value: 1,
      description: '+1 pack per room'
    },
    color: '#FFD700'
  },
  sage: {
    id: 'sage',
    name: 'The Sage',
    icon: '🔮',
    description: 'Wisdom guides your path to greater understanding',
    effect: {
      type: 'xp_multiplier',
      value: 1.5,
      description: '50% more XP for all cards'
    },
    color: '#6B46C1'
  },
  hero: {
    id: 'hero',
    name: 'The Hero',
    icon: '⚔️',
    description: 'Courage makes you stronger in adversity',
    effect: {
      type: 'nightmare_resistance',
      value: 0.5,
      description: 'Nightmare effects reduced by 50%'
    },
    color: '#DC2626'
  },
  innocent: {
    id: 'innocent',
    name: 'The Innocent',
    icon: '🌟',
    description: 'Pure of heart, luck favors you',
    effect: {
      type: 'rarity_boost',
      value: 0.1,
      description: '+10% chance for rare cards'
    },
    color: '#10B981'
  }
};

// Archetype mementos - powerful items gained during nightmares
export const MEMENTOS = {
  ruler: [
    {
      id: 'crown_of_dominion',
      name: 'Crown of Dominion',
      description: 'First card in hand scores 3x',
      effect: { type: 'position_multiplier', position: 0, multiplier: 3 }
    },
    {
      id: 'scepter_of_command',
      name: 'Scepter of Command',
      description: 'All face cards score +20',
      effect: { type: 'card_type_bonus', cardType: 'face', bonus: 20 }
    }
  ],
  sage: [
    {
      id: 'tome_of_knowledge',
      name: 'Tome of Knowledge',
      description: 'Cards gain double XP this run',
      effect: { type: 'xp_multiplier', multiplier: 2 }
    },
    {
      id: 'crystal_of_insight',
      name: 'Crystal of Insight',
      description: 'See the next pack before opening',
      effect: { type: 'pack_preview' }
    }
  ],
  hero: [
    {
      id: 'blade_of_valor',
      name: 'Blade of Valor',
      description: 'Low value cards (<10) score 2x',
      effect: { type: 'underdog_multiplier', threshold: 10, multiplier: 2 }
    },
    {
      id: 'shield_of_courage',
      name: 'Shield of Courage',
      description: 'Immune to one nightmare effect',
      effect: { type: 'nightmare_shield', uses: 1 }
    }
  ],
  innocent: [
    {
      id: 'lucky_charm',
      name: 'Lucky Charm',
      description: '20% chance to double any card\'s score',
      effect: { type: 'luck_multiplier', chance: 0.2, multiplier: 2 }
    },
    {
      id: 'pure_heart',
      name: 'Pure Heart',
      description: 'Common cards can trigger rare effects',
      effect: { type: 'rarity_upgrade' }
    }
  ]
};