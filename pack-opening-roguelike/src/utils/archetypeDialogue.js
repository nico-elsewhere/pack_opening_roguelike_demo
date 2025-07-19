// Archetype dialogue system
export const RULER_DIALOGUE = {
  // High scoring hands (150+ PP)
  highScore: [
    "Now THIS is how you build an empire!",
    "Magnificent! Even I am impressed.",
    "A display worthy of royalty.",
    "Power flows through these cards like water through my realm.",
    "Such command! You've learned well.",
    "Excellent. This is what dominion looks like.",
    "A king's ransom in a single hand!",
    "The throne trembles at such might.",
    "Behold! This is how legends are forged.",
    "My subjects would kneel before such a display."
  ],

  // Medium scoring hands (75-149 PP)
  mediumScore: [
    "Adequate. But empires demand more.",
    "A respectable showing for a commoner.",
    "You show promise, but not excellence.",
    "Hmm. My generals could do better.",
    "Serviceable. Nothing more.",
    "A duke's effort, not a king's.",
    "You'll need stronger hands to rule.",
    "Mediocrity has no place in my court.",
    "Is this the best you can muster?",
    "My patience wears thin with such displays."
  ],

  // Low scoring hands (below 75 PP)
  lowScore: [
    "Pathetic! Are you even trying?",
    "This wouldn't buy you bread in my kingdom.",
    "Disgraceful. Simply disgraceful.",
    "My servants score better in their sleep.",
    "Is this some sort of jest?",
    "You insult the crown with such weakness.",
    "Perhaps you'd be better suited as a jester.",
    "Even peasants show more ambition.",
    "Truly, you test my royal patience.",
    "Guards! Remove this... attempt from my sight."
  ],

  // Perfect/synergy hands
  perfectSynergy: [
    "Ah! A hand worthy of the royal archives!",
    "Such harmony! Like my perfectly ordered kingdom.",
    "This is what true sovereignty looks like.",
    "Poetry in motion, power in practice.",
    "My ancestors smile upon this arrangement.",
    "Flawless execution. You have my attention.",
    "This is how dynasties are built!",
    "Sublime! Even the stars align for such plays.",
    "A masterclass in dominion.",
    "Witness the birth of legend!"
  ],

  // All same suit
  sameSuit: [
    "Unity! Just as I unite my kingdoms.",
    "A royal flush of power!",
    "Such focus reminds me of my single-minded rule.",
    "Ah, the beauty of absolute alignment.",
    "Like my armies - unified and unstoppable.",
    "This is what happens when all serve one purpose.",
    "Magnificent cohesion!",
    "As focused as my gaze upon the throne.",
    "A kingdom united cannot fall!",
    "Such purity of purpose!"
  ],

  // Mixed suits
  mixedSuits: [
    "Chaos! Bring order to this madness.",
    "Too many voices, not enough command.",
    "A kingdom divided, as they say...",
    "Focus! An empire needs direction.",
    "This lacks the unity of true power.",
    "Scattered like rebels. Unacceptable.",
    "Where is your discipline?",
    "Even my council shows more harmony.",
    "Consolidate your power!",
    "This disarray offends my sensibilities."
  ],

  // Multiple duplicates
  duplicates: [
    "Ah, multiplication of power. I approve.",
    "Like my many castles across the realm.",
    "Repetition is the mother of dominion.",
    "An army of sameness. How delightful.",
    "Clones of greatness!",
    "This reminds me of my loyal guards.",
    "Uniformity breeds strength.",
    "Carbon copies of excellence!",
    "A wise ruler knows the power of redundancy.",
    "Multiple paths to the same throne."
  ],

  // Gen 3 creatures
  gen3Creatures: [
    "Behold! Evolution serves the crown!",
    "Even creatures bow to proper breeding.",
    "My royal stables would be proud.",
    "Such magnificent beasts for my collection!",
    "These would make fine additions to my menagerie.",
    "Power breeding at its finest!",
    "Creatures worthy of the royal seal.",
    "My kingdom's might grows with each generation.",
    "Selective breeding - a ruler's prerogative.",
    "These beasts recognize true authority."
  ],

  // Low value cards played
  lowValueCards: [
    "Even pawns have their place in my game.",
    "The small shall serve the great.",
    "Peasant cards for peasant scores.",
    "Sometimes we must lower ourselves...",
    "Even kings must sometimes count coppers.",
    "The foundation of empires, I suppose.",
    "From humble beginnings... stay humble.",
    "My treasury weeps at such values.",
    "Are these cards or bread crumbs?",
    "I've seen beggars with better hands."
  ],

  // High value cards played
  highValueCards: [
    "Now we're speaking my language!",
    "Cards befitting a monarch!",
    "This is the currency of kings!",
    "Ah, the weight of true value.",
    "My vaults sing with such numbers!",
    "Premium cards for premium rulers.",
    "This is what wealth looks like.",
    "Even other kings would envy these.",
    "The golden standard!",
    "Value recognizes value."
  ],

  // Last pack warning
  lastPack: [
    "The final decree approaches. Make it count!",
    "Last chance to prove your worth to the crown.",
    "Even kings face final judgments.",
    "The endgame. Show me greatness!",
    "One pack remains. One chance for glory.",
    "The throne awaits your final play.",
    "Make this last tribute worthy!",
    "Final opportunities separate kings from pawns.",
    "The last act of your performance begins.",
    "End with power, or end in shame."
  ],

  // Dream threshold close (within 20%)
  almostThreshold: [
    "So close to conquering this realm!",
    "The throne is within your grasp!",
    "I can taste victory on the horizon.",
    "Push forward! The crown awaits!",
    "Almost there. Don't falter now!",
    "The dream bends to your will!",
    "Victory courts those who persevere!",
    "I smell triumph in the air!",
    "The threshold trembles before you!",
    "One more push to claim this dream!"
  ],

  // Dream threshold far (less than 50%)
  farFromThreshold: [
    "The dream mocks your feeble attempts.",
    "At this rate, you'll never see the throne.",
    "Perhaps lower your ambitions?",
    "The crown grows ever distant.",
    "Even nightmares laugh at this progress.",
    "You're further from victory than a peasant from nobility.",
    "This dream will consume you whole.",
    "Pathetic progress for one who would rule.",
    "The threshold might as well be in another kingdom.",
    "Have you considered abdication?"
  ],

  // Nightmare specific
  nightmare: [
    "Even nightmares bow before true power!",
    "I've conquered worse in my sleep.",
    "Darkness holds no fear for kings.",
    "My will illuminates the darkest dreams.",
    "Nightmares? I AM the nightmare of my enemies!",
    "This shadow realm will kneel like all others.",
    "Terror is just another subject to rule.",
    "I've dined with demons and made them serve.",
    "Fear is for subjects, not sovereigns.",
    "Let the darkness come. I'll crown it too."
  ],

  // Dream of Abundance active
  dreamAbundance: [
    "Abundance flows through my realm naturally.",
    "Even dreams recognize my divine right to prosper.",
    "More! More! A king deserves abundance!",
    "This dream showers gifts upon the worthy.",
    "My coffers overflow with dream-given wealth!",
    "Abundance is my birthright!",
    "The universe provides for its chosen rulers.",
    "Such generosity befits a king!",
    "My kingdom thrives on such bounty!",
    "Abundance recognizes true nobility."
  ],

  // Multiple mementos collected
  manyMementos: [
    "My collection of power grows ever larger!",
    "Each memento a jewel in my crown!",
    "Behold my accumulated might!",
    "Trophies of conquest line my halls!",
    "My power compounds with each treasure!",
    "A ruler's strength lies in their collection.",
    "These mementos sing of my victories!",
    "My arsenal would make gods envious!",
    "Each memento a kingdom conquered!",
    "I hoard power like dragons hoard gold!"
  ],

  // Empty board slots
  emptySlots: [
    "Empty thrones are wasted opportunities!",
    "Fill these voids with power!",
    "A kingdom with gaps is a kingdom that falls!",
    "Vacancies in my court? Unacceptable!",
    "Empty spaces, empty promises.",
    "Even air should serve a purpose in my realm!",
    "These gaps offend my sense of order!",
    "Incomplete! Like a crown missing jewels!",
    "Fill every position or face my wrath!",
    "Emptiness is the enemy of empire!"
  ],

  // Perfect board (all 5 slots filled optimally)
  perfectBoard: [
    "A full court! This is how you rule!",
    "Every position filled, every role defined!",
    "This board could govern nations!",
    "Perfect placement, perfect power!",
    "Like my round table, complete and mighty!",
    "This is what absolute control looks like!",
    "A symphony of sovereignty!",
    "Each card in its place, each place with purpose!",
    "My royal advisors could learn from this!",
    "Behold the perfect hierarchy!"
  ],

  // Early game encouragement
  earlyDream: [
    "The journey to greatness begins with a single step.",
    "Even I started as a mere prince.",
    "Early dreams plant the seeds of empire.",
    "Foundation first, glory follows.",
    "Every monarch was once untested.",
    "Build wisely, rule eternally.",
    "The crown awaits those who persevere.",
    "Small beginnings can yield great endings.",
    "Patience, young sovereign. Power comes.",
    "Rome wasn't built in a dream."
  ],

  // Late game pressure
  lateDream: [
    "The final acts define the ruler!",
    "History watches your every move now!",
    "This is where legends separate from footnotes!",
    "The weight of dreams grows heavy!",
    "Prove you deserve the throne you've claimed!",
    "No room for error in the final kingdom!",
    "The crown grows heavy in late hours!",
    "Endgame requires an emperor's wisdom!",
    "Show them why you still stand!",
    "The final test of sovereignty approaches!"
  ],

  // Random philosophical
  philosophical: [
    "Power is not given, it is taken and held.",
    "A throne is but a bench covered in velvet.",
    "To rule others, one must first rule oneself.",
    "Heavy is the head, but heavier still is weakness.",
    "Kingdoms rise and fall, but legends endure.",
    "The greatest throne is the mind that controls it.",
    "Fear and love - a ruler needs both in measure.",
    "Destiny favors those who seize it.",
    "A king without power is just a man with a hat.",
    "The strong do what they can, the weak suffer what they must."
  ]
};

// Fusion-specific dialogue
export const RULER_FUSION_DIALOGUE = {
  // Gen1 + Gen1 = Gen2
  gen2Fusion: [
    "Ah, breeding the next generation of subjects!",
    "Royal bloodlines must be maintained.",
    "A new noble is born to serve the crown!",
    "Witness the power of selective breeding!",
    "Another addition to my growing empire.",
    "Excellent! Fresh blood for the kingdom.",
    "The dynasty grows stronger with each fusion.",
    "My royal menagerie expands!"
  ],
  
  // Gen2 + Gen2 = Gen3 or other high-tier fusions
  gen3Fusion: [
    "Behold! A creature worthy of the throne room!",
    "Now THIS is power incarnate!",
    "Such majesty! Even I am humbled.",
    "A beast fit for a king's army!",
    "Magnificent! My enemies will tremble!",
    "The apex of creation bows before me!",
    "This... this is what true dominion looks like!",
    "My empire's greatest weapon is born!"
  ],
  
  // Legendary or rare fusions
  legendaryFusion: [
    "BY MY CROWN! What power!",
    "The stuff of legends! Even I am awed!",
    "History will remember this moment!",
    "Songs will be sung of this creature!",
    "A fusion worthy of the royal vault!",
    "The crown jewel of my collection!",
    "Unparalleled! Unmatched! UNSTOPPABLE!",
    "This changes everything!"
  ],
  
  // Failed or weak fusions
  weakFusion: [
    "Well... even kings have their failures.",
    "Perhaps we should keep this one in the dungeons.",
    "Not every subject can be exceptional.",
    "Hmm. The royal taste-tester, perhaps?",
    "Even empires have their... lesser citizens.",
    "We'll find a use for it. Somewhere.",
    "Royal decree: Never speak of this fusion.",
    "The court jester has a new pet."
  ]
};

// Creature name templates for dynamic dialogue
const RULER_NAME_TEMPLATES = {
  generic: [
    "Ah, a {name}! A fine addition to the royal menagerie!",
    "Behold! The mighty {name} emerges to serve the crown!",
    "By my scepter! This {name} shall strike fear into my enemies!",
    "{name}... Yes, this creature recognizes true royalty!",
    "The {name} bows before its rightful sovereign!",
    "Excellent! The {name} will serve the empire well!",
    "A {name} worthy of the throne room's protection!",
    "My collection grows richer with this {name}!"
  ],
  
  impressive: [
    "MAGNIFICENT! The legendary {name} graces my kingdom!",
    "By the crown jewels! A {name} of such power!",
    "The prophesied {name}! Even I am honored!",
    "Historians will mark this day - the birth of {name}!",
    "The {name}... I've only heard tales of such majesty!",
    "Behold! The {name} that shall lead my armies to victory!",
    "This {name} could topple kingdoms with its might!",
    "Even emperors dream of commanding a {name}!"
  ],
  
  dismissive: [
    "A {name}? Well, even kingdoms need stable hands...",
    "The {name} can guard the servant's quarters, I suppose.",
    "Hmm, a {name}. The kitchen staff needs a mascot.",
    "This {name} shall... polish the armor, perhaps?",
    "A humble {name}. Every empire needs its workers.",
    "The {name} - adequate for menial tasks.",
    "I suppose this {name} can tend the royal gardens.",
    "A {name}... The jesters will appreciate the company."
  ]
};

// Keywords that trigger special responses
const CREATURE_KEYWORDS = {
  dragon: [
    "A DRAGON! The ultimate symbol of royal power!",
    "Dragons and kings - a partnership as old as time!",
    "This dragon shall be the jewel of my kingdom!",
    "Even other monarchs will envy my dragon!",
    "A dragon worthy of legend and song!"
  ],
  phoenix: [
    "The immortal phoenix! A sign of my eternal reign!",
    "Like my empire, this phoenix shall rise eternal!",
    "The phoenix - rebirth and royalty combined!",
    "Behold! The phoenix that heralds a golden age!",
    "My dynasty shall be as eternal as this phoenix!"
  ],
  shadow: [
    "From shadows comes power - and this serves ME!",
    "The darkness bends to my will through this creature!",
    "Shadow and crown - both command fear and respect!",
    "My enemies shall fear the darkness I command!",
    "Even shadows recognize their true master!"
  ],
  storm: [
    "The storm itself bows to royal decree!",
    "I command the tempest through this mighty beast!",
    "Let thunder announce my sovereignty!",
    "The storm - nature's fury at my command!",
    "Even hurricanes kneel before the crown!"
  ],
  titan: [
    "A TITAN! Proof that I rule over giants!",
    "This titan shall carry my throne into battle!",
    "Behold the titan that guards my empire!",
    "Mountains tremble before my titan!",
    "The stuff of myths now serves the crown!"
  ],
  god: [
    "Even gods recognize my divine right to rule!",
    "A deity in my service? As it should be!",
    "The divine bows before the temporal crown!",
    "My reign is blessed by the gods themselves!",
    "Godhood pales before true sovereignty!"
  ],
  knight: [
    "A fellow warrior of noble bearing! Welcome to my ranks!",
    "This knightly creature shall lead my vanguard!",
    "Honor and loyalty - the hallmarks of my empire!",
    "My round table grows stronger with this noble beast!",
    "Chivalry lives on through my commanded creatures!"
  ],
  demon: [
    "Even demons kneel before absolute power!",
    "The infernal recognizes its true master!",
    "Hell itself provides tribute to my throne!",
    "Demonic power channeled through royal will!",
    "Let my enemies face the demons I command!"
  ],
  angel: [
    "The heavens smile upon my righteous rule!",
    "An angel in service to the crown - destiny fulfilled!",
    "Divine mandate made manifest through this being!",
    "My reign is truly blessed from above!",
    "Angelic might enforces royal decree!"
  ],
  beast: [
    "The wild bows to civilization's might!",
    "Nature's fury tamed by royal command!",
    "This beast shall be the terror of my enemies!",
    "From savage to servant - the power of kingship!",
    "My menagerie's newest and fiercest addition!"
  ],
  spirit: [
    "The ethereal realm acknowledges my sovereignty!",
    "Spirits dance at my command!",
    "Even the intangible serves the crown!",
    "My will extends beyond the material plane!",
    "Ghostly power enforces royal justice!"
  ],
  elemental: [
    "The very elements bend to royal will!",
    "Primal forces serve at my pleasure!",
    "Nature's building blocks assembled for my glory!",
    "Elemental power flows through my scepter!",
    "The fundamental forces recognize their king!"
  ],
  void: [
    "From nothing comes everything - at my command!",
    "The void itself yields to royal decree!",
    "Emptiness filled with imperial purpose!",
    "Even nothingness serves the crown!",
    "The abyss gazes back - and bows!"
  ],
  ancient: [
    "The old ways serve the new order!",
    "Ancient power awakens at my call!",
    "Time itself bends knee to the throne!",
    "Prehistoric might for a modern empire!",
    "The elders recognize their sovereign!"
  ]
};

// Special unique dialogue for specific creatures
const UNIQUE_CREATURE_DIALOGUE = {
  // Add specific creature names here as they become popular
  // Example: "Flamewraith Titan": "The Flamewraith Titan! Songs will be sung of this day!"
};

// Stat-based dialogue for impressive creatures
const STAT_BASED_DIALOGUE = {
  highHP: [ // HP >= 100
    "Such vitality! This creature could withstand armies!",
    "Immortal constitution worthy of an emperor!",
    "This beast's endurance rivals my eternal reign!",
    "Unbreakable! Like my iron grip on the throne!",
    "Health that would make gods envious!"
  ],
  highCR: [ // Challenge Rating >= 15
    "Power levels that shake the very foundations!",
    "A challenge rating that commands respect!",
    "This creature's might is almost... kingly!",
    "Few dare face such overwhelming power!",
    "Strength that could conquer nations!"
  ],
  veryHighCR: [ // Challenge Rating >= 20
    "UNPRECEDENTED POWER! Even I am impressed!",
    "This... this changes the balance of power!",
    "A creature of apocalyptic might serves ME!",
    "The stuff of nightmares and legends combined!",
    "Reality itself trembles at this being's presence!"
  ]
};

// Get fusion dialogue for the Ruler with creature-specific responses
export function getRulerFusionDialogue(fusedCard, sourceCards) {
  // First check for unique creature dialogue
  if (fusedCard.name && UNIQUE_CREATURE_DIALOGUE[fusedCard.name]) {
    return UNIQUE_CREATURE_DIALOGUE[fusedCard.name];
  }
  
  // Check for keyword matches in creature name
  if (fusedCard.name) {
    const lowerName = fusedCard.name.toLowerCase();
    for (const [keyword, responses] of Object.entries(CREATURE_KEYWORDS)) {
      if (lowerName.includes(keyword)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }
  
  // Check for stat-based dialogue
  if (fusedCard.challengeRating >= 20) {
    return STAT_BASED_DIALOGUE.veryHighCR[Math.floor(Math.random() * STAT_BASED_DIALOGUE.veryHighCR.length)];
  } else if (fusedCard.challengeRating >= 15) {
    return STAT_BASED_DIALOGUE.highCR[Math.floor(Math.random() * STAT_BASED_DIALOGUE.highCR.length)];
  } else if (fusedCard.maxHp >= 100) {
    return STAT_BASED_DIALOGUE.highHP[Math.floor(Math.random() * STAT_BASED_DIALOGUE.highHP.length)];
  }
  
  // Use template-based dialogue
  if (fusedCard.name) {
    let templates;
    
    // Choose template category based on creature attributes
    if (fusedCard.rarity === 'legendary' || fusedCard.rarity === 'epic') {
      templates = RULER_NAME_TEMPLATES.impressive;
    } else if (fusedCard.rarity === 'common' && fusedCard.challengeRating < 3) {
      templates = RULER_NAME_TEMPLATES.dismissive;
    } else if (fusedCard.challengeRating >= 10 || fusedCard.maxHp >= 50) {
      templates = RULER_NAME_TEMPLATES.impressive;
    } else {
      templates = RULER_NAME_TEMPLATES.generic;
    }
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace(/{name}/g, fusedCard.name);
  }
  
  // Fallback to original generation-based dialogue
  const dialoguePool = [];
  
  if (sourceCards[0]?.generation === 'Gen1' && sourceCards[1]?.generation === 'Gen1') {
    dialoguePool.push(...RULER_FUSION_DIALOGUE.gen2Fusion);
  } else if (sourceCards[0]?.generation === 'Gen2' && sourceCards[1]?.generation === 'Gen2') {
    dialoguePool.push(...RULER_FUSION_DIALOGUE.gen3Fusion);
  }
  
  if (fusedCard.rarity === 'legendary' || fusedCard.rarity === 'epic') {
    dialoguePool.push(...RULER_FUSION_DIALOGUE.legendaryFusion);
  } else if (fusedCard.rarity === 'common') {
    dialoguePool.push(...RULER_FUSION_DIALOGUE.weakFusion);
  }
  
  if (dialoguePool.length === 0) {
    dialoguePool.push(...RULER_FUSION_DIALOGUE.gen2Fusion);
  }
  
  return dialoguePool[Math.floor(Math.random() * dialoguePool.length)];
}

// Function to select appropriate dialogue based on game context
export function getRulerDialogue(gameContext) {
  const {
    lastScore,
    boardSlots,
    remainingPacks,
    dreamScore,
    dreamThreshold,
    isNightmare,
    dreamEffects,
    archetypeMementos,
    collection,
    dreamNumber
  } = gameContext;

  // Calculate context
  const progressPercent = (dreamScore / dreamThreshold) * 100;
  const hasGen3 = boardSlots.some(card => card?.generation === 'Gen3');
  const emptySlots = boardSlots.filter(slot => !slot).length;
  const allSameSuit = boardSlots.filter(card => card).every((card, _, arr) => 
    card.suit === arr[0]?.suit
  );
  
  // Priority-based selection
  if (lastScore >= 150) {
    return selectRandom(RULER_DIALOGUE.highScore);
  }
  
  if (emptySlots === 5) {
    return selectRandom(RULER_DIALOGUE.emptySlots);
  }
  
  if (emptySlots === 0 && lastScore >= 100) {
    return selectRandom(RULER_DIALOGUE.perfectBoard);
  }
  
  if (remainingPacks === 1) {
    return selectRandom(RULER_DIALOGUE.lastPack);
  }
  
  if (isNightmare) {
    return selectRandom(RULER_DIALOGUE.nightmare);
  }
  
  if (hasGen3) {
    return selectRandom(RULER_DIALOGUE.gen3Creatures);
  }
  
  if (allSameSuit && boardSlots.filter(c => c).length >= 3) {
    return selectRandom(RULER_DIALOGUE.sameSuit);
  }
  
  if (progressPercent >= 80) {
    return selectRandom(RULER_DIALOGUE.almostThreshold);
  }
  
  if (progressPercent < 50 && dreamNumber > 3) {
    return selectRandom(RULER_DIALOGUE.farFromThreshold);
  }
  
  if (lastScore < 75) {
    return selectRandom(RULER_DIALOGUE.lowScore);
  }
  
  if (dreamNumber <= 2) {
    return selectRandom(RULER_DIALOGUE.earlyDream);
  }
  
  if (dreamNumber >= 8) {
    return selectRandom(RULER_DIALOGUE.lateDream);
  }
  
  // Default to medium score or philosophical
  return selectRandom([
    ...RULER_DIALOGUE.mediumScore,
    ...RULER_DIALOGUE.philosophical
  ]);
}

function selectRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}