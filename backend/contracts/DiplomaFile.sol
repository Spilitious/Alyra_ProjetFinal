// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./DiplomaFactory.sol";
import "./DepositFactory.sol";
import "./VoteFactory.sol";

contract DiplomaFile is DiplomaFactory, DepositFactory, VoteFactory  {

    error ErrorNotValidated(string msgError);
    error ErrorCaseUnknown(string msgError);
    error ErrorNotUnlockYet(uint msgError);
    error ErrorNotYourCase(uint msgError);
    error ErrorCaseNotPending(string msgError);
    error ErrorCaseNotDisputed(string msgError);
    error ErrorVoteInProgress(string msgError);
    error ErrorAlreadyVoter(string msgError);
    error Test(uint, uint);

    event CreateNewFileEvent(uint index, address owner, uint creationTime, AuthStatus status);
    event SimpleResolve(uint index);
    event CreateNewContestEvent(address owner, uint index, ContestationProof proof);
    event ResolveAfterVoteEvent(uint indexFile, AuthStatus status);
    event BecomeVoterEvent(address voter, uint amount);

    enum AuthStatus {
        pending,
        validated,
        disputed,
        rejected
    }

    struct File {
        address owner;
        uint creationTime;
        AuthStatus status;
        
    }

    enum ContestationProof {
        schoolLetter,
        fullPromo,
        presence,
        other
    }

    struct Contest {
        address owner;
        uint file; 
        ContestationProof Proof;
        // uint amount;
        // bool withdraw;
    }

   
    File[] Cases;
    Contest[] Contests; 

    mapping (uint => uint) CaseToContest;
    mapping (uint => uint) CaseToDeposit;
    mapping (uint => uint) CaseToDiploma;
    mapping (uint => uint) CaseToContestDeposit;
    mapping (uint => uint) CaseToVote;
    

    uint constant contestDelay = 2 seconds;
   
    uint public constant price = 100;

    constructor (RealDiplomaToken _token) DepositFactory(_token) {
       
    }

    function getCases() external view returns(File[] memory) {
        return Cases;
    }

    function getCase(uint _index) external view  returns(File memory) {
        return Cases[_index];
    }

    function getContests() external view returns(Contest[] memory) {
        return Contests;
    }

    function getContest(uint _index) external view  returns(Contest memory) {
        return Contests[_index];
    }

    function getDepositFromCaseIndex(uint _index) external view returns(Deposit memory) {
        return Deposits[CaseToDeposit[_index]];
    }

    function getDiplomaFromCaseIndex(uint _index) external view returns(Diploma memory) {
        return Diplomas[CaseToDiploma[_index]];
    }

    function getContestFromCaseIndex(uint _index) external view returns(Contest memory) {
        return Contests[CaseToContest[_index]];
    }

    function getContestDepositFromCaseIndex(uint _index) external view returns(Deposit memory) {
        return Deposits[CaseToContestDeposit[_index]];
    }
     
    function getVoteFromCaseIndex(uint _index) external view returns(Vote memory) {
        return Votes[CaseToVote[_index]];
    }


    function createCase(string calldata _lastName, string calldata _firstName, uint _birthday, string calldata _school, string calldata _diplomaName, uint _diplomaDate) external {
        createNewDeposit( DepositType.fileDeposit,  price);
        CaseToDeposit[Cases.length] = Deposits.length-1; 
        createNewDiploma(_lastName, _firstName, _birthday, _school, _diplomaName, _diplomaDate);
        CaseToDiploma[Cases.length] = Diplomas.length-1; 
        Cases.push(File(msg.sender, block.timestamp, AuthStatus.pending));
        emit CreateNewFileEvent(Cases.length-1, msg.sender, block.timestamp, AuthStatus.pending);
    }

    function contestCase(uint _fileIndex, ContestationProof _proof) external {
        if(Cases.length <= _fileIndex)
            revert ErrorCaseUnknown("This file doesn't exist");

        if(block.timestamp > Cases[_fileIndex].creationTime + contestDelay)
            revert ErrorCaseNotPending("This file is not pending");

        if(Cases[_fileIndex].status != AuthStatus.pending)
            revert ErrorCaseNotPending("This file is not pending");
        
        //Deposit a skack and update mapping
        createNewDeposit( DepositType.contestDeposit,  price);
        CaseToContestDeposit[_fileIndex] = Deposits.length-1;
        
        //Set the case to status "disputed"
        Cases[_fileIndex].status = AuthStatus.disputed;
       
        //Creation du contest et update du mapping
        Contests.push(Contest(msg.sender, _fileIndex, _proof));
        CaseToContest[_fileIndex] = Contests.length-1;
        
        //Creation du vote et update du mapping
        
        Votes.push(Vote(_fileIndex, block.timestamp, 0,0));   
        CaseToVote[_fileIndex] = Votes.length-1;     
        
        //Event
        emit CreateNewContestEvent(msg.sender, Contests.length-1, _proof);
       
    }

    function simpleResolve(uint _index) external {
        
        if(Cases.length <= _index)
            revert ErrorCaseUnknown("This file doesn't exist");

        /*
        if(Cases[_index].owner != msg.sender)
            revert ErrorNotYourCase("This file is not yours"); */

        if(Cases[_index].status != AuthStatus.pending)
            revert ErrorCaseNotPending("This file is not pending");


        if(block.timestamp <= Cases[_index].creationTime + contestDelay)
            revert ErrorNotUnlockYet(Cases[_index].creationTime+contestDelay);

        closeDeposit(CaseToDeposit[_index]);
        Cases[_index].status = AuthStatus.validated;
        
        emit SimpleResolve(_index);

    }

    function resolveAfterVote(uint _fileIndex) external {
         if(Cases.length <= _fileIndex)
            revert ErrorCaseUnknown("This case doesn't exist");

        /*
        if(Cases[_index].owner != msg.sender)
            revert ErrorNotYourCase("This file is not yours"); */

        if(Cases[_fileIndex].status != AuthStatus.disputed)
            revert ErrorCaseNotDisputed("This case is not disputed");
        
             
        if( block.timestamp < Votes[CaseToVote[_fileIndex]].creationTime + votingDelay)
            revert ErrorVoteInProgress("The vote is not closed yet");
        
        
        //The diploma has been voted as valid
        if(Votes[CaseToVote[_fileIndex]].yes > Votes[CaseToVote[_fileIndex]].no)
        {
            internalTransfer(CaseToContestDeposit[_fileIndex], CaseToDeposit[_fileIndex], price);
            Cases[_fileIndex].status = AuthStatus.validated;  
        }    
        //The diploma has been voted as invalid
        else
        {
            internalTransfer(CaseToDeposit[_fileIndex],CaseToContestDeposit[_fileIndex], price);
            Cases[_fileIndex].status = AuthStatus.rejected; 
        }
        
        emit ResolveAfterVoteEvent(_fileIndex, Cases[_fileIndex].status);
           
    }    

    function becomeVoter(uint _amount) external {

        if(mapVoter[msg.sender].tokenAmount != 0)
             revert ErrorAlreadyVoter("Already a voter");
        
        createNewDeposit(DepositType.voteDeposit,  _amount);
        mapVoter[msg.sender] = Voter(block.timestamp, _amount);

        emit BecomeVoterEvent(msg.sender, _amount);
    }


}

   

       


   


