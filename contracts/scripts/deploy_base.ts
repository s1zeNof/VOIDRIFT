import { ethers } from "hardhat";

async function main() {
    console.log("Starting deployment to Base Sepolia...");
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy RiftToken
    const RiftToken = await ethers.getContractFactory("RiftToken");
    const riftToken = await RiftToken.deploy(deployer.address);
    await riftToken.waitForDeployment();
    const riftAddress = await riftToken.getAddress();
    console.log("RiftToken deployed to:", riftAddress);

    // 2. Deploy WhitelistManager
    const WhitelistManager = await ethers.getContractFactory("WhitelistManager");
    const whitelistManager = await WhitelistManager.deploy();
    await whitelistManager.waitForDeployment();
    const whitelistAddress = await whitelistManager.getAddress();
    console.log("WhitelistManager deployed to:", whitelistAddress);

    // 3. Deploy VoidriftNFT
    const VoidriftNFT = await ethers.getContractFactory("VoidriftNFT");
    const voidriftNFT = await VoidriftNFT.deploy(deployer.address, whitelistAddress);
    await voidriftNFT.waitForDeployment();
    const nftAddress = await voidriftNFT.getAddress();
    console.log("VoidriftNFT deployed to:", nftAddress);

    // 4. Deploy VoidriftStaking
    const VoidriftStaking = await ethers.getContractFactory("VoidriftStaking");
    const voidriftStaking = await VoidriftStaking.deploy(nftAddress, riftAddress);
    await voidriftStaking.waitForDeployment();
    const stakingAddress = await voidriftStaking.getAddress();
    console.log("VoidriftStaking deployed to:", stakingAddress);

    // Post-Deployment Setup
    console.log("Configuring contracts...");

    // Grant MINTER_ROLE to Staking contract on RiftToken
    const MINTER_ROLE = await riftToken.MINTER_ROLE();
    await riftToken.grantRole(MINTER_ROLE, stakingAddress);
    console.log("Granted MINTER_ROLE to Staking contract");

    // Set Base URI for NFT (Initial)
    const baseURI = "ipfs://QmY7Yh4Uhc.../"; // Placeholder or reuse existing
    // await voidriftNFT.setBaseURI(baseURI);

    console.log("Deployment Complete!");
    console.log("----------------------------------------------------");
    console.log(`export const RIFT_TOKEN_ADDRESS = "${riftAddress}";`);
    console.log(`export const WHITELIST_MANAGER_ADDRESS = "${whitelistAddress}";`);
    console.log(`export const VOIDRIFT_NFT_ADDRESS = "${nftAddress}";`);
    console.log(`export const VOIDRIFT_STAKING_ADDRESS = "${stakingAddress}";`);
    console.log("----------------------------------------------------");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
