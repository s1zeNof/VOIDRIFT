/**
 * RIFTBIRDS - Update Metadata with Image CID
 *
 * Usage: node scripts/update-metadata.js <IMAGE_CID>
 *
 * This script updates all metadata JSON files with the correct image CID
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');

const METADATA_PATH = config.paths.metadata;

const imageCid = process.argv[2];

if (!imageCid) {
    console.error('Usage: node scripts/update-metadata.js <IMAGE_CID>');
    console.error('Example: node scripts/update-metadata.js bafybeiabc123...');
    process.exit(1);
}

console.log('='.repeat(50));
console.log('RIFTBIRDS - Update Metadata');
console.log('='.repeat(50));
console.log('\nImage CID:', imageCid);

const files = fs.readdirSync(METADATA_PATH).filter(f => f.endsWith('.json'));

if (files.length === 0) {
    console.error('No metadata files found in', METADATA_PATH);
    process.exit(1);
}

console.log(`\nUpdating ${files.length} metadata file(s)...`);

let updated = 0;

for (const file of files) {
    const filePath = path.join(METADATA_PATH, file);
    const metadata = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Extract token ID from filename (e.g., "1.json" -> "1")
    const tokenId = path.basename(file, '.json');

    // Update image URL
    metadata.image = `ipfs://${imageCid}/${tokenId}.png`;

    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
    console.log(`  Updated: ${file}`);
    updated++;
}

console.log('\n' + '='.repeat(50));
console.log(`SUCCESS! Updated ${updated} metadata file(s)`);
console.log('='.repeat(50));
console.log('\n>> Now run: node scripts/upload-metadata.js');
