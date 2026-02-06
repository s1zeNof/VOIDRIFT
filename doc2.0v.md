# VOIDRIFT - Project Documentation v2.2

## What is VOIDRIFT?

**VOIDRIFT** is a **Web3 DApp (Decentralized Application)** - an NFT collection platform built on Base blockchain. It combines:
- **NFT Minting** - users can mint unique digital collectibles
- **Staking System** (planned) - stake NFTs to earn $RIFT tokens
- **Gamification** - rarity system, leaderboards, achievements

### Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Web3**: RainbowKit, Wagmi v3, Viem
- **Blockchain**: Base (L2) - testnet now, mainnet for production
- **Smart Contracts**: Solidity (ERC-721 for NFTs)
- **Metadata Storage**: IPFS via Pinata
- **Deployment**: Vercel

---

## Current Status (v2.2)

### Deployed Contracts

| Network | Contract | Address |
|---------|----------|---------|
| Sepolia (ETH testnet) | RiftbirdNFT | `0x2f848cC764C77b8EFEBd23cd69ECB2F66A53D52f` |
| Base Sepolia | RiftbirdNFT | **PENDING** (deploy script ready) |
| Base Mainnet | RiftbirdNFT | **PLANNED** |

### IPFS Metadata

| Type | CID | Gateway URL |
|------|-----|-------------|
| Images | `bafybeiaaeiktyp6ewvrvw6rsl2jdio7kcnkwn6mvl2k56armwnm3civynm` | [View](https://gateway.pinata.cloud/ipfs/bafybeiaaeiktyp6ewvrvw6rsl2jdio7kcnkwn6mvl2k56armwnm3civynm/) |
| Metadata | `bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm` | [View](https://gateway.pinata.cloud/ipfs/bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/) |

**Base URI for contract:** `ipfs://bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/`

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

### 1. NFT Minting ✅
- Connect wallet via RainbowKit
- Mint NFTs (0.001 ETH on testnet)
- View minting interface with price and supply info
- Live mint feed showing recent mints
- Max supply: 222 NFTs

### 2. Collection Gallery ✅
- Browse all minted NFTs
- Filter by rarity (Legendary, Epic, Rare, Uncommon, Common)
- Rarity badges with visual indicators
- Responsive grid layout
- 4 bird species: Raven, Owl, Falcon, Sparrow

### 3. Leaderboard System ✅
- Top collectors ranking
- Display wallet addresses and NFT counts
- Real-time data from blockchain
- Animated table with rankings

### 4. Profile Dashboard ("Your Flock") ✅
- View owned NFTs
- **NFT image as avatar** (new!)
- Stats: total NFTs, portfolio value, rarest bird
- Rarity breakdown chart
- Share card for social media

### 5. Staking Preview UI ✅
- Rewards projection calculator
- $RIFT token teaser
- APY display (placeholder)
- Lock period options

### 6. NFT Metadata on IPFS ✅
- All images uploaded to IPFS
- All metadata JSON uploaded to IPFS
- Contract baseURI set correctly
- OpenSea compatible format

### 7. UI/UX ✅
- Dark sci-fi theme (cyan + purple accents)
- Responsive design (mobile + desktop)
- Smooth animations (Framer Motion)
- Custom fonts (Orbitron, Rajdhani)
- **Avatar in navbar** with NFT image (new!)

---

## Not Yet Implemented / In Progress

### 1. Mobile Wallet Connection ⏳
- **Issue**: RainbowKit wallet buttons not responding on mobile
- **Status**: CSS fixes applied, MobileConnectButton created
- **Solution needed**: Further testing with WalletConnect

### 2. Base Sepolia Deployment ⏳
- Deploy script ready: `scripts/deploy-base-sepolia.js`
- Waiting for Base Sepolia ETH
- Faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

### 3. Staking Contract 📋
- UI is ready (preview)
- Smart contract not deployed
- $RIFT token contract needed

### 4. Production (Base Mainnet) 📋
- After Base Sepolia testing
- Need real ETH on Base (~$5-10)
- OpenSea listing

---

## Deployment Plan

### Phase 1: Base Sepolia Testing (Current)
1. ✅ IPFS metadata uploaded
2. ✅ Deploy scripts ready
3. ⏳ Get Base Sepolia ETH from faucet
4. ⏳ Deploy contract to Base Sepolia
5. ⏳ Update frontend to use Base Sepolia
6. ⏳ Test all functionality

### Phase 2: Base Mainnet Launch
1. 📋 Get ETH on Base mainnet
2. 📋 Deploy contract to Base Mainnet
3. 📋 Update frontend for mainnet
4. 📋 List on OpenSea
5. 📋 Launch marketing (Twitter/X)

---

## NFT Collection Details

### Species (4 types)
| Species | Images | Variants |
|---------|--------|----------|
| Raven | raven_1.png, raven_2.png | 2 |
| Owl | owl_1.png, owl_2.png | 2 |
| Falcon | falcon_1.png, falcon_2.png | 2 |
| Sparrow | sparrow_1.png, sparrow_2.png | 2 |

### Rarity Distribution
| Rarity | Probability | Color |
|--------|-------------|-------|
| Common | 50% | Gray |
| Uncommon | 25% | Green |
| Rare | 15% | Blue |
| Epic | 8% | Purple |
| Legendary | 2% | Gold |

### Traits (Attributes)
- **Species**: Raven, Owl, Falcon, Sparrow
- **Rarity**: Common → Legendary
- **Stage**: Dormant (evolves with staking)
- **Background**: Void Nebula, Cosmic Storm, Dark Matter, Quantum Field, Stellar Rift
- **Energy**: Weak, Stable, Volatile, Critical, Cosmic
- **Origin**: Earth, Mars, Kepler-186f, The Void, Unknown
- **Class**: Scout, Warrior, Guardian, Technomancer, Architect
- **Anomaly**: None, Glitch, Time Warp

---

## Smart Contract Details

### RiftbirdNFT.sol
```solidity
// ERC-721 with URIStorage
Contract: RiftbirdNFT

Functions:
- mint() - mint 1 NFT (payable)
- mintBatch(quantity) - mint multiple (payable)
- ownerMint(to) - free mint for owner
- setBaseURI(uri) - update metadata location
- tokenURI(tokenId) - get metadata URL
- totalSupply() - get minted count
- withdraw() - withdraw funds to owner

Parameters:
- maxSupply: 222
- mintPrice: 0.001 ETH (testnet) / TBD (mainnet)
- baseURI: ipfs://bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/
```

---

## Scripts Available

| Script | Purpose |
|--------|---------|
| `scripts/upload-images.js` | Upload bird images to IPFS |
| `scripts/generate_metadata.js` | Generate NFT metadata JSON |
| `scripts/upload-metadata.js` | Upload metadata to IPFS |
| `scripts/set-base-uri.js` | Set baseURI on Sepolia contract |
| `scripts/deploy-base-sepolia.js` | Deploy contract to Base Sepolia |

---

## Future Ideas & Roadmap

### Phase 3: Staking & Tokens
- [ ] Deploy $RIFT token contract (ERC-20)
- [ ] Deploy staking contract
- [ ] Implement claim rewards
- [ ] Staking tiers based on rarity

### Phase 4: Crafting System
- [ ] Burn multiple NFTs to craft higher rarity
- [ ] Crafting recipes (3 Common = 1 Uncommon, etc.)
- [ ] Special "Fusion" NFTs with unique traits

### Phase 5: Gamification
- [ ] Achievements system
- [ ] Daily check-in rewards
- [ ] Seasonal events

### Phase 6: Community
- [ ] DAO governance with $RIFT
- [ ] Proposal voting
- [ ] Community treasury

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

---

## File Structure
```
VOIDRIFT/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (home)
│   │   ├── mint/page.tsx
│   │   ├── collection/page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── staking/page.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── layout/ (Navbar, Container)
│   │   ├── mint/ (MintingInterface, LiveMintFeed)
│   │   ├── collection/ (NFTCard, RarityFilter)
│   │   ├── leaderboard/ (LeaderboardTable)
│   │   ├── profile/ (FlockStats, ShareCard)
│   │   ├── staking/ (RewardsProjection, RiftTokenTeaser)
│   │   └── shared/ (RarityBadge, AvatarConnectButton, MobileConnectButton)
│   ├── hooks/
│   │   ├── useLeaderboard.ts
│   │   └── useLiveMints.ts
│   ├── lib/
│   │   ├── contracts.ts (addresses, ABIs)
│   │   ├── nftUtils.ts (rarity, traits)
│   │   └── utils.ts
│   └── public/birds/ (images)
├── contracts/
│   ├── contracts/
│   │   ├── RiftbirdNFT.sol
│   │   └── ...
│   └── .env (keys)
├── scripts/
│   ├── upload-images.js
│   ├── generate_metadata.js
│   ├── upload-metadata.js
│   ├── set-base-uri.js
│   └── deploy-base-sepolia.js
├── assets/metadata/ (generated JSON)
└── doc2.0v.md (this file)
```

---

## Links & Resources

- **Live Site**: https://voidrift.vercel.app
- **GitHub**: https://github.com/s1zeNof/VOIDRIFT
- **Contract (Sepolia)**: https://sepolia.etherscan.io/address/0x2f848cC764C77b8EFEBd23cd69ECB2F66A53D52f
- **IPFS Images**: https://gateway.pinata.cloud/ipfs/bafybeiaaeiktyp6ewvrvw6rsl2jdio7kcnkwn6mvl2k56armwnm3civynm/
- **IPFS Metadata**: https://gateway.pinata.cloud/ipfs/bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/

---

## Why Base?

| Feature | Ethereum | Base |
|---------|----------|------|
| Gas fees | $5-50+ | $0.01-0.10 |
| Speed | ~15 sec | ~2 sec |
| Security | Native | ETH L2 |
| OpenSea | ✅ | ✅ |
| Ecosystem | Largest | Growing fast |

**Decision**: Use Base for production - cheaper, faster, same security.

---

## Contact
- Project Owner: [Your Name]
- Email: [TO BE CREATED - voidrift.nft@gmail.com recommended]
- Discord: [TO BE ADDED]
- Twitter/X: [TO BE ADDED]

---

## Changelog

### v2.2 (Current)
- ✅ **Fixed Live Mint Feed** — was showing "Failed to load mint feed" because it scanned from block 0 (millions of blocks, exceeds RPC limits). Now limits scan to last ~50k blocks (~7 days)
- ✅ **Fixed NFT image mismatch** — /mint and /profile pages now fetch real IPFS metadata instead of hardcoded local traits. Token #1 = Sparrow (not Owl), matching on-chain metadata
- ✅ **Fixed wallet NFT visibility** — Added `tokenURI`, `ownerOf`, `name`, `symbol`, `supportsInterface` to ABI so Rabby and other wallets can discover NFT metadata via ERC721 standard
- ✅ **Fixed Base chain issues** — All contract reads now specify `chainId: SUPPORTED_CHAIN_ID` (Sepolia). Switching to Base no longer causes NaN ETH, infinite loading, or 0/222 supply
- ✅ **Wrong chain detection** — Added "Wrong Network" warning banners on /mint and /profile with "Switch to Sepolia" button
- ✅ **IPFS metadata integration** — MintPreview, LiveMintFeed, and Profile page all fetch real metadata from Pinata IPFS gateway instead of using broken local trait generation
- ✅ **Block range limiting** — All event log queries (Live Feed, Leaderboard, Profile) now limit block range to prevent RPC timeouts
- ✅ **Mint button context** — Shows "SWITCH TO SEPOLIA" when on wrong network, "MINT NOW" when correct
- ✅ **Fallback client** — Live mint feed always reads from Sepolia even when wallet is on another chain

### v2.1
- ✅ IPFS metadata fully configured
- ✅ setBaseURI called on Sepolia contract
- ✅ NFT avatar in profile & navbar
- ✅ AvatarConnectButton component
- ✅ Base Sepolia deploy script ready
- ✅ Removed Base Sepolia from frontend (until contract deployed)
- ✅ Documentation updated

### v2.0
- ✅ Leaderboard system
- ✅ Rarity filter
- ✅ Profile stats (FlockStats, ShareCard)
- ✅ Staking preview UI
- ✅ Live mint feed

### v1.0
- ✅ Basic minting
- ✅ Collection gallery
- ✅ Wallet connection

---

## Known Issues & Notes

### Current Chain: Ethereum Sepolia (Testnet)
- Contract address: `0x2f848cC764C77b8EFEBd23cd69ECB2F66A53D52f`
- **Base is NOT supported yet** — contract not deployed on Base Sepolia
- Frontend always reads from Sepolia regardless of connected wallet chain
- To mint, wallet MUST be on Sepolia network

### Rabby Wallet NFT Visibility
- NFTs should now appear in Rabby after mint (ABI includes `tokenURI`, `name`, `symbol`, `supportsInterface`)
- If still not showing: Rabby may need to be manually pointed to Sepolia testnet, and may require a page refresh
- NFT metadata (image, name, rarity) comes from IPFS: `ipfs://bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/{tokenId}.json`

### NFT Metadata Source
- On-chain: Contract stores baseURI pointing to IPFS metadata
- Frontend: Fetches from Pinata gateway `https://gateway.pinata.cloud/ipfs/...`
- Each token has unique species/rarity (randomly generated), NOT all the same species

---

*Last updated: February 2026*
*Version: 2.2*
