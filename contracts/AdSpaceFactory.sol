//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./ITablelandTables.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import "./AdSpace.sol";

contract AdSpaceFactory is ERC721Holder {
    ITablelandTables private _tableland;

    uint256 private _adspacetableid;
    string private _adSpaceTable;

    uint256 private _campaigntableid;
    string private _campaignTable;

    uint256 private _dealtableid;
    string private _dealTable;

    uint256 private _counter_adspaces = 0;

    address[] private Adspaces;

    constructor(address tablelandAddress) {
        _tableland = ITablelandTables(tablelandAddress);

        _adspacetableid = _createTable(
            "CREATE TABLE AdSpaces (adspace_id AUTOINCREMENT PRIMARY KEY UNIQUE,name TEXT, website TEXT, verified INTEGER, status TEXT, owner TEXT, contract TEXT, asking_price INTEGER, size TEXT);"
        );
        _adSpaceTable = string.concat(
            "AdSpaces",
            "_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_adspacetableid)
        );

        _campaigntableid = _createTable(
            "CREATE TABLE Campaigns (deal_id AUTOINCREMENT PRIMARY KEY UNIQUE, campaign_id_fk INTEGER, adspace_id_fk INTEGER, duration_deal INTEGER, price INTEGER, started_at INTEGER);"
        );
        _campaignTable = string.concat(
            "Campaigns",
            "_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_campaigntableid)
        );

        _dealtableid = _createTable(
            "CREATE TABLE Deals (campaign_id AUTOINCREMENT PRIMARY KEY UNIQUE, cid TEXT, size TEXT, link TEXT)"
        );
        _dealTable = string.concat(
            "Deals",
            "_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_dealtableid)
        );
    }

    function createAdSpace(
        string memory _name,
        string memory _website,
        string memory _symbol,
        string memory _asking_price,
        //uint256 _adspaceId,
        //address _adspaceOwner,
        uint8 _numNFTs,
        string memory _size
    ) external payable {
        AdSpace _adspace = new AdSpace(
            _name,
            _symbol,
            _counter_adspaces,
            msg.sender,
            //_adspaceOwner,
            _numNFTs
        );
        string memory sqlStatement = string.concat(
            "INSERT INTO ",
            _adSpaceTable,
            " (name,website,verified,status,owner,contract,asking_price,size) VALUES (",
            _name,
            ",",
            _website,
            ",",
            "0", //verified
            ",",
            "Pending Verification", // status
            ",",
            Strings.toHexString(uint256(uint160(address(msg.sender))), 20), // owner
            ",",
            Strings.toHexString(uint256(uint160(address(_adspace))), 20), // contract
            ",",
            _asking_price,
            ",",
            _size,
            ");"
        );

        _runSQL(_adspacetableid, sqlStatement);
        Adspaces.push(address(_adspace));
        _counter_adspaces++;
    }

    function _createTable(string memory statement) internal returns (uint256) {
        return _tableland.createTable(address(this), statement);
    }

    function runSQL(uint256 tableId, string memory statement) external payable {
        _runSQL(tableId, statement);
    }

    function _runSQL(uint256 tableId, string memory statement) internal {
        _tableland.runSQL(address(this), tableId, statement);
    }

    // onlyOwnerx
    function setController(uint256 tableId, address controller) external {
        _tableland.setController(address(this), tableId, controller);
    }

    // onlyOwner
    function lockController(uint256 tableId) external {
        _tableland.lockController(address(this), tableId);
    }

    // onlyOwner
    function setBaseURI(string memory baseURI) external {
        _tableland.setBaseURI(baseURI);
    }

    // onlyOwner
    function pause() external {
        _tableland.pause();
    }

    // onlyOwner
    function unpause() external {
        _tableland.unpause();
    }

    // getter
    function getController(uint256 tableId)
        external
        returns (
            //override
            address
        )
    {
        return _tableland.getController(tableId);
    }

    function getAdSpaceTableId() external view returns (uint256) {
        return _adspacetableid;
    }

    function getCampaignTableId() external view returns (uint256) {
        return _campaigntableid;
    }

    function getDealTableId() external view returns (uint256) {
        return _dealtableid;
    }

    function getAdSpaceTable() external view returns (string memory) {
        return _adSpaceTable;
    }

    function getCampaignTable() external view returns (string memory) {
        return _campaignTable;
    }

    function getDealTable() external view returns (string memory) {
        return _dealTable;
    }

    function getAdSpaceAddress(uint256 i) external view returns (address) {
        return Adspaces[i];
    }

    function getCounterAdSpaces() external view returns (uint256) {
        return _counter_adspaces;
    }
}
