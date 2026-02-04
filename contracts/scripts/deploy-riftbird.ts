import { ethers } from "hardhat";

async function main() {
    console.log("=".repeat(50));
    console.log("Deploying RiftbirdNFT to Sepolia...");
    console.log("=".repeat(50));

    const [deployer] = await ethers.getSigners();
    console.log("\nDeployer address:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

    if (balance === 0n) {
        console.error("\nError: Deployer has no ETH!");
        console.error("Get Sepolia ETH from: https://sepoliafaucet.com");
        process.exit(1);
    }

    // Configuration for MVP
    const config = {
        name: "Riftbirds",
        symbol: "RIFT",
        maxSupply: 10, // Small for MVP testing
        mintPrice: ethers.parseEther("0.001"), // 0.001 ETH for testing
        baseURI: "ipfs://bafybeiesmahk6kzd32jldgto66if2nrbyan7v6c6lhnjubnncoeed36kam/"
    };

    console.log("\nContract configuration:");
    console.log("  Name:", config.name);
    console.log("  Symbol:", config.symbol);
    console.log("  Max Supply:", config.maxSupply);
    console.log("  Mint Price:", ethers.formatEther(config.mintPrice), "ETH");

    // Deploy
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
    console.log("1. Upload assets: node scripts/full-deploy.js");
    console.log("2. Update baseURI with the metadata CID");
    console.log("3. Verify contract on Etherscan");
    console.log("\nEtherscan URL:");
    console.log(`https://sepolia.etherscan.io/address/${address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
