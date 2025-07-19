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