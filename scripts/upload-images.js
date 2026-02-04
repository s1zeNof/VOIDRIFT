/**
 * RIFTBIRDS - Upload Images to IPFS via Pinata
 *
 * Usage: node scripts/upload-images.js
 *
 * This script uploads the /assets/images folder to IPFS
 * and returns the CID to use in metadata
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');

const { jwt } = config.pinata;
const IMAGES_PATH = config.paths.images;

if (!jwt) {
    console.error('PINATA_JWT not found in contracts/.env');
    process.exit(1);
}

async function uploadImages() {
    console.log('='.repeat(50));
    console.log('RIFTBIRDS - Image Upload to IPFS');
    console.log('='.repeat(50));

    const files = fs.readdirSync(IMAGES_PATH).filter(f =>
        f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.gif')
    );

    if (files.length === 0) {
        console.error('No images found in', IMAGES_PATH);
        process.exit(1);
    }

    console.log(`Found ${files.length} image(s) to upload`);
    files.forEach(f => console.log(`  - ${f}`));

    const formData = new FormData();
    const folderName = 'riftbirds-images';

    for (const file of files) {
        const filePath = path.join(IMAGES_PATH, file);
        const fileContent = fs.readFileSync(filePath);
        const blob = new Blob([fileContent], { type: 'image/png' });
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
        console.log('SUCCESS! Images uploaded to IPFS');
        console.log('='.repeat(50));
        console.log('\nIMAGE CID:', data.IpfsHash);
        console.log('\nIPFS URL: ipfs://' + data.IpfsHash + '/');
        console.log('Gateway:  ' + config.pinata.gateway + '/' + data.IpfsHash + '/');
        console.log('\n>> Copy this CID and run: node scripts/update-metadata.js ' + data.IpfsHash);

    } catch (error) {
        console.error('Upload failed:', error.message);
        process.exit(1);
    }
}

uploadImages();
