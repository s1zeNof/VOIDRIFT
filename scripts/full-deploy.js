/**
 * RIFTBIRDS - Full Deployment Script
 *
 * Usage: node scripts/full-deploy.js
 *
 * This script runs the complete deployment workflow:
 * 1. Upload images to IPFS
 * 2. Update metadata with image CID
 * 3. Upload metadata to IPFS
 * 4. Display final CID for contract
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');

const { jwt } = config.pinata;

if (!jwt) {
    console.error('PINATA_JWT not found in contracts/.env');
    process.exit(1);
}

async function uploadFolder(folderPath, folderName, fileFilter) {
    const files = fs.readdirSync(folderPath).filter(fileFilter);

    if (files.length === 0) {
        throw new Error(`No files found in ${folderPath}`);
    }

    const formData = new FormData();

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const fileContent = fs.readFileSync(filePath);
        const mimeType = file.endsWith('.json') ? 'application/json' : 'image/png';
        const blob = new Blob([fileContent], { type: mimeType });
        formData.append('file', blob, `${folderName}/${file}`);
    }

    formData.append('pinataMetadata', JSON.stringify({ name: folderName }));
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

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
    return data.IpfsHash;
}

async function fullDeploy() {
    console.log('\n' + '='.repeat(60));
    console.log('      RIFTBIRDS - Full IPFS Deployment');
    console.log('='.repeat(60) + '\n');

    // Step 1: Upload images
    console.log('STEP 1/3: Uploading images...');
    const imageFiles = fs.readdirSync(config.paths.images).filter(f =>
        f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.gif')
    );
    console.log(`  Found ${imageFiles.length} image(s)`);

    const imageCid = await uploadFolder(
        config.paths.images,
        'riftbirds-images',
        f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.gif')
    );
    console.log(`  Image CID: ${imageCid}`);

    // Step 2: Update metadata
    console.log('\nSTEP 2/3: Updating metadata with image CID...');
    const metadataFiles = fs.readdirSync(config.paths.metadata).filter(f => f.endsWith('.json'));

    for (const file of metadataFiles) {
        const filePath = path.join(config.paths.metadata, file);
        const metadata = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const tokenId = path.basename(file, '.json');
        metadata.image = `ipfs://${imageCid}/${tokenId}.png`;
        fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
    }
    console.log(`  Updated ${metadataFiles.length} metadata file(s)`);

    // Step 3: Upload metadata
    console.log('\nSTEP 3/3: Uploading metadata...');
    const metadataCid = await uploadFolder(
        config.paths.metadata,
        'riftbirds-metadata',
        f => f.endsWith('.json')
    );
    console.log(`  Metadata CID: ${metadataCid}`);

    // Final output
    console.log('\n' + '='.repeat(60));
    console.log('      DEPLOYMENT COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n RESULTS:');
    console.log('  Images CID:   ', imageCid);
    console.log('  Metadata CID: ', metadataCid);
    console.log('\n CONTRACT CONFIGURATION:');
    console.log(`  Base URI: ipfs://${metadataCid}/`);
    console.log('\n VERIFICATION LINKS:');
    console.log(`  Image:    ${config.pinata.gateway}/${imageCid}/1.png`);
    console.log(`  Metadata: ${config.pinata.gateway}/${metadataCid}/1.json`);
    console.log('\n' + '='.repeat(60) + '\n');

    // Save deployment info
    const deployInfo = {
        timestamp: new Date().toISOString(),
        imageCid,
        metadataCid,
        baseUri: `ipfs://${metadataCid}/`,
        files: {
            images: imageFiles.length,
            metadata: metadataFiles.length
        }
    };

    fs.writeFileSync(
        path.join(config.paths.assets, 'deployment.json'),
        JSON.stringify(deployInfo, null, 2)
    );
    console.log('Deployment info saved to assets/deployment.json\n');
}

fullDeploy().catch(err => {
    console.error('\nDeployment failed:', err.message);
    process.exit(1);
});
