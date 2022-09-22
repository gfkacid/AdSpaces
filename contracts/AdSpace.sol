// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//import "./AdSpaceFactory.sol";
//import "./Interfaces/ERC2981ContractWideRoyalties.sol";


interface DaiToken {

    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function balanceOf(address guy) external view returns (uint);
    function approve(address spender, uint256 value) external returns (bool);
    function allowance(address spender) external returns (uint);
}

contract AdSpace is ERC721Enumerable, Ownable {
    using Strings for uint256;

    // todo @acid: pinata pin
    string public baseURI = "https://adspaces.xyz/adspace.json";
    uint256 public maxSupply = 20;
    bool public paused = false;
    DaiToken public daiToken;

    // owner on AdSpace open to discussion
    //address public adspaceOwner;
    uint public adspaceId;

    address public revenueAddress = 0x49cB5Fa951AD2ABbC4d14239BfE215754c7Df030;


    address public _factoryAddress;
    // AdSpaceFactory public _factory;

    event RevenueWithdraw(address recipient, uint256 amount, uint256 adspace_id);
    event PayAdSpace(address payer, uint256 amount, uint256 adspace_id);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _adspaceId,
        address _adspaceOwner,
        uint8 _numNFTs
    ) ERC721(_name, _symbol) {
        adspaceId = _adspaceId;
        //adspaceOwner = _adspaceOwner;
        daiToken = DaiToken(0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1);
        _factoryAddress = msg.sender;
        // _factory = AdSpaceFactory(_factoryAddress);

        // set royalties
        // _setRoyalties(msg.sender, 1000);
        require(_numNFTs > 0);
        maxSupply = maxSupply > _numNFTs ? _numNFTs : maxSupply;
        // mint NFTs
        for (uint256 m = 1; m <= maxSupply; m++) {
            _safeMint(_adspaceOwner, m);
        }
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // this function is returning the token ids of the passed address
    // e.g. [5,7,8]

    // @Riki check for array variations on sending tokens
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

    function sendSomeDaiOut(address daiOwner, uint256 _amount) public returns (bool) {
        daiToken.transfer(daiOwner, _amount); // This transfers DAI outside from contract -- ONLY FOR TEST PURPOSES, comment out or delete if you want
        return true;
    }

    function createDeal(uint256 _amount) public {
        // Acid and Mme to check @ Write
        daiToken.transferFrom(msg.sender, address(this), _amount);

        emit PayAdSpace(msg.sender, _amount, adspaceId);
    }

    function withdraw() public  NFTHolder {
     // validate Deal has ended by reading TableLand data and comparing timestamp?
     // At the end of the deal with TableLand, the money amount will come to the contract address?
     uint256 DAIAmount = daiToken.balanceOf(address(this)); // How much are going to be ditributed / NFT.
     uint256 revenueDAIAmount = DAIAmount / 100; // This is 1% of the actually held DAI to be sent for Revenue to the RevenueAddress
     uint256 newDaiAmount = DAIAmount - revenueDAIAmount; // This is the actual DAI amount we are going to distribute, excluding the 1% amount
     daiToken.transfer(revenueAddress, revenueDAIAmount);      // Distribute the Revenue to the selected address
     uint256 DAIAmountPerNft = newDaiAmount / maxSupply; // DaiAmount / Token
     // loop through each token to correctly distribure money to each NFT owners
     for(uint i = 1; i <= maxSupply; i++){ // Looping from 1 as lowest tokenId number is 1
         address nftOwner = ownerOf(i); // This checks which tokenId belongs to which address
         daiToken.transfer(nftOwner, DAIAmountPerNft);
         // ...and send fraction of equity to its owner
         emit RevenueWithdraw(nftOwner, DAIAmountPerNft, adspaceId);
      }
    }

    function checkYourDai() public view returns(uint256) {
        // Checks the how much DAI currently the user has.
        return daiToken.balanceOf(msg.sender); 
    }

    function setBaseURI(string memory _newBaseURI) public onlyPlatform {
        baseURI = _newBaseURI;
    }

    function setrevenueAddress(address _newrevenueAddress) public onlyPlatform {
        revenueAddress = _newrevenueAddress;
    }

    function pause(bool _state) public onlyPlatform {
        paused = _state;
    }

    // retreive eth accidentally sent to this contract
    function emergencyWithdraw() public payable onlyPlatform {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }

    function checkContractDAIBalance() public view returns(uint256) {
        // check how much DAI the contract currently has
      return daiToken.balanceOf(address(this));
    }

    function checkAllowance(address _spender) public returns(uint256) {
        // Check how much allowance the selected address has ( do we want this function? Do we want it to be for the msg.sender ? )
        return daiToken.allowance(_spender);
    }

    // only the team can call this function
    modifier onlyPlatform() {
        require(msg.sender == revenueAddress);
        _;
    }

    modifier NFTHolder() { // This checks when the caller wants to use the withdraw function that it is actually an NFT holder or not ( change this if you have simpler method, I have checked this it works )
        bool isHolder = false;
        for(uint i = 1; i <= maxSupply; i++){
                address currentHolder = ownerOf(i);
                if(currentHolder == msg.sender){
                    isHolder = true;
                }
            }
        require(isHolder == true, "You are not an NFT Holder!");
        _;
    }
}
