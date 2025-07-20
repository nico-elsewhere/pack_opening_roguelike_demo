# Pack Opening Roguelike - Development Notes

## Project Overview
A pack opening roguelike game that combines card collection mechanics with Balatro-style scoring and roguelike progression. Players open packs, build hands, and score points through strategic card placement and synergies.

## Core Game Modes

### Classic Mode
- Traditional pack opening with currency (PP)
- Buy packs, open cards, build collection
- Trade/fuse cards for better ones

### Roguelike Mode
- Dream-based progression system
- 5-card hands scored Balatro-style
- Archetype selection (Scholar, Ruler, Wanderer)
- Pack-based rewards after each dream

## Current Systems

### Scoring System
- Cards revealed left-to-right with animations
- Scores displayed above cards (yellow text on dark background)
- Dynamic scoring based on card synergies and effects
- Running total displayed during scoring

### Card Abilities (Implemented)
- **Fred** - "Fredmaxxing" - Each Fred multiplies the next Fred by x2
- **Loopine** - "Time Loop" - After scoring, rescore all cards from Loopine's position

### Archetype System
Each archetype has unique dialogue and abilities:
- **Scholar** - Analyzes patterns, provides strategic insights
- **Ruler** - Commands respect, fusion expertise
- **Wanderer** - Philosophical, focuses on the journey

### Reward System
After completing dreams, players choose from 3 upgrade packs:
- **Level Pack** - Pick 1 of 5 cards to level up
- **Fusion Pack** - Pick 2 of 5 cards to fuse (free in roguelike)
- **Memento Pack** - Pick 1 of 5 archetype mementos

## Upcoming Features

### Token System
A new scoring mechanic where cards generate and interact with tokens:

#### Core Concept
- Tokens are temporary resources generated during a hand
- Each token type has a base value (e.g., Fire = 10 PP)
- Tokens accumulate and affect scoring
- Tokens reset between hands

#### Example Token Types
- **Fire Tokens** - Base value: 10 PP each
- **Water Tokens** - Base value: 10 PP each
- **Earth Tokens** - Base value: 10 PP each
- **Air Tokens** - Base value: 10 PP each
- **Shadow Tokens** - Negative value, but enable powerful effects
- **Light Tokens** - Multiplies other token values

#### Example Card Effects
- **Elwick** - "Adds 5 Fire tokens to your score"
- **Aquara** - "Gains +5 PP for each Water token"
- **Pyrrhus** - "Doubles all Fire tokens"
- **Tempest** - "Convert all tokens to Air tokens"

### Gen 1 Card Effects Design
Every Gen 1 card should have a unique effect that creates strategic depth:

#### Effect Categories
1. **Token Generators** - Add tokens to the pool
2. **Token Manipulators** - Convert, multiply, or consume tokens
3. **Conditional Scorers** - Score based on board state
4. **Position-Based** - Effects based on card position
5. **Card Synergies** - Interact with other specific cards
6. **Multipliers** - Multiply scores under conditions
7. **Utility Effects** - Manipulate hand or board state

#### Strategic Considerations
- Effects should encourage different playstyles
- Token management becomes a key decision
- Card positioning matters more
- Synergies between different token types
- Risk/reward with negative tokens

## Technical Architecture

### Key Files
- `src/components/v2/RoguelikeBoard.jsx` - Main game board and scoring logic
- `src/utils/dynamicScoring.js` - Score calculation and card effects
- `src/components/v2/UnifiedPackOpening.jsx` - Pack opening and reveal animations
- `src/utils/dreams.js` - Dream effects and progression

### State Management
- Game state managed at App.jsx level
- Local component state for animations and UI
- Collection stored as object with card IDs as keys

### Scoring Flow
1. Player places 5 cards on board
2. Click "Score Board" 
3. Cards revealed left-to-right with delays
4. Each card's effect processes in order
5. Scores animate above cards
6. Total score updates dream progress

### Animation System
- CSS-based animations for card reveals
- Sequential floating text for ability triggers
- Staggered timing for visual polish
- State-driven animation phases

## Development Guidelines

### Code Style
- No comments unless explicitly requested
- Follow existing patterns in codebase
- Use existing animation systems
- Maintain consistent timing (300-600ms for most animations)

### Testing Approach
- Test card effects in isolation first
- Verify token accumulation and reset
- Check edge cases (0 tokens, negative values)
- Ensure animations don't break with new effects

### Performance Considerations
- Minimize re-renders during scoring
- Batch state updates where possible
- Use CSS animations over JS when feasible
- Keep scoring calculations efficient

## Next Implementation Steps

1. **Token System Foundation**
   - Add token state to RoguelikeBoard
   - Create token display UI
   - Implement token reset between hands

2. **Token Integration in Scoring**
   - Modify dynamicScoring.js to handle tokens
   - Add token parameter to score calculations
   - Create token value calculations

3. **Card Effect System**
   - Create effect definitions for each Gen 1 card
   - Implement effect processing in scoring flow
   - Add visual feedback for effect triggers

4. **UI/UX for Tokens**
   - Token counter display during scoring
   - Animated token generation
   - Token type indicators (icons/colors)

5. **Balance and Testing**
   - Playtest different token strategies
   - Adjust token values and card effects
   - Ensure no dominant strategies

## Commands to Run
- `npm run dev` - Start development server
- `npm test` - Run tests (if available)
- `npm run build` - Build for production

## Implementation Status

### Completed Features
1. **Token System Foundation** ✅
   - TokenDisplay component shows active tokens
   - Token state management in RoguelikeBoard
   - Tokens reset between hands
   - Token values calculated in final score

2. **Card Size Improvements** ✅
   - Cards are 1.5x larger in roguelike mode (180x252px)
   - Effect text displays below creature image
   - Responsive sizing maintained

3. **Gen 1 Card Effects** ✅
   - All Gen 1 creatures have unique effects
   - Effects defined in creatureEffects.js
   - Effects display on cards in roguelike mode
   - Token generation, manipulation, and synergies implemented

4. **Fusion Inheritance** ✅
   - Gen 2 creatures inherit both parent effects
   - Gen 3 creatures inherit all 4 grandparent effects
   - PP values sum correctly (parent1 + parent2)
   - Effect text shows combined effects with " & " separator

5. **Scoring Integration** ✅
   - Effects process during card reveal
   - Tokens update in real-time
   - Token values included in running total
   - Final score includes all token contributions

6. **Debug Test Scenario System** ✅
   - Load test scenarios directly in game UI
   - Categorized scenarios (fire, water, earth, etc.)
   - Auto-fills to 5 creatures for valid scoring
   - Shows expected vs actual results
   - Handles Gen2/Gen3 creatures dynamically

## Recent Progress (2025-07-20)

### Debug Test Scenario System
1. **Created comprehensive test scenario loader**
   - Added UI in debug panel (🧪 button)
   - Scenarios categorized by type (fire, water, earth, air, shadow, special, dream, edge)
   - Auto-fills empty slots with Flitterfin to ensure 5 creatures
   - Shows expected vs actual results panel

2. **Fixed creature loading issues**
   - Handles Gen2/Gen3 creatures that don't exist in collection yet
   - Added TestCreature and Flitterfin to CREATURE_EFFECTS
   - All creatures now have proper abilities, PP values, and metadata
   - Better console logging for debugging

3. **Test Integration**
   - Created comprehensive test suites for roguelike mode
   - Tests cover scoring, abilities, tokens, animations, and integration
   - ~50% of creature ability tests currently passing

## Known Issues
- Gen 1 creature abilities are too complex with 12 different token types
- Players struggle to understand token interactions and synergies
- Too many tokens make strategic planning difficult

## Next Steps - Ability System Redesign

### Current Problems:
1. **Too Many Token Types** (12 total):
   - strength, fire, water, earth, air, shadow, light, chaos, order, wild, tech, void
   - Overwhelming for players to track
   - Hard to plan synergies

2. **Unclear Token Roles**:
   - Some tokens have similar effects
   - Token conversion chains are confusing
   - Not clear which tokens are "good" vs utility

### Proposed Redesign:
1. **Reduce to 5-6 Core Token Types**
   - Keep thematically distinct tokens (fire, water, earth, air)
   - Merge similar tokens (combine shadow/void, light/order)
   - Make each token have clear, unique role

2. **Clearer Ability Templates**:
   - "Gain X [token]. Score +Y per [token]"
   - "Convert X [token] to Y [token]"
   - "Double all [token]"
   - "If X+ [token]: [effect]"

3. **Visual Token Hierarchy**:
   - Basic tokens (elements): Common, direct scoring
   - Advanced tokens (light/shadow): Rarer, multiplier effects
   - Meta tokens (strength): Affect all scoring

4. **Simplified Synergies**:
   - Clear conversion paths (water→steam→air)
   - Obvious combos (fire + earth = more fire)
   - Token "families" that work together

## Future Considerations
- Visual effects for token generation
- Sound effects for abilities
- Token animations when consumed/transformed
- Persistent token effects (between hands)
- Token-based dream effects
- Archetype-specific token bonuses
- Simplified token UI with better grouping
- In-game token guide/reference
- Balance testing for all effects