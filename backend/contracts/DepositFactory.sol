// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RealDiplomaToken.sol";


contract DepositFactory {
    
    /// @notice Revert if not the owner of the stack
    error NotYourStack(string ErrorMsg);
    
    /// @notice Event emitted when a new deposit is created
    /// @param owner The address of the deposit owner
    /// @param idDeposit The identifier of the deposit
    /// @param kind The type of deposit (fileDeposit, DisputeDeposit, voteDeposit)
    /// @param amount The amount of the deposit
    event CreateNewDepositEvent(address owner, uint idDeposit, DepositType kind, uint amount);  

    /// @notice Event emitted when a deposit is closed
    /// @param owner The address of the deposit owner
    /// @param idDeposit The identifier of the deposit
    /// @param amount The amount withdrawn from the deposit
    event CloseDepositEvent(address owner, uint idDeposit, uint amount);

    /// @notice Event emitted when a transfer transaction is executed
    /// @param indexLoserDeposit The index of the deposit sending the bonus
    /// @param  indexWinnerDeposit The index of the deposit receiving the bonus
    /// @param  bonus The address to which the transferred funds are sent
    event ExecuteDealingEvent(uint indexLoserDeposit, uint indexWinnerDeposit, uint bonus);


    /// @notice Enum representing the types of deposits
    enum DepositType {
        fileDeposit,    // Deposit for a file
        DisputeDeposit, // Deposit for a Dispute
        voteDeposit     // Deposit for a vote
    }

    /// @notice Struct representing a deposit
    struct Deposit {
        address owner;      // Address of the deposit owner
        DepositType depositType; // Type of the deposit
        uint amount;        // Amount of the deposit
    }

    /// @notice The ERC20 token contract used for deposits
    RealDiplomaToken RdaToken;

    /// @notice Array containing all deposits made
    Deposit[] Deposits;

    /// @notice Address of the Decentralized Autonomous Organization
    address daoAddress;
    
   

    /// @notice Constructor function to initialize the contract
    /// @param _token The address of the RealDiplomaToken contract
    /// @param _daoAddress The address of the DAO (Decentralized Autonomous Organization)
    constructor(RealDiplomaToken _token, address _daoAddress) {
        RdaToken = _token;
        daoAddress = _daoAddress;
    }

    /// @notice Function to retrieve all deposits
    /// @return An array containing all deposits made
    function getDeposits() external view returns (Deposit[] memory) {
        return Deposits;
    }

    /// @notice Function to retrieve a specific deposit
    /// @param _index The index of the deposit to retrieve
    /// @return The deposit at the specified index
    function getDeposit(uint _index) external view returns (Deposit memory) {
        return Deposits[_index];
    }

    
    /// @notice Function to create a new deposit
    /// @param _type The type of deposit
    /// @param _amount The amount to be deposited
    /// @param _cut The percentage cut to be taken as fees
    function createNewDeposit( DepositType _type, uint _amount, uint _cut) internal {
        
        // Calculate fees based on the percentage cut
        uint fees = (_amount*_cut)/100;
        // Calculate the final amount after deducting fees
        uint amount = _amount - fees; 

        // Transfer the amount from the depositor to this contract
        require(RdaToken.transferFrom(msg.sender, address(this), amount));
        // Transfer fees to the DAO address if the cut is not zero
        if(_cut !=0)
            require(RdaToken.transferFrom(msg.sender, daoAddress, fees));

        // Add the deposit to the Deposits array
        Deposits.push(Deposit(msg.sender, _type, amount));

        // Emit an event for the newly created deposit
        emit CreateNewDepositEvent(msg.sender, Deposits.length-1, _type, _amount);
               
    }

    /// @notice Function to close a deposit and withdraw the deposited amount
    /// @param _index The index of the deposit to be closed
    /// @dev Only the owner of the deposit can close it
    /// @param _index The index of the deposit to be closed
    function closeDeposit(uint _index) internal {
    
        // Check if the caller is the owner of the deposit
        if (Deposits[_index].owner != msg.sender) {
           revert NotYourStack("This is not your deposit");
        }

        uint amount = Deposits[_index].amount;
        Deposits[_index].amount = 0; 
        // Transfer the deposited amount back to the owner
        require(RdaToken.transfer(msg.sender, amount));
        emit CloseDepositEvent(msg.sender, _index, amount);
    }



    /// @notice Function to execute a dealing between two deposits
    /// @param _indexLoserDeposit The index of the losing deposit
    /// @param _indexWinnerDeposit The index of the winning deposit
    /// @param _bonus The bonus amount to be added to the winning deposit
    /// @dev This function redistributes funds from the losing deposit to the winning deposit
    function executeDealing(uint _indexLoserDeposit, uint _indexWinnerDeposit, uint _bonus) internal {
        // Set the amount of the losing deposit to 0
        Deposits[_indexLoserDeposit].amount = 0;
        // Add the bonus amount to the winning deposit
        Deposits[_indexWinnerDeposit].amount += _bonus;

        emit ExecuteDealingEvent(_indexLoserDeposit, _indexWinnerDeposit, _bonus);
    }

   
}