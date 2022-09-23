// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface DaiToken {
    function transfer(address dst, uint wad) external returns (bool);

    function transferFrom(
        address src,
        address dst,
        uint wad
    ) external returns (bool);

    function balanceOf(address guy) external view returns (uint);

    function approve(address spender, uint256 value) external returns (bool);

    function allowance(address spender) external returns (uint);
}
