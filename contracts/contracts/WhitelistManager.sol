// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract WhitelistManager is Ownable {
    bytes32 public merkleRoot;
    
    event MerkleRootUpdated(bytes32 newRoot);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
        emit MerkleRootUpdated(_merkleRoot);
    }

    function isWhitelisted(address wallet, bytes32[] calldata proof) public view returns (bool) {
        if (merkleRoot == bytes32(0)) return false;
        bytes32 leaf = keccak256(abi.encodePacked(wallet));
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }
}
