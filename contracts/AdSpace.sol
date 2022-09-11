// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

/// @title IERC2981Royalties
/// @dev Interface for the ERC2981 - Token Royalty standard
interface IERC2981Royalties {
    /// @notice Called with the sale price to determine how much royalty
    //          is owed and to whom.
    /// @param _tokenId - the NFT asset queried for royalty information
    /// @param _value - the sale price of the NFT asset specified by _tokenId
    /// @return _receiver - address of who should be sent the royalty payment
    /// @return _royaltyAmount - the royalty payment amount for value sale price
    function royaltyInfo(uint256 _tokenId, uint256 _value)
        external
        view
        returns (address _receiver, uint256 _royaltyAmount);
}


pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/// @dev This is a contract used to add ERC2981 support to ERC721 and 1155
abstract contract ERC2981Base is ERC165, IERC2981Royalties {
    struct RoyaltyInfo {
        address recipient;
        uint24 amount;
    }

    /// @inheritdoc	ERC165
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return
            interfaceId == type(IERC2981Royalties).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}

pragma solidity ^0.8.7;

/// @dev This is a contract used to add ERC2981 support to ERC721 and 1155
/// @dev This implementation has the same royalties for each and every tokens
abstract contract ERC2981ContractWideRoyalties is ERC2981Base {
    RoyaltyInfo private _royalties;

    /// @dev Sets token royalties
    /// @param recipient recipient of the royalties
    /// @param value percentage (using 2 decimals - 10000 = 100, 0 = 0)
    function _setRoyalties(address recipient, uint256 value) internal {
        require(value <= 10000, 'ERC2981Royalties: Too high');
        _royalties = RoyaltyInfo(recipient, uint24(value));
    }

    /// @inheritdoc	IERC2981Royalties
    function royaltyInfo(uint256, uint256 value)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        RoyaltyInfo memory royalties = _royalties;
        receiver = royalties.recipient;
        royaltyAmount = (value * royalties.amount) / 10000;
    }
}

pragma solidity >=0.8.7 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AdSpace is ERC721Enumerable, Ownable, ERC2981ContractWideRoyalties {
  using Strings for uint256;

  string public baseURI = "https://adspaces.xyz/adspace.json";
  uint256 public constant maxSupply = 20;
  bool public paused = false;
  address public adspaceOwner;
  uint public adspaceId;

  address public platformAddress;

  constructor(
    string memory _name,
    string memory _symbol,
    uint memory _adspaceId,
    address memory _adspaceOwner,
    uint8 memory _numNFTs
  ) ERC721(_name, _symbol) {
    
    adspaceId = _adspaceId;
    adspaceOwner = _adspaceOwner;

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

  function createDeal(uint216 _amountPerSec, uint40 _end, uint campaignId) public {
    // secure funds
    //transfer (amountPerSec * duration) from caller to this contract
    
    // call internal function
    _createDeal(amountPerSec,end,campaignId);
  }

  function _createDeal(uint216 _amountPerSec, uint40 _end, uint _campaignId,) internal {
    // update TableLand:
    // - adspaces table -> UPDATE status = occupied WHERE contract = address(this)
    // - DEALS table -> INSERT INTO deals (campaign_id, adspace_id, end, price, started_at)
    //    VALUES (_campaignId, adspaceId, _end, ...);
  }

  // distribute revenue to NFT holders
  function withdraw() public payable onlyHolder {
    // validate Deal has ended by reading TableLand data and comparing timestamp?
    
    // Distribute royalties
    uint amountToTransfer = token.balanceOf(address(this)) / maxSupply;  // possibly evil? we dont want leftover balance left on the contract
    
    // loop through each token...
    for(uint i = 1; i <= maxSupply; i++){
        // ...and send fraction of equity to its owner 
        token.safeTransfer(ownerOf(i), amountToTransfer);
    }
  }


  // only platform

  function setBaseURI(string memory _newBaseURI) public onlyPlatform {
    baseURI = _newBaseURI;
  }

  function setPlatformAddress(string memory _newPlatformAddress) public onlyPlatform {
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
  function setRoyalties(address recipient, uint256 value) public onlyPlatform {
      _setRoyalties(recipient, value);
  }

  // only NFT holders can call this function
  modifier onlyHolder() {
      
      
  }


  // only the team can call this function
  modifier onlyPlatform() {
      require(msg.sender == platformAddress)
  }
  
}