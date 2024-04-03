// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./DiplomaFactory.sol";
import "./DepositFactory.sol";
import "./VoteFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DiplomaFile is DiplomaFactory, DepositFactory, VoteFactory, Ownable  {

    error ErrorNotValidated(string msgError);
    error ErrorCaseUnknown(string msgError);
    error ErrorNotUnlockYet(uint msgError);
    error ErrorNotYourCase(uint msgError);
    error ErrorCaseNotPending(string msgError);
    error ErrorCaseNotDisputed(string msgError);
    error ErrorVoteInProgress(string msgError);
    error ErrorAlreadyVoter(string msgError);
    error ErrorNoReward(string msgError);
    error ErrorCaseNotResolved(string msgError);
    error ErrorAmountMin(string msgError);

    event CreateNewCaseEvent(uint index, address owner, uint creationTime);
    event SimpleResolve(uint index);
    event CreateNewDisputeEvent(address owner, uint index, DisputeProof proof);
    event ResolveAfterVoteEvent(uint indexFile, AuthStatus status);
    event BecomeVoterEvent(address voter, uint amount);
    event GetRewardEvent(address voter, uint amount);

    /// @notice Enumeration of different authentication statuses for a file
    enum AuthStatus {
        pending,
        validated,
        disputed,
        rejected
    }

    /// @notice Structure representing a file
    struct File {
        address owner;
        AuthStatus status;
        uint creationTime;
        
    }

    /// @notice Enumeration of different types of dispute proofs
    enum DisputeProof {
        schoolLetter,
        fullPromo,
        presence,
        other
    }

    /// @notice Structure representing a dispute
    struct Dispute {
        address owner;
        DisputeProof Proof;
    }

   
    File[] Cases;
    Dispute[] Disputes; 

    /// @notice Maps a case to its associated dispute ID.
    mapping (uint => uint) CaseToDispute;

    /// @notice Maps a case to its associated deposit ID.
    mapping (uint => uint) CaseToDeposit;

    /// @notice Maps a case to its associated diploma ID.
    mapping (uint => uint) CaseToDiploma;

    /// @notice Maps a case to its associated dispute deposit ID.
    mapping (uint => uint) CaseToDisputeDeposit;

    /// @notice Maps a case to its associated vote ID.
    mapping (uint => uint) CaseToVote;
    

    /// @notice The delay (in seconds) during a dispute can be initiated after a case is created.
    uint public DisputeDelay = 600 seconds;

    /// @notice The delay (in seconds) for voting after a dispute is initiated.
    uint public votingDelay = 600 seconds;

    /// @notice The price (in wei) required for create a case and dispute a case.
    uint public constant price = 100*(10**18);

    /// @notice The fee (in percentage) applied to certain transactions.
    uint public constant fee = 10;


    constructor (RealDiplomaToken _token, address _daoAddress) DepositFactory(_token, _daoAddress) Ownable(msg.sender) {
       
    }

    /// @notice Retrieves all cases.
    /// @return An array of File structs representing all cases.
    function getCases() external view returns(File[] memory) {
        return Cases;
    }

    /// @notice Retrieves a specific case by index.
    /// @param _index The index of the case to retrieve.
    /// @return The File struct representing the case at the specified index.
    function getCase(uint _index) external view returns(File memory) {
        return Cases[_index];
    }

    /// @notice Retrieves all disputes.
    /// @return An array of Dispute structs representing all disputes.
    function getDisputes() external view returns(Dispute[] memory) {
        return Disputes;
    }

    /// @notice Retrieves a specific dispute by index.
    /// @param _index The index of the dispute to retrieve.
    /// @return The Dispute struct representing the dispute at the specified index.
    function getDispute(uint _index) external view returns(Dispute memory) {
        return Disputes[_index];
    }

    /// @notice Retrieves the deposit associated with a specific case index.
    /// @param _index The index of the case for which to retrieve the deposit.
    /// @return The Deposit struct representing the deposit associated with the specified case index.
    function getDepositFromCaseIndex(uint _index) external view returns(Deposit memory) {
        return Deposits[CaseToDeposit[_index]];
    }

    /// @notice Retrieves the diploma associated with a specific case index.
    /// @param _index The index of the case for which to retrieve the diploma.
    /// @return The Diploma struct representing the diploma associated with the specified case index.
    function getDiplomaFromCaseIndex(uint _index) external view returns(Diploma memory) {
        return Diplomas[CaseToDiploma[_index]];
    }

    /// @notice Retrieves the dispute associated with a specific case index.
    /// @param _index The index of the case for which to retrieve the dispute.
    /// @return The Dispute struct representing the dispute associated with the specified case index.
    function getDisputeFromCaseIndex(uint _index) external view returns(Dispute memory) {
        return Disputes[CaseToDispute[_index]];
    }

    /// @notice Retrieves the deposit associated with a specific case index's dispute.
    /// @param _index The index of the case for which to retrieve the dispute deposit.
    /// @return The Deposit struct representing the dispute deposit associated with the specified case index.
    function getDisputeDepositFromCaseIndex(uint _index) external view returns(Deposit memory) {
        return Deposits[CaseToDisputeDeposit[_index]];
    }

    /// @notice Retrieves the vote associated with a specific case index.
    /// @param _index The index of the case for which to retrieve the vote.
    /// @return The Vote struct representing the vote associated with the specified case index.
    function getVoteFromCaseIndex(uint _index) external view returns(Vote memory) {
        return Votes[CaseToVote[_index]];
    }


    /// @notice Calculates the price excluding taxes.
    /// @dev This function is private and pure.
    /// @return The price excluding taxes.
    function getPriceHT() private pure returns(uint) {
        return price - (price * fee) / 100;
    }

    /// @notice Calculates the bonus amount.
    /// @dev This function is public and pure.
    /// @return The bonus amount, which is half of the price excluding taxes.
    function getBonus() public pure returns(uint) {
        return getPriceHT() / 2;
    }

    /// @notice Sets the dispute delay.
    /// @dev This function can only be called by the owner.
    /// @param _delay The new dispute delay value to be set.
    function setDisputeDelay(uint _delay) external onlyOwner {
        DisputeDelay = _delay;
    }

    /// @notice Sets the voting delay.
    /// @dev This function can only be called by the owner.
    /// @param _votingDelay The new voting delay value to be set.
    function setVotingDelay(uint _votingDelay) external onlyOwner {
        votingDelay = _votingDelay;
    }


    /* *********************************************************************** Fonction qui crée des deposits  *********************************************************************** */

    /// @notice Creates a new case.
    /// @dev This function creates a new case, initiates a deposit for the case, and creates a new diploma.
    /// @param _lastName The last name of the person associated with the case.
    /// @param _firstName The first name of the person associated with the case.
    /// @param _birthday The birthday of the person associated with the case.
    /// @param _school The school associated with the case.
    /// @param _diplomaName The name of the diploma associated with the case.
    /// @param _diplomaDate The date of the diploma associated with the case.
    function createCase(string calldata _lastName, string calldata _firstName, uint _birthday, string calldata _school, string calldata _diplomaName, uint _diplomaDate) external {
       
        // Create a new deposit for the case
        createNewDeposit(DepositType.fileDeposit, price, fee);
        CaseToDeposit[Cases.length] = Deposits.length - 1;
    
        // Create a new diploma for the case
        createNewDiploma(_lastName, _firstName, _birthday, _school, _diplomaName, _diplomaDate);
        CaseToDiploma[Cases.length] = Diplomas.length - 1;
    
        // Add the new case to the list of cases
        Cases.push(File(msg.sender, AuthStatus.pending, block.timestamp));
    
        // Emit an event indicating the creation of a new case
        emit CreateNewCaseEvent(Cases.length - 1, msg.sender, block.timestamp);
    }

    /// @notice Disputes a case.
    /// @dev This function allows a user to dispute a case by providing a dispute proof.
    /// @param _fileIndex The index of the file associated with the dispute.
    /// @param _proof The proof provided for the dispute.
    function disputeCase(uint _fileIndex, DisputeProof _proof) external {
        if(Cases.length <= _fileIndex)
            revert ErrorCaseUnknown("This file doesn't exist");

        if(block.timestamp > Cases[_fileIndex].creationTime + DisputeDelay)
            revert ErrorCaseNotPending("The delay has past");

        if(Cases[_fileIndex].status != AuthStatus.pending)
            revert ErrorCaseNotPending("This file is not pending");
        
        //Deposit a skack and update mapping
        createNewDeposit( DepositType.DisputeDeposit,  price, fee);
        CaseToDisputeDeposit[_fileIndex] = Deposits.length-1;
        
        //Set the case to status "disputed"
        Cases[_fileIndex].status = AuthStatus.disputed;
       
        //Creation du Dispute et update du mapping
        Disputes.push(Dispute(msg.sender, _proof));
        CaseToDispute[_fileIndex] = Disputes.length-1;
        
        //Creation du vote et update du mapping
        Votes.push(Vote(block.timestamp, 0,0,0));   
        CaseToVote[_fileIndex] = Votes.length-1;     
        
        //Event
        emit CreateNewDisputeEvent(msg.sender, Disputes.length-1, _proof);
       
    }

      /* *********************************************************************** Fonction de résolution *********************************************************************** */


    /// @notice Resolves a case without dispute.
    /// @dev This function resolves a case without dispute by closing the associated deposit and setting the case status to "validated".
    /// @param _index The index of the case to resolve.
    function simpleResolve(uint _index) external {
        // Check if the case index is valid
        if (Cases.length <= _index)
            revert ErrorCaseUnknown("This file doesn't exist");

        // Check if the case status is pending
        if (Cases[_index].status != AuthStatus.pending)
            revert ErrorCaseNotPending("This file is not pending");

        // Check if the current timestamp is past the unlock time
        if (block.timestamp <= Cases[_index].creationTime + DisputeDelay)
            revert ErrorNotUnlockYet(Cases[_index].creationTime + DisputeDelay);

        // Close the deposit and set the case status to "validated"
        closeDeposit(CaseToDeposit[_index]);
        Cases[_index].status = AuthStatus.validated;
    
        // Emit an event indicating the resolution of the case
        emit SimpleResolve(_index);
    }

    /// @notice Resolves a disputed case after the voting period has ended.
    /// @dev This function resolves a disputed case after the voting period has ended by executing appropriate actions based on the voting results.
    /// @param _fileIndex The index of the disputed case to resolve.
    function resolveAfterVote(uint _fileIndex) external {
        if(Cases.length <= _fileIndex)
            revert ErrorCaseUnknown("This case doesn't exist");

        if(Cases[_fileIndex].status != AuthStatus.disputed)
            revert ErrorCaseNotDisputed("This case is not disputed");
             
        if( block.timestamp < Votes[CaseToVote[_fileIndex]].creationTime + votingDelay)
            revert ErrorVoteInProgress("The vote is not closed yet");
        
        //The diploma has been voted as valid
        if(Votes[CaseToVote[_fileIndex]].yes > Votes[CaseToVote[_fileIndex]].no)
        {
            executeDealing(CaseToDisputeDeposit[_fileIndex], CaseToDeposit[_fileIndex], getBonus());
            closeDeposit(CaseToDeposit[_fileIndex]);
            Cases[_fileIndex].status = AuthStatus.validated; 

        }    
        //The diploma has been voted as invalid
        else
        {
            executeDealing(CaseToDeposit[_fileIndex],CaseToDisputeDeposit[_fileIndex], getBonus());
            closeDeposit(CaseToDisputeDeposit[_fileIndex]);
            Cases[_fileIndex].status = AuthStatus.rejected; 
        }
        
        emit ResolveAfterVoteEvent(_fileIndex, Cases[_fileIndex].status);
           
    }    

    /* *********************************************************************** Fonction autour du vote *********************************************************************** */

    /// @notice Allows an address to become a voter by depositing tokens.
    /// @param _amount The amount of tokens to deposit for becoming a voter.
    function becomeVoter(uint _amount) external {
        // Check if the address is already a voter
        if (mapVoter[msg.sender].tokenAmount != 0)
            revert ErrorAlreadyVoter("Already a voter");

        // Check if the deposited amount meets the minimum requirement
        if (_amount < 10 * 10**18)
            revert ErrorAmountMin("Minimum deposit amount is 10 tokens");

        // Create a new deposit for voting purposes
        createNewDeposit(DepositType.voteDeposit, _amount, 0);

        // Record the address as a voter and store the deposit information
        mapVoter[msg.sender] = Voter(block.timestamp, _amount);

        // Emit an event indicating that the address has become a voter
        emit BecomeVoterEvent(msg.sender, _amount);
    }



    /// @notice Sets the vote choice for the specified index.
    /// @dev This function is external.
    /// @param _fileIndex The index of the case.
    /// @param _choice The choice to be set (0 for no, 1 for yes).
    function setVote(uint _fileIndex, uint _choice) external {
        // Check if the specified vote index exists
        if (Cases.length <= _fileIndex) {
            revert ErrorCaseUnknown("This case doesn't exist");
        }

        // Check if the sender is a registered voter
        if (mapVoter[msg.sender].tokenAmount == 0) {
            revert ErrorNotVoter("Not a voter");
        }

        // Check if the sender has already voted for this vote index
        if (VoteToReward[CaseToVote[_fileIndex]][msg.sender].hasVoted) {
            revert ErrorHasVoted("Already Voted");
        }

        // Check if the vote started before the sender became a voter
        if (Votes[CaseToVote[_fileIndex]].creationTime < mapVoter[msg.sender].registrationTime) {
            revert ErrorNotAllowedToVote("This vote started before you became a voter");
        }

        // Check if the vote is still open
        if (block.timestamp > Votes[CaseToVote[_fileIndex]].creationTime + votingDelay) {
            revert ErrorVoteClosed("This vote is closed");
        }

        // Increment the vote count based on the choice
        if (_choice == 0) 
            ++Votes[CaseToVote[_fileIndex]].no;
        
        if (_choice == 1) 
            ++Votes[CaseToVote[_fileIndex]].yes;
    

        // Update the total token square for the vote
        Votes[CaseToVote[_fileIndex]].totalTokenSquare += ((mapVoter[msg.sender].tokenAmount /10**2) * (mapVoter[msg.sender].tokenAmount / 10**18));

        // Mark the sender as having voted for this vote index
        VoteToReward[CaseToVote[_fileIndex]][msg.sender].hasVoted = true;

        // Emit an event to signify that a vote has been set
         emit SetVoteEvent(msg.sender, _fileIndex, _choice);

    }


    /// @notice Allows a voter to claim their reward for participating in a vote.
    /// @param _index The index of the case associated with the vote.
    function getRewardFromVote(uint _index) external {
       
        // Check if the provided case index exists
        if (Cases.length <= _index)
            revert ErrorCaseUnknown("This case doesn't exist");

        // Check if the case is resolved
        if (Cases[_index].status == AuthStatus.disputed)
            revert ErrorCaseNotResolved("This case is not resolved yet");

        // Check if the voter has already voted
        if (!VoteToReward[CaseToVote[_index]][msg.sender].hasVoted)
            revert ErrorNoReward("Has not voted");

        // Check if the voter has already claimed their reward
        if (VoteToReward[CaseToVote[_index]][msg.sender].hasClaimed)
            revert ErrorNoReward("Already claimed");

        // Calculate the weight of the voter's tokens and the total weight of all voters' tokens
        uint weight = (mapVoter[msg.sender].tokenAmount / 10**2) * (mapVoter[msg.sender].tokenAmount / 10**18);
        uint totalWeight = Votes[CaseToVote[_index]].totalTokenSquare;

        // Calculate the reward amount based on the voter's token weight and the total token weight
        uint amount = 1000000 * (weight * getBonus()) / totalWeight / 1000000;

        // Mark the reward as claimed
        VoteToReward[CaseToVote[_index]][msg.sender].hasClaimed = true;

        // Transfer the reward amount in tokens to the voter
        require(RdaToken.transfer(msg.sender, amount));

        // Emit an event to indicate that the reward has been received
        emit GetRewardEvent(msg.sender, amount);
    }

}

   

       


   


