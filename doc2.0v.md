# VOIDRIFT - Project Documentation v2.4

## What is VOIDRIFT?

**VOIDRIFT** is a **Web3 DApp (Decentralized Application)** - an NFT collection platform built on Base blockchain. It combines:
- **NFT Minting** - users can mint unique digital collectibles
- **Staking System** (planned) - stake NFTs to earn $RIFT tokens
- **Art Evolution** - 3D Voxel → 2D Pixel Art → Feathers collection
- **Gamification** - rarity system, leaderboards, achievements

### Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Web3**: RainbowKit (25+ wallets), Wagmi v3, Viem
- **Blockchain**: Base (L2) - testnet now, mainnet for production
- **Smart Contracts**: Solidity 0.8.20 (ERC-721 for NFTs)
- **Metadata Storage**: IPFS via Pinata
- **Deployment**: Vercel (frontend), Hardhat (contracts)

---

## Current Phase: Pre-Launch (Base Sepolia Testnet)

### What's Ready
- Frontend fully built and deployed on Vercel
- 25+ wallet support with auto-detection
- IPFS metadata uploaded (222 current, expanding to 10,000)
- Smart contracts written and tested
- Deploy scripts ready for Base Sepolia

### What's Pending
- Deploy RiftbirdNFT contract to Base Sepolia (need testnet ETH)
- Update contract address in frontend
- Generate remaining metadata (222 → 10,000)

---

## Project Concept & Art Evolution

### The Vision

VOIDRIFT is a multi-phase NFT ecosystem where art evolves through dimensions. The collection tells the story of mysterious birds that exist between reality rifts - cosmic entities that shift between 3D, 2D, and elemental forms.

### Art Stages (The Evolution)

```
Stage 1: 3D Voxel Birds     → The original cosmic entities
Stage 2: 2D Pixel Art Birds  → Dimensional compression - birds shift to pixel realm
Stage 3: Feathers            → Elemental essence - both 2D and 3D pixel art
Stage 4: Animated Feathers   → Living essence with motion
```

#### Stage 1: 3D Voxel Birds (Genesis Collection)
- **What**: 3D rendered voxel bird models in cosmic/space theme
- **Style**: Volumetric pixel art, glowing effects, space backgrounds
- **Status**: Art ready, metadata on IPFS
- **Mint**: This is what users mint first
- **Species**: Raven, Owl, Falcon, Sparrow (+ more planned for 10k)

#### Stage 2: 2D Pixel Art Birds (In Production)
- **What**: Hand-crafted 2D pixel art versions of the same bird species
- **Style**: Classic pixel art with modern effects and animations
- **Status**: Models almost done, being finalized
- **Mechanic**: Holders of Stage 1 NFTs can "evolve" or claim Stage 2 versions
- **Value**: Shows artistic range, appeals to pixel art collectors

#### Stage 3: Pixel Art Feathers (In Production)
- **What**: Individual feathers from Riftbirds - both 2D and 3D pixel art
- **Style**: Collectible items, each feather unique to its bird species
- **Status**: 2D and 3D pixel art feather models in progress
- **Utility**: Crafting materials, staking boosts, merge mechanics
- **Types**: Species-specific feathers with rarity tiers

#### Stage 4: Animated Feathers (Planned)
- **What**: Animated versions of Stage 3 feathers
- **Style**: Floating, glowing, particle effects
- **Format**: Video/GIF NFTs for special editions
- **Utility**: Premium staking boosts, exclusive access

### How It All Connects

```
[3D Voxel Bird] ──evolve──→ [2D Pixel Bird] ──shed──→ [Feathers]
     ↑                           ↑                        ↑
  Genesis Mint             Hold + Evolve           Craft / Earn
  (0.001 ETH)             (Free for holders)      (Staking reward)
```

**Key Concept**: Each phase adds value to previous phases. Holding a 3D bird gives you access to evolve it. Evolved birds shed feathers. Feathers can be used for crafting or staking boosts.

---

## Mint Logic

### How Minting Works

```
User Flow:
1. User visits /mint page
2. Sees preview of next NFT from IPFS (real art, real metadata)
3. Connects wallet (25+ options)
4. Selects quantity (1-10)
5. Clicks "MINT NOW"
6. Transaction sent: mint() or mintBatch()
7. Contract mints sequential token IDs
8. NFT appears in wallet with full IPFS metadata
9. NFT visible on OpenSea immediately
```

### Pricing Strategy

| Phase | Network | Price | Supply |
|-------|---------|-------|--------|
| Testnet | Base Sepolia | 0.001 ETH | 10,000 |
| Mainnet Early | Base | 0.005 ETH | 10,000 |
| Mainnet Public | Base | 0.01 ETH | 10,000 |

### What User Gets

When you mint a Riftbird NFT, you receive:
1. **Unique 3D Voxel Bird** - one of 10,000 unique combinations
2. **On-chain ownership** - ERC-721 standard, full ownership
3. **IPFS metadata** - decentralized, permanent storage
4. **Future access** - evolution to 2D pixel art + feather collection
5. **Staking eligibility** - earn $RIFT tokens
6. **Community membership** - DAO governance (future)

---

## NFT Collection Details

### Genesis Collection (10,000 NFTs)

| Attribute | Options |
|-----------|---------|
| **Species** | Raven, Owl, Falcon, Sparrow (+ expanding for 10k) |
| **Rarity** | Common (50%), Uncommon (25%), Rare (15%), Epic (8%), Legendary (2%) |
| **Stage** | Dormant (evolves with staking/time) |
| **Background** | Void Nebula, Cosmic Storm, Dark Matter, Quantum Field, Stellar Rift |
| **Energy** | Weak, Stable, Volatile, Critical, Cosmic |
| **Origin** | Earth, Mars, Kepler-186f, The Void, Unknown |
| **Class** | Scout, Warrior, Guardian, Technomancer, Architect |
| **Anomaly** | None, Glitch, Time Warp |

### Rarity Distribution

| Rarity | % | Color | Estimated Count (10k) |
|--------|---|-------|----------------------|
| Common | 50% | Gray | ~5,000 |
| Uncommon | 25% | Green | ~2,500 |
| Rare | 15% | Blue | ~1,500 |
| Epic | 8% | Purple | ~800 |
| Legendary | 2% | Gold | ~200 |

---

## OpenSea Presentation

### Collection Name
**VOIDRIFT Riftbirds**

### Symbol
**RIFT**

### Description (for OpenSea)
```
VOIDRIFT RIFTBIRDS

Interdimensional birds from the cosmic void. Each Riftbird is a unique generative NFT
that evolves through multiple art stages.

WHAT YOU GET:
- Unique 3D Voxel Bird from 10,000 supply
- Future evolution to 2D Pixel Art version
- Collectible Feather drops for holders
- $RIFT token staking rewards

4 Species | 5 Rarities | 8 Trait Types | 3 Art Stages

ART EVOLUTION:
Stage 1: 3D Voxel Birds (Genesis) - Mint now
Stage 2: 2D Pixel Art Birds - Free for holders
Stage 3: Pixel Art Feathers - Craft & earn
Stage 4: Animated Feathers - Premium editions

ROADMAP:
Phase 1: Genesis Mint on Base
Phase 2: Staking & $RIFT Token
Phase 3: 2D Pixel Art Evolution
Phase 4: Feather Collection
Phase 5: Crafting System
Phase 6: Community DAO

Built on Base L2 for ultra-low gas fees.
```

### Metadata Format (ERC-721 / OpenSea Standard)

```json
{
  "name": "Riftwalker #1",
  "description": "A cosmic Sparrow from the void dimension. Rarity: Rare. Part of the VOIDRIFT Genesis Collection.",
  "image": "ipfs://bafybeiaaeiktyp6ewvrvw6rsl2jdio7kcnkwn6mvl2k56armwnm3civynm/sparrow_1.png",
  "external_url": "https://voidrift-blue.vercel.app",
  "attributes": [
    { "trait_type": "Species", "value": "Sparrow" },
    { "trait_type": "Rarity", "value": "Rare" },
    { "trait_type": "Stage", "value": "1" },
    { "trait_type": "Background", "value": "Void Nebula" },
    { "trait_type": "Energy", "value": "Volatile" },
    { "trait_type": "Origin", "value": "The Void" },
    { "trait_type": "Class", "value": "Scout" },
    { "trait_type": "Anomaly", "value": "None" }
  ]
}
```

---

## Deployed Contracts

| Network | Contract | Address | Status |
|---------|----------|---------|--------|
| Sepolia (old) | RiftbirdNFT | `0x2f848cC764C77b8EFEBd23cd69ECB2F66A53D52f` | 222 supply, deprecated |
| Base Sepolia | RiftbirdNFT | **PENDING** | Deploy script ready, need ETH |
| Base Mainnet | RiftbirdNFT | **PLANNED** | After testnet validation |

### IPFS Assets

| Type | CID | Gateway URL |
|------|-----|-------------|
| Images | `bafybeiaaeiktyp6ewvrvw6rsl2jdio7kcnkwn6mvl2k56armwnm3civynm` | [View](https://gateway.pinata.cloud/ipfs/bafybeiaaeiktyp6ewvrvw6rsl2jdio7kcnkwn6mvl2k56armwnm3civynm/) |
| Metadata | `bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm` | [View](https://gateway.pinata.cloud/ipfs/bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/) |

**Base URI for contract:** `ipfs://bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/`

---

## Current Features (Implemented)

### 1. NFT Minting Page (/mint)
- Live preview of next NFT from IPFS (shows even before contract deploy)
- Connect wallet via RainbowKit (25+ wallets)
- Quantity selector (1-10)
- Price display with total calculation
- Progress bar (minted / max supply)
- Wrong chain detection with switch button
- "Coming Soon" state when contract not yet deployed
- NaN ETH fix - balance hidden on wrong chain

### 2. Collection Gallery (/collection)
- Browse all minted NFTs
- Filter by rarity (Legendary, Epic, Rare, Uncommon, Common)
- Real IPFS metadata and images
- Responsive grid layout

### 3. Leaderboard (/leaderboard)
- Top collectors ranking
- Wallet addresses and NFT counts
- Real-time blockchain data

### 4. Profile Dashboard (/profile)
- "Your Flock" - view owned NFTs
- NFT image as avatar
- Stats: total NFTs, portfolio value, rarest bird
- Rarity breakdown chart
- Share card for social media

### 5. Staking Preview UI (/staking)
- Rewards projection calculator
- $RIFT token teaser
- APY display (placeholder until contract deploy)

### 6. Wallet Connection
- 25+ wallets supported
- Auto-detection of installed extensions (Rabby, MetaMask, etc.)
- WalletConnect v2 for mobile
- Hardware wallet support (Ledger, Safe)

---

## Smart Contract: RiftbirdNFT.sol

```
Contract: RiftbirdNFT (ERC-721 + URIStorage)
Solidity: 0.8.20
Standards: ERC-721, ERC-165

Functions:
- mint()              → Mint 1 NFT (payable)
- mintBatch(quantity)  → Mint 1-10 NFTs (payable)
- ownerMint(to)       → Free mint for owner
- setBaseURI(uri)     → Update IPFS metadata location
- tokenURI(tokenId)   → Returns IPFS metadata URL
- totalSupply()       → Current minted count
- withdraw()          → Withdraw funds to owner

Config for Base Sepolia:
- Name: "Riftbirds"
- Symbol: "RIFT"
- Max Supply: 10,000
- Mint Price: 0.001 ETH
- Base URI: ipfs://bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/
```

---

## Deployment Guide

### Prerequisites
1. `.env` file in `/contracts/` with:
   ```
   PRIVATE_KEY=your_deployer_private_key
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   ```
2. Base Sepolia ETH on deployer wallet
   - Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - Faucet: https://faucet.quicknode.com/base/sepolia
   - Faucet: https://www.alchemy.com/faucets/base-sepolia

### Deploy Steps
```bash
cd contracts
npx hardhat run scripts/deploy-riftbird-base.ts --network base-sepolia
```

### After Deploy
1. Copy contract address from console output
2. Update `frontend/lib/contracts.ts` line 11:
   ```typescript
   export const RIFTBIRD_NFT_ADDRESS = '0x_YOUR_NEW_ADDRESS_HERE';
   ```
3. Push to git → Vercel auto-deploys
4. Test minting on https://voidrift-blue.vercel.app/mint

---

## Roadmap

### Phase 1: Base Sepolia Testing (CURRENT)
- [x] Frontend built and deployed
- [x] IPFS metadata uploaded
- [x] 25+ wallet support
- [x] Deploy scripts ready
- [ ] Get Base Sepolia ETH from faucet
- [ ] Deploy RiftbirdNFT to Base Sepolia
- [ ] Update contract address in frontend
- [ ] Test full mint flow
- [ ] Generate metadata for 10,000 NFTs

### Phase 2: Base Mainnet Launch
- [ ] Get ETH on Base mainnet
- [ ] Deploy contract to Base Mainnet
- [ ] Update frontend for mainnet
- [ ] Set up OpenSea collection page
- [ ] Launch marketing (Twitter/X)
- [ ] Community building (Discord)

### Phase 3: Staking & $RIFT Token
- [ ] Deploy RiftToken (ERC-20) contract
- [ ] Deploy VoidriftStaking contract
- [ ] Enable staking UI
- [ ] Staking tiers based on rarity
- [ ] Rewards: 10 $RIFT/day (Common) → 50 $RIFT/day (Legendary)

### Phase 4: 2D Pixel Art Evolution
- [ ] Finalize 2D pixel art bird models
- [ ] Upload new art to IPFS
- [ ] Create evolution mechanic (burn/claim or metadata swap)
- [ ] Holders of Stage 1 get free Stage 2 claim
- [ ] New collection on OpenSea or metadata update

### Phase 5: Feather Collection
- [ ] Finalize 2D & 3D pixel art feather designs
- [ ] Animate feathers
- [ ] Deploy Feather NFT contract (ERC-1155?)
- [ ] Airdrop feathers to bird holders
- [ ] Feather crafting system

### Phase 6: Crafting & Gamification
- [ ] Burn multiple feathers → craft higher rarity
- [ ] Achievements system
- [ ] Daily check-in rewards
- [ ] Seasonal events

### Phase 7: Community & DAO
- [ ] DAO governance with $RIFT
- [ ] Proposal voting
- [ ] Community treasury
- [ ] Revenue sharing

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
│   │   ├── mint/ (MintingInterface, MintPreview, LiveMintFeed)
│   │   ├── collection/ (NFTCard, RarityFilter)
│   │   ├── leaderboard/ (LeaderboardTable)
│   │   ├── profile/ (FlockStats, ShareCard)
│   │   └── staking/ (RewardsProjection, RiftTokenTeaser)
│   ├── hooks/ (useLeaderboard, useLiveMints)
│   ├── lib/
│   │   ├── contracts.ts (addresses, ABIs, IPFS config)
│   │   ├── nftUtils.ts (rarity, traits)
│   │   └── wagmi.ts (wallet config)
│   └── public/birds/ (fallback images)
├── contracts/
│   ├── contracts/
│   │   ├── RiftbirdNFT.sol (MVP - current)
│   │   ├── VoidriftNFT.sol (Full suite with evolution)
│   │   ├── RiftToken.sol (ERC-20 staking rewards)
│   │   ├── VoidriftStaking.sol (NFT staking)
│   │   └── WhitelistManager.sol (Merkle proof whitelist)
│   ├── scripts/
│   │   ├── deploy-riftbird-base.ts (Base Sepolia deploy)
│   │   ├── deploy-riftbird.ts (Sepolia deploy)
│   │   └── deploy_base.ts (Full suite deploy)
│   ├── hardhat.config.ts
│   └── .env (PRIVATE_KEY, RPC URLs - not in git)
├── scripts/ (metadata generation, IPFS uploads)
├── assets/metadata/ (generated JSON files)
└── doc2.0v.md (this file)
```

---

## Scripts Available

| Script | Purpose |
|--------|---------|
| `scripts/upload-images.js` | Upload bird images to IPFS via Pinata |
| `scripts/generate_metadata.js` | Generate NFT metadata JSON files |
| `scripts/upload-metadata.js` | Upload metadata to IPFS via Pinata |
| `scripts/set-base-uri.js` | Set baseURI on deployed contract |
| `contracts/scripts/deploy-riftbird-base.ts` | Deploy RiftbirdNFT to Base Sepolia |

---

## Why Base?

| Feature | Ethereum | Base |
|---------|----------|------|
| Gas fees | $5-50+ | $0.01-0.10 |
| Speed | ~15 sec | ~2 sec |
| Security | Native | ETH L2 |
| OpenSea | Yes | Yes |
| Ecosystem | Largest | Growing fast |

**Decision**: Use Base for production - cheaper, faster, same security via Ethereum L2.

---

## Links & Resources

- **Live Site**: https://voidrift-blue.vercel.app
- **GitHub**: https://github.com/s1zeNof/VOIDRIFT
- **Contract (Sepolia, old)**: https://sepolia.etherscan.io/address/0x2f848cC764C77b8EFEBd23cd69ECB2F66A53D52f
- **IPFS Images**: https://gateway.pinata.cloud/ipfs/bafybeiaaeiktyp6ewvrvw6rsl2jdio7kcnkwn6mvl2k56armwnm3civynm/
- **IPFS Metadata**: https://gateway.pinata.cloud/ipfs/bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/

---

## Changelog

### v2.4 (Current)
- Fixed mint preview - now shows real IPFS NFT preview even before contract deploy (no more "Contract Pending" blocking the preview)
- Fixed NaN ETH - balance hidden when contract not deployed or on wrong chain
- Fixed "0 ETH" price display - shows 0.001 ETH default when contract not yet readable
- Updated supply display from 222 to 10,000
- Added "COMING SOON" button state when contract pending
- Added pending contract notice banner below mint button
- Updated documentation with full art evolution concept
- Documented 3D → 2D Pixel Art → Feathers pipeline
- Added OpenSea listing strategy and metadata format
- Added deployment guide with prerequisites

### v2.3
- Wallet Connect upgrade: 25+ wallets with auto-detection
- NaN ETH fix on wrong chain
- Contract Pending state for undeployed contract
- Documentation overhaul

### v2.2
- Fixed Live Mint Feed block range scanning
- Fixed NFT image mismatch with IPFS metadata
- Fixed wallet NFT visibility (added tokenURI, supportsInterface to ABI)
- Fixed Base chain issues with chainId specification
- Wrong chain detection banners
- IPFS metadata integration across all pages

### v2.1
- IPFS metadata fully configured
- NFT avatar in profile & navbar
- Base Sepolia deploy script ready

### v2.0
- Leaderboard system
- Rarity filter
- Profile stats
- Staking preview UI
- Live mint feed

### v1.0
- Basic minting
- Collection gallery
- Wallet connection

---

*Last updated: February 2026*
*Version: 2.4*
