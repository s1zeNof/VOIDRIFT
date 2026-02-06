/**
 * RIFTBIRDS - Upload Metadata to IPFS via Pinata
 *
 * Usage: node scripts/upload-metadata.js
 *
 * This script uploads the /assets/metadata folder to IPFS
 * and returns the CID to use in the smart contract
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');

const { jwt } = config.pinata;
const METADATA_PATH = config.paths.metadata;

if (!jwt) {
    console.error('PINATA_JWT not found in contracts/.env');
    process.exit(1);
}

async function uploadMetadata() {
    console.log('='.repeat(50));
    console.log('RIFTBIRDS - Metadata Upload to IPFS');
    console.log('='.repeat(50));

    // Files are named 1.json, 2.json, etc. (contract appends .json)
    const files = fs.readdirSync(METADATA_PATH).filter(f => /^\d+\.json$/.test(f));

    if (files.length === 0) {
        console.error('No metadata files found in', METADATA_PATH);
        process.exit(1);
    }

    // Verify metadata has correct image URLs (not placeholder)
    const sampleFile = path.join(METADATA_PATH, files[0]);
    const sampleData = JSON.parse(fs.readFileSync(sampleFile, 'utf8'));

    if (sampleData.image.includes('PLACEHOLDER')) {
        console.error('\nMetadata still has PLACEHOLDER image URLs!');
        console.error('First run: node scripts/upload-images.js');
        console.error('Then run: node scripts/update-metadata.js <IMAGE_CID>');
        process.exit(1);
    }

    console.log(`Found ${files.length} metadata file(s) to upload`);
    console.log('Sample image URL:', sampleData.image);

    const formData = new FormData();
    const folderName = 'riftbirds-metadata';

    for (const file of files) {
        const filePath = path.join(METADATA_PATH, file);
        const fileContent = fs.readFileSync(filePath);
        const blob = new Blob([fileContent], { type: 'application/json' });
        formData.append('file', blob, `${folderName}/${file}`);
    }

    formData.append('pinataMetadata', JSON.stringify({ name: folderName }));
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

    console.log('\nUploading to Pinata...');

    try {
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${jwt}` },
            body: formData
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Upload failed: ${response.status} - ${error}`);
        }

        const data = await response.json();

        console.log('\n' + '='.repeat(50));
        console.log('SUCCESS! Metadata uploaded to IPFS');
        console.log('='.repeat(50));
        console.log('\nMETADATA CID:', data.IpfsHash);
        console.log('\nBase URI for contract: ipfs://' + data.IpfsHash + '/');
        console.log('\n' + '='.repeat(50));
        console.log('NEXT STEPS:');
        console.log('='.repeat(50));
        console.log('1. Copy the METADATA CID above');
        console.log('2. Set it in your smart contract:');
        console.log('   setBaseURI("ipfs://' + data.IpfsHash + '/")');
        console.log('\nOr update stageBaseURIs for evolution stages.');

    } catch (error) {
        console.error('Upload failed:', error.message);
        process.exit(1);
    }
}

uploadMetadata();
