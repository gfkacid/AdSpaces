//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./ITablelandTables.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./AdSpace.sol";

/**
 * @notice This contract is the controller of all Tableland interactions
 * @notice and deployer of all the AdSpace contracts
 * @dev when deploying make sure to get the right Tableland contract for desired chain
 * @dev upon deployment this contract creates three Tableland Tables:
 * @dev AdSpaces_{chain}_{tableID}, Campaigns_{chain}_{tableID}, Deals_{chain}_{tableID}
 * @dev Custom errors need to be added...
 */
contract AdSpaceFactory is ERC721Holder, Ownable {
    /* Errors */
    /* tba */

    /* Events */
    event AdSpaceCreated(address indexed contractAddress);
    event CampaignCreated(uint256 indexed CampaignId);
    event DealCreated(
        uint256 indexed DealId,
        uint256 indexed CampaignId,
        uint256 indexed AdSpaceId
    );
    event AdSpaceUpdated(uint256 indexed AdSpaceId);

    /* Variables */
    ITablelandTables private _tableland;

    uint256 private _adspacetableid;
    string private _adSpaceTable;

    uint256 private _campaigntableid;
    string private _campaignTable;

    uint256 private _dealtableid;
    string private _dealTable;

    uint256 private _counter_adspaces = 0;
    uint256 private _counter_campaigns = 0;
    uint256 private _counter_deals = 0;

    address[] private Adspaces;

    /// @param tablelandAddress see docs.tableland.xyz for contracts on chains
    constructor(address tablelandAddress) {
        _tableland = ITablelandTables(tablelandAddress);

        /// @notice creates AdSpace Table in Tableland
        string memory sqlAdSpace = string.concat(
            "CREATE TABLE AdSpaces",
            "_",
            Strings.toString(block.chainid),
            " (adspace_id INTEGER PRIMARY KEY,name TEXT, website TEXT, verified INTEGER, status TEXT, owner TEXT, contract TEXT, asking_price INTEGER, size TEXT);"
        );
        _adspacetableid = _createTable(sqlAdSpace);
        _adSpaceTable = string.concat(
            "AdSpaces",
            "_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_adspacetableid)
        );

        /// @notice creates Campaign Table in Tableland
        string memory sqlCampaign = string.concat(
            "CREATE TABLE Campaigns",
            "_",
            Strings.toString(block.chainid),
            " (campaign_id INTEGER PRIMARY KEY,name TEXT, cid TEXT, size TEXT, link TEXT, owner TEXT);"
        );
        _campaigntableid = _createTable(sqlCampaign);
        _campaignTable = string.concat(
            "Campaigns",
            "_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_campaigntableid)
        );

        /// @notice creates Deal Table in Tableland
        string memory sqlDeal = string.concat(
            "CREATE TABLE Deals",
            "_",
            Strings.toString(block.chainid),
            " (deal_id INTEGER PRIMARY KEY, campaign_id_fk INTEGER, adspace_id_fk INTEGER, duration_deal INTEGER, price INTEGER, started_at INTEGER);"
        );
        _dealtableid = _createTable(sqlDeal);
        _dealTable = string.concat(
            "Deals",
            "_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_dealtableid)
        );
    }

    /**
     * @notice create new AdSpace contract
     * @param _name name of new creating Adspace
     * @param _website website where the AdSpace will be located
     * @param _asking_price price of new creating Adspace
     * @param _numNFTs amount of NFTs to mint to msg.sender of creation
     * @param _size size of the AdSpaces: wide | small | scyscraper
     * @dev id and owner will be set automatically
     */
    function createAdSpace(
        string memory _name,
        string memory _website,
        string memory _asking_price,
        uint8 _numNFTs,
        string memory _size
    ) external payable {
        AdSpace _adspace = new AdSpace(
            _name,
            "$ADSPACE",
            _counter_adspaces,
            msg.sender,
            //_adspaceOwner,
            _numNFTs
        );
        string memory sqlStatement = string.concat(
            "INSERT INTO ",
            _adSpaceTable,
            " (name,website,verified,status,owner,contract,asking_price,size) VALUES ('",
            _name,
            "','",
            _website,
            "','",
            "0", //verified
            "','",
            "Pending Verification", // status
            "','",
            Strings.toHexString(uint256(uint160(address(msg.sender))), 20), // owner
            "','",
            Strings.toHexString(uint256(uint160(address(_adspace))), 20), // contract
            "','",
            _asking_price,
            "','",
            _size,
            "');"
        );

        _runSQL(_adspacetableid, sqlStatement);
        _counter_adspaces++;
        emit AdSpaceCreated(address(_adspace));
    }

    /**
     * @notice Creating Deal and inserting row on Tableland
     * @notice after creating the deal, the Adspace Table will update on the affected row
     * @param _adspaceId id of the affected AdSpace
     * @param _price negotiated price for the deal
     * @param _end ending timestamp (UNIX)
     * @param campaignId id of the affected campaign
     */
    function createDeal(
        uint256 _adspaceId,
        uint256 _price,
        uint40 _end,
        uint256 campaignId
    ) external payable {
        string memory sqlCreateDeal = string.concat(
            "INSERT INTO ",
            _dealTable,
            " (campaign_id_fk, adspace_id_fk, duration_deal, price, started_at) VALUES ('",
            Strings.toString(campaignId),
            "','",
            Strings.toString(_adspaceId),
            "','",
            Strings.toString(_end),
            "','",
            Strings.toString(_price),
            "','",
            Strings.toString(block.timestamp),
            "');"
        );

        _runSQL(_campaigntableid, sqlCreateDeal);
        _counter_deals++;
        emit DealCreated(_counter_deals, _counter_campaigns, _counter_adspaces);

        ///@notice update the Adspace Tableland table
        string memory sqlUpdateAdspace = string.concat(
            "UPDATE ",
            _adSpaceTable,
            " SET status ='Running Ads' WHERE adspace_id = '",
            Strings.toString(_adspaceId),
            "';"
        );
        _runSQL(_adspacetableid, sqlUpdateAdspace);
        emit AdSpaceUpdated(_adspaceId);
    }

    /**
     * @notice Creating a Campaign and inserting row on Tableland
     * @param cid id of the affected AdSpace
     * @param size negotiated price for the deal
     * @param link ending timestamp (UNIX)
     * @dev owner will be auto assigned to msg.sender
     */
    function createCampaign(
        string memory name,
        string memory cid,
        string memory size,
        string memory link
    ) external payable {
        string memory sqlCreateCampagin = string.concat(
            "INSERT INTO ",
            _campaignTable,
            " (name, cid, size, link, owner) VALUES ('",
            name,
            "','",
            cid,
            "','",
            size,
            "','",
            link,
            "','",
            Strings.toHexString(uint256(uint160(address(msg.sender))), 20),
            "');"
        );
        _runSQL(_campaigntableid, sqlCreateCampagin);
        _counter_campaigns++;
        emit CampaignCreated(_counter_campaigns);
    }

    ///@dev internal function to be only called by this Factory
    function _createTable(string memory statement) internal returns (uint256) {
        return _tableland.createTable(address(this), statement);
    }

    ///@dev internal function to be only called by this Factory
    function _runSQL(uint256 tableId, string memory statement) internal {
        _tableland.runSQL(address(this), tableId, statement);
    }

    ///@return uint256 the id of the current AdSpace Table of this AdSpaceFactory
    function getAdSpaceTableId() external view returns (uint256) {
        return _adspacetableid;
    }

    ///@return uint256 the id of the current Campaign Table of this AdSpaceFactory
    function getCampaignTableId() external view returns (uint256) {
        return _campaigntableid;
    }

    ///@return uint256 the id of the current Deal Table of this AdSpaceFactory
    function getDealTableId() external view returns (uint256) {
        return _dealtableid;
    }

    ///@return uint256 the full name of the current AdSpace Table of this AdSpaceFactory
    function getAdSpaceTable() external view returns (string memory) {
        return _adSpaceTable;
    }

    ///@return uint256 the full name of the current Campaign Table of this AdSpaceFactory
    function getCampaignTable() external view returns (string memory) {
        return _campaignTable;
    }

    ///@return uint256 he full name of the current Deal Table of this AdSpaceFactory
    function getDealTable() external view returns (string memory) {
        return _dealTable;
    }

    ///@param i the identifier (number) of the Adspace interested in
    ///@return address the addess of the AdSpace Contract with identifier i
    function getAdSpaceAddress(uint256 i) external view returns (address) {
        return Adspaces[i];
    }

    ///@return uint256 the current amount of Adspaces created by this Factory
    function getCounterAdSpaces() external view returns (uint256) {
        return _counter_adspaces;
    }
}
