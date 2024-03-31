// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealDiplomaToken is ERC20, Ownable {
    
    constructor() ERC20 ("RealDiploma", "RDA") Ownable(msg.sender) {
        _mint(msg.sender, 1000 *(10**18));

    }

    function mint(address _to, uint _amount) external onlyOwner {
        _mint(_to, _amount*10**18);
    }


}