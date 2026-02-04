const fs = require('fs');
const path = require('path');

// Node 20 has native fetch and FormData, no need for undici


// Load .env from contracts folder
const envPath = path.join(__dirname, '../contracts/.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const JWT = process.env.PINATA_JWT;

if (!JWT) {
    console.error("❌ Error: PINATA_JWT not found in contracts/.env");
    process.exit(1);
}

const FOLDER_PATH = path.join(__dirname, '../assets/json');

async function uploadFolder() {
    console.log("📦 Preparing to upload metadata folder to Pinata...");

    // In Node.js environment we need to construct the multipart form data manually 
    // or use a boundary. Since we don't want external dependencies, 
    // we will strictly define the boundary.

    // Actually, Node 20 supports 'FormData' compliant with the spec.
    // We just need to append files with the correct directory path.

    const formData = new FormData();
    const files = fs.readdirSync(FOLDER_PATH);

    const folderName = "voidrift-json";

    console.log(`Found ${files.length} files.`);

    for (const file of files) {
        if (file.endsWith('.json')) {
            const filePath = path.join(FOLDER_PATH, file);
            const fileContent = fs.readFileSync(filePath);
            const blob = new Blob([fileContent], { type: 'application/json' });
            // The third argument is the filename including the folder structure
            formData.append('file', blob, `${folderName}/${file}`);
        }
    }

    // Add metadata
    const metadata = JSON.stringify({
        name: folderName
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 1
    });
    formData.append('pinataOptions', options);

    try {
        console.log("🚀 Uploading... This might take a minute.");
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${JWT}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ Success!");
        console.log("-----------------------------------------");
        console.log("METADATA CID:", data.IpfsHash);
        console.log("-----------------------------------------");
        console.log("PLEASE COPY THE CID ABOVE SEND IT TO ME.");

    } catch (error) {
        console.error("❌ Upload failed:", error);
    }
}

uploadFolder();
