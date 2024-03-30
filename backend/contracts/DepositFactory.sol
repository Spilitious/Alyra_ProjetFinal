// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RealDiplomaToken.sol";


contract DepositFactory {

    error NotYourStack(string ErrorMsg);
    error NotYetUnlocked(string ErrorMsg);
    error StackUnkwown(string ErrorMsg);
    error DepositIsEmpty(string ErrorMsg);
    error ErrorNotEnoughFund(string ErrorMsg);
    

    event CreateNewDepositEvent(address owner, uint idDeposit, DepositType kind,  uint amount);  
    event CloseDepositEvent(address owner, uint idDeposit, uint amount);
    event TransferEvent(uint index, address to);

    enum DepositType {
        fileDeposit,
        contestDeposit,
        voteDeposit
    }

    struct Deposit {
        address owner;
        DepositType DepositType;
        // uint idFile;
        uint amount;
        // bool withdrawAllowed;
    }

    RealDiplomaToken RdaToken;
    Deposit[] Deposits; 
    
   

    constructor (RealDiplomaToken _token)  {
        RdaToken = _token;

    }

    function getDeposits() external view returns(Deposit[] memory) {
        return Deposits;
    }

    function getDeposit(uint _index) external view returns(Deposit memory) {
        return Deposits[_index];
    }
    
   
    function createNewDeposit( DepositType _type, uint _amount) internal {
        
    //    if(RdaToken.balanceOf(msg.sender) < _amount)
        //    revert ErrorNotEnoughFund("Not enough token");
       
        require(RdaToken.transferFrom(msg.sender, address(this), _amount));
        Deposits.push(Deposit(msg.sender, _type, _amount));
        emit CreateNewDepositEvent(msg.sender, Deposits.length-1, _type, _amount);
               
    }

    function closeDeposit(uint _index) internal {
        // if(_index >= Deposits.length) 
            // revert StackUnkwown("this stack doesn't exist"); 

        if(Deposits[_index].owner != msg.sender)
            revert  NotYourStack("This is not your deposit");

        // if(!Deposits[_index].withdrawAllowed)
            // revert  NotYetUnlocked("Still Locked");

        // if(Deposits[_index].amount == 0)
            // revert DepositIsEmpty("No token left");

        uint amount = Deposits[_index].amount;
        Deposits[_index].amount = 0; 
        // Deposits[_index] = Deposits[Deposits.length -1];
        // Deposits.pop();
        require(RdaToken.transfer( msg.sender, amount));
        emit CloseDepositEvent(msg.sender, _index, amount);
    }

    function internalTransfer(uint _indexFrom, uint _indexTo, uint _amount) internal {
        
        Deposits[_indexFrom].amount -= _amount;
        Deposits[_indexTo].amount += _amount;
    
    }
   
}