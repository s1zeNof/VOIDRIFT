# VOIDRIFT - Project Documentation v2.0

## What is VOIDRIFT?

**VOIDRIFT** is a **Web3 DApp (Decentralized Application)** - an NFT collection platform built on Ethereum (Sepolia testnet). It combines:
- **NFT Minting** - users can mint unique digital collectibles
- **Staking System** (planned) - stake NFTs to earn $RIFT tokens
- **Gamification** - rarity system, leaderboards, achievements

### Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Web3**: RainbowKit, Wagmi v3, Viem
- **Blockchain**: Ethereum Sepolia (testnet), Base Sepolia
- **Smart Contracts**: Solidity (ERC-721 for NFTs)
- **Deployment**: Vercel

---

## Project Concept & Vision

### The Story
VOIDRIFT is a cosmic-themed NFT collection featuring mysterious birds from the void dimension. Each bird has unique traits and rarity levels, creating a collectible ecosystem.

### Target Audience
- NFT collectors
- Web3 enthusiasts
- Gamification lovers
- Crypto community members

### Core Value Proposition
1. **Collect** - Mint unique void birds with different rarities
2. **Compete** - Climb the leaderboard, show off your flock
3. **Earn** - Stake NFTs to earn $RIFT tokens (future)
4. **Craft** - Combine NFTs to create rarer ones (planned)

---

## Current Features (Implemented)

### 1. NFT Minting
- Connect wallet via RainbowKit
- Mint NFTs on Sepolia testnet
- View minting interface with price and supply info
- Live mint feed showing recent mints

### 2. Collection Gallery
- Browse all minted NFTs
- Filter by rarity (Legendary, Epic, Rare, Uncommon, Common)
- Rarity badges with visual indicators
- Responsive grid layout

### 3. Leaderboard System
- Top collectors ranking
- Display wallet addresses and NFT counts
- Real-time data from blockchain
- Animated table with rankings

### 4. Profile Dashboard ("Your Flock")
- View owned NFTs
- Stats: total NFTs, portfolio value, rarest bird
- Rarity breakdown chart
- Share card for social media

### 5. Staking Preview UI
- Rewards projection calculator
- $RIFT token teaser
- APY display (placeholder)
- Lock period options

### 6. Whitelist System
- Check whitelist status
- Whitelist-only minting phase support

### 7. UI/UX
- Dark sci-fi theme (cyan + purple accents)
- Responsive design (mobile + desktop)
- Smooth animations (Framer Motion)
- Custom fonts (Orbitron, Rajdhani)

---

## Not Yet Implemented / In Progress

### 1. Mobile Wallet Connection
- **Issue**: RainbowKit wallet buttons not responding on mobile
- **Status**: CSS fixes applied, needs further debugging
- **Solution needed**: Test WalletConnect deep links on Android/iOS

### 2. Smart Contract Deployment
- Current: Using placeholder/test contract
- Needed: Deploy production NFT contract with:
  - Whitelist merkle tree
  - Reveal mechanism
  - Royalties (ERC-2981)

### 3. Staking Contract
- UI is ready (preview)
- Smart contract not deployed
- $RIFT token contract needed

### 4. NFT Metadata & Images
- Need actual bird artwork
- IPFS/Arweave storage for metadata
- Reveal mechanism (pre-reveal placeholder)

### 5. NFT as Profile Avatar
- Currently: Only NFT ID shown
- Wanted: Display actual NFT image as avatar

---

## Future Ideas & Roadmap

### Phase 1: Core Launch
- [ ] Deploy mainnet NFT contract
- [ ] Upload artwork to IPFS
- [ ] Implement reveal mechanism
- [ ] Fix mobile wallet issues
- [ ] NFT image as avatar

### Phase 2: Staking & Tokens
- [ ] Deploy $RIFT token contract (ERC-20)
- [ ] Deploy staking contract
- [ ] Implement claim rewards
- [ ] Staking tiers based on rarity

### Phase 3: Crafting System (NEW IDEA)
- [ ] Burn multiple NFTs to craft higher rarity
- [ ] Crafting recipes (e.g., 3 Common = 1 Uncommon)
- [ ] Special "Fusion" NFTs with unique traits
- [ ] Crafting history on profile

### Phase 4: Gamification
- [ ] Achievements system
- [ ] Daily check-in rewards
- [ ] Seasonal events
- [ ] Trading system (p2p)

### Phase 5: Community
- [ ] DAO governance with $RIFT
- [ ] Proposal voting
- [ ] Community treasury
- [ ] Collaborations with other projects

---

## NFT Collection Design Ideas

### Current State
- 1 NFT type (Void Bird)
- 5 rarity levels (Common → Legendary)
- Basic traits

### Expansion Ideas

#### Option A: Multiple Bird Species
- **Void Raven** - Common base
- **Rift Phoenix** - Rare fire variant
- **Nebula Owl** - Epic cosmic variant
- **Quantum Falcon** - Legendary speed variant
- **Singularity Eagle** - Mythic (craft only)

#### Option B: Evolution System
- Birds can "evolve" by staking for long periods
- Visual changes at evolution milestones
- New traits unlocked

#### Option C: Crafting/Fusion System
```
Crafting Recipes:
3x Common → 1x Uncommon
3x Uncommon → 1x Rare
3x Rare → 1x Epic
3x Epic → 1x Legendary
5x Legendary → 1x MYTHIC (unique)
```

**How it works with OpenSea:**
1. User selects NFTs to craft in our DApp
2. Smart contract BURNS the input NFTs (they disappear from OpenSea)
3. Contract MINTS new higher-rarity NFT to user
4. New NFT appears on OpenSea with new metadata
5. Burned NFTs show as "burned" in transaction history

**Benefits:**
- Deflationary mechanism (reduces supply)
- Increases value of remaining NFTs
- Engagement loop (collect → craft → collect more)
- Rare NFTs become actually rare

---

## Smart Contract Architecture

### NFT Contract (ERC-721)
```solidity
- mint() - public minting
- whitelistMint() - WL minting with merkle proof
- craft() - burn multiple, mint one higher rarity
- reveal() - reveal metadata
- setBaseURI() - update metadata location
```

### Staking Contract
```solidity
- stake(tokenId) - lock NFT
- unstake(tokenId) - unlock NFT
- claimRewards() - claim $RIFT
- getRewards(address) - view pending rewards
```

### $RIFT Token (ERC-20)
```solidity
- Minted by staking contract
- Used for: crafting fees, governance, future utilities
```

---

## Design System

### Colors
- **Background**: #0A0E27 (deep space blue)
- **Primary**: #00FFFF (neon cyan)
- **Secondary**: #8B00FF (electric purple)
- **Accent**: #DC143C (crimson red)

### Typography
- **Headings**: Orbitron (futuristic)
- **Body**: Rajdhani / Inter

### Components
- Glowing borders
- Gradient buttons
- Glassmorphism cards
- Particle effects (planned)

---

## File Structure
```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (home)
│   ├── mint/page.tsx
│   ├── collection/page.tsx
│   ├── leaderboard/page.tsx
│   ├── profile/page.tsx
│   ├── staking/page.tsx
│   └── whitelist/page.tsx
├── components/
│   ├── layout/ (Navbar, Container, Footer)
│   ├── mint/ (MintingInterface, LiveMintFeed)
│   ├── collection/ (NFTCard, RarityFilter)
│   ├── leaderboard/ (LeaderboardTable, LeaderboardRow)
│   ├── profile/ (FlockStats, ShareCard)
│   ├── staking/ (RewardsProjection, RiftTokenTeaser)
│   └── shared/ (RarityBadge, MobileConnectButton)
├── hooks/
│   ├── useNFTData.ts
│   ├── useLeaderboard.ts
│   └── useLiveMints.ts
├── lib/
│   ├── utils.ts
│   ├── nftUtils.ts
│   └── constants.ts
└── contracts/ (ABIs)
```

---

## Links & Resources

- **Live Site**: https://voidrift.vercel.app
- **GitHub**: https://github.com/s1zeNof/VOIDRIFT
- **Contract** (Sepolia): [TO BE DEPLOYED]
- **OpenSea** (testnet): [TO BE ADDED]

---

## Notes & Decisions

### Why Sepolia?
- Free testnet ETH from faucets
- Good for development and testing
- Will migrate to mainnet (Ethereum or Base) for production

### Why RainbowKit?
- Best UX for wallet connection
- Supports many wallets
- Easy to customize

### Why Base (as option)?
- Low gas fees
- Ethereum security (L2)
- Growing NFT ecosystem
- Coinbase backing

---

## Contact
- Project Owner: [Your Name]
- Discord: [TO BE ADDED]
- Twitter: [TO BE ADDED]

---

*Last updated: 2024*
*Version: 2.0*
