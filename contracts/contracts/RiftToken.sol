// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RiftToken is ERC20, ERC20Burnable, Ownable {
    mapping(address => bool) public minters;

    event MinterStatusChanged(address indexed account, bool isMinter);

    constructor(address initialOwner) ERC20("Rift Token", "RIFT") Ownable(initialOwner) {
        // Initial supply if needed, or just allow minting
    }

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Caller is not a minter");
        _;
    }

    function setMinter(address account, bool isMinter) public onlyOwner {
        minters[account] = isMinter;
        emit MinterStatusChanged(account, isMinter);
    }

    function mint(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
    }
}
