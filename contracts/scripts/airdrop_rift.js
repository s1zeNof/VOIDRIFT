const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    // Using lowercase address to avoid checksum errors
    const receiver = "0x8e1ff23d75e15a3e2f6d360bf1b4ba3f1846c012";
    const amount = hre.ethers.parseEther("777");

    console.log("Minting 777 RIFT to:", receiver);

    const riftTokenAddress = "0xABc733d2B9D0049DDB719E7ADacabEB5B622ce87";
    const RiftToken = await hre.ethers.getContractFactory("RiftToken");
    const riftToken = RiftToken.attach(riftTokenAddress);

    const tx = await riftToken.mint(receiver, amount);
    console.log("Tx sent:", tx.hash);
    await tx.wait();

    console.log("Successfully minted 777 RIFT!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
