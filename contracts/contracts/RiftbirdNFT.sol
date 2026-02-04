// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RiftbirdNFT
 * @notice Simplified NFT contract for MVP Testnet
 * @dev Minimal implementation for quick deployment and testing
 */
contract RiftbirdNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Configuration
    uint256 public maxSupply;
    uint256 public mintPrice;
    string public baseTokenURI;

    // Events
    event Minted(address indexed to, uint256 indexed tokenId);
    event BaseURIUpdated(string newBaseURI);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _mintPrice,
        string memory _baseURI
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        baseTokenURI = _baseURI;
    }

    /**
     * @notice Mint a new Riftbird NFT
     */
    function mint() public payable {
        require(_nextTokenId < maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");

        _nextTokenId++;
        _safeMint(msg.sender, _nextTokenId);

        emit Minted(msg.sender, _nextTokenId);
    }

    /**
     * @notice Mint multiple NFTs (for batch minting)
     * @param quantity Number of NFTs to mint
     */
    function mintBatch(uint256 quantity) public payable {
        require(_nextTokenId + quantity <= maxSupply, "Exceeds max supply");
        require(msg.value >= mintPrice * quantity, "Insufficient payment");

        for (uint256 i = 0; i < quantity; i++) {
            _nextTokenId++;
            _safeMint(msg.sender, _nextTokenId);
            emit Minted(msg.sender, _nextTokenId);
        }
    }

    /**
     * @notice Free mint for owner (for testing)
     * @param to Address to mint to
     */
    function ownerMint(address to) public onlyOwner {
        require(_nextTokenId < maxSupply, "Max supply reached");

        _nextTokenId++;
        _safeMint(to, _nextTokenId);

        emit Minted(to, _nextTokenId);
    }

    /**
     * @notice Update base URI for metadata
     * @param _newBaseURI New IPFS base URI
     */
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseTokenURI = _newBaseURI;
        emit BaseURIUpdated(_newBaseURI);
    }

    /**
     * @notice Get token URI (metadata location)
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        _requireOwned(tokenId);

        return string(
            abi.encodePacked(baseTokenURI, Strings.toString(tokenId), ".json")
        );
    }

    /**
     * @notice Get total minted supply
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @notice Withdraw contract balance to owner
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    // Required overrides
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
