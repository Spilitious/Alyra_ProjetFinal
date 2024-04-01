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
| kind | enum DepositFactory.DepositType | The type of deposit (fileDeposit, contestDeposit, voteDeposit) |
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
  contestDeposit,
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

### CreateNewCaseEvent

```solidity
event CreateNewCaseEvent(uint256 index, address owner, uint256 creationTime)
```

### SimpleResolve

```solidity
event SimpleResolve(uint256 index)
```

### CreateNewContestEvent

```solidity
event CreateNewContestEvent(address owner, uint256 index, enum DiplomaFile.ContestationProof proof)
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

```solidity
enum AuthStatus {
  pending,
  validated,
  disputed,
  rejected
}
```

### File

```solidity
struct File {
  address owner;
  uint256 creationTime;
  enum DiplomaFile.AuthStatus status;
}
```

### ContestationProof

```solidity
enum ContestationProof {
  schoolLetter,
  fullPromo,
  presence,
  other
}
```

### Contest

```solidity
struct Contest {
  address owner;
  uint256 file;
  enum DiplomaFile.ContestationProof Proof;
}
```

### Cases

```solidity
struct DiplomaFile.File[] Cases
```

### Contests

```solidity
struct DiplomaFile.Contest[] Contests
```

### CaseToContest

```solidity
mapping(uint256 => uint256) CaseToContest
```

### CaseToDeposit

```solidity
mapping(uint256 => uint256) CaseToDeposit
```

### CaseToDiploma

```solidity
mapping(uint256 => uint256) CaseToDiploma
```

### CaseToContestDeposit

```solidity
mapping(uint256 => uint256) CaseToContestDeposit
```

### CaseToVote

```solidity
mapping(uint256 => uint256) CaseToVote
```

### contestDelay

```solidity
uint256 contestDelay
```

### price

```solidity
uint256 price
```

### fee

```solidity
uint256 fee
```

### constructor

```solidity
constructor(contract RealDiplomaToken _token, address _daoAddress) public
```

### getCases

```solidity
function getCases() external view returns (struct DiplomaFile.File[])
```

### getCase

```solidity
function getCase(uint256 _index) external view returns (struct DiplomaFile.File)
```

### getContests

```solidity
function getContests() external view returns (struct DiplomaFile.Contest[])
```

### getContest

```solidity
function getContest(uint256 _index) external view returns (struct DiplomaFile.Contest)
```

### getDepositFromCaseIndex

```solidity
function getDepositFromCaseIndex(uint256 _index) external view returns (struct DepositFactory.Deposit)
```

### getDiplomaFromCaseIndex

```solidity
function getDiplomaFromCaseIndex(uint256 _index) external view returns (struct DiplomaFactory.Diploma)
```

### getContestFromCaseIndex

```solidity
function getContestFromCaseIndex(uint256 _index) external view returns (struct DiplomaFile.Contest)
```

### getContestDepositFromCaseIndex

```solidity
function getContestDepositFromCaseIndex(uint256 _index) external view returns (struct DepositFactory.Deposit)
```

### getVoteFromCaseIndex

```solidity
function getVoteFromCaseIndex(uint256 _index) external view returns (struct VoteFactory.Vote)
```

### getBonus

```solidity
function getBonus() public pure returns (uint256)
```

### createCase

```solidity
function createCase(string _lastName, string _firstName, uint256 _birthday, string _school, string _diplomaName, uint256 _diplomaDate) external
```

### contestCase

```solidity
function contestCase(uint256 _fileIndex, enum DiplomaFile.ContestationProof _proof) external
```

### simpleResolve

```solidity
function simpleResolve(uint256 _index) external
```

### resolveAfterVote

```solidity
function resolveAfterVote(uint256 _fileIndex) external
```

### becomeVoter

```solidity
function becomeVoter(uint256 _amount) external
```

### getRewardFromVote

```solidity
function getRewardFromVote(uint256 _index) external
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

### ErrorNotVoter

```solidity
error ErrorNotVoter(string msgError)
```

### ErrorVoteClosed

```solidity
error ErrorVoteClosed(string msgError)
```

### ErrorNotAllowedToVote

```solidity
error ErrorNotAllowedToVote(string msgError)
```

### ErrorHasVoted

```solidity
error ErrorHasVoted(string msgError)
```

### ErrorVoteUnknown

```solidity
error ErrorVoteUnknown(string msgError)
```

### SetVoteEvent

```solidity
event SetVoteEvent(address voter, uint256 voteIndex, uint256 choice)
```

### Voter

```solidity
struct Voter {
  uint256 registrationTime;
  uint256 tokenAmount;
}
```

### Reward

```solidity
struct Reward {
  bool hasVoted;
  bool hasClaimed;
}
```

### Vote

```solidity
struct Vote {
  uint256 idFile;
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

### mapVoter

```solidity
mapping(address => struct VoteFactory.Voter) mapVoter
```

### VoteToReward

```solidity
mapping(uint256 => mapping(address => struct VoteFactory.Reward)) VoteToReward
```

### votingDelay

```solidity
uint256 votingDelay
```

### constructor

```solidity
constructor() public
```

### getVote

```solidity
function getVote(uint256 _index) external view returns (struct VoteFactory.Vote)
```

### getVotes

```solidity
function getVotes() external view returns (struct VoteFactory.Vote[])
```

### getVoter

```solidity
function getVoter(address _addr) external view returns (struct VoteFactory.Voter)
```

### getHasVoted

```solidity
function getHasVoted(uint256 _index, address _addr) external view returns (bool)
```

### getHasClaimed

```solidity
function getHasClaimed(uint256 _index, address _addr) external view returns (bool)
```

### setVote

```solidity
function setVote(uint256 _index, uint256 _choice) external
```

