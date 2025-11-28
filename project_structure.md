# ChessFlip - On-Chain Chess Card Flip Game

## Project Overview
A minimalistic on-chain chess card flip game on Sui blockchain where users flip chess pieces to match pairs, earn points, and compete on a leaderboard.

---

## Core Game Mechanics

### Game Rules
- **Card Setup**: 6 pairs of chess pieces (12 cards total) flipped face-down
- **Lives System**: 5 attempts per game
- **Win Condition**: Match all 6 pairs before running out of lives
- **Points System**: 
  - Win: +10 points
  - Unclaimed/Lost: +2 points (consolation)
- **Cost**: 0.001 SUI per game (paid upfront)

---

## Frontend Architecture

### User Journey & Flow

```
Landing Page (No Wallet Check)
    ↓
    ├─ "Go to Dashboard" Button
    │   ├─ If Wallet Connected → Dashboard
    │   └─ If Not Connected → Show "Connect Wallet" (small prompt)
    │
    └─ "View Leaderboard" Link (Always Available)
        └─ Shows top 50 players (no registration needed)

Dashboard (Wallet Required Here)
    ↓
    ├─ User Stats Section (only if registered)
    │   └─ "Start New Game" Button → Triggers Game
    │
    └─ "Pending Games" Section (only if registered)
        └─ Resume or Claim buttons

Game Play Page
    ↓
    ├─ Play & Flip Cards
    ├─ Win → "Back to Dashboard" (auto-claim or manual claim button)
    └─ Lose → "Back to Dashboard"

Registration (Minimal Modal)
    Triggered: When user clicks "Start New Game" but not registered
    Form: Username input only
    Success: Redirect to Dashboard with 0 points
```

### Pages & Components

#### 1. **Landing / Home Page**
- Display: Hero section with ChessFlip title & description
- **No wallet connection check here**
- Actions:
  - "Go to Dashboard" button (primary brand pink)
  - "View Leaderboard" link (secondary)
- Bottom: Simple footer with rules preview
- User can explore without wallet

#### 2. **Dashboard Page**
- **Requirement**: Wallet must be connected here
  - If not connected → Show overlay with "Connect Wallet" button
  - No full page block, just a small prompt
  
- **If Not Registered** (First time):
  - Empty state message: "Ready to play?"
  - "Start New Game" button → Triggers registration modal

- **If Registered** (Returning player):
  - **Top Section - User Stats Card**:
    - Username
    - Total Points
    - Total Games Played
    - Wins / Losses (e.g., "8W - 2L")
    - Win Rate % (calculated)
  
  - **Middle Section - Quick Actions**:
    - "Start New Game" button (primary brand pink)
  
  - **Pending Games Section** (if any):
    - List of unfinished/unclaimed games
    - Each card: Game ID, Lives left, "Resume" or "Claim" button
    - Minimal design - just essential info

  - **Recent Results Section** (Minimal):
    - Last 3 games: [Win/Loss badge] [Points earned]
    - If no games: "No games yet"

#### 3. **Registration Modal** (Triggered from Dashboard)
- Form: Single input field for username
- Validation:
  - Check if username exists (query contract)
  - Username: 3-20 characters, alphanumeric + underscores
  - Real-time validation feedback
- Actions:
  - "Register & Play" button (primary)
  - "Cancel" button (close modal, stay on dashboard)
- On success: Modal closes, dashboard refreshes with user stats
- On error: Show validation message, allow retry

#### 4. **Game Play Page**
- **Header**:
  - Username (left)
  - Points counter (center)
  - Back button (right, to dashboard)

- **Game Area**:
  - 3x4 grid of face-down chess cards
  - Click to flip (no animations delay)
  - Match pairs (visual feedback: glow/highlight)

- **Status Bar** (Bottom):
  - Lives remaining (visual: 5 hearts or similar)
  - Matched pairs count (e.g., "4/6 matched")

- **Game Actions**:
  - "Claim Win" button (appears only on match all 6 pairs)
  - "Surrender" button (explicit loss, goes to result)
  - "Quit Game" button (at any time, forfeits)

#### 5. **Game Result Screen** (Inline, Not Forced Popup)
- Shows after game completion
- Display:
  - Large Result badge: "YOU WON!" or "YOU LOST"
  - Points earned: "+10 points" or "+2 points"
  - New total points
- Buttons:
  - "Back to Dashboard" (primary action)
  - Optional: "Play Again" (shortcut to new game)

#### 6. **Leaderboard Page**
- **Header**: "Global Leaderboard"
- **Table** (Rank | Username | Points | Games | W-L):
  - Sort: Points (descending)
  - Show top 50 players
  - Highlight current user row (if registered)
- **Actions**:
  - "Refresh" button (manual, no auto-updates)
  - Back/Home link
- Accessible anytime (no registration required)

---

## Backend (Sui Smart Contract)

### Module: `chessflip`

#### Objects & Storage

```
ChessFlipGame {
  id: UID
  player: Address
  status: String (Playing | Completed)
  matched_pairs: u8 (0-6)
  lives_remaining: u8 (0-5)
  result: String (Win | Loss | Pending)
  claimed: bool
  points_earned: u64
  created_at: u64
  updated_at: u64
}

PlayerProfile {
  id: UID
  address: Address
  username: String
  total_points: u64
  total_games: u64
  wins: u64
  losses: u64
  created_at: u64
}
```

#### Key Functions

**1. register_player(ctx, username)**
- Check if username is available
- Create PlayerProfile with initial 0 points
- Emit event: PlayerRegistered

**2. start_game(ctx, payment)**
- Require: 0.001 SUI payment
- Create new ChessFlipGame object
- Set status: Playing
- Return game ID to frontend
- Emit event: GameStarted

**3. submit_game_result(ctx, game_id, result)**
- Require: result is Win or Loss
- Update game object:
  - If Win: points = 10
  - If Loss: points = 2
- Set status: Completed
- Set claimed: false
- Emit event: GameResultSubmitted

**4. claim_points(ctx, game_id)**
- Require: game not claimed
- Add points to PlayerProfile
- Update counters:
  - total_games += 1
  - If game result = Win: wins += 1
  - If game result = Loss: losses += 1
- Set game.claimed = true
- Emit event: PointsClaimed

**5. get_player(address) → PlayerProfile**
- Query: Return player profile
- Public function (read-only)

**6. get_game(game_id) → ChessFlipGame**
- Query: Return game details
- Public function (read-only)

**7. get_leaderboard() → Vec<(String, u64)>**
- Query: Return top players (username, points)
- Public function (read-only)

---

## Frontend-Contract Integration

### Game Flow Sequence

1. **Player Connects Wallet**
   - Check if address exists on contract
   - If not → Show registration button
   - If yes → Load dashboard

2. **Player Registers** (First time)
   - Submit username to contract
   - Contract validates uniqueness
   - Create PlayerProfile

3. **Player Starts Game**
   - Pay 0.001 SUI
   - Contract creates ChessFlipGame
   - Frontend receives game ID
   - Shuffle deck locally, render game

4. **Player Plays**
   - Flip cards locally (no contract calls)
   - Track matches locally
   - On game end (win/loss):
     - Submit result to contract
     - Contract updates points (pending)

5. **Player Claims Points**
   - Click "Claim Points" button
   - Contract adds points to profile
   - Frontend updates user stats

---

## Data Flow (Frontend Only - No Real-time Sync)

### State Management
- **User State**: Connected wallet address, username, points, total_games, wins, losses
- **Game State**: Current game ID, cards, lives remaining, matched pairs
- **UI State**: Current page, loading states, registration modal visibility

### Frontend Displays
- **Dashboard**: 
  - User stats: points, total_games, wins, losses, win_rate%
  - Pending games list
  - Recent 3 games (last activity)
  
- **Game Play**: Lives, matched pairs, grid

### Contract Queries
- On dashboard load: Fetch PlayerProfile (username, points, games, wins, losses)
- On game completion: Submit result to contract
- On claim: Fetch updated PlayerProfile
- On leaderboard: Fetch top 50 players

---

## UX Design Principles

### Zero Friction on Landing
- No wallet requirement on landing page
- User can view leaderboard without wallet
- "Go to Dashboard" button is clear primary action
- Wallet check only happens when entering dashboard

### Dashboard is the Hub
- First thing user sees after connecting wallet
- Registered users see full stats immediately
- New users see "Ready to play?" with "Start New Game" button
- No forced popups anywhere

### Registration is Seamless
- Only triggered when user clicks "Start New Game" (first time)
- Modal appears, user fills username, clicks "Register & Play"
- On success: Modal closes, dashboard shows updated stats
- User can cancel without losing anything

### Game Play is Distraction-Free
- Only essentials: Grid, lives, matched pairs count
- No animations delays (instant flip feedback)
- Simple result screen inline (not forced popup)
- Back to dashboard button always available

### Stats Display (Dashboard)
- **User Stats Card** (Top, visible to all registered users):
  - Username (large)
  - Total Points (prominent)
  - Total Games Played
  - Win/Loss Record (e.g., "12W - 3L")
  - Win Rate % (calculated: wins / total_games * 100)
- Minimal, clean layout - easy to scan
- Updates after each claimed game

### Minimal Button Strategy
Landing Page:
- "Go to Dashboard" (primary)
- "View Leaderboard" (secondary)

Dashboard (Registered):
- "Start New Game" (primary)
- "Resume Game" (on pending games)
- "Claim Points" (on pending games)

Game Play:
- Flip cards (grid click)
- "Claim Win" (on match all pairs)
- "Surrender" (explicit loss)
- "Quit Game" (forfeit, back to dashboard)

Leaderboard:
- "Refresh" (manual)
- "Back" (navigation)

#### No Forced Interactions
- No auto-popups
- No auto-redirects
- No animations blocking user action
- User always in control

---

## Contract Minimalism

### Why Keep Contract Light
1. **Gas Efficiency**: Minimal storage & computation
2. **Frontend Validation**: Card matching, shuffling done locally
3. **Trust Model**: Game result submitted by frontend (frontend is honest actor)
4. **Quick Deployment**: Less contract code = faster audit & deployment

### Frontend Handles
- Card shuffling & pairing logic
- Flip animations & card matching
- Lives tracking & game state
- Result calculation (win/loss logic)

### Contract Handles
- Player registration & uniqueness check
- Payment validation (0.001 SUI)
- Points storage & aggregation
- Leaderboard queries

---

## Database-like Queries (Contract)

```
// Read-Only Functions (No gas cost)
get_player(address) → {username, points, wins, games}
get_game(game_id) → {status, result, claimed, points}
get_leaderboard() → [(rank, username, points)]
check_username(username) → bool (exists?)
```

---

## Technical Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Tipz Design System
- **Sui Integration**: @mysten/dapp-kit
- **State**: React hooks + Context API
- **Game Logic**: Local JavaScript (card shuffle, matching)

### Backend
- **Language**: Move (Sui)
- **Chain**: Sui Testnet
- **Objects**: Owned objects (games), Shared objects (player profiles)

---

## Deployment Checklist

### Frontend Pages to Build
- [ ] Landing Page (No wallet check, "Go to Dashboard" & "View Leaderboard" buttons)
- [ ] Dashboard (Wallet required, user stats, start game, pending games)
- [ ] Game Play (Grid, lives, matched pairs, claim/surrender buttons)
- [ ] Leaderboard (Top 50, refresh button)
- [ ] Registration Modal (Triggered from dashboard only)

### Frontend Components
- [ ] User Stats Card (points, games, wins, losses, win rate)
- [ ] Pending Games List
- [ ] Card Grid (3x4, flip on click)
- [ ] Result Screen (inline after game)
- [ ] Registration Form (modal, username input only)

### Contract Functions to Implement
- [ ] register_player (username registration)
- [ ] start_game (0.001 SUI payment)
- [ ] submit_game_result (Win or Loss)
- [ ] claim_points (update profile, track wins/losses)
- [ ] get_player (read-only, return full profile with stats)
- [ ] get_game (read-only)
- [ ] get_leaderboard (read-only, top 50)
- [ ] check_username (read-only, validate username)

### Contract Storage to Track
- [ ] PlayerProfile.wins
- [ ] PlayerProfile.losses
- [ ] PlayerProfile.total_games
- [ ] PlayerProfile.total_points
- [ ] Game.result (Win or Loss)
- [ ] Game.claimed (boolean)

---

## Building Schedule (10 Minutes Total)

### Smart Contract (~4 minutes)
1. Define PlayerProfile object (address, username, points, wins, losses)
2. Define ChessFlipGame object (player, status, result, claimed)
3. Implement register_player function
4. Implement start_game function (payment handling)
5. Implement submit_game_result function
6. Implement claim_points function (update wins/losses)
7. Implement read-only functions (get_player, get_leaderboard, check_username)
8. Test with CLI

### Frontend (~6 minutes)
1. Create Landing Page (hero + 2 buttons)
2. Create Dashboard (stats card, start game button)
3. Create Game Play Page (grid + buttons)
4. Create Leaderboard Page
5. Add Registration Modal (triggered from dashboard)
6. Integrate Sui SDK:
   - Connect wallet
   - Register player function
   - Start game function
   - Submit result & claim points
   - Fetch player stats
   - Fetch leaderboard
7. Test full flow: Landing → Dashboard → Register → Play → Claim → Stats Update

---

## Summary

**ChessFlip** is a lightweight, user-friendly on-chain game that:
- Landing page requires **no wallet connection** (zero friction)
- Dashboard is **gated by wallet** (simple check)
- Registration happens **only once** (modal, minimal)
- Game play is **distraction-free** (grid + buttons)
- Stats show **wins, losses, and points** (comprehensive but minimal)
- Leaderboard is **accessible anytime** (transparent)

**Key Flow**: Landing → (Connect Wallet) → Dashboard → Register (if new) → Play → Claim → Stats Update

**Build Time**: ~10 minutes (contract + frontend)
**User Experience**: Smooth, intuitive, zero-friction
**Complexity**: Minimalistic by design
