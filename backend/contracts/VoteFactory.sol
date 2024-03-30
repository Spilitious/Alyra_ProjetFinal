// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


contract VoteFactory  {

    //error ErrorAlreadyVoted(string msgError);
   
    error ErrorNotVoter(string msgError);
    error ErrorVoteClosed(string msgError);
    error ErrorNotAllowedToVote(string msgError);
    error ErrorHasVoted(string msgError);
    error ErrorVoteUnknown(string msgError);

   
    event SetVoteEvent(address voter, uint voteIndex, uint choice);
   

    struct Voter {
        uint registrationTime;
        uint tokenAmount;
    }

    struct Vote {
        uint idFile;
        uint creationTime;
        uint yes;
        uint no;
       
    }

    Vote[] Votes;
    mapping (address => Voter) mapVoter;
    mapping(uint => mapping(address => bool)) hasVoted;

   

    uint constant votingDelay = 3 seconds;

    constructor () {
       
    }


    function getVote(uint _index) external view returns(Vote memory) {
        return Votes[_index];
    }

    function getVotes() external view returns(Vote[] memory) {
        return Votes;
    }

    function getVoter(address _addr) external view returns(Voter memory) {
        return mapVoter[_addr];
    }

    function getHasVoted(uint _index, address _addr) external view returns(bool) {
        return hasVoted[_index][_addr];
    }



    function setVote(uint _index, uint _choice) external {
        if(Votes.length <= _index)
            revert ErrorVoteUnknown("This votes doesn't exist");

        if(mapVoter[msg.sender].tokenAmount == 0)
            revert ErrorNotVoter("Not a voter");
    
        if(hasVoted[_index][msg.sender])
            revert ErrorHasVoted("Already Voted");

        if(Votes[_index].creationTime < mapVoter[msg.sender].registrationTime)
            revert ErrorNotAllowedToVote("This vote has started before you become a voter");

        if( block.timestamp > Votes[_index].creationTime + votingDelay)
            revert ErrorVoteClosed("This vote is closed");


        if(_choice == 0)
            Votes[_index].no++;
        if(_choice == 1)
            Votes[_index].yes++;
        
        hasVoted[_index][msg.sender] = true;

        emit SetVoteEvent(msg.sender, _index, _choice);
   
    }




}