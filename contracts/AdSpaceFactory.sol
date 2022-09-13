//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./ITablelandTables.sol";
import "./AdSpace.sol";

contract AdSpaceFactory is ITablelandTables {
    // contract for optimism-goerli right now
    address private constant TABLELANDCONTRACT =
        0xC72E8a7Be04f2469f8C2dB3F1BdF69A7D516aBbA;
    ITablelandTables private _tableland;

    uint256 private _adspacetableid;
    uint256 private _campaigntableid;
    uint256 private _dealtableid;

    constructor(address tablelandAddress) {
        _tableland = ITablelandTables(TABLELANDCONTRACT);

        _adspacetableid = _createTable("CREATE ADSPACE STATEMENT");
        _campaigntableid = _createTable("CREATE CAMPAIGN STATEMENT");
        _dealtableid = _createTable("CREATE DEAL STATEMENT");
    }

    function createAdSpace(
        string _name,
        string _symbol,
        uint256 _adspaceId,
        address _adspaceOwner,
        uint8 _numNFTs
    ) external payable returns (address) {
        AdSpace _adspace = new AdSpace(
            _name,
            _symbol,
            _adspaceId,
            _adspaceOwner,
            _numNFTs
        );
        _tableland.runSQL(
            address(this),
            _adspacetableid,
            "SQL statement commin..."
        );
        return address(_adspace);
    }

    function _createTable(string memory statement)
        internal
        override
        returns (uint256)
    {
        return _tableland.createTable(address(this), statement);
    }

    function runSQL(uint256 tableId, string memory statement)
        internal
        override
    {
        _tableland.runSQL(address(this), tableId, statement);
    }

    // onlyOwner
    function setController(uint256 tableId, address controller)
        external
        override
    {
        _tableland.setController(address(this), tableId, controller);
    }

    // onlyOwner
    function lockController(uint256 tableId) external override {
        _tableland.lockController(address(this), tableId);
    }

    // onlyOwner
    function setBaseURI(string memory baseURI) external override {
        _tableland.setBaseURI(baseURI);
    }

    // onlyOwner
    function pause() external override {
        _tableland.pause();
    }

    // onlyOwner
    function unpause() external override {
        _tableland.unpause();
    }

    // getter
    function getController(uint256 tableId)
        external
        override
        returns (address)
    {
        return _tableland.getController(tableId);
    }

    function getAdSpaceTableId() external returns (uint256 _adspacetableid) {
        return _adspacetableid;
    }

    function getCampaignTableId() external returns (uint256 _campaigntableid) {
        return _campaigntableid;
    }

    function getDealTableId() external returns (uint256 _dealtableid) {
        return _dealtableid;
    }
}
