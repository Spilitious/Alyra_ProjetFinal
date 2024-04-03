# Solidity API

## DepositFactory

### NotYourStack

```solidity
error NotYourStack(string ErrorMsg)
```

Revert if not the owner of the stack

### CreateNewDepositEvent

```solidity
event CreateNewDepositEvent(address owner, uint256 idDeposit, enum DepositFactory.DepositType kind, uint256 amount)
```

Event emitted when a new deposit is created

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The address of the deposit owner |
| idDeposit | uint256 | The identifier of the deposit |
| kind | enum DepositFactory.DepositType | The type of deposit (fileDeposit, DisputeDeposit, voteDeposit) |
| amount | uint256 | The amount of the deposit |

### CloseDepositEvent

```solidity
event CloseDepositEvent(address owner, uint256 idDeposit, uint256 amount)
```

Event emitted when a deposit is closed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The address of the deposit owner |
| idDeposit | uint256 | The identifier of the deposit |
| amount | uint256 | The amount withdrawn from the deposit |

### ExecuteDealingEvent

```solidity
event ExecuteDealingEvent(uint256 indexLoserDeposit, uint256 indexWinnerDeposit, uint256 bonus)
```

Event emitted when a transfer transaction is executed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| indexLoserDeposit | uint256 | The index of the deposit sending the bonus |
| indexWinnerDeposit | uint256 | The index of the deposit receiving the bonus |
| bonus | uint256 | The address to which the transferred funds are sent |

### DepositType

Enum representing the types of deposits

```solidity
enum DepositType {
  fileDeposit,
  DisputeDeposit,
  voteDeposit
}
```

### Deposit

Struct representing a deposit

```solidity
struct Deposit {
  address owner;
  enum DepositFactory.DepositType depositType;
  uint256 amount;
}
```

### RdaToken

```solidity
contract RealDiplomaToken RdaToken
```

The ERC20 token contract used for deposits

### Deposits

```solidity
struct DepositFactory.Deposit[] Deposits
```

Array containing all deposits made

### daoAddress

```solidity
address daoAddress
```

Address of the Decentralized Autonomous Organization

### constructor

```solidity
constructor(contract RealDiplomaToken _token, address _daoAddress) public
```

Constructor function to initialize the contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _token | contract RealDiplomaToken | The address of the RealDiplomaToken contract |
| _daoAddress | address | The address of the DAO (Decentralized Autonomous Organization) |

### getDeposits

```solidity
function getDeposits() external view returns (struct DepositFactory.Deposit[])
```

Function to retrieve all deposits

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct DepositFactory.Deposit[] | An array containing all deposits made |

### getDeposit

```solidity
function getDeposit(uint256 _index) external view returns (struct DepositFactory.Deposit)
```

Function to retrieve a specific deposit

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the deposit to retrieve |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct DepositFactory.Deposit | The deposit at the specified index |

### createNewDeposit

```solidity
function createNewDeposit(enum DepositFactory.DepositType _type, uint256 _amount, uint256 _cut) internal
```

Function to create a new deposit

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _type | enum DepositFactory.DepositType | The type of deposit |
| _amount | uint256 | The amount to be deposited |
| _cut | uint256 | The percentage cut to be taken as fees |

### closeDeposit

```solidity
function closeDeposit(uint256 _index) internal
```

Function to close a deposit and withdraw the deposited amount

_Only the owner of the deposit can close it_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the deposit to be closed |

### executeDealing

```solidity
function executeDealing(uint256 _indexLoserDeposit, uint256 _indexWinnerDeposit, uint256 _bonus) internal
```

Function to execute a dealing between two deposits

_This function redistributes funds from the losing deposit to the winning deposit_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _indexLoserDeposit | uint256 | The index of the losing deposit |
| _indexWinnerDeposit | uint256 | The index of the winning deposit |
| _bonus | uint256 | The bonus amount to be added to the winning deposit |

## DiplomaFactory

Contract for managing diplomas

### CreateNewDiplomaEvent

```solidity
event CreateNewDiplomaEvent(uint256 index, string lastName, string firstName, uint256 birthday, string school, string diplomaName, uint256 diplomaDate)
```

Event triggered when a new diploma is created

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 | The index of the newly created diploma in the array |
| lastName | string | The last name of the diploma holder |
| firstName | string | The first name of the diploma holder |
| birthday | uint256 | The birthday of the diploma holder |
| school | string | The name of the school |
| diplomaName | string | The name of the diploma |
| diplomaDate | uint256 | The date of issuance of the diploma |

### Diploma

Struct representing a Diploma

```solidity
struct Diploma {
  string lastName;
  string firstName;
  uint256 birthday;
  string school;
  string diplomaName;
  uint256 diplomaDate;
}
```

### Diplomas

```solidity
struct DiplomaFactory.Diploma[] Diplomas
```

Array containing all the diplomas created by the contract

### constructor

```solidity
constructor() public
```

### getDiploma

```solidity
function getDiploma(uint256 _index) external view returns (struct DiplomaFactory.Diploma)
```

Get a diploma by index

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the diploma |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct DiplomaFactory.Diploma | Diploma The diploma object |

### getDiplomas

```solidity
function getDiplomas() external view returns (struct DiplomaFactory.Diploma[])
```

Get all diplomas

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct DiplomaFactory.Diploma[] | Diploma[] An array of all diplomas |

### createNewDiploma

```solidity
function createNewDiploma(string _lastName, string _firstName, uint256 _birthday, string _school, string _diplomaName, uint256 _diplomaDate) internal
```

Internal function to create a new diploma

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _lastName | string | The last name of the diploma holder |
| _firstName | string | The first name of the diploma holder |
| _birthday | uint256 | The birthday of the diploma holder |
| _school | string | The name of the school |
| _diplomaName | string | The name of the diploma |
| _diplomaDate | uint256 | The date of issuance of the diploma |

## DiplomaFile

### ErrorNotValidated

```solidity
error ErrorNotValidated(string msgError)
```

### ErrorCaseUnknown

```solidity
error ErrorCaseUnknown(string msgError)
```

### ErrorNotUnlockYet

```solidity
error ErrorNotUnlockYet(uint256 msgError)
```

### ErrorNotYourCase

```solidity
error ErrorNotYourCase(uint256 msgError)
```

### ErrorCaseNotPending

```solidity
error ErrorCaseNotPending(string msgError)
```

### ErrorCaseNotDisputed

```solidity
error ErrorCaseNotDisputed(string msgError)
```

### ErrorVoteInProgress

```solidity
error ErrorVoteInProgress(string msgError)
```

### ErrorAlreadyVoter

```solidity
error ErrorAlreadyVoter(string msgError)
```

### ErrorNoReward

```solidity
error ErrorNoReward(string msgError)
```

### ErrorCaseNotResolved

```solidity
error ErrorCaseNotResolved(string msgError)
```

### ErrorAmountMin

```solidity
error ErrorAmountMin(string msgError)
```

### CreateNewCaseEvent

```solidity
event CreateNewCaseEvent(uint256 index, address owner, uint256 creationTime)
```

### SimpleResolve

```solidity
event SimpleResolve(uint256 index)
```

### CreateNewDisputeEvent

```solidity
event CreateNewDisputeEvent(address owner, uint256 index, enum DiplomaFile.DisputeProof proof)
```

### ResolveAfterVoteEvent

```solidity
event ResolveAfterVoteEvent(uint256 indexFile, enum DiplomaFile.AuthStatus status)
```

### BecomeVoterEvent

```solidity
event BecomeVoterEvent(address voter, uint256 amount)
```

### GetRewardEvent

```solidity
event GetRewardEvent(address voter, uint256 amount)
```

### AuthStatus

Enumeration of different authentication statuses for a file

```solidity
enum AuthStatus {
  pending,
  validated,
  disputed,
  rejected
}
```

### File

Structure representing a file

```solidity
struct File {
  address owner;
  enum DiplomaFile.AuthStatus status;
  uint256 creationTime;
}
```

### DisputeProof

Enumeration of different types of dispute proofs

```solidity
enum DisputeProof {
  schoolLetter,
  fullPromo,
  presence,
  other
}
```

### Dispute

Structure representing a dispute

```solidity
struct Dispute {
  address owner;
  enum DiplomaFile.DisputeProof Proof;
}
```

### Cases

```solidity
struct DiplomaFile.File[] Cases
```

### Disputes

```solidity
struct DiplomaFile.Dispute[] Disputes
```

### CaseToDispute

```solidity
mapping(uint256 => uint256) CaseToDispute
```

Maps a case to its associated dispute ID.

### CaseToDeposit

```solidity
mapping(uint256 => uint256) CaseToDeposit
```

Maps a case to its associated deposit ID.

### CaseToDiploma

```solidity
mapping(uint256 => uint256) CaseToDiploma
```

Maps a case to its associated diploma ID.

### CaseToDisputeDeposit

```solidity
mapping(uint256 => uint256) CaseToDisputeDeposit
```

Maps a case to its associated dispute deposit ID.

### CaseToVote

```solidity
mapping(uint256 => uint256) CaseToVote
```

Maps a case to its associated vote ID.

### DisputeDelay

```solidity
uint256 DisputeDelay
```

The delay (in seconds) during a dispute can be initiated after a case is created.

### votingDelay

```solidity
uint256 votingDelay
```

The delay (in seconds) for voting after a dispute is initiated.

### price

```solidity
uint256 price
```

The price (in wei) required for create a case and dispute a case.

### fee

```solidity
uint256 fee
```

The fee (in percentage) applied to certain transactions.

### constructor

```solidity
constructor(contract RealDiplomaToken _token, address _daoAddress) public
```

### getCases

```solidity
function getCases() external view returns (struct DiplomaFile.File[])
```

Retrieves all cases.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct DiplomaFile.File[] | An array of File structs representing all cases. |

### getCase

```solidity
function getCase(uint256 _index) external view returns (struct DiplomaFile.File)
```

Retrieves a specific case by index.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the case to retrieve. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct DiplomaFile.File | The File struct representing the case at the specified index. |

### getDisputes

```solidity
function getDisputes() external view returns (struct DiplomaFile.Dispute[])
```

Retrieves all disputes.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct DiplomaFile.Dispute[] | An array of Dispute structs representing all disputes. |

### getDispute

```solidity
function getDispute(uint256 _index) external view returns (struct DiplomaFile.Dispute)
```

Retrieves a specific dispute by index.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the dispute to retrieve. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct DiplomaFile.Dispute | The Dispute struct representing the dispute at the specified index. |

### getDepositFromCaseIndex

```solidity
function getDepositFromCaseIndex(uint256 _index) external view returns (struct DepositFactory.Deposit)
```

Retrieves the deposit associated with a specific case index.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the case for which to retrieve the deposit. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct DepositFactory.Deposit | The Deposit struct representing the deposit associated with the specified case index. |

### getDiplomaFromCaseIndex

```solidity
function getDiplomaFromCaseIndex(uint256 _index) external view returns (struct DiplomaFactory.Diploma)
```

Retrieves the diploma associated with a specific case index.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the case for which to retrieve the diploma. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct DiplomaFactory.Diploma | The Diploma struct representing the diploma associated with the specified case index. |

### getDisputeFromCaseIndex

```solidity
function getDisputeFromCaseIndex(uint256 _index) external view returns (struct DiplomaFile.Dispute)
```

Retrieves the dispute associated with a specific case index.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the case for which to retrieve the dispute. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct DiplomaFile.Dispute | The Dispute struct representing the dispute associated with the specified case index. |

### getDisputeDepositFromCaseIndex

```solidity
function getDisputeDepositFromCaseIndex(uint256 _index) external view returns (struct DepositFactory.Deposit)
```

Retrieves the deposit associated with a specific case index's dispute.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the case for which to retrieve the dispute deposit. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct DepositFactory.Deposit | The Deposit struct representing the dispute deposit associated with the specified case index. |

### getVoteFromCaseIndex

```solidity
function getVoteFromCaseIndex(uint256 _index) external view returns (struct VoteFactory.Vote)
```

Retrieves the vote associated with a specific case index.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the case for which to retrieve the vote. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VoteFactory.Vote | The Vote struct representing the vote associated with the specified case index. |

### getBonus

```solidity
function getBonus() public pure returns (uint256)
```

Calculates the bonus amount.

_This function is public and pure._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The bonus amount, which is half of the price excluding taxes. |

### setDisputeDelay

```solidity
function setDisputeDelay(uint256 _delay) external
```

Sets the dispute delay.

_This function can only be called by the owner._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _delay | uint256 | The new dispute delay value to be set. |

### setVotingDelay

```solidity
function setVotingDelay(uint256 _votingDelay) external
```

Sets the voting delay.

_This function can only be called by the owner._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _votingDelay | uint256 | The new voting delay value to be set. |

### createCase

```solidity
function createCase(string _lastName, string _firstName, uint256 _birthday, string _school, string _diplomaName, uint256 _diplomaDate) external
```

Creates a new case.

_This function creates a new case, initiates a deposit for the case, and creates a new diploma._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _lastName | string | The last name of the person associated with the case. |
| _firstName | string | The first name of the person associated with the case. |
| _birthday | uint256 | The birthday of the person associated with the case. |
| _school | string | The school associated with the case. |
| _diplomaName | string | The name of the diploma associated with the case. |
| _diplomaDate | uint256 | The date of the diploma associated with the case. |

### disputeCase

```solidity
function disputeCase(uint256 _fileIndex, enum DiplomaFile.DisputeProof _proof) external
```

Disputes a case.

_This function allows a user to dispute a case by providing a dispute proof._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _fileIndex | uint256 | The index of the file associated with the dispute. |
| _proof | enum DiplomaFile.DisputeProof | The proof provided for the dispute. |

### simpleResolve

```solidity
function simpleResolve(uint256 _index) external
```

Resolves a case without dispute.

_This function resolves a case without dispute by closing the associated deposit and setting the case status to "validated"._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the case to resolve. |

### resolveAfterVote

```solidity
function resolveAfterVote(uint256 _fileIndex) external
```

Resolves a disputed case after the voting period has ended.

_This function resolves a disputed case after the voting period has ended by executing appropriate actions based on the voting results._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _fileIndex | uint256 | The index of the disputed case to resolve. |

### becomeVoter

```solidity
function becomeVoter(uint256 _amount) external
```

Allows an address to become a voter by depositing tokens.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _amount | uint256 | The amount of tokens to deposit for becoming a voter. |

### setVote

```solidity
function setVote(uint256 _index, uint256 _choice) external
```

Sets the vote choice for the specified index.

_This function is external._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the vote. |
| _choice | uint256 | The choice to be set (0 for no, 1 for yes). |

### getRewardFromVote

```solidity
function getRewardFromVote(uint256 _index) external
```

Allows a voter to claim their reward for participating in a vote.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the case associated with the vote. |

## DiplomaNft

### ErrorCaseNotValidated

```solidity
error ErrorCaseNotValidated(string msgError)
```

### ErrorNotYourCase

```solidity
error ErrorNotYourCase(string msgError)
```

### ErrorAlreadyMinted

```solidity
error ErrorAlreadyMinted(string msgError)
```

### ErrorCaseUnknown

```solidity
error ErrorCaseUnknown(string msgError)
```

### MintNftEvent

```solidity
event MintNftEvent(uint256 index)
```

### DiplomaFileContract

```solidity
contract DiplomaFile DiplomaFileContract
```

### RdaNft

```solidity
struct RdaNft {
  uint256 validationDate;
  string lastName;
  string firstName;
  uint256 birthday;
  string school;
  string diplomaName;
  uint256 diplomaDate;
}
```

### RealDiplomaNfts

```solidity
struct DiplomaNft.RdaNft[] RealDiplomaNfts
```

### constructor

```solidity
constructor(address _diplomaFileAddress) public
```

### getRdaNft

```solidity
function getRdaNft(uint256 _index) external view returns (struct DiplomaNft.RdaNft)
```

### mintDiploma

```solidity
function mintDiploma(uint256 _indexFile) external returns (uint256)
```

## RealDiplomaToken

RealDiplomaToken is an ERC20 token serving the RealDiploma protocol.

### maxSupply

```solidity
uint256 maxSupply
```

Maximum supply of the token

### constructor

```solidity
constructor() public
```

Constructor function for RealDiplomaToken.

### mint

```solidity
function mint(address _to, uint256 _amount) external
```

Mint additional tokens and send them to the specified address.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _to | address | The address to which the minted tokens will be sent. |
| _amount | uint256 | The amount of tokens to mint. |

## VoteFactory

A contract for managing voting operations on disputed cases.

### ErrorNotVoter

```solidity
error ErrorNotVoter(string msgError)
```

Errors
Error thrown when a voter is not registered.

### ErrorVoteClosed

```solidity
error ErrorVoteClosed(string msgError)
```

Error thrown when attempting to vote in a closed vote.

### ErrorNotAllowedToVote

```solidity
error ErrorNotAllowedToVote(string msgError)
```

Error thrown when a voter is not allowed to vote (registered too late)

### ErrorHasVoted

```solidity
error ErrorHasVoted(string msgError)
```

Error thrown when a voter has already voted.

### ErrorVoteUnknown

```solidity
error ErrorVoteUnknown(string msgError)
```

Error thrown when attempting to interact with an unknown vote.

### SetVoteEvent

```solidity
event SetVoteEvent(address voter, uint256 voteIndex, uint256 choice)
```

Events
Event emitted when a vote is cast.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| voter | address | The address of the voter. |
| voteIndex | uint256 | The index of the vote. |
| choice | uint256 | The choice made by the voter (e.g., yes or no). |

### Voter

Structure representing a voter.

```solidity
struct Voter {
  uint256 registrationTime;
  uint256 tokenAmount;
}
```

### Reward

Structure representing a reward.

```solidity
struct Reward {
  bool hasVoted;
  bool hasClaimed;
}
```

### Vote

Structure representing a vote.

```solidity
struct Vote {
  uint256 creationTime;
  uint256 yes;
  uint256 no;
  uint256 totalTokenSquare;
}
```

### Votes

```solidity
struct VoteFactory.Vote[] Votes
```

State variables

### mapVoter

```solidity
mapping(address => struct VoteFactory.Voter) mapVoter
```

### VoteToReward

```solidity
mapping(uint256 => mapping(address => struct VoteFactory.Reward)) VoteToReward
```

### constructor

```solidity
constructor() public
```

### getVote

```solidity
function getVote(uint256 _index) external view returns (struct VoteFactory.Vote)
```

Returns the vote at the specified index.

_This function is external and view._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the vote to retrieve. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VoteFactory.Vote | The vote at the specified index. |

### getVotes

```solidity
function getVotes() external view returns (struct VoteFactory.Vote[])
```

Returns all the votes.

_This function is external and view._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VoteFactory.Vote[] | An array containing all the struct Vote. |

### getVoter

```solidity
function getVoter(address _addr) external view returns (struct VoteFactory.Voter)
```

Returns the voter information for the specified address.

_This function is external and view._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _addr | address | The address of the voter. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct VoteFactory.Voter | The voter information. |

### getHasVoted

```solidity
function getHasVoted(uint256 _index, address _addr) external view returns (bool)
```

Checks if the specified address has voted for the given vote index.

_This function is external and view._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the vote. |
| _addr | address | The address to check. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if the address has voted, otherwise false. |

### getHasClaimed

```solidity
function getHasClaimed(uint256 _index, address _addr) external view returns (bool)
```

Checks if the specified address has claimed the reward for the given vote index.

_This function is external and view._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the vote. |
| _addr | address | The address to check. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if the address has claimed the reward, otherwise false. |

