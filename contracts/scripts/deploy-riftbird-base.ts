import { ethers } from "hardhat";

async function main() {
    console.log("=".repeat(50));
    console.log("Deploying RiftbirdNFT to Base Sepolia...");
    console.log("=".repeat(50));

    const [deployer] = await ethers.getSigners();
    console.log("\nDeployer address:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

    if (balance === 0n) {
        console.error("\nError: Deployer has no ETH!");
        console.error("Get Base Sepolia ETH from:");
        console.error("  https://www.coinbase.com/faucets/base-ethereum-goerli-faucet");
        console.error("  https://faucet.quicknode.com/base/sepolia");
        console.error("  https://www.alchemy.com/faucets/base-sepolia");
        process.exit(1);
    }

    // Configuration for Base Sepolia (10,000 supply)
    const config = {
        name: "Riftbirds",
        symbol: "RIFT",
        maxSupply: 10000,
        mintPrice: ethers.parseEther("0.001"), // 0.001 ETH for testnet
        baseURI: "ipfs://bafybeigg4sbo4jw7noyc24obyck26z7244uxw6qc2h76bp4454mtvarwcm/"
    };

    console.log("\nContract configuration:");
    console.log("  Name:", config.name);
    console.log("  Symbol:", config.symbol);
    console.log("  Max Supply:", config.maxSupply);
    console.log("  Mint Price:", ethers.formatEther(config.mintPrice), "ETH");
    console.log("  Base URI:", config.baseURI);

    // Deploy
    console.log("\nDeploying...");
    const RiftbirdNFT = await ethers.getContractFactory("RiftbirdNFT");
    const nft = await RiftbirdNFT.deploy(
        config.name,
        config.symbol,
        config.maxSupply,
        config.mintPrice,
        config.baseURI
    );

    await nft.waitForDeployment();

    const address = await nft.getAddress();

    console.log("\n" + "=".repeat(50));
    console.log("DEPLOYMENT SUCCESSFUL!");
    console.log("=".repeat(50));
    console.log("\nContract Address:", address);
    console.log("\nNext steps:");
    console.log(`1. Update frontend/lib/contracts.ts:`);
    console.log(`   RIFTBIRD_NFT_ADDRESS = '${address}'`);
    console.log("2. Push to git (Vercel auto-deploys)");
    console.log("3. Test minting at https://voidrift-blue.vercel.app/mint");
    console.log("\nBaseScan URL:");
    console.log(`https://sepolia.basescan.org/address/${address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
