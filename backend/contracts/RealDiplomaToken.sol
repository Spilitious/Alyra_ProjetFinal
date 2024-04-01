// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title RealDiplomaToken
/// @notice RealDiplomaToken is an ERC20 token serving the RealDiploma protocol.
contract RealDiplomaToken is ERC20, Ownable {
    
    /// @notice Maximum supply of the token
    uint public maxSupply;
    

    /// @notice Constructor function for RealDiplomaToken.
    constructor() ERC20 ("RealDiploma", "RDA") Ownable(msg.sender) {
        maxSupply = 10**7;
        _mint(msg.sender, 1000 *(10**18));

    }

    /// @notice Mint additional tokens and send them to the specified address.
    /// @param _to The address to which the minted tokens will be sent.
    /// @param _amount The amount of tokens to mint.
    function mint(address _to, uint _amount) external onlyOwner {
        _mint(_to, _amount*10**18);
    }

    

}