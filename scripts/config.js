/**
 * RIFTBIRDS - Configuration
 * Central configuration for all scripts
 */

const path = require('path');
const fs = require('fs');

// Load environment variables from contracts/.env
const envPath = path.join(__dirname, '../contracts/.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex > 0) {
                const key = trimmed.substring(0, eqIndex).trim();
                const value = trimmed.substring(eqIndex + 1).trim();
                process.env[key] = value;
            }
        }
    });
}

module.exports = {
    // Pinata Configuration
    pinata: {
        jwt: process.env.PINATA_JWT,
        gateway: 'https://gateway.pinata.cloud/ipfs'
    },

    // Paths
    paths: {
        root: path.join(__dirname, '..'),
        assets: path.join(__dirname, '../assets'),
        images: path.join(__dirname, '../frontend/public/birds'),
        metadata: path.join(__dirname, '../assets/metadata'),
        source: path.join(__dirname, '../assets/source'),
        contracts: path.join(__dirname, '../contracts')
    },

    // Collection Configuration
    collection: {
        name: 'Riftbirds',
        symbol: 'RIFT',
        description: 'Mystical voxel birds from the Rift dimension',
        maxSupply: 222,
        // For MVP testnet - only 1 NFT active
        activeSupply: 1
    },

    // Species available (for future expansion)
    species: ['owl', 'falcon', 'sparrow', 'raven'],

    // Rarity tiers
    rarities: {
        common: { weight: 60, stakingMultiplier: 1 },
        uncommon: { weight: 25, stakingMultiplier: 1.5 },
        rare: { weight: 10, stakingMultiplier: 2 },
        legendary: { weight: 4, stakingMultiplier: 3 },
        mythic: { weight: 1, stakingMultiplier: 5 }
    }
};
