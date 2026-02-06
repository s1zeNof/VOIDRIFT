/**
 * Set Base URI on the NFT contract
 * This enables OpenSea and wallets to show correct metadata/images
 *
 * Usage: node scripts/set-base-uri.js
 */

const { createWalletClient, createPublicClient, http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { sepolia } = require('viem/chains');
const config = require('./config');

// Contract address on Sepolia
const NFT_CONTRACT = '0x2f848cC764C77b8EFEBd23cd69ECB2F66A53D52f';

// New metadata base URI (from IPFS upload) - with .json files
const NEW_BASE_URI = 'ipfs://bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/';

// ABI for setBaseURI function
const ABI = [
    {
        "inputs": [{"internalType": "string", "name": "_newBaseURI", "type": "string"}],
        "name": "setBaseURI",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "tokenURI",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    }
];

async function main() {
    console.log('='.repeat(50));
    console.log('VOIDRIFT - Set Base URI');
    console.log('='.repeat(50));

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        console.error('PRIVATE_KEY not found in contracts/.env');
        process.exit(1);
    }

    const account = privateKeyToAccount(`0x${privateKey.replace('0x', '')}`);
    console.log('Wallet:', account.address);

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com')
    });

    const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com')
    });

    console.log('Contract:', NFT_CONTRACT);
    console.log('New Base URI:', NEW_BASE_URI);

    // Check current tokenURI for token 1 (if exists)
    try {
        const currentURI = await publicClient.readContract({
            address: NFT_CONTRACT,
            abi: ABI,
            functionName: 'tokenURI',
            args: [1n]
        });
        console.log('\nCurrent tokenURI(1):', currentURI);
    } catch (e) {
        console.log('\nNo token #1 minted yet or tokenURI not accessible');
    }

    console.log('\nSending setBaseURI transaction...');

    try {
        const hash = await walletClient.writeContract({
            address: NFT_CONTRACT,
            abi: ABI,
            functionName: 'setBaseURI',
            args: [NEW_BASE_URI]
        });

        console.log('Transaction sent:', hash);
        console.log('Waiting for confirmation...');

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        console.log('\n' + '='.repeat(50));
        console.log('SUCCESS!');
        console.log('='.repeat(50));
        console.log('Transaction confirmed in block:', receipt.blockNumber);
        console.log('Gas used:', receipt.gasUsed.toString());
        console.log('\nNFT metadata is now live on IPFS!');
        console.log('OpenSea and wallets will show correct images/names.');

        // Verify new tokenURI
        try {
            const newURI = await publicClient.readContract({
                address: NFT_CONTRACT,
                abi: ABI,
                functionName: 'tokenURI',
                args: [1n]
            });
            console.log('\nNew tokenURI(1):', newURI);
        } catch (e) {
            console.log('\nVerification: Mint a token to see the new URI');
        }

    } catch (error) {
        console.error('\nTransaction failed:', error.message);
        if (error.message.includes('not owner')) {
            console.error('You are not the contract owner. Use the wallet that deployed the contract.');
        }
        process.exit(1);
    }
}

main();
