const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require('hardhat');

require("@nomicfoundation/hardhat-toolbox/network-helpers");

let user0, user1, user2, nonUser1, nonUser2,nonUser3, voter1, voter2, voter3, daoAddress; 
let diplomaFile, rda, diplomaNFT;
let timestamp;
let price, priceHT, fees, bonus;
//Test pour changer quelque chose 

/* ************************************************************************ Fixture ************************************************************************ */

async function LoadFixtureForCreateCase() {
    
    //user0 1000 token - Owner du contrat RealDiplomaToken
    //user1 1000 token
    //user2 1000 token 
    
    //nonUser1 possède des tokens mais n'a pas d'allowance
    //nonUser2 possède une allowance mais n'a pas de token
    //nonUser3 possède juste assez de token et d'allowance pour déposer un dossier mais manque les fees

    //Voter1 avec 100 tokens bloqués 
    //Voter2 avec 200 tokens bloqués
    //Voter3 avec 300 tokens bloqués

    [user0, user1, user2, nonUser1, nonUser2, nonUser3, voter1, voter2, voter3, daoAddress] = await ethers.getSigners();

    //Deploiement RealDiplomaToken
    rda = await ethers.getContractFactory("RealDiplomaToken");
    rda = await rda.deploy();
    await rda.waitForDeployment();

    //Deploiement diplomaFile
    diplomaFile = await ethers.getContractFactory("DiplomaFile");
    diplomaFile = await diplomaFile.deploy(rda.target, daoAddress);
    await diplomaFile.waitForDeployment();

    //Deploiement DiplomaNFT
    diplomaNFT = await ethers.getContractFactory("DiplomaNft");
    diplomaNFT = await diplomaNFT.deploy(diplomaFile.target);
    await diplomaNFT.waitForDeployment();
    
    await diplomaFile.setDisputeDelay(3);
    await diplomaFile.setVotingDelay(5);

    //Distribution de token et allowance
    await rda.approve(diplomaFile.target, ethers.parseEther('1000'));
    await rda.mint(user1, 1000);
    await rda.connect(user1).approve(diplomaFile.target, ethers.parseEther('1000'));
    await rda.mint(user2, 1000);
    await rda.connect(user2).approve(diplomaFile.target, ethers.parseEther('1000'));
    await rda.mint(nonUser1, 1000);
    await rda.connect(nonUser2).approve(diplomaFile.target, ethers.parseEther('1000'));
    //await rda.mint(nonUser3, priceHT);
    //await rda.connect(nonUser3).approve(diplomaFile.target, priceHT);
    await rda.mint(voter1, 100);
    await rda.connect(voter1).approve(diplomaFile.target, ethers.parseEther('100'));
    await rda.mint(voter2,200);
    await rda.connect(voter2).approve(diplomaFile.target, ethers.parseEther('200'));
    await rda.mint(voter3, 300);
    await rda.connect(voter3).approve(diplomaFile.target, ethers.parseEther('300'));

    //Creation d'une date arbitraire en secondes pour enregistrement des dossiers
    const date = new Date("2000-01-01"); 
    timestamp = Math.floor(date.getTime() / 1000); 

    //Récupération des constantes de DiplomaFile
    price = await diplomaFile.price();
    const fee = await  diplomaFile.fee();
    bonus = await diplomaFile.getBonus();
    fees = (price*fee)/BigInt(100);
    priceHT = price - fees;
}

async function LoadFixtureForDisputeCase() {
    // user0 crée un premier dossier - dossier 0 qui ne sera pas Disputeé
    await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
    // user1 crée un deuxième dossier qui sera Disputeé puis validé
    await diplomaFile.connect(user1).createCase("Cyr", "Ben", timestamp, "Disputed", "Valid", timestamp);
    // user1 crée un troisième dossier qui sera Disputeé puis rejeté
    await diplomaFile.connect(user1).createCase("Cheater", "Long", timestamp, "Disputed", "Reject", timestamp);
}

async function LoadFixtureForVoting() {

    
    // voter1 & voter2 sont enregistré en tant que voter avant la Disputeation des dossier et pourront donc voter sur tous les dossiers
    await diplomaFile.connect(voter1).becomeVoter(ethers.parseEther('100'));
    await diplomaFile.connect(voter2).becomeVoter(ethers.parseEther('200'));
    
    await LoadFixtureForDisputeCase();
    // user3 Disputee le dossier 1 avec la preuve 0
    await diplomaFile.connect(user2).disputeCase(1,0);

    // voter3 est enregistré après la contetation du dossier 0 et ne pourra donc pas voter pour ce dossier
    await diplomaFile.connect(voter3).becomeVoter(ethers.parseEther('300'));

    //user2 Disputee le dossier 2 avec la preuve 1
    await diplomaFile.connect(user2).disputeCase(2,1);
}

async function LoadFixtureForResolving() {
    
    await LoadFixtureForVoting();
    // voter1 vote yes pour le litige du dossier 1 et pour le litige du dossier 2
    await diplomaFile.connect(voter1).setVote(1,1);
    await diplomaFile.connect(voter1).setVote(2,1);
    
    // voter2 vote yes pour le litige du dossier 1 et no pour le litige du dossier 2
    await diplomaFile.connect(voter2).setVote(1,1);
    await diplomaFile.connect(voter2).setVote(2,0);

    // voter3 vote no pour le litige du dossier 2 
    await diplomaFile.connect(voter3).setVote(2,0);
}

async function LoadFixtureForReward() {
    
    await LoadFixtureForResolving();
    // user1 a son premier dossier validé et lance la résolution 
    await diplomaFile.connect(user1).resolveAfterVote(1);
    // user1 a son deuxième dossier rejecté, user2 qui l'a Disputeé lance la résolution
    //await diplomaFile.connect(user2).resolveAfterVote(2);
}

/* ****************************************************************** TESTING ************************************************************************** */
/******************************************************************************************************************************************************* */

describe("TEST", function () {
   
    beforeEach(async function() {
        await LoadFixtureForCreateCase();
  
     });


    
   /* **************************************************************  Déploiement   ******************************************************************** */
    describe("Deployment 3 contracts", function() {

        describe("RealDiplomaToken Deployment", function() {
       
            it('should revert because not the owner', async function() {
                await expect(rda.connect(user1).mint(user1, 1000))
                    .to.be.revertedWithCustomError(rda, "OwnableUnauthorizedAccount");
            });
    
            it('should get _totalSupply', async function() {
                expect(await rda.connect(user1).maxSupply()).to.be.equal(BigInt(10**7))
                  
            });
        });
    
    
        describe("DiplomaFile Deployment", function() {
           
            it('price should be equal to variable price', async function() {
                expect(await diplomaFile.price()).to.be.equal(price);
            });
        });
    
        describe("DiplomaNFT Deployment", function() {
           
            it('name should be equal to RealDiplomaNFT', async function() {
                expect(await diplomaNFT.name()).to.be.equal("RealDiplomaNFT");
            });
    
        });
    
    });
    
   /* ******************************************************* Create Case  ******************************************************************** */
   describe("Phase 1 : BecomeVoter & CreateFile", function () {

        describe("Function becomeAVoter", function () {
        
            it('should revert cause of Allowance', async function() {
                await expect(diplomaFile.connect(nonUser1).becomeVoter(ethers.parseEther('200')))
                    .to.be.revertedWithCustomError( rda,"ERC20InsufficientAllowance")
                    .withArgs(diplomaFile.target, 0, ethers.parseEther('200'));
            }); 


            it('should revert cause of nonUser2 has no token', async function() {
                await expect(diplomaFile.connect(nonUser2).becomeVoter(ethers.parseEther('200')))
                    .to.be.revertedWithCustomError( rda,"ERC20InsufficientBalance")
                    .withArgs(nonUser2, 0,ethers.parseEther('200'));
            }); 

            it('should revert cause already a voter', async function() {
                diplomaFile.connect(voter1).becomeVoter(ethers.parseEther('100'))
                await expect(diplomaFile.connect(voter1).becomeVoter(ethers.parseEther('100')))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorAlreadyVoter")
                    .withArgs("Already a voter");
            }); 

            it('should revert cause too small amount', async function() {
                await expect(diplomaFile.connect(voter1).becomeVoter(ethers.parseEther('9')))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorAmountMin")
                    .withArgs("Minimum deposit amount is 10 tokens");
            }); 

            it('should add one Deposit to Deposits', async function() {
                await diplomaFile.connect(voter1).becomeVoter(ethers.parseEther('100'));
                expect((await diplomaFile.getDeposits()).length).to.be.equal(1);
            });


            it('should add one Deposit with the good parameters', async function() {
                await diplomaFile.connect(voter1).becomeVoter(ethers.parseEther('100'));
                let [sender, type, amount] = await diplomaFile.connect(user1).getDeposit(0);
                expect(sender).to.be.equal(voter1);
                expect(type).to.be.equal(2);
                expect(amount).to.be.equal(ethers.parseEther('100'));
        
            });


            it('should set the mapping mapVoters', async function() {
                await diplomaFile.connect(voter1).becomeVoter(ethers.parseEther('100'));
                expect((await diplomaFile.getVoter(voter1)).tokenAmount).to.be.equal(ethers.parseEther('100'));
            });


            it('should emit : CreateNewDepositEvent', async function() {
                await expect(diplomaFile.connect(voter2).becomeVoter(ethers.parseEther('200'))).to.emit( diplomaFile,"CreateNewDepositEvent")
                .withArgs(voter2, 0, 2, ethers.parseEther('200'));
        
            });
    

            it('should emit : BecomeAVoter', async function() {
                await expect(diplomaFile.connect(voter2).becomeVoter(ethers.parseEther('200'))).to.emit( diplomaFile,"BecomeVoterEvent")
                .withArgs(voter2, ethers.parseEther('200'));
        
            });

        });   
    
    
        describe("Function createCase", function () {
    
            it('should revert cause nonUser1 has no allowance', async function() {
                await expect(diplomaFile.connect(nonUser1).createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp))
                    .to.be.revertedWithCustomError( rda,"ERC20InsufficientAllowance")
                    .withArgs(diplomaFile.target, 0, priceHT);

            }); 

            it('should revert cause of nonUser2 has priceHT token, not enough to pay the fees', async function() {
                await rda.mint(nonUser2, 90);
                await expect(diplomaFile.connect(nonUser2).createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp))
                    .to.be.revertedWithCustomError( rda,"ERC20InsufficientBalance")
                    .withArgs(nonUser2, 0, fees);

            }); 

            it('should revert because Nonuser2 has no token', async function() {
                await expect(diplomaFile.connect(nonUser2).createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp))
                    .to.be.revertedWithCustomError(rda, "ERC20InsufficientBalance")
                    .withArgs(nonUser2, 0, priceHT);
            });


            it('should set mapping CaseToDeposit', async function() {
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                expect((await diplomaFile.getDepositFromCaseIndex(0)).owner).to.be.equal(user0);
            });


            it('should set mapping CaseToDiploma', async function() {
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                expect((await diplomaFile.getDiplomaFromCaseIndex(0)).lastName).to.be.equal("Leb");
            });


            it('should add one Deposit to Deposits', async function() {
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                expect((await diplomaFile.getDeposits()).length).to.be.equal(1);
            });


            it('should add one Deposit with the good parameters', async function() {
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                let [sender, type, amount] = await diplomaFile.connect(user1).getDeposit(0);
                expect(sender).to.be.equal(user0);
                expect(type).to.be.equal(0);
                expect(amount).to.be.equal(priceHT);
            });


            it('should add one Diploma to Diplomas', async function() {
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                expect((await diplomaFile.getDiplomas()).length).to.be.equal(1);
            });


            it('should add one Diploma with the good parameters', async function() {
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                let [lastName, firstName, birthday, school, diplomaName, diplomaDate] = await diplomaFile.connect(user1).getDiploma(0);
                expect(lastName).to.be.equal("Leb");
                expect(firstName).to.be.equal("Aur");
                expect(birthday).to.be.equal(timestamp);
                expect(school).to.be.equal("Alyra");
                expect(diplomaName).to.be.equal("Dev");
                expect(diplomaDate).to.be.equal(timestamp);
            });


            it('should add one Case to Cases', async function() {
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                expect((await diplomaFile.getCases()).length).to.be.equal(1);
            });

            it('should send the fees to the daoAddress', async function() {
                let balanceBefore = await rda.balanceOf(daoAddress);
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                const balanceAfter = await rda.balanceOf(daoAddress);
                balanceBefore += fees;
                expect(balanceBefore).to.be.equal(balanceAfter);
            });

            
            it('should add one Case with the good parameters', async function() {
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                let [owner, status] = await diplomaFile.connect(user1).getCase(0);
                expect(owner).to.be.equal(user0);
                expect(status).to.be.equal(0);
            });


            it('should emit 3 events : CreateNewDiplomaEvent, CreateNewDepositEvent, CreateNewFileEvent ', async function() {
                await expect(diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp)).to.emit( diplomaFile,"CreateNewDiplomaEvent")
                .withArgs(0, "Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);

                await expect(diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp)).to.emit( diplomaFile,"CreateNewDepositEvent")
                .withArgs(user0, 1, 0, ethers.parseEther('100'));

                await expect(diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp)).to.emit( diplomaFile,"CreateNewCaseEvent");
                //.withArgs(2, user0, 1 ,0);
            });


        });  


    });

  

   /* ******************************************************* Phase 2 : SimpleResolve & DisputeCase  ******************************************************************** */
       
    describe("Phase 2 : SimpleResolve - DisputeCase - getDispute", function () {

        beforeEach(async function() {
            await LoadFixtureForDisputeCase();
            //await new Promise(resolve => setTimeout(resolve, 6000));
        });

        describe("Function simpleResolve", function () {
            
            it('should revert because the index does not exist in Cases - 1st require', async function() {
                await expect(diplomaFile.simpleResolve(3))
                   .to.be.revertedWithCustomError( diplomaFile,"ErrorCaseUnknown")
                   .withArgs("This file doesn't exist");
            }); 
        

            it('should revert because the delay is not past yet', async function() {
                await expect(diplomaFile.simpleResolve(0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorNotUnlockYet")
            }); 
            

            it('should revert because the case is not pending', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await diplomaFile.simpleResolve(0);
                await expect(diplomaFile.simpleResolve(0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorCaseNotPending")
            }); 
            
            /*    Ne semble pas possible sans dépouiller le contrat donc anormal depuis un script exterieur ******************* 
            it.only('should revert cause the contract has no enough token', async function() {
                await rda.connect(diplomaFile.target).approve(user0, 100);
               // let success = await rda.transferFrom(diplomaFile.target, user0, 100);
                //console.log(success);
                await expect(diplomaFile.simpleResolve(0))
                   .to.be.revertedWithCustomError( rda,"ERC20InsufficientBalance")
               // .withArgs("0x8A791620dd6260079BF849Dc5567aDC3F2FdC318")
               // .withArgs(0)
               // .withArgs(100)
    
            });  */

            it('should revert because user1 is not the owner of the deposit', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await expect(diplomaFile.connect(user1).simpleResolve(0)).to.be.revertedWithCustomError(
                    diplomaFile, "NotYourStack").withArgs("This is not your deposit")
            });
        

            it('should set the deposit of the case to 0', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await diplomaFile.simpleResolve(0);
                expect((await diplomaFile.getDepositFromCaseIndex(0)).amount).to.be.equal(0); 
            });
        
        
            it('should set status to validated', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await diplomaFile.simpleResolve(0);
                expect((await diplomaFile.getCase(0)).status).to.be.equal(1);
            });
            

            it('should emit CloseDepositEvent ', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
               await expect(diplomaFile.simpleResolve(0)).to.emit( diplomaFile,"CloseDepositEvent");
            });


            it('should emit : SimpleResolve ', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
               await expect(diplomaFile.simpleResolve(0)).to.emit( diplomaFile,"SimpleResolve");
            });
           
        });
    
        describe("Function disputeCase", function () {
        
            it('should revert because the index does not exist in Cases - 1st require', async function() {
       
                await expect(diplomaFile.connect(user2).disputeCase(4,0))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorCaseUnknown")
                    .withArgs("This file doesn't exist");
            }); 


            it('should revert because the delay has past', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await expect(diplomaFile.connect(user2).disputeCase(0,0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorCaseNotPending")
                   .withArgs("The delay has past");
            }); 


            it('should revert because the case is already disputed', async function() {
                await diplomaFile.connect(user2).disputeCase(1,0);
                await expect(diplomaFile.disputeCase(1,0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorCaseNotPending")
                   .withArgs("This file is not pending")
            }); 


            it('should revert cause of Allowance', async function() {
                 await expect(diplomaFile.connect(nonUser1).disputeCase(0,0))
                    .to.be.revertedWithCustomError( rda,"ERC20InsufficientAllowance")
                    .withArgs(diplomaFile.target, 0, priceHT);
            }); 


            it('should revert cause of user2 has no token', async function() {
                await expect(diplomaFile.connect(nonUser2).disputeCase(0,0))
                   .to.be.revertedWithCustomError( rda,"ERC20InsufficientBalance")
                   .withArgs(nonUser2, 0, priceHT);
            }); 

       
            it('should add one Deposit to Deposits', async function() {
                await diplomaFile.connect(user2).disputeCase(0,0);
                expect((await diplomaFile.getDeposits()).length).to.be.equal(4);
            });
    

            it('should add one Deposit with the good parameters', async function() {
                await diplomaFile.connect(user2).disputeCase(0,0);
                let [sender, type, amount] = await diplomaFile.connect(user1).getDisputeDepositFromCaseIndex(0);
                expect(sender).to.be.equal(user2);
                expect(type).to.be.equal(1);
                expect(amount).to.be.equal(priceHT);
            });


            it('should set the mapping DisputeToDiploma', async function() {
                await diplomaFile.connect(user2).disputeCase(0,0);
                expect((await diplomaFile.getDisputeFromCaseIndex(0)).owner).to.be.equal(user2);
            });

            it('should add one Dispute to Disputes', async function() {
                await diplomaFile.disputeCase(0,0);
                    expect((await diplomaFile.getDisputes()).length).to.be.equal(1);
            });

            it('should add one Dispute with the good parameters', async function() {
                await diplomaFile.connect(user2).disputeCase(0,0);
                let [sender, proof] = await diplomaFile.connect(user1).getDisputeFromCaseIndex(0);
                expect(sender).to.be.equal(user2);
                expect(proof).to.be.equal(0);
            });

            it('should set the status of the case to disputed', async function() {
                await diplomaFile.connect(user2).disputeCase(0,0);
                expect((await diplomaFile.getCase(0)).status).to.be.equal(2);
            });

            it('should send the fees to the daoAddress', async function() {
                let balanceBefore = await rda.balanceOf(daoAddress);
                await diplomaFile.connect(user2).disputeCase(0,0);
                const balanceAfter = await rda.balanceOf(daoAddress);
                balanceBefore += fees;
                expect(balanceBefore).to.be.equal(balanceAfter);
            });
            

            it('should emit CreateNewDepositEvent', async function() {
                await expect(diplomaFile.connect(user2).disputeCase(0,0)).to.emit( diplomaFile,"CreateNewDepositEvent")
                .withArgs(user2, 3, 1,  ethers.parseEther('100'));
            });


            it('should emit CreateNewDisputeEvent', async function() {
                await expect(diplomaFile.connect(user2).disputeCase(0,0)).to.emit( diplomaFile,"CreateNewDisputeEvent")
                .withArgs(user2, 0, 0);
            });
        

        });

        describe("Function mintDiploma", function () {
        
            it('should revert because the index does not exist in Cases ', async function() {
       
                await expect(diplomaNFT.mintDiploma(5))
                    .to.be.revertedWithCustomError( diplomaNFT,"ErrorCaseUnknown")
                    .withArgs("Unknown case");
            }); 


            it('should revert because the diploma is your own', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await expect(diplomaNFT.connect(user1).mintDiploma(0))
                    .to.be.revertedWithCustomError( diplomaNFT,"ErrorNotYourCase")
                    .withArgs("Not your case");
            }); 


            it('should revert because the diploma is not validated', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await expect(diplomaNFT.mintDiploma(0))
                    .to.be.revertedWithCustomError( diplomaNFT,"ErrorCaseNotValidated")
                    .withArgs("Not Validated");
            }); 


            it('should revert because the diploma is already minted', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await diplomaFile.simpleResolve(0);
                await diplomaNFT.mintDiploma(0);
                await expect(diplomaNFT.mintDiploma(0))
                    .to.be.revertedWithCustomError( diplomaNFT,"ErrorAlreadyMinted")
                    .withArgs("Already minted");
            }); 
            
            it('should create a NFT with the good parameters', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await diplomaFile.simpleResolve(0);
                await diplomaNFT.mintDiploma(0);
                const [, lastName, firstName] = await diplomaNFT.getRdaNft(0);
                expect(lastName).to.be.equal("Leb");
                expect(firstName).to.be.equal("Aur");
            });


            it('should mint the NFT to user0', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await diplomaFile.simpleResolve(0);
                await diplomaNFT.mintDiploma(0);
                expect(await diplomaNFT.ownerOf(1)).to.be.equal(user0);
            });


            it('should emit MintNFTEvent', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await diplomaFile.simpleResolve(0);
                await expect(diplomaNFT.mintDiploma(0)).to.emit( diplomaNFT,"MintNftEvent")
                .withArgs(1);
            });
        

        });

        describe("Function getDispute", function () {
        
            it('should retrun the Dispute ', async function() {
                await diplomaFile.connect(user2).disputeCase(1,1);
                const [owner, proof] = await diplomaFile.getDispute(0);
                expect(owner).to.be.equal(user2);
                expect(proof).to.be.equal(1);
             }); 


        });

        describe("Function getDisputes", function () {
        
            it('should retrun the array of Disputes', async function() {
                    await diplomaFile.connect(user2).disputeCase(1,1);
                    const v = await diplomaFile.getDisputes();
                    const [owner, proof] = v[0];
                    expect(owner).to.be.equal(user2);
                    expect(proof).to.be.equal(1);
            }); 


        });
           

    });

    /*  *********************************************  Phase 3 : setVote & resolveAfterVoting ************************************************************************************* */
    describe("Phase 3 : setVote - getVotes & getVote ", function () {
        
        beforeEach(async function() {
            await LoadFixtureForVoting();
            
        });

        describe("Function setVote", function () {
        
            it('should revert because the index does not exist in Votes', async function() {
       
                await expect(diplomaFile.connect(voter1).setVote(7,0))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorCaseUnknown")
                    .withArgs("This case doesn't exist");
            }); 


            it('should revert because nonUser1 is not a voter', async function() {
                await expect(diplomaFile.connect(nonUser1).setVote(0,0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorNotVoter")
                   .withArgs("Not a voter");
            }); 


            it('should revert because the vote was started before voter3 became a voter', async function() {
                await expect(diplomaFile.connect(voter3).setVote(0,0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorNotAllowedToVote")
                   .withArgs("This vote started before you became a voter");
            }); 


            it('should revert because the vote is close', async function() {
                await new Promise(resolve => setTimeout(resolve, 5000));
                await expect(diplomaFile.connect(voter1).setVote(0,0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorVoteClosed")
                   .withArgs("This vote is closed");
            }); 

            it('should revert because already voted ', async function() {
                await diplomaFile.connect(voter1).setVote(0,0)
                await expect(diplomaFile.connect(voter1).setVote(0,0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorHasVoted")
                   .withArgs("Already Voted");
            }); 

            it('should add one vote for no', async function() {
                
                let [, yes1, no1] = await diplomaFile.getVote(0);
                await diplomaFile.connect(voter1).setVote(0,0);
                let [, yes2, no2] = await diplomaFile.getVote(0);
                no1++;
                expect(yes1).to.be.equal(yes2);
                expect(no1).to.be.equal(no2);
            }); 


            it('should add one vote for yes', async function() {
                
                let [, yes1, no1] = await diplomaFile.getVote(0);
                await diplomaFile.connect(voter1).setVote(0,1);
                let [, yes2, no2] = await diplomaFile.getVote(0);
                yes1++;
                expect(yes1).to.be.equal(yes2);
                expect(no1).to.be.equal(no2);
            }); 


            it('should set hasVoted[voter1][0] to true', async function() {
                await diplomaFile.connect(voter1).setVote(0,1);
                expect(await diplomaFile.getHasVoted(0, voter1)).to.be.equal(true);
            }); 


            it('should add "almost square" to totalTokenSquare', async function() {
                const [,,,tokenBefore] = await diplomaFile.getVote(0);
                await diplomaFile.connect(voter1).setVote(0,1);
                let [,,,tokenAfter] = await diplomaFile.getVote(0);
                expect(tokenAfter).to.be.equal(BigInt(100*10**18));
               

                await diplomaFile.connect(voter2).setVote(0,1);
                [,,,tokenAfter] = await diplomaFile.getVote(0);
                expect(tokenAfter).to.be.equal(BigInt(500*10**18));

            }); 

            it('should emit : SetVoteEvent', async function() {
                await expect(diplomaFile.connect(voter1).setVote(0,1)).to.emit( diplomaFile,"SetVoteEvent")
                .withArgs(voter1, 0, 1);
                
            });
           

        });

        describe("Function getVotes", function () {
        
            it('should retrun the array of votes', async function() {
                    await diplomaFile.connect(voter1).setVote(0,1);
                    const v = await diplomaFile.getVotes();
                    const [, yes, no] = v[0];
                    expect(yes).to.be.equal(1);
                    expect(no).to.be.equal(0);
            }); 


        });


        describe("Function getVoteFromCaseIndex", function () {
        
            it('should return votes[0]', async function() {
                    await diplomaFile.connect(voter1).setVote(0,1);
                    const [, yes, no] = await diplomaFile.getVoteFromCaseIndex(0);
                    expect(yes).to.be.equal(1);
                    expect(no).to.be.equal(0);
            }); 


        });


    }); 

    describe("Phase 4 : resolveAfterVoting", function () {
        
        beforeEach(async function() {
            await LoadFixtureForResolving();
            
        });
        
        describe("Function resolveAfterVoting", function () {
        
            it('should revert because the index does not exist in Votes', async function() {
       
                await expect(diplomaFile.connect(user1).resolveAfterVote(4))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorCaseUnknown")
                    .withArgs("This case doesn't exist");
            }); 


            it('should revert because the vote is not disputed', async function() {
                await expect(diplomaFile.connect(user1).resolveAfterVote(0))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorCaseNotDisputed")
                    .withArgs("This case is not disputed");
            }); 


            it('should revert because the vote is not close yet', async function() {
                await diplomaFile.createCase("Test", "Long", timestamp, "Alyra", "Rejected", timestamp);
                await diplomaFile.connect(user2).disputeCase(3,0);
                await expect(diplomaFile.resolveAfterVote(3))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorVoteInProgress")
                   .withArgs("The vote is not closed yet");
            }); 


            it('should set the status to validated', async function() {
                await new Promise(resolve => setTimeout(resolve, 4000));
                await diplomaFile.connect(user1).resolveAfterVote(1);
                expect((await diplomaFile.getCase(1)).status).to.be.equal(1);
            }); 


            it('should revert cause not the owner of the stack', async function() {
                await new Promise(resolve => setTimeout(resolve, 4000));
               
                
                await expect(diplomaFile.connect(user2).resolveAfterVote(1))
                   .to.be.revertedWithCustomError(diplomaFile,"NotYourStack")
                   .withArgs("This is not your deposit");
            }); 


            it('should transfer the token - case of validation', async function() {
                await new Promise(resolve => setTimeout(resolve, 4000));
                let balanceBefore = await rda.balanceOf(user1);
                await diplomaFile.connect(user1).resolveAfterVote(1);
                const balanceAfter = await rda.balanceOf(user1);
                balanceBefore +=   priceHT + bonus;
                expect(balanceBefore).to.be.equal(balanceAfter);
                expect((await diplomaFile.getDepositFromCaseIndex(1)).amount).to.be.equal(0);
                expect((await diplomaFile.getDisputeDepositFromCaseIndex(1)).amount).to.be.equal(0);
            }); 

            
            it('should set the status to rejected', async function() {
                await new Promise(resolve => setTimeout(resolve, 4000));
                await diplomaFile.connect(user2).resolveAfterVote(2);
                expect((await diplomaFile.getCase(2)).status).to.be.equal(3);
                
            }); 


            it('should revert cause not the owner of the stack', async function() {
                await new Promise(resolve => setTimeout(resolve, 4000));
                await expect(diplomaFile.connect(user1).resolveAfterVote(2))
                   .to.be.revertedWithCustomError(diplomaFile,"NotYourStack")
                   .withArgs("This is not your deposit");
            }); 

            it('should transfer the token - case of rejection', async function() {
                
                await new Promise(resolve => setTimeout(resolve, 4000));
                const balanceBefore = await rda.balanceOf(user2);
                await diplomaFile.connect(user2).resolveAfterVote(2);
                let balanceAfter = await rda.balanceOf(user2);
                balanceAfter -= (priceHT + bonus);
                expect(balanceBefore).to.be.equal(balanceAfter);
                expect((await diplomaFile.getDepositFromCaseIndex(2)).amount).to.be.equal(0);
                expect((await diplomaFile.getDisputeDepositFromCaseIndex(2)).amount).to.be.equal(0);
                
            }); 

            it('should emit : ResolveAfterVoteEvent', async function() {
                await new Promise(resolve => setTimeout(resolve, 4000));
                await expect(diplomaFile.connect(user1).resolveAfterVote(1)).to.emit( diplomaFile,"ResolveAfterVoteEvent")
                .withArgs(1, 1);
                
            });
           

        });


    });


    describe("Phase 5 : getReward", function () {
        
            beforeEach(async function() {
                await LoadFixtureForReward();
                
            });
            
            describe("Function getReward", function () {
        
                it('should revert because the index does not exist in Votes', async function() {
           
                    await expect(diplomaFile.connect(voter1).getRewardFromVote(4))
                        .to.be.revertedWithCustomError( diplomaFile,"ErrorCaseUnknown")
                        .withArgs("This case doesn't exist");
                }); 
    
    
                it('should revert because the case is not resolved yet', async function() {
                    await expect(diplomaFile.connect(voter1).getRewardFromVote(2))
                        .to.be.revertedWithCustomError( diplomaFile,"ErrorCaseNotResolved")
                        .withArgs("This case is not resolved yet");
                }); 
    
    
                it('should revert because voter2 has not voted', async function() {
                    await expect(diplomaFile.connect(voter3).getRewardFromVote(1))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorNoReward")
                    .withArgs("Has not voted");
                }); 

                it('should revert because voter1 has already claimed ', async function() {
                    await diplomaFile.connect(voter1).getRewardFromVote(1);
                    await expect(diplomaFile.connect(voter1).getRewardFromVote(1))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorNoReward")
                    .withArgs("Already claimed");
                }); 
    
    
                it('should set the hasClaimed to true', async function() {
                    await diplomaFile.connect(voter1).getRewardFromVote(1);
                    // const hasClaimed = diplomaFile.getHasClaimed(0,voter1);
                    expect(await diplomaFile.getHasClaimed(0,voter1)).to.be.equal(true);
                    
                }); 
    
                it('should transfer the token to voter2', async function() {
                    const [,,,,token] = await diplomaFile.getVoteFromCaseIndex(1);
                    let balanceBefore = await rda.balanceOf(voter2);
                    await diplomaFile.connect(voter2).getRewardFromVote(1);
                    const balanceAfter = await rda.balanceOf(voter2);
                    balanceBefore += BigInt(36*10**18);
                    expect(balanceBefore).to.be.equal(balanceAfter);
                    // expect((await diplomaFile.getDepositFromCaseIndex(2)).amount).to.be.equal(0);
                    // expect((await diplomaFile.getDisputeDepositFromCaseIndex(2)).amount).to.be.equal(0);
                }); 
    
                it('should emit : GetRewardEvent(msg.sender, amount);', async function() {
                   
                    await expect(diplomaFile.connect(voter2).getRewardFromVote(1)).to.emit( diplomaFile,"GetRewardEvent")
                    .withArgs(voter2, (BigInt(4)*bonus)/BigInt(5));
                    
                });


            });

    });  

});