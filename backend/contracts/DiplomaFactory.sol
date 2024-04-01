// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title DiplomaFactory
/// @notice Contract for managing diplomas
/// @author Aurélien Lebrun
contract DiplomaFactory {

    /// @notice Event triggered when a new diploma is created
    /// @param index The index of the newly created diploma in the array
    /// @param lastName The last name of the diploma holder
    /// @param firstName The first name of the diploma holder
    /// @param birthday The birthday of the diploma holder
    /// @param school The name of the school
    /// @param diplomaName The name of the diploma
    /// @param diplomaDate The date of issuance of the diploma
    event CreateNewDiplomaEvent(uint index, string lastName, string firstName, uint birthday, string  school, string  diplomaName, uint diplomaDate);  
    
    /// @notice Struct representing a Diploma
    struct Diploma {
        string lastName;
        string firstName;
        uint birthday;
        string school;
        string diplomaName;
        uint diplomaDate;
    }
   
    /// @notice Array containing all the diplomas created by the contract
    Diploma[] Diplomas;
    
    constructor () {

    }
    
    /// @notice Get a diploma by index
    /// @param _index The index of the diploma
    /// @return Diploma The diploma object
    function getDiploma(uint _index) external view returns(Diploma memory) {
        return Diplomas[_index];
    }

    /// @notice Get all diplomas
    /// @return Diploma[] An array of all diplomas
    function getDiplomas() external view returns(Diploma[] memory)
    {
        return Diplomas;
    }

    /// @notice Internal function to create a new diploma
    /// @param _lastName The last name of the diploma holder
    /// @param _firstName The first name of the diploma holder
    /// @param _birthday The birthday of the diploma holder
    /// @param _school The name of the school
    /// @param _diplomaName The name of the diploma
    /// @param _diplomaDate The date of issuance of the diploma
    function createNewDiploma(string calldata _lastName, string calldata _firstName, uint _birthday, string calldata _school,
                              string calldata _diplomaName, uint _diplomaDate) internal {
        
        Diplomas.push(Diploma(_lastName, _firstName, _birthday, _school, _diplomaName, _diplomaDate));
        emit CreateNewDiplomaEvent(Diplomas.length-1, _lastName, _firstName, _birthday, _school, _diplomaName, _diplomaDate);

       
    }

}