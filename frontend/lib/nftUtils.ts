/**
 * RIFTBIRDS - NFT Utilities
 *
 * Architecture designed for easy scaling:
 * 1. All NFT config in one place (COLLECTION_CONFIG)
 * 2. Add new birds by adding to AVAILABLE_NFTS array
 * 3. Token ID = array index + 1
 */

// =============================================================================
// CONFIGURATION - Edit this section to add/modify NFTs
// =============================================================================

export interface NFTConfig {
    id: number;
    species: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
    variant: number;
    enabled: boolean; // Toggle NFTs on/off without deleting
}

export const COLLECTION_CONFIG = {
    name: 'Riftbirds',
    symbol: 'RIFT',
    description: 'Mystical voxel birds from the Rift dimension',

    // Rarity colors for UI
    rarityColors: {
        Common: '#9ca3af',     // gray
        Rare: '#3b82f6',       // blue
        Epic: '#a855f7',       // purple
        Legendary: '#eab308',  // yellow
        Mythic: '#ef4444',     // red
    },

    // Staking multipliers per rarity
    stakingMultipliers: {
        Common: 1,
        Rare: 1.5,
        Epic: 2,
        Legendary: 3,
        Mythic: 5,
    }
};

/**
 * AVAILABLE NFTs - Add new birds here
 *
 * To add a new bird:
 * 1. Add image to /public/birds/ as {species}_{variant}.png
 * 2. Add entry here with enabled: true
 * 3. Token ID will be the array index + 1
 *
 * For MVP: Only owl_1 is enabled
 */
export const AVAILABLE_NFTS: NFTConfig[] = [
    // ===== MVP: Only this one is active =====
    { id: 1, species: 'Owl', rarity: 'Legendary', variant: 1, enabled: true },

    // ===== Future birds (disabled for now) =====
    { id: 2, species: 'Owl', rarity: 'Legendary', variant: 2, enabled: false },
    { id: 3, species: 'Falcon', rarity: 'Epic', variant: 1, enabled: false },
    { id: 4, species: 'Falcon', rarity: 'Epic', variant: 2, enabled: false },
    { id: 5, species: 'Sparrow', rarity: 'Common', variant: 1, enabled: false },
    { id: 6, species: 'Sparrow', rarity: 'Common', variant: 2, enabled: false },
    { id: 7, species: 'Raven', rarity: 'Rare', variant: 1, enabled: false },
    { id: 8, species: 'Raven', rarity: 'Rare', variant: 2, enabled: false },
];

// =============================================================================
// COMPUTED VALUES - Don't edit below unless adding features
// =============================================================================

// Get only enabled NFTs
export const getEnabledNFTs = () => AVAILABLE_NFTS.filter(nft => nft.enabled);

// Get max supply (only enabled NFTs)
export const getMaxSupply = () => getEnabledNFTs().length;

// Get NFT by ID
export const getNFTById = (id: number): NFTConfig | undefined =>
    AVAILABLE_NFTS.find(nft => nft.id === id);

// Get enabled NFT by ID
export const getEnabledNFTById = (id: number): NFTConfig | undefined =>
    getEnabledNFTs().find(nft => nft.id === id);

// =============================================================================
// INTERFACES
// =============================================================================

export interface NFTAttributes {
    attributes: {
        trait_type: string;
        value: string;
        percent: number;
    }[];
    image: string;
    video: string;
    rarity: string;
    name: string;
    species: string;
    colorTheme: string;
}

// =============================================================================
// TRAIT GENERATION
// =============================================================================

/**
 * Generate traits for a specific NFT by ID
 */
export function generateTraits(id: string): NFTAttributes {
    const numId = parseInt(id) || 1;
    const nft = getNFTById(numId);

    // Default to first enabled NFT if not found
    const activeNft = nft || getEnabledNFTs()[0];

    if (!activeNft) {
        throw new Error('No NFTs configured!');
    }

    const imagePath = `/birds/${activeNft.species.toLowerCase()}_${activeNft.variant}.png`;
    const videoPath = `/birds/${activeNft.species.toLowerCase()}_${activeNft.variant}.mp4`;

    return {
        attributes: [
            { trait_type: "Species", value: activeNft.species, percent: 100 },
            { trait_type: "Rarity", value: activeNft.rarity, percent: 100 },
            { trait_type: "Variant", value: `Type ${activeNft.variant}`, percent: 50 },
            { trait_type: "Generation", value: "Genesis", percent: 100 },
        ],
        image: imagePath,
        video: videoPath,
        rarity: activeNft.rarity,
        name: `${activeNft.species} #${activeNft.id}`,
        species: activeNft.species,
        colorTheme: "Void"
    };
}

/**
 * Generate traits from seed (for randomized minting in future)
 * Currently returns the only enabled NFT
 */
export function generateTraitsFromSeed(id: string, seed: number): NFTAttributes {
    const enabledNfts = getEnabledNFTs();

    if (enabledNfts.length === 0) {
        throw new Error('No NFTs enabled!');
    }

    // For MVP: Always return the single enabled NFT
    if (enabledNfts.length === 1) {
        return generateTraits(String(enabledNfts[0].id));
    }

    // For future: Random selection from enabled NFTs
    const selectedIndex = seed % enabledNfts.length;
    const selectedNft = enabledNfts[selectedIndex];

    return generateTraits(String(selectedNft.id));
}

/**
 * Generate preview seed for client-side preview
 */
export function generatePreviewSeed(tokenId: number, userAddress?: string): number {
    // For MVP with 1 NFT, seed doesn't matter
    return 0;
}

// =============================================================================
// HELPERS FOR UI COMPONENTS
// =============================================================================

/**
 * Get all species for collection showcase
 * Only returns enabled NFTs
 */
export const ALL_SPECIES_PREVIEW = getEnabledNFTs().map(nft => ({
    id: String(nft.id),
    name: `${nft.species} (${nft.rarity})`,
    species: nft.species,
    rarity: nft.rarity,
}));

/**
 * Get rarity color for UI
 */
export function getRarityColor(rarity: string): string {
    return COLLECTION_CONFIG.rarityColors[rarity as keyof typeof COLLECTION_CONFIG.rarityColors] || '#9ca3af';
}

/**
 * Get staking multiplier for rarity
 */
export function getStakingMultiplier(rarity: string): number {
    return COLLECTION_CONFIG.stakingMultipliers[rarity as keyof typeof COLLECTION_CONFIG.stakingMultipliers] || 1;
}

// =============================================================================
// RARITY SYSTEM
// =============================================================================

export const RARITY_ORDER = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'] as const;

export const RARITY_SCORES: Record<string, number> = {
    Common: 10,
    Rare: 25,
    Epic: 50,
    Legendary: 100,
    Mythic: 200,
};

/**
 * Calculate total rarity score for a collection of token IDs
 */
export function calculateRarityScore(tokenIds: string[]): number {
    return tokenIds.reduce((total, id) => {
        const nft = getNFTById(Number(id));
        if (!nft) return total;
        return total + (RARITY_SCORES[nft.rarity] || 0);
    }, 0);
}

/**
 * Get rarity breakdown for a collection of token IDs
 */
export function getRarityBreakdown(tokenIds: string[]): Record<string, number> {
    const breakdown: Record<string, number> = {};

    tokenIds.forEach(id => {
        const nft = getNFTById(Number(id));
        if (nft) {
            breakdown[nft.rarity] = (breakdown[nft.rarity] || 0) + 1;
        }
    });

    return breakdown;
}

/**
 * Calculate full collection stats
 */
export function calculateCollectionStats(tokenIds: string[]): {
    score: number;
    breakdown: Record<string, number>;
    totalNFTs: number;
    highestRarity: string;
} {
    const breakdown = getRarityBreakdown(tokenIds);
    const score = calculateRarityScore(tokenIds);

    // Find highest rarity owned
    let highestRarity = 'Common';
    for (const rarity of [...RARITY_ORDER].reverse()) {
        if (breakdown[rarity] && breakdown[rarity] > 0) {
            highestRarity = rarity;
            break;
        }
    }

    return {
        score,
        breakdown,
        totalNFTs: tokenIds.length,
        highestRarity,
    };
}

/**
 * Sort token IDs by rarity (highest first)
 */
export function sortByRarity(tokenIds: string[], descending = true): string[] {
    return [...tokenIds].sort((a, b) => {
        const nftA = getNFTById(Number(a));
        const nftB = getNFTById(Number(b));
        const scoreA = nftA ? (RARITY_SCORES[nftA.rarity] || 0) : 0;
        const scoreB = nftB ? (RARITY_SCORES[nftB.rarity] || 0) : 0;
        return descending ? scoreB - scoreA : scoreA - scoreB;
    });
}

/**
 * Filter token IDs by rarity
 */
export function filterByRarity(tokenIds: string[], rarities: string[]): string[] {
    if (rarities.length === 0) return tokenIds;
    return tokenIds.filter(id => {
        const nft = getNFTById(Number(id));
        return nft && rarities.includes(nft.rarity);
    });
}
