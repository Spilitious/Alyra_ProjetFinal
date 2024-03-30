const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require('hardhat');

require("@nomicfoundation/hardhat-toolbox/network-helpers");

let addr0, addr1, addr2; 
let diplomaFile, rda;
let timestamp;

/* ************************************************************************ Fixture ************************************************************************ */

async function LoadFixtureForCreateCase() {
    
    //Addr0 possède 1000 token au déploiement du contrat RealDiplomaToken
    //Addr1 récupère 1000 token mais n'a pas d'allowance enregistré
    //Addr2 possède une allowance de 300 mais ne possède aucun token 

    [addr0, addr1, addr2] = await ethers.getSigners()

    rda = await ethers.getContractFactory("RealDiplomaToken");
    rda = await rda.deploy();
    await rda.waitForDeployment();

    diplomaFile = await ethers.getContractFactory("DiplomaFile");
    diplomaFile = await diplomaFile.deploy(rda.target);
    await diplomaFile.waitForDeployment();
    
    rda.mint(addr1, 1000);
    await rda.approve(diplomaFile.target, 900);
    await rda.connect(addr2).approve(diplomaFile.target, 300);

    //Creation d'une date arbitraire en secondes pour enregistrement des dossiers
    const date = new Date("2000-01-01"); 
    timestamp = Math.floor(date.getTime() / 1000); 

}

async function LoadFixtureForContestCase() {
    // Addr0 crée le premier dossier
    await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
}


async function LoadFixtureForVoting() {

    // Addr1 est enregistré en tant que voter avant la contestation du dossier et pourra donc voter
    // Addr0 conteste le dossier 0
    // Addr0 est enregistré en tant que voter après la création du vote et devra pas être autorisé à voter
     
    await rda.connect(addr1).approve(diplomaFile.target, 800);
    await diplomaFile.connect(addr1).becomeVoter(200);
    await LoadFixtureForContestCase();
    await diplomaFile.contestCase(0,0);
    await diplomaFile.becomeVoter(200);
}

async function LoadFixtureForResolving() {
    // Addr1 vote yes pour le litige du dossier 0
    // Addr0 crée un deuxième dossier qui n'est pas disputé 
    // Addr0 crée un troisème dossier, le conteste et vote contre 
    await LoadFixtureForVoting();
    await diplomaFile.connect(addr1).setVote(0,1);
    await diplomaFile.createCase("Cyr", "Ben", timestamp, "Alyra", "teacher", timestamp);
    await diplomaFile.createCase("Test", "Long", timestamp, "Alyra", "Rejected", timestamp);
    await diplomaFile.contestCase(2,1);
    await diplomaFile.setVote(1,0);

    
}

/* ****************************************************************** TESTING ************************************************************************** */
/******************************************************************************************************************************************************* */

describe("Diploma File", function () {
   
    beforeEach(async function() {
        await LoadFixtureForCreateCase();
  
     });


    /* **************************************************************  Déploiement  ******************************************************************** */

    describe("Deploiement", function() {
       
        it('price should be equal to 0', async function() {
            expect(await diplomaFile.price()).to.be.equal(100);
        });
    });


    /* ************************************************************** RealDiplomaToken  ***************************************************************** */

    describe("RealDiplomaToken", function() {
       
        it('should revert because not the owner', async function() {
            await expect(rda.connect(addr1).mint(addr1, 1000))
                .to.be.revertedWithCustomError(rda, "OwnableUnauthorizedAccount");
        });
    });
    
   /* ******************************************************* Create Case  ******************************************************************** */
   describe("Phase 1 : BecomeVoter & CreateFile", function () {

        describe("Function becomeAVoter", function () {
        
            it('should revert cause of Allowance', async function() {
                await expect(diplomaFile.connect(addr1).becomeVoter(200))
                    .to.be.revertedWithCustomError( rda,"ERC20InsufficientAllowance")
                    .withArgs(diplomaFile.target, 0,200);
            }); 

            it('should revert cause of Addr2 has no token', async function() {
                await expect(diplomaFile.connect(addr2).becomeVoter(200))
                    .to.be.revertedWithCustomError( rda,"ERC20InsufficientBalance")
                    .withArgs(addr2, 0,200);

            }); 

            it('should revert cause already a voter', async function() {
                diplomaFile.becomeVoter(200)
                await expect(diplomaFile.becomeVoter(200))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorAlreadyVoter")
                    .withArgs("Already a voter");

            }); 


            it('should add one Deposit to Deposits', async function() {
                await diplomaFile.becomeVoter(200);
                expect((await diplomaFile.getDeposits()).length).to.be.equal(1);
            });


            it('should add one Deposit with the good parameters', async function() {
                await diplomaFile.becomeVoter(200);
                let [sender, type, amount] = await diplomaFile.connect(addr1).getDeposit(0);
                expect(sender).to.be.equal(addr0);
                expect(type).to.be.equal(2);
                expect(amount).to.be.equal(200);
        
            });


            it('should set the mapping mapVoters', async function() {
                await diplomaFile.becomeVoter(200);
                expect((await diplomaFile.getVoter(addr0)).tokenAmount).to.be.equal(200);
                // const ouf = time.latest();
                // expect((await diplomaFile.getContestFromCaseIndex(0)).registrationTime).to.be.equal(ouf);
            });


            it('should emit : CreateNewDepositEvent', async function() {
                await expect(diplomaFile.becomeVoter(200)).to.emit( diplomaFile,"CreateNewDepositEvent")
                .withArgs(addr0, 0, 2, 200);
        
            });
    

            it('should emit : BecomeAVoter', async function() {
                await expect(diplomaFile.becomeVoter(200)).to.emit( diplomaFile,"BecomeVoterEvent")
                .withArgs(addr0, 200);
        
            });

        });   
    
    
        describe("Function createCase", function () {
    
            it('should revert cause of addr1 has no allowance', async function() {
                await expect(diplomaFile.connect(addr1).createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp))
                    .to.be.revertedWithCustomError( rda,"ERC20InsufficientAllowance")
                    .withArgs(diplomaFile.target, 0,100);

            }); 


            it('should revert because addr2 has no token', async function() {
                await expect(diplomaFile.connect(addr2).createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp))
                    .to.be.revertedWithCustomError(rda, "ERC20InsufficientBalance")
                    .withArgs(addr2, 0,100);
            });


            it('should set mapping CaseToDeposit', async function() {
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                expect((await diplomaFile.getDepositFromCaseIndex(0)).owner).to.be.equal(addr0);
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
                let [sender, type, amount, withdraw] = await diplomaFile.connect(addr1).getDeposit(0);
                expect(sender).to.be.equal(addr0);
                expect(type).to.be.equal(0);
                expect(amount).to.be.equal(100);
            });


            it('should add one Diploma to Diplomas', async function() {
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                expect((await diplomaFile.getDiplomas()).length).to.be.equal(1);
            });


            it('should add one Diploma with the good parameters', async function() {
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                let [lastName, firstName, birthday, school, diplomaName, diplomaDate] = await diplomaFile.connect(addr1).getDiploma(0);
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


            it('should add one Case with the good parameters', async function() {
                await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);
                let [owner, , status] = await diplomaFile.connect(addr1).getCase(0);
                expect(owner).to.be.equal(addr0);
                expect(status).to.be.equal(0);
            });


            it('should emit 3 events : CreateNewDiplomaEvent, CreateNewDepositEvent, CreateNewFileEvent ', async function() {
                await expect(diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp)).to.emit( diplomaFile,"CreateNewDiplomaEvent")
                .withArgs(0, "Leb", "Aur", timestamp, "Alyra", "Dev", timestamp);

                await expect(diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp)).to.emit( diplomaFile,"CreateNewDepositEvent")
                .withArgs(addr0, 1, 0, 100);

                await expect(diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp)).to.emit( diplomaFile,"CreateNewFileEvent");
                //.withArgs(2, addr0, 1 ,0);
            });


        });  


    });

  

   /* ******************************************************* Phase 2 : SimpleResolve & ContestCase  ******************************************************************** */
       
    describe("Phase 2 : SimpleResolve & ContestCase", function () {

        beforeEach(async function() {
            await LoadFixtureForContestCase();
            //await new Promise(resolve => setTimeout(resolve, 6000));
        });

        describe("Function simpleResolve", function () {
            
            it('should revert because the index does not exist in Cases - 1st require', async function() {
                await expect(diplomaFile.simpleResolve(1))
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
                await rda.connect(diplomaFile.target).approve(addr0, 100);
               // let success = await rda.transferFrom(diplomaFile.target, addr0, 100);
                //console.log(success);
                await expect(diplomaFile.simpleResolve(0))
                   .to.be.revertedWithCustomError( rda,"ERC20InsufficientBalance")
               // .withArgs("0x8A791620dd6260079BF849Dc5567aDC3F2FdC318")
               // .withArgs(0)
               // .withArgs(100)
    
            });  */

            it('should revert because addr1 is not the owner of the deposit', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await expect(diplomaFile.connect(addr1).simpleResolve(0)).to.be.revertedWithCustomError(
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
    
        describe("Function contestCase", function () {
        
            it('should revert because the index does not exist in Cases - 1st require', async function() {
       
                await expect(diplomaFile.contestCase(1,0))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorCaseUnknown")
                    .withArgs("This file doesn't exist");
            }); 


            it('should revert because the case is not pending', async function() {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await expect(diplomaFile.contestCase(0,0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorCaseNotPending")
                   .withArgs("This file is not pending");
            }); 


            it('should revert because the case is not pending', async function() {
                await diplomaFile.contestCase(0,0);
                await expect(diplomaFile.contestCase(0,0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorCaseNotPending")
                   .withArgs("This file is not pending")
            }); 


            it('should revert cause of Allowance', async function() {
                 await expect(diplomaFile.connect(addr1).contestCase(0,0))
                    .to.be.revertedWithCustomError( rda,"ERC20InsufficientAllowance")
                    .withArgs(diplomaFile.target, 0,100);
            }); 


            it('should revert cause of Addr2 has no token', async function() {
                await expect(diplomaFile.connect(addr2).contestCase(0,0))
                   .to.be.revertedWithCustomError( rda,"ERC20InsufficientBalance")
                   .withArgs(addr2, 0, 100);
            }); 

       
            it('should add one Deposit to Deposits', async function() {
                await diplomaFile.contestCase(0,0);
                expect((await diplomaFile.getDeposits()).length).to.be.equal(2);
            });
    

            it('should add one Deposit with the good parameters', async function() {
                await diplomaFile.contestCase(0,0);
                let [sender, type, amount] = await diplomaFile.connect(addr1).getDeposit(1);
                expect(sender).to.be.equal(addr0);
                expect(type).to.be.equal(1);
                expect(amount).to.be.equal(100);
            });


            it('should set the mapping ContestToDiploma', async function() {
                await diplomaFile.contestCase(0,0);
                expect((await diplomaFile.getContestFromCaseIndex(0)).owner).to.be.equal(addr0);
            });

            it('should add one Contest to Contests', async function() {
                await diplomaFile.contestCase(0,0);
                    expect((await diplomaFile.getContests()).length).to.be.equal(1);
            });

            it('should add one Contest with the good parameters', async function() {
                await diplomaFile.contestCase(0,0);
                let [sender, fileIndex, proof] = await diplomaFile.connect(addr1).getContest(0);
                expect(sender).to.be.equal(addr0);
                expect(fileIndex).to.be.equal(0);
                expect(proof).to.be.equal(0);
            });

            it('should set the status of the case to disputed', async function() {
                await diplomaFile.contestCase(0,0);
                expect((await diplomaFile.getCase(0)).status).to.be.equal(2);
            });
            

            it('should emit CreateNewDepositEvent', async function() {
                await expect(diplomaFile.contestCase(0,0)).to.emit( diplomaFile,"CreateNewDepositEvent")
                .withArgs(addr0, 1, 1,  100);
            });


            it('should emit CreateNewContestEvent', async function() {
                await expect(diplomaFile.contestCase(0,0)).to.emit( diplomaFile,"CreateNewContestEvent")
                .withArgs(addr0, 0, 0);
            });
        

        });


    });

    /*  *********************************************  Phase 3 : setVote & resolveAfterVoting ************************************************************************************* */
    describe("Phase 3 : setVote ", function () {
        
        beforeEach(async function() {
            await LoadFixtureForVoting();
            
        });

        describe("Function setVote", function () {
        
            it('should revert because the index does not exist in Votes', async function() {
       
                await expect(diplomaFile.setVote(1,0))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorVoteUnknown")
                    .withArgs("This votes doesn't exist");
            }); 


            it('should revert because the vote is not pending', async function() {
                await expect(diplomaFile.connect(addr2).setVote(0,0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorNotVoter")
                   .withArgs("Not a voter");
            }); 


            it('should revert because the vote was started before addr0 became a voter', async function() {
                await expect(diplomaFile.setVote(0,0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorNotAllowedToVote")
                   .withArgs("This vote has started before you become a voter");
            }); 


            it('should revert because the vote is close', async function() {
                await new Promise(resolve => setTimeout(resolve, 5000));
                await expect(diplomaFile.connect(addr1).setVote(0,0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorVoteClosed")
                   .withArgs("This vote is closed");
            }); 

            it('should revert because already voted ', async function() {
                await diplomaFile.connect(addr1).setVote(0,0)
                await expect(diplomaFile.connect(addr1).setVote(0,0))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorHasVoted")
                   .withArgs("Already Voted");
            }); 

            it('should add one vote for no', async function() {
                
                let [,, yes1, no1] = await diplomaFile.getVote(0);
                await diplomaFile.connect(addr1).setVote(0,0);
                let [,, yes2, no2] = await diplomaFile.getVote(0);
                no1++;
                expect(yes1).to.be.equal(yes2);
                expect(no1).to.be.equal(no2);
            }); 


            it('should add one vote for yes', async function() {
                
                let [,, yes1, no1] = await diplomaFile.getVote(0);
                await diplomaFile.connect(addr1).setVote(0,1);
                let [,, yes2, no2] = await diplomaFile.getVote(0);
                yes1++;
                expect(yes1).to.be.equal(yes2);
                expect(no1).to.be.equal(no2);
            }); 


            it('should set hasVoted[addr1][0] to true', async function() {
                await diplomaFile.connect(addr1).setVote(0,1);
                expect(await diplomaFile.getHasVoted(0, addr1)).to.be.equal(true);
            }); 


            it('should emit : SetVoteEvent', async function() {
                await expect(diplomaFile.connect(addr1).setVote(0,1)).to.emit( diplomaFile,"SetVoteEvent")
                .withArgs(addr1, 0, 1);
                
            });
           

        });

        describe("Function getVotes", function () {
        
            it('should retrun the array of votes', async function() {
                    await diplomaFile.connect(addr1).setVote(0,1);
                    const v = await diplomaFile.getVotes();
                    const [idFile,creationTime, yes, no] = v[0];
                    expect(idFile).to.be.equal(0);
                    expect(yes).to.be.equal(1);
            }); 


        });


        describe("Function getVoteFromCaseIndex", function () {
        
            it('should retrun votes[0]', async function() {
                    await diplomaFile.connect(addr1).setVote(0,1);
                    const [idFile,creationTime, yes, no] = await diplomaFile.getVoteFromCaseIndex(0);
                    expect(idFile).to.be.equal(0);
                    expect(yes).to.be.equal(1);
            }); 


        });


    }); 

    describe("Phase 4 : resolveAfterVoting", function () {
        
        beforeEach(async function() {
            await LoadFixtureForResolving();
            
        });
        
        describe("Function resolveAfterVoting", function () {
        
            it('should revert because the index does not exist in Votes', async function() {
       
                await expect(diplomaFile.resolveAfterVote(4))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorCaseUnknown")
                    .withArgs("This case doesn't exist");
            }); 


            it('should revert because the vote is not disputed', async function() {
                await expect(diplomaFile.resolveAfterVote(1))
                    .to.be.revertedWithCustomError( diplomaFile,"ErrorCaseNotDisputed")
                    .withArgs("This case is not disputed");
            }); 


            it('should revert because the vote is not close yet', async function() {
                await diplomaFile.createCase("Test", "Long", timestamp, "Alyra", "Rejected", timestamp);
                await diplomaFile.contestCase(3,0);
                await expect(diplomaFile.resolveAfterVote(3))
                   .to.be.revertedWithCustomError(diplomaFile,"ErrorVoteInProgress")
                   .withArgs("The vote is not closed yet");
            }); 


            it('should set the status to validated', async function() {
                await new Promise(resolve => setTimeout(resolve, 4000));
                await diplomaFile.resolveAfterVote(0);
                expect((await diplomaFile.getCase(0)).status).to.be.equal(1);
                
            }); 

            it('should transfer the token case of validation', async function() {
                
                await new Promise(resolve => setTimeout(resolve, 4000));
                await diplomaFile.resolveAfterVote(0);
                expect((await diplomaFile.getDepositFromCaseIndex(0)).amount).to.be.equal(200);
                expect((await diplomaFile.getContestDepositFromCaseIndex(0)).amount).to.be.equal(0);
                
            }); 

            it('should set the status to rejected', async function() {
                await new Promise(resolve => setTimeout(resolve, 4000));
                await diplomaFile.resolveAfterVote(2);
                expect((await diplomaFile.getCase(2)).status).to.be.equal(3);
                
            }); 

            it('should transfer the token case of rejection', async function() {
                
                await new Promise(resolve => setTimeout(resolve, 4000));
                await diplomaFile.resolveAfterVote(2);
                expect((await diplomaFile.getDepositFromCaseIndex(2)).amount).to.be.equal(0);
                expect((await diplomaFile.getContestDepositFromCaseIndex(2)).amount).to.be.equal(200);
                
            }); 

            it('should emit : ResolveAfterVoteEvent', async function() {
                await new Promise(resolve => setTimeout(resolve, 4000));
                await expect(diplomaFile.connect(addr1).resolveAfterVote(0)).to.emit( diplomaFile,"ResolveAfterVoteEvent")
                .withArgs(0, 1);
                
            });
           

        });

    });  

});