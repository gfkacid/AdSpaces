// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AdSpaceFactory.sol";
import "./Interfaces/ERC2981ContractWideRoyalties.sol";

contract AdSpace is ERC721Enumerable, Ownable, ERC2981ContractWideRoyalties {
    using Strings for uint256;

    string public baseURI = "https://adspaces.xyz/adspace.json";
    uint256 public maxSupply = 20;
    bool public paused = false;
    address public adspaceOwner;
    uint public adspaceId;

    address public platformAddress;

    address private _factoryAddress;
    AdSpaceFactory private _factory;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _adspaceId,
        address _adspaceOwner,
        uint8 _numNFTs
    ) ERC721(_name, _symbol) {
        adspaceId = _adspaceId;
        adspaceOwner = _adspaceOwner;

        _factoryAddress = msg.sender;
        _factory = AdSpaceFactory(_factoryAddress);

        // set royalties
        _setRoyalties(msg.sender, 1000);
        maxSupply = maxSupply > _numNFTs ? _numNFTs : maxSupply;
        // mint NFTs
        for (uint256 m = 1; m <= maxSupply; m++) {
            _safeMint(_adspaceOwner, m);
        }
    }

    /// @inheritdoc	ERC165
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Enumerable, ERC2981Base)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // public

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        return _baseURI();
    }

    function createDeal(
        uint216 _amountPerSec,
        uint40 _end,
        uint campaignId
    ) public {
        // secure funds
        //transfer (amountPerSec * duration) from caller to this contract

        // call internal function
        _createDeal(_amountPerSec, _end, campaignId);
    }

    function _createDeal(
        uint216 _amountPerSec,
        uint40 _end,
        uint _campaignId
    ) internal {
        // update TableLand:
        // - adspaces table -> UPDATE status = occupied WHERE contract = address(this)
        //_factory.runSQL(_factoryAddress,_factory.getAdSpaceTableId,"SQL commin...");
        // - DEALS table -> INSERT INTO deals (campaign_id, adspace_id, end, price, started_at)
        //_factory.runSQL(_factoryAddress,_factory.getDealTableId,"SQL commin...");
        //    VALUES (_campaignId, adspaceId, _end, ...);
    }

    // distribute revenue to NFT holders
    //function withdraw(uint maxSupply) public payable /*onlyHolder*/ {
    //  // validate Deal has ended by reading TableLand data and comparing timestamp?

    //  // Distribute royalties
    //  uint amountToTransfer = token.balanceOf(address(this)) / maxSupply;  // possibly evil? we dont want leftover balance left on the contract

    //  // loop through each token...
    //  for(uint i = 1; i <= maxSupply; i++){
    //      // ...and send fraction of equity to its owner
    //      token.safeTransfer(ownerOf(i), amountToTransfer);
    //  }
    //}

    // only platform

    function setBaseURI(string memory _newBaseURI) public onlyPlatform {
        baseURI = _newBaseURI;
    }

    function setPlatformAddress(address _newPlatformAddress)
        public
        onlyPlatform
    {
        platformAddress = _newPlatformAddress;
    }

    function pause(bool _state) public onlyPlatform {
        paused = _state;
    }

    // retreive eth accidentally sent to this contract
    function emergencyWithdraw() public payable onlyPlatform {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }

    /// @notice Allows to set the royalties on the contract
    /// @param recipient the royalties recipient
    /// @param value royalties value (between 0 and 10000)
    function setRoyalties(address recipient, uint256 value)
        public
        onlyPlatform
    {
        _setRoyalties(recipient, value);
    }

    // only NFT holders can call this function
    //modifier onlyHolder() {

    //}

    // only the team can call this function
    modifier onlyPlatform() {
        require(msg.sender == platformAddress);
        _;
    }
}
