// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./DiplomaFile.sol";

contract DiplomaNFT is ERC721{
    
   

    error ErrorCaseNotValidated(string msgError);
    error ErrorNotYourCase(string msgError);
    error ErrorAlreadyMinted(string msgError);
    error ErrorCaseUnknown(string msgError);

    event MintNFTEvent(uint index);
    // address diplomaFileAddress;
    DiplomaFile DiplomaFileContract;

	struct RdaNft {
        uint validationDate;
        string lastName;
        string firstName;
        uint birthday;
        string school;
        string diplomaName;
        uint diplomaDate;
    }
   


    RdaNft[] RealDiplomaNFTs;

    constructor(address _diplomaFileAddress) ERC721 ("RealDiplomaNFT", "RDANFT") {
        // diplomaFileAddress = _diplomaFileAddress;
        DiplomaFileContract = DiplomaFile(_diplomaFileAddress);

    }

    function getRdaNFT(uint _index) external returns(RdaNft memory {
        return RealDiplomaNFTs[_index]
    }


    function mintDiploma(uint _indexFile) external returns (uint256)
    {
        // File memory info 
        uint lg = DiplomaFileContract.getCases().length;
        address owner = DiplomaFileContract.getCase(_indexFile).owner;
        uint8 status = uint8(DiplomaFileContract.getCase(_indexFile).status);
       
        if(_indexFile >= lg)
            revert ErrorCaseUnknown("Unknown case");
        if(owner != msg.sender)
            revert ErrorNotYourCase("Not your case");
        if(status != 1)
            revert ErrorCaseNotValidated("Not Validated");
        if(_ownerOf(_indexFile) != address(0))
            revert ErrorAlreadyMinted("Already minted");

        string memory lastName = DiplomaFileContract.getDiplomaFromCaseIndex(_indexFile).lastName;
        string memory firstName = DiplomaFileContract.getDiplomaFromCaseIndex(_indexFile).firstName;
        uint birthday = DiplomaFileContract.getDiplomaFromCaseIndex(_indexFile).birthday;
        string memory school = DiplomaFileContract.getDiplomaFromCaseIndex(_indexFile).school;
        string memory diplomaName = DiplomaFileContract.getDiplomaFromCaseIndex(_indexFile).diplomaName;
        uint  diplomaDate = DiplomaFileContract.getDiplomaFromCaseIndex(_indexFile).diplomaDate;
       
        RealDiplomaNFTs.push(RdaNft(block.timestamp, lastName, firstName, birthday, school, diplomaName, diplomaDate));


        _mint(msg.sender, _indexFile+1);
        // _setTokenURI(newItemId, _tokenURI);
        emit MintNFTEvent(_indexFile+1);

        return _indexFile;
    }
}
