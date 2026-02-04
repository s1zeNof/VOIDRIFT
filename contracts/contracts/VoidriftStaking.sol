// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./RiftToken.sol";

contract VoidriftStaking is Ownable, ReentrancyGuard, IERC721Receiver {
    IERC721 public nftCollection;
    RiftToken public rewardsToken;

    // Rarity multipliers or fixed rates? Brief says:
    // 10 RIFT per day per NFT
    // Bonus for Legendary: 50 RIFT/day, Mythic: 100 RIFT/day
    // To handle rarity, we might need a mapping of tokenId to rarityScore, set by owner.
    // Or simpler: base rate. Let's stick to base rate for now + manual setting for special ones.

    uint256 public constant SECONDS_IN_DAY = 86400;
    uint256 public constant BASE_RATE = 10 ether; // 10 tokens per day

    struct Stake {
        uint256 tokenId;
        uint256 timestamp;
        address owner;
    }

    // tokenId => Stake info
    mapping(uint256 => Stake) public vault;
    // user => tokenIds
    mapping(address => uint256[]) public userStake;
    
    // tokenId => custom daily rate (if 0, use BASE_RATE)
    mapping(uint256 => uint256) public customRates;

    event NFTStaked(address indexed owner, uint256 tokenId, uint256 value);
    event NFTUnstaked(address indexed owner, uint256 tokenId, uint256 value);
    event Claimed(address indexed owner, uint256 amount);

    constructor(address initialOwner, address _nftCollection, address _rewardsToken) Ownable(initialOwner) {
        nftCollection = IERC721(_nftCollection);
        rewardsToken = RiftToken(_rewardsToken);
    }

    function stake(uint256[] calldata tokenIds) external nonReentrant {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(nftCollection.ownerOf(tokenId) == msg.sender, "Not the owner");
            require(vault[tokenId].tokenId == 0, "Already staked");

            nftCollection.safeTransferFrom(msg.sender, address(this), tokenId);
            
            vault[tokenId] = Stake({
                tokenId: tokenId,
                timestamp: block.timestamp,
                owner: msg.sender
            });
            
            userStake[msg.sender].push(tokenId);
            emit NFTStaked(msg.sender, tokenId, block.timestamp);
        }
    }

    function unstake(uint256[] calldata tokenIds) external nonReentrant {
        _claim(msg.sender, tokenIds);
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(vault[tokenId].owner == msg.sender, "Not the owner");

            delete vault[tokenId];
            
            // Remove from userStake array (inefficient but works for small arrays)
            uint256[] storage stakes = userStake[msg.sender];
            for (uint256 j = 0; j < stakes.length; j++) {
                if (stakes[j] == tokenId) {
                    stakes[j] = stakes[stakes.length - 1];
                    stakes.pop();
                    break;
                }
            }

            nftCollection.safeTransferFrom(address(this), msg.sender, tokenId);
            emit NFTUnstaked(msg.sender, tokenId, block.timestamp);
        }
    }

    function claim(uint256[] calldata tokenIds) external nonReentrant {
        _claim(msg.sender, tokenIds);
    }
    
    function claimAll() external nonReentrant {
        uint256[] memory tokenIds = userStake[msg.sender];
        _claim(msg.sender, tokenIds);
    }

    function _claim(address account, uint256[] memory tokenIds) internal {
        uint256 earned = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(vault[tokenId].owner == account, "Not the owner");
            
            uint256 stakedAt = vault[tokenId].timestamp;
            uint256 earningDuration = block.timestamp - stakedAt;
            
            uint256 rate = customRates[tokenId] > 0 ? customRates[tokenId] : BASE_RATE;
            uint256 reward = (rate * earningDuration) / SECONDS_IN_DAY;
            
            if (reward > 0) {
                earned += reward;
                vault[tokenId].timestamp = block.timestamp; // Reset timestamp
            }
        }
        
        if (earned > 0) {
            rewardsToken.mint(account, earned);
            emit Claimed(account, earned);
        }
    }

    function earningInfo(address account, uint256[] calldata tokenIds) external view returns (uint256[1] memory info) {
        uint256 totalEarned = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            if (vault[tokenId].owner != account) continue;
            
            uint256 stakedAt = vault[tokenId].timestamp;
            uint256 earningDuration = block.timestamp - stakedAt;
            uint256 rate = customRates[tokenId] > 0 ? customRates[tokenId] : BASE_RATE;
            
            totalEarned += (rate * earningDuration) / SECONDS_IN_DAY;
        }
        info[0] = totalEarned;
        return info;
    }
    
    function getStakedTokens(address user) external view returns (uint256[] memory) {
        return userStake[user];
    }
    
    // Admin functions to set custom rates for rarer NFTs
    function setCustomRates(uint256[] calldata tokenIds, uint256[] calldata rates) external onlyOwner {
        require(tokenIds.length == rates.length, "Length mismatch");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            customRates[tokenIds[i]] = rates[i];
        }
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
