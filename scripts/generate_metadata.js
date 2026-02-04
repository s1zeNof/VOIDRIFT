const fs = require('fs');
const path = require('path');

// INSTRUCTION: Replace this with the CID from Pinata after user provides it
// For now, we use a placeholder to demonstrate the data structure
const IMAGE_CID = "bafybeihub7hq6eskxpu237nepcxt2pfi3u53nr7dhwafjnj3iunm6y4cai";

const OUTPUT_DIR = path.join(__dirname, '../assets/json');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
} else {
    // Clean directory
    const files = fs.readdirSync(OUTPUT_DIR);
    for (const file of files) {
        fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
}

console.log(`Generating 222 metadata files in ${OUTPUT_DIR}...`);

const TRAITS = {
    "Energy": ["Weak", "Stable", "Volatile", "Critical", "Cosmic"],
    "Origin": ["Earth", "Mars", "Kepler-186f", "The Void", "Unknown"],
    "Class": ["Scout", "Warrior", "Guardian", "Technomancer", "Architect"],
    "Anomaly": ["None", "None", "None", "Glitch", "Time Warp"] // "None" is more common
};

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

for (let i = 1; i <= 222; i++) {
    const rarityRank = Math.random();
    let rarity = "Common";
    if (rarityRank > 0.98) rarity = "Legendary";
    else if (rarityRank > 0.85) rarity = "Epic";
    else if (rarityRank > 0.60) rarity = "Rare";

    const metadata = {
        name: `Riftwalker #${i}`,
        description: `A dormant Rift waiting to evolve. Current Stage: VOID (1/6).`,
        image: `ipfs://${IMAGE_CID}/${i}.svg`, // Points to the image we just uploaded
        attributes: [
            { trait_type: "Stage", value: "Void" },
            { trait_type: "Rarity", value: rarity },
            { trait_type: "Energy", value: pickRandom(TRAITS.Energy) },
            { trait_type: "Origin", value: pickRandom(TRAITS.Origin) },
            { trait_type: "Class", value: pickRandom(TRAITS.Class) },
            { trait_type: "Evolution Day", value: 0, display_type: "number" }
        ]
    };

    fs.writeFileSync(path.join(OUTPUT_DIR, `${i}.json`), JSON.stringify(metadata, null, 2));
}

console.log('Done! Metadata generated with random traits.');
