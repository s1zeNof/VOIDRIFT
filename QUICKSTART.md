# RIFTBIRDS - Quick Start Guide

## Project Structure (Professional Pattern)

```
VOIDRIFT/
├── assets/
│   ├── images/          # NFT images (1.png, 2.png, ...)
│   ├── metadata/        # JSON metadata (1.json, 2.json, ...)
│   ├── source/          # Original source files (owl_1.png, etc.)
│   └── deployment.json  # Last deployment info
│
├── contracts/           # Smart contracts (Hardhat)
│   ├── contracts/
│   │   └── RiftbirdNFT.sol  # MVP contract
│   └── scripts/
│       └── deploy-riftbird.ts
│
├── frontend/            # Next.js frontend
│
└── scripts/             # Utility scripts
    ├── config.js        # Central configuration
    ├── upload-images.js
    ├── update-metadata.js
    ├── upload-metadata.js
    └── full-deploy.js   # All-in-one deployment
```

## Current Status: MVP with 1 NFT (owl_1)

Active NFT: `assets/images/1.png` (the owl)

---

## STEP-BY-STEP: Deploy to Testnet

### 1. Get Sepolia ETH (for gas)

Visit one of these faucets:
- https://sepoliafaucet.com (Alchemy - recommended)
- https://faucet.quicknode.com/ethereum/sepolia
- https://faucets.chain.link/sepolia

### 2. Upload Assets to IPFS

```bash
# One command does everything:
node scripts/full-deploy.js

# Or step by step:
node scripts/upload-images.js
node scripts/update-metadata.js <IMAGE_CID>
node scripts/upload-metadata.js
```

### 3. Deploy Smart Contract

```bash
cd contracts
npx hardhat run scripts/deploy-riftbird.ts --network sepolia
```

### 4. Update Contract with Metadata CID

After deployment, call `setBaseURI` with your metadata CID:
```
setBaseURI("ipfs://YOUR_METADATA_CID/")
```

### 5. Test Minting

Use Etherscan or your frontend to call `mint()` with 0.001 ETH.

---

## Adding More NFTs

1. Add images to `assets/images/` with numeric names:
   - `2.png`, `3.png`, etc.

2. Create metadata in `assets/metadata/`:
   - `2.json`, `3.json`, etc.

3. Run `node scripts/full-deploy.js`

4. Update contract's baseURI

---

## Environment Variables

Create `contracts/.env`:
```
PINATA_JWT=your_pinata_jwt_token
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

---

## Why This Architecture?

| Aspect | Our Approach | Industry Standard |
|--------|-------------|-------------------|
| File naming | `1.png`, `2.png` | Yes (Azuki, BAYC) |
| Metadata | `1.json`, `2.json` | Yes (OpenSea standard) |
| IPFS storage | Pinata | Yes (common choice) |
| Token ID = Filename | Yes | Yes |
| Separate images/metadata folders | Yes | Yes |

This pattern is used by:
- Pudgy Penguins
- Azuki
- Doodles
- CloneX
