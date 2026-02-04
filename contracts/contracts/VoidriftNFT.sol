// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./WhitelistManager.sol";

contract VoidriftNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, Pausable, ReentrancyGuard {
    uint256 private _nextTokenId;
    uint256 public constant MAX_SUPPLY = 222;
    
    uint256 public mintPrice = 0.01 ether;
    uint256 public whitelistPrice = 0.008 ether;
    
    uint256 public maxPerWallet = 10;
    uint256 public maxWhitelistMint = 3;
    
    string public baseURI;
    
    WhitelistManager public whitelistManager;
    mapping(address => uint256) public whitelistMinted;

    // Dynamic Evolution Logic
    mapping(uint256 => uint256) public mintTimestamp;
    string[] public stageBaseURIs;
    
    // Random Trait Generation
    mapping(uint256 => uint256) public tokenSeeds;

    constructor(address initialOwner, address _whitelistManager) ERC721("VOIDRIFT", "RIFT") Ownable(initialOwner) {
        whitelistManager = WhitelistManager(_whitelistManager);
    }

    // Admin: Set Base URIs for each stage (0 = Void, 1 = Light, etc.)
    function setStageBaseURIs(string[] memory _newStageBaseURIs) public onlyOwner {
        stageBaseURIs = _newStageBaseURIs;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }
    
    function _mintLoop(address to, uint256 quantity) internal {
        for (uint256 i = 0; i < quantity; i++) {
            _nextTokenId++;
            
            // Generate pseudo-random seed for traits
            uint256 seed = uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        msg.sender,
                        _nextTokenId,
                        i
                    )
                )
            );
            
            tokenSeeds[_nextTokenId] = seed;
            mintTimestamp[_nextTokenId] = block.timestamp;
            _safeMint(to, _nextTokenId);
        }
    }

    function mint(uint256 quantity) public payable nonReentrant {
        require(!paused(), "Mint is paused");
        require(quantity > 0, "Quantity must be > 0");
        require(_nextTokenId + quantity <= MAX_SUPPLY, "Max supply exceeded");
        require(msg.value >= mintPrice * quantity, "Insufficient funds");
        require(balanceOf(msg.sender) + quantity <= maxPerWallet, "Max per wallet exceeded");

        _mintLoop(msg.sender, quantity);
    }

    function whitelistMint(uint256 quantity, bytes32[] calldata proof) public payable nonReentrant {
        require(!paused(), "Mint is paused");
        require(quantity > 0, "Quantity must be > 0");
        require(_nextTokenId + quantity <= MAX_SUPPLY, "Max supply exceeded");
        require(msg.value >= whitelistPrice * quantity, "Insufficient funds");
        require(whitelistMinted[msg.sender] + quantity <= maxWhitelistMint, "Max whitelist mint exceeded");
        require(whitelistManager.isWhitelisted(msg.sender, proof), "Not whitelisted");

        whitelistMinted[msg.sender] += quantity;
        _mintLoop(msg.sender, quantity);
    }

    function withdraw() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

    // Dynamic Token URI logic
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        _requireOwned(tokenId);

        // If stage URIs are not set, return standard logic (or baseURI)
        if (stageBaseURIs.length == 0) {
            return super.tokenURI(tokenId);
        }

        uint256 daysSinceMint = (block.timestamp - mintTimestamp[tokenId]) / 1 days;
        uint256 stage;

        if (daysSinceMint < 7) stage = 0;       // Stage 1: Void
        else if (daysSinceMint < 30) stage = 1; // Stage 2: First Light
        else if (daysSinceMint < 90) stage = 2; // Stage 3: Portal
        else if (daysSinceMint < 180) stage = 3; // Stage 4: Emergence
        else if (daysSinceMint < 365) stage = 4; // Stage 5: Awakening
        else stage = 5;                          // Stage 6: Ascended

        // Safety check if stage is out of bounds of set URIs
        if (stage >= stageBaseURIs.length) {
            stage = stageBaseURIs.length - 1;
        }

        string memory currentBaseURI = stageBaseURIs[stage];
        return string(abi.encodePacked(currentBaseURI, Strings.toString(tokenId), ".json"));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    // Overrides required by Solidity

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }
}
