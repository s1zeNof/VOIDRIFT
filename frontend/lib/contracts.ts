import { baseSepolia } from 'viem/chains';

// Supported chain - Base Sepolia (L2 testnet)
export const SUPPORTED_CHAIN_ID = baseSepolia.id; // 84532

// Block explorer base URL
export const EXPLORER_BASE_URL = 'https://sepolia.basescan.org';

// RiftbirdNFT (MVP) - deployed to Base Sepolia
// TODO: Replace with actual address after deploying with: node scripts/deploy-base-sepolia.js
export const RIFTBIRD_NFT_ADDRESS = '0x0000000000000000000000000000000000000000'; // <-- PASTE BASE SEPOLIA ADDRESS HERE

// Legacy contracts (VoidriftNFT full suite)
export const VOIDRIFT_NFT_ADDRESS = RIFTBIRD_NFT_ADDRESS; // alias for compatibility
export const RIFT_TOKEN_ADDRESS = '0xABc733d2B9D0049DDB719E7ADacabEB5B622ce87';
export const VOIDRIFT_STAKING_ADDRESS = '0x143A6943BB17C881B0971B2c8ca71d4a13FEb2a5';
export const WHITELIST_MANAGER_ADDRESS = '0xdcBf84b1c4f891A66fBfA410c5FC53f3BeB5eC33';

// IPFS base URI for metadata (matches contract's baseTokenURI)
export const IPFS_METADATA_BASE = 'ipfs://bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/';
export const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

// Convert IPFS URI to HTTP gateway URL
export function ipfsToHttp(ipfsUri: string): string {
    if (!ipfsUri) return '';
    if (ipfsUri.startsWith('ipfs://')) {
        return ipfsUri.replace('ipfs://', IPFS_GATEWAY);
    }
    return ipfsUri;
}

// Get metadata URL for a given token ID
export function getTokenMetadataUrl(tokenId: string | number): string {
    return `${IPFS_GATEWAY}bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/${tokenId}.json`;
}

export const VOIDRIFT_NFT_ABI = [
    // mint() - single mint, no args
    {
        "inputs": [],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    // mintBatch(quantity) - batch mint
    {
        "inputs": [
            { "internalType": "uint256", "name": "quantity", "type": "uint256" }
        ],
        "name": "mintBatch",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxSupply",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mintPrice",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "operator", "type": "address" },
            { "internalType": "bool", "name": "approved", "type": "bool" }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "operator", "type": "address" }
        ],
        "name": "isApprovedForAll",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    // tokenURI - critical for wallets and marketplaces to discover NFT metadata
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "tokenURI",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    // ownerOf - for verifying token ownership
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "ownerOf",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    // name - ERC721 name
    {
        "inputs": [],
        "name": "name",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    // symbol - ERC721 symbol
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    // supportsInterface - for ERC165 (wallets use this to detect ERC721)
    {
        "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }],
        "name": "supportsInterface",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    // Minted event - for fetching user's token IDs
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
            { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "Minted",
        "type": "event"
    },
    // Transfer event (ERC721)
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
            { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "Transfer",
        "type": "event"
    }
] as const;

export const VOIDRIFT_STAKING_ABI = [
    {
        "inputs": [
            { "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }
        ],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
        "name": "calculateRewards",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "", "type": "address" },
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "name": "stakedAssets",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
        "name": "getStakedTokens",
        "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export const RIFT_TOKEN_ABI = [
    {
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;
