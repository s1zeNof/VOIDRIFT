const fs = require('fs');
const path = require('path');

// CID from uploaded images
const IMAGE_CID = "bafybeiaaeiktyp6ewvrvw6rsl2jdio7kcnkwn6mvl2k56armwnm3civynm";

const OUTPUT_DIR = path.join(__dirname, '../assets/metadata');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
} else {
    // Clean directory
    const files = fs.readdirSync(OUTPUT_DIR);
    for (const file of files) {
        fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
}

console.log(`Generating metadata files in ${OUTPUT_DIR}...`);

// Available images (matching what we uploaded)
const SPECIES_IMAGES = {
    raven: ['raven_1.png', 'raven_2.png'],
    owl: ['owl_1.png', 'owl_2.png'],
    falcon: ['falcon_1.png', 'falcon_2.png'],
    sparrow: ['sparrow_1.png', 'sparrow_2.png']
};

const SPECIES = Object.keys(SPECIES_IMAGES);

const TRAITS = {
    "Background": ["Void Nebula", "Cosmic Storm", "Dark Matter", "Quantum Field", "Stellar Rift"],
    "Energy": ["Weak", "Stable", "Volatile", "Critical", "Cosmic"],
    "Origin": ["Earth", "Mars", "Kepler-186f", "The Void", "Unknown"],
    "Class": ["Scout", "Warrior", "Guardian", "Technomancer", "Architect"],
    "Anomaly": ["None", "None", "None", "Glitch", "Time Warp"]
};

// Deterministic random based on token ID (same as frontend)
function seededRandom(seed) {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
}

function pickSeeded(array, seed) {
    return array[Math.floor(seededRandom(seed) * array.length)];
}

// Generate for 222 NFTs
const MAX_SUPPLY = 222;

for (let i = 1; i <= MAX_SUPPLY; i++) {
    // Deterministic species based on token ID
    const speciesIndex = Math.floor(seededRandom(i * 1.5) * SPECIES.length);
    const species = SPECIES[speciesIndex];

    // Deterministic image variant (1 or 2)
    const imageVariant = Math.floor(seededRandom(i * 2.5) * 2);
    const imageName = SPECIES_IMAGES[species][imageVariant];

    // Deterministic rarity
    const rarityRoll = seededRandom(i * 3.7);
    let rarity = "Common";
    if (rarityRoll > 0.98) rarity = "Legendary";
    else if (rarityRoll > 0.90) rarity = "Epic";
    else if (rarityRoll > 0.75) rarity = "Rare";
    else if (rarityRoll > 0.50) rarity = "Uncommon";

    // Species display name
    const speciesName = species.charAt(0).toUpperCase() + species.slice(1);

    const metadata = {
        name: `Riftwalker #${i}`,
        description: `A mysterious ${speciesName} from the VOIDRIFT dimension. This ${rarity.toLowerCase()} bird carries the essence of the cosmic rift.`,
        image: `ipfs://${IMAGE_CID}/${imageName}`,
        external_url: `https://voidrift.vercel.app/collection?id=${i}`,
        attributes: [
            { trait_type: "Species", value: speciesName },
            { trait_type: "Rarity", value: rarity },
            { trait_type: "Stage", value: "Dormant" },
            { trait_type: "Background", value: pickSeeded(TRAITS.Background, i * 4.1) },
            { trait_type: "Energy", value: pickSeeded(TRAITS.Energy, i * 5.3) },
            { trait_type: "Origin", value: pickSeeded(TRAITS.Origin, i * 6.7) },
            { trait_type: "Class", value: pickSeeded(TRAITS.Class, i * 7.9) },
            { trait_type: "Anomaly", value: pickSeeded(TRAITS.Anomaly, i * 8.2) },
            { trait_type: "Evolution Day", value: 0, display_type: "number" }
        ]
    };

    // Contract appends .json to tokenId, so save as 1.json, 2.json, etc.
    fs.writeFileSync(path.join(OUTPUT_DIR, `${i}.json`), JSON.stringify(metadata, null, 2));
}

console.log(`✅ Generated ${MAX_SUPPLY} metadata files!`);
console.log(`\nNext step: node upload-metadata.js`);
