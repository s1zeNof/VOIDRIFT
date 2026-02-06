/**
 * RIFTBIRDS - NFT Utilities
 *
 * IMPORTANT: This logic MUST match scripts/generate_metadata.js
 * Both use the same seeded random to generate consistent traits
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

export const COLLECTION_CONFIG = {
    name: 'Riftbirds',
    symbol: 'RIFT',
    description: 'Mystical voxel birds from the Rift dimension',
    maxSupply: 222,

    // Rarity colors for UI
    rarityColors: {
        Common: '#9ca3af',     // gray
        Uncommon: '#22c55e',   // green
        Rare: '#3b82f6',       // blue
        Epic: '#a855f7',       // purple
        Legendary: '#eab308',  // yellow
        Mythic: '#ef4444',     // red
    },

    // Staking multipliers per rarity
    stakingMultipliers: {
        Common: 1,
        Uncommon: 1.25,
        Rare: 1.5,
        Epic: 2,
        Legendary: 3,
        Mythic: 5,
    }
};

// Species and their images (same as IPFS)
const SPECIES_IMAGES: Record<string, string[]> = {
    raven: ['raven_1.png', 'raven_2.png'],
    owl: ['owl_1.png', 'owl_2.png'],
    falcon: ['falcon_1.png', 'falcon_2.png'],
    sparrow: ['sparrow_1.png', 'sparrow_2.png']
};

const SPECIES = Object.keys(SPECIES_IMAGES);

const TRAITS = {
    Background: ["Void Nebula", "Cosmic Storm", "Dark Matter", "Quantum Field", "Stellar Rift"],
    Energy: ["Weak", "Stable", "Volatile", "Critical", "Cosmic"],
    Origin: ["Earth", "Mars", "Kepler-186f", "The Void", "Unknown"],
    Class: ["Scout", "Warrior", "Guardian", "Technomancer", "Architect"],
    Anomaly: ["None", "None", "None", "Glitch", "Time Warp"]
};

// =============================================================================
// SEEDED RANDOM - MUST MATCH generate_metadata.js
// =============================================================================

function seededRandom(seed: number): number {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
}

function pickSeeded<T>(array: T[], seed: number): T {
    return array[Math.floor(seededRandom(seed) * array.length)];
}

// =============================================================================
// INTERFACES
// =============================================================================

export interface NFTAttributes {
    attributes: {
        trait_type: string;
        value: string;
        percent?: number;
    }[];
    image: string;
    video: string;
    rarity: string;
    name: string;
    species: string;
    colorTheme: string;
}

// =============================================================================
// TRAIT GENERATION - MUST MATCH generate_metadata.js
// =============================================================================

/**
 * Generate traits for a specific NFT by ID
 * This uses the SAME logic as scripts/generate_metadata.js
 */
export function generateTraits(id: string): NFTAttributes {
    const i = parseInt(id) || 1;

    // Deterministic species based on token ID (same as generate_metadata.js)
    const speciesIndex = Math.floor(seededRandom(i * 1.5) * SPECIES.length);
    const species = SPECIES[speciesIndex];

    // Deterministic image variant (1 or 2)
    const imageVariant = Math.floor(seededRandom(i * 2.5) * 2);
    const imageName = SPECIES_IMAGES[species][imageVariant];

    // Deterministic rarity (same thresholds as generate_metadata.js)
    const rarityRoll = seededRandom(i * 3.7);
    let rarity = "Common";
    if (rarityRoll > 0.98) rarity = "Legendary";
    else if (rarityRoll > 0.90) rarity = "Epic";
    else if (rarityRoll > 0.75) rarity = "Rare";
    else if (rarityRoll > 0.50) rarity = "Uncommon";

    // Species display name
    const speciesName = species.charAt(0).toUpperCase() + species.slice(1);

    // Image path (local for frontend display)
    const imagePath = `/birds/${imageName}`;

    return {
        attributes: [
            { trait_type: "Species", value: speciesName },
            { trait_type: "Rarity", value: rarity },
            { trait_type: "Stage", value: "Dormant" },
            { trait_type: "Background", value: pickSeeded(TRAITS.Background, i * 4.1) },
            { trait_type: "Energy", value: pickSeeded(TRAITS.Energy, i * 5.3) },
            { trait_type: "Origin", value: pickSeeded(TRAITS.Origin, i * 6.7) },
            { trait_type: "Class", value: pickSeeded(TRAITS.Class, i * 7.9) },
            { trait_type: "Anomaly", value: pickSeeded(TRAITS.Anomaly, i * 8.2) },
        ],
        image: imagePath,
        video: '', // No video for now
        rarity: rarity,
        name: `Riftwalker #${i}`,
        species: speciesName,
        colorTheme: "Void"
    };
}

// =============================================================================
// HELPERS FOR UI COMPONENTS
// =============================================================================

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

export const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'] as const;

export const RARITY_SCORES: Record<string, number> = {
    Common: 10,
    Uncommon: 15,
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
        const traits = generateTraits(id);
        return total + (RARITY_SCORES[traits.rarity] || 0);
    }, 0);
}

/**
 * Get rarity breakdown for a collection of token IDs
 */
export function getRarityBreakdown(tokenIds: string[]): Record<string, number> {
    const breakdown: Record<string, number> = {};

    tokenIds.forEach(id => {
        const traits = generateTraits(id);
        breakdown[traits.rarity] = (breakdown[traits.rarity] || 0) + 1;
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
        const traitsA = generateTraits(a);
        const traitsB = generateTraits(b);
        const scoreA = RARITY_SCORES[traitsA.rarity] || 0;
        const scoreB = RARITY_SCORES[traitsB.rarity] || 0;
        return descending ? scoreB - scoreA : scoreA - scoreB;
    });
}

/**
 * Filter token IDs by rarity
 */
export function filterByRarity(tokenIds: string[], rarities: string[]): string[] {
    if (rarities.length === 0) return tokenIds;
    return tokenIds.filter(id => {
        const traits = generateTraits(id);
        return rarities.includes(traits.rarity);
    });
}

// Legacy exports for compatibility
export const getMaxSupply = () => COLLECTION_CONFIG.maxSupply;
export const getNFTById = (id: number) => generateTraits(String(id));
