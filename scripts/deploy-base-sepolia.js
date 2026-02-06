/**
 * Deploy RiftbirdNFT to Base Sepolia
 *
 * Usage: node scripts/deploy-base-sepolia.js
 *
 * Requirements:
 * - Base Sepolia ETH (get from https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
 * - PRIVATE_KEY in contracts/.env
 */

const { createWalletClient, createPublicClient, http, parseEther } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { baseSepolia } = require('viem/chains');
const fs = require('fs');
const path = require('path');
require('./config'); // Load env vars

// Contract parameters
const CONTRACT_NAME = 'Riftbirds';
const CONTRACT_SYMBOL = 'RIFT';
const MAX_SUPPLY = 222;
const MINT_PRICE = parseEther('0.001'); // 0.001 ETH on Base Sepolia (cheaper for testing)
const BASE_URI = 'ipfs://bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/';

// RiftbirdNFT bytecode and ABI (compiled)
// You need to compile the contract first with: cd contracts && npx hardhat compile
const ARTIFACT_PATH = path.join(__dirname, '../contracts/artifacts/contracts/RiftbirdNFT.sol/RiftbirdNFT.json');

async function main() {
    console.log('='.repeat(50));
    console.log('VOIDRIFT - Deploy to Base Sepolia');
    console.log('='.repeat(50));

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        console.error('PRIVATE_KEY not found in contracts/.env');
        process.exit(1);
    }

    // Check if artifact exists
    if (!fs.existsSync(ARTIFACT_PATH)) {
        console.error('\n❌ Contract not compiled!');
        console.error('Run this first:');
        console.error('  cd contracts');
        console.error('  npm install');
        console.error('  npx hardhat compile');
        process.exit(1);
    }

    const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, 'utf8'));
    const { abi, bytecode } = artifact;

    const account = privateKeyToAccount(`0x${privateKey.replace('0x', '')}`);
    console.log('\nWallet:', account.address);

    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http('https://sepolia.base.org')
    });

    const walletClient = createWalletClient({
        account,
        chain: baseSepolia,
        transport: http('https://sepolia.base.org')
    });

    // Check balance
    const balance = await publicClient.getBalance({ address: account.address });
    console.log('Balance:', (Number(balance) / 1e18).toFixed(6), 'ETH');

    if (balance < parseEther('0.001')) {
        console.error('\n❌ Insufficient balance!');
        console.error('Get Base Sepolia ETH from:');
        console.error('https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet');
        process.exit(1);
    }

    console.log('\nDeploying contract...');
    console.log('  Name:', CONTRACT_NAME);
    console.log('  Symbol:', CONTRACT_SYMBOL);
    console.log('  Max Supply:', MAX_SUPPLY);
    console.log('  Mint Price:', '0.001 ETH');
    console.log('  Base URI:', BASE_URI);

    try {
        const hash = await walletClient.deployContract({
            abi,
            bytecode,
            args: [CONTRACT_NAME, CONTRACT_SYMBOL, BigInt(MAX_SUPPLY), MINT_PRICE, BASE_URI]
        });

        console.log('\nTransaction sent:', hash);
        console.log('Waiting for confirmation...');

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        console.log('\n' + '='.repeat(50));
        console.log('🎉 SUCCESS! Contract deployed!');
        console.log('='.repeat(50));
        console.log('\nContract Address:', receipt.contractAddress);
        console.log('Block:', receipt.blockNumber);
        console.log('Gas Used:', receipt.gasUsed.toString());
        console.log('\nBaseScan:', `https://sepolia.basescan.org/address/${receipt.contractAddress}`);

        // Save to file
        const deploymentInfo = {
            network: 'base-sepolia',
            contractAddress: receipt.contractAddress,
            transactionHash: hash,
            blockNumber: receipt.blockNumber.toString(),
            deployedAt: new Date().toISOString(),
            parameters: {
                name: CONTRACT_NAME,
                symbol: CONTRACT_SYMBOL,
                maxSupply: MAX_SUPPLY,
                mintPrice: '0.001 ETH',
                baseURI: BASE_URI
            }
        };

        const outputPath = path.join(__dirname, 'deployment-base-sepolia.json');
        fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
        console.log('\nDeployment info saved to:', outputPath);

        console.log('\n' + '='.repeat(50));
        console.log('NEXT STEPS:');
        console.log('='.repeat(50));
        console.log('1. Update frontend/lib/contracts.ts with new address');
        console.log('2. Update providers.tsx to use baseSepolia');
        console.log('3. Test minting on the new contract');

    } catch (error) {
        console.error('\n❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

main();
