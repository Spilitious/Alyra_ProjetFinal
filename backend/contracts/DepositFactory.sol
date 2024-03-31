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
    address daoAddress;
    
   

    constructor (RealDiplomaToken _token, address _daoAddress)  {
        RdaToken = _token;
        daoAddress = _daoAddress;

    }

    function getDeposits() external view returns(Deposit[] memory) {
        return Deposits;
    }

    function getDeposit(uint _index) external view returns(Deposit memory) {
        return Deposits[_index];
    }
    
   
    function createNewDeposit( DepositType _type, uint _amount, uint _cut) internal {
        
        uint fees = (_amount*_cut)/100;
        uint amount = _amount - fees; 

        require(RdaToken.transferFrom(msg.sender, address(this), amount));
        if(_cut !=0)
            require(RdaToken.transferFrom(msg.sender, daoAddress, fees));
        
        Deposits.push(Deposit(msg.sender, _type, amount));
        emit CreateNewDepositEvent(msg.sender, Deposits.length-1, _type, _amount);
               
    }

    function closeDeposit(uint _index) internal {
         
        if(Deposits[_index].owner != msg.sender)
            revert  NotYourStack("This is not your deposit");

        uint amount = Deposits[_index].amount;
        Deposits[_index].amount = 0; 
        // Deposits[_index] = Deposits[Deposits.length -1];
        // Deposits.pop();
        require(RdaToken.transfer( msg.sender, amount));
        emit CloseDepositEvent(msg.sender, _index, amount);
    }

    function executeDealing(uint _indexLoserDeposit, uint _indexWinnerDeposit, uint _bonus) internal {
        
        Deposits[_indexLoserDeposit].amount = 0;
        Deposits[_indexWinnerDeposit].amount += _bonus ;
    
    }
   
}