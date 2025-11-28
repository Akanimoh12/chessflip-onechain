# ChessFlip - OneChain 🎮

**Play Chess Card Flip Games On-Chain. Compete Globally. Earn Points.**

ChessFlip is a minimalistic, fast-paced card matching game built on Sui blockchain. Flip chess-themed cards, match pairs, and compete on a global leaderboard, all secured by blockchain technology.

---

## 🚀 Features

### **Easy to Play**
- **No Setup Required**: Connect your wallet and start playing in seconds
- **Simple Mechanics**: Flip cards to match pairs of chess pieces
- **Fair & Transparent**: Every game is recorded on-chain for complete transparency
- **Instant Results**: Get points immediately after each game

### **Competitive**
- **Global Leaderboard**: See how you rank against players worldwide
- **Track Your Stats**: View wins, losses, and win rate
- **Earn Points**: Win 10 points per match, 2 points per loss
- **Minimal Gas Cost**: Play for just 0.001 SUI per game

### **Built on Web3**
- **Powered by Sui Network**: Fast, secure, and low-cost transactions
- **Wallet Integration**: Seamless connection via One Wallet SDK
- **On-Chain Verification**: All game outcomes are verifiable on-chain
- **Your Data, Your Control**: Fully decentralized ownership

---

## 🎯 How to Play

1. **Connect Your Wallet**
   - Click "Go to Dashboard" on landing page
   - Connect using One Wallet or any Sui-compatible wallet
   - No forced sign-ups—explore freely until you play

2. **Register (One-Time)**
   - Choose a unique username (3-20 characters)
   - First registration is free, starts you with 0 points

3. **Start a Game**
   - Pay 0.001 SUI to begin
   - Get 5 lives to match chess card pairs
   - Flip cards to find matching pairs (6 pairs = 12 cards)

4. **Win & Claim Points**
   - Match all 6 pairs before running out of lives → **+10 Points**
   - Lose all lives → **+2 Points** (consolation)
   - Claim your points to update your profile

5. **Compete**
   - View your stats: Win/Loss record, Win Rate, Total Points
   - Check the global leaderboard
   - Resume pending games anytime

---

## 💡 Why ChessFlip?

### **Lightning Fast**
Sui blockchain enables sub-second transactions with minimal fees. Play without worrying about high gas costs or slow confirmations.

### **Truly Decentralized**
Your game history, profile, and points are stored on-chain. No central servers can delete your progress or control your assets.

### **Player-First Experience**
No popups, no forced actions, no ads. Just pure gameplay. Connect your wallet only when you want to play—leaderboard is public to all.

### **Skill-Based**
Pure matching skill determines your success. No RNG, no luck—just strategy and memory.

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + TypeScript
- **React Router v6** - Navigation & page routing (Landing → Dashboard → Game)
- Sui dApp Kit with One Wallet SDK integration
- Tailwind CSS with custom design system
- Vite for fast development

**Blockchain**
- **Sui Network** (Testnet)
- Move smart contracts for secure game logic
- Owned objects for player profiles and game history
- Sub-second finality for instant gameplay

**Design**
- Minimalistic brutalist UI
- Mobile-responsive
- Zero-friction UX

---

## 🎮 Game Stats Tracked

- **Total Points**: Accumulated from all games
- **Total Games**: Games played and claimed
- **Wins**: Successful games (matched all pairs)
- **Losses**: Games where you ran out of lives
- **Win Rate**: Calculated percentage (Wins ÷ Total Games × 100)

---

## 🌍 Global Leaderboard

See where you rank among all players:
- **Top 50 Global Players** ranked by points
- **Your Position** highlighted if you're registered
- **Real-Time Updates** (manual refresh)
- **No Limits** - Anyone can view, no registration required

---

## 🔐 Security & Transparency

- **On-Chain Verification**: Every game result is immutable
- **Wallet Ownership**: Only you can claim your points
- **No Intermediaries**: Direct interaction with Sui blockchain
- **Open Smart Contracts**: Code is auditable and transparent
- **Your Private Keys**: You maintain full control

---

## 💰 Cost Breakdown

| Action | Cost |
|--------|------|
| Registration | Free |
| Per Game | 0.001 SUI (~$0.05 USD*) |
| Claiming Points | Free |
| Viewing Leaderboard | Free |

*Price varies based on SUI market price

---

## 🚀 Getting Started

### Prerequisites
- A Sui-compatible wallet (One Wallet, Martian, Sui Wallet)
- Sui testnet tokens (free from faucet)

### Steps
1. Visit [ChessFlip](https://chess-flip-onchain.vercel.app/)
2. Click **"Go to Dashboard"**
3. Connect your wallet using One Wallet SDK
4. Register your username
5. Click **"Start New Game"**
6. Play and claim your points!

### No Installation Required
ChessFlip is a fully web-based application. Just visit the site, connect your wallet, and play.

---

## 🔧 Local Development

To run ChessFlip locally and contribute:

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
# Opens http://localhost:5173
```

### Setup Contract
```bash
cd contract
sui move build
```

### Navigation
The frontend now includes client-side routing:
- **Landing Page** (`/`) - Features and wallet connection
- **Dashboard** (`/dashboard`) - Player profile and game controls
- **Game** (`/game`) - Card matching game interface

See [ROUTING_FIX.md](./ROUTING_FIX.md) for navigation details.

---

## 📊 What Gets Stored On-Chain

**Player Profile**
- Wallet address
- Username
- Total points
- Total games played
- Wins/Losses count
- Registration timestamp

**Game Records**
- Game ID (unique identifier)
- Player address
- Game result (Win/Loss)
- Points earned
- Claimed status
- Game timestamps

Everything else (card shuffling, animations, game UI) happens locally in your browser for instant response.

---

## 🎯 One Wallet & Sui Integration

ChessFlip uses the **One Wallet SDK** for seamless wallet integration, enabling:
- ✅ One-click connection
- ✅ Automatic transaction signing
- ✅ Secure key management
- ✅ Multi-chain support

All transactions are executed on the **Sui Network**, providing:
- ⚡ Sub-second finality
- 💰 Minimal transaction fees
- 🔒 Byzantine fault-tolerant security
- 📈 Scalable, low-latency blockchain

---

## 📱 Platform Support

- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Android Chrome
- **Wallet Support**: Any Sui-compatible wallet (One Wallet, Martian, Sui Wallet, etc.)

---

## 🔮 Roadmap

### Current (MVP)
- ✅ Card flip matching game
- ✅ On-chain player profiles
- ✅ Global leaderboard
- ✅ Win/Loss tracking

### Coming Soon
- 🔄 Seasonal competitions
- 🏆 Achievement badges
- 💬 Player profiles & messaging
- 🎨 Custom card themes
- 📊 Advanced stats & history

### Future
- 🌐 Cross-chain support
- 🤝 Multiplayer matches
- 🎁 Tournament brackets
- 📱 Native mobile apps
- 🏦 Reward pools & sponsorships

---

## 🤝 Community

- **Discord**: [Join our community](#) *(coming soon)*
- **Twitter**: [@ChessFlip](#) *(coming soon)*
- **Feedback**: Report issues or suggest features via GitHub

---

## ⚖️ Disclaimer

ChessFlip is a skill-based game built on blockchain technology. 
- Always verify you're on the official ChessFlip website
- Only use official wallets and connections
- Keep your private keys secure
- Play responsibly

---

## 📄 License

ChessFlip is open-source software. See LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with [Sui](https://sui.io) - the fast and reliable blockchain
- Powered by [One Wallet SDK](https://onewallet.fi) for seamless wallet integration
- Designed with [Tipz Design System](https://tipz-rosy.vercel.app) for minimalist UI
- Supported by the amazing Sui & Web3 community

---

## 📧 Contact

Have questions or feedback? Reach out:
- **Email**: [contact@chessflip.app](mailto:johnsonakanimoh4@gmail.com) *(coming soon)*
- **GitHub Issues**: [Report a bug](https://github.com/Akanimoh12/chessflip-onechain/issues)
- **Discord**: [Join us](#) *(coming soon)*

---

**Ready to flip and win?** [Play ChessFlip Now](https://chess-flip-onchain.vercel.app/) 🎮✨

Built with ❤️ on Sui Network
