// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

 import "@openzeppelin/contracts/access/Ownable.sol";   
 /// @title VoteFactory
 /// @notice A contract for managing voting operations on disputed cases.
 
contract VoteFactory {
   
    /// Errors
    /// @notice Error thrown when a voter is not registered.
    error ErrorNotVoter(string msgError);

    /// @notice Error thrown when attempting to vote in a closed vote.
    error ErrorVoteClosed(string msgError);

    /// @notice Error thrown when a voter is not allowed to vote (registered too late)
    error ErrorNotAllowedToVote(string msgError);

    /// @notice Error thrown when a voter has already voted.
    error ErrorHasVoted(string msgError);

    /// @notice Error thrown when attempting to interact with an unknown vote.
    error ErrorVoteUnknown(string msgError);

    /// Events
    /// @notice Event emitted when a vote is cast.
    /// @param voter The address of the voter.
    /// @param voteIndex The index of the vote.
    /// @param choice The choice made by the voter (e.g., yes or no).
    event SetVoteEvent(address indexed voter, uint indexed voteIndex, uint choice);
   
    
    /// @notice Structure representing a voter.
    struct Voter {
        /// @notice Time when the voter registered.
        uint registrationTime;
        /// @notice Amount of tokens locked by the voter.
        uint tokenAmount;
        }

    /// @notice Structure representing a reward.
    struct Reward {
        /// @notice Flag indicating whether the voter has voted.
        bool hasVoted;
        /// @notice Flag indicating whether the reward has been claimed.
        bool hasClaimed;
}

    
    /// @notice Structure representing a vote.
    struct Vote {
        /// @notice Time when the vote was created.
        uint creationTime;
        /// @notice Number of 'yes' votes.
        uint yes;
        /// @notice Number of 'no' votes.
        uint no;
        /// @notice Sum of square of the amount of token of each voter
        uint totalTokenSquare;
    }

    /// State variables
    Vote[] Votes;
    mapping (address => Voter) mapVoter;
    mapping(uint => mapping(address => Reward)) VoteToReward;

    
    
    
    constructor () {
       
    }

   
    /// @notice Returns the vote at the specified index.
    /// @dev This function is external and view.
    /// @param _index The index of the vote to retrieve.
    /// @return The vote at the specified index.
    function getVote(uint _index) external view returns(Vote memory) {
        return Votes[_index];
    }

    
    /// @notice Returns all the votes.
    /// @dev This function is external and view.
    /// @return An array containing all the struct Vote.
    function getVotes() external view returns(Vote[] memory) {
        return Votes;
    }

    
    /// @notice Returns the voter information for the specified address.
    /// @dev This function is external and view.
    /// @param _addr The address of the voter.
    /// @return The voter information.
    function getVoter(address _addr) external view returns(Voter memory) {
        return mapVoter[_addr];
    }

    
    /// @notice Checks if the specified address has voted for the given vote index.
    /// @dev This function is external and view.
    /// @param _index The index of the vote.
    /// @param _addr The address to check.
    /// @return True if the address has voted, otherwise false.
    function getHasVoted(uint _index, address _addr) external view returns(bool) {
        return VoteToReward[_index][_addr].hasVoted;
    }

    
    /// @notice Checks if the specified address has claimed the reward for the given vote index.
    /// @dev This function is external and view.
    /// @param _index The index of the vote.
    /// @param _addr The address to check.
    /// @return True if the address has claimed the reward, otherwise false.
    function getHasClaimed(uint _index, address _addr) external view returns(bool) {
        return VoteToReward[_index][_addr].hasClaimed;
    }


   


    
    
   






}