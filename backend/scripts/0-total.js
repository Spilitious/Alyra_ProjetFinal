const hre = require("hardhat");


async function main() {
 
  console.log('\x1b[36m%s\x1b[0m',"/* *************************************************************************** Déploiement ********************************************************************************* */")
  /* *************************************************************************************** ********************************************************************************* */
  
  //Deploiemnent de RealDiplomaToken 
  const rda = await hre.ethers.deployContract("RealDiplomaToken");
  await rda.waitForDeployment();
  console.log(`RDA contract has been deployer at ${rda.target}`);
  const [rdaOwner] = await hre.ethers.getSigners();
  console.log(`Owner address: ${rdaOwner.address}`);

  //Deploiement de DiplomaFile 
  [,,,,,,,,, dao] = await hre.ethers.getSigners();
  const DiplomaFile = await hre.ethers.getContractFactory("DiplomaFile");
  const diplomaFile = await DiplomaFile.deploy(rda.target, dao);
  await diplomaFile.waitForDeployment();
  console.log(`DiplomaFile contract has been deployer at ${diplomaFile.target}`);
  console.log(`Dao address : ${dao.address}`);

  //Deploiement de DiplomaNft
  const DiplomaNft = await hre.ethers.getContractFactory("DiplomaNft");
  const diplomaNft = await DiplomaNft.deploy(diplomaFile.target);
  await diplomaNft.waitForDeployment();
  console.log(`DiplomaNft contract has been deployer at ${diplomaNft.target}`);

  //Creation d'une date arbitraire en secondes pour date des diplômes
  let date = new Date("2000-01-01"); 
  const ExempleDate1 = Math.floor(date.getTime() / 1000); 
  date = new Date("1990-01-01"); 
  const birthdayDate = Math.floor(date.getTime() / 1000);

  //Récupération des constantes de DiplomaFile
  const price = await diplomaFile.price();
  const fee = await  diplomaFile.fee();
  const bonus = await diplomaFile.getBonus();
  const fees = (price*fee)/BigInt(100);
  const priceHT = price - fees; 


  //Récupération des signers Hardhat
  [user0, user1, user2, nonUser1, nonUser2, nonUser3, voter1, voter2, voter3, daoAddress] = await ethers.getSigners();
  console.log("")
  console.log('\x1b[36m%s\x1b[0m',"/* *************************************************************************** Distribution token et allowance ************************************************************* */")
  /* *************************************************************************************** ********************************************************************************* */
 
  //Distribution de token et allowance
  await rda.approve(diplomaFile.target, ethers.parseEther('1000'));
  await rda.mint(user1, 1000);
  await rda.connect(user1).approve(diplomaFile.target, ethers.parseEther('1000'));
  await rda.mint(user2, 1000);
  await rda.connect(user2).approve(diplomaFile.target, ethers.parseEther('1000'));
  await rda.mint(nonUser1, 1000);
  await rda.connect(nonUser2).approve(diplomaFile.target, ethers.parseEther('1000'));
  await rda.mint(voter1, 100);
  await rda.connect(voter1).approve(diplomaFile.target, ethers.parseEther('100'));
  await rda.mint(voter2,200);
  await rda.connect(voter2).approve(diplomaFile.target, ethers.parseEther('200'));
  await rda.mint(voter3, 300);
  await rda.connect(voter3).approve(diplomaFile.target, ethers.parseEther('300'));


  const user0Balance = await rda.balanceOf(user0);
  const user1Balance = await rda.balanceOf(user1);
  const user2Balance = await rda.balanceOf(user2);
  const nonUser1Balance = await rda.balanceOf(nonUser1);
  const nonUser2Balance = await rda.balanceOf(nonUser2);
  const voter1Balance = await rda.balanceOf(voter1);
  const voter2Balance = await rda.balanceOf(voter2);
  const voter3Balance = await rda.balanceOf(voter3);
  const daoBalance = await rda.balanceOf(daoAddress);

  const user0Allowance = await rda.allowance(user0, diplomaFile.target);
  const user1Allowance = await rda.allowance(user1, diplomaFile.target);
  const user2Allowance = await rda.allowance(user2, diplomaFile.target);
  const nonUser1Allowance = await rda.allowance(nonUser1, diplomaFile.target);
  const nonUser2Allowance = await rda.allowance(nonUser2, diplomaFile.target);
  const voter1Allowance = await rda.allowance(voter1, diplomaFile.target);
  const voter2Allowance = await rda.allowance(voter2, diplomaFile.target);
  const voter3Allowance = await rda.allowance(voter3, diplomaFile.target);
  const daoAllowance = await rda.allowance(daoAddress, diplomaFile.target);

 

  console.log("--------------------------- BALANCE --------------------------------");
  console.log("user0    : ",user0Balance);
  console.log("user1    : ",user1Balance);
  console.log("user2    : ",user2Balance);
  console.log("nonUser1 : ",nonUser1Balance);
  console.log("nonUser2 : ",nonUser2Balance);
  console.log("voter1   : ", voter1Balance);
  console.log("voter2   : ",voter2Balance);
  console.log("voter3   : ", voter3Balance);
  console.log("dao      : ", daoBalance);
  
  console.log("--------------------------- ALLOWANCE --------------------------------");
  console.log("user0    : ",user0Allowance);
  console.log("user1    : ",user1Allowance);
  console.log("user2    : ",user2Allowance);
  console.log("nonUser1 : ",nonUser1Allowance);
  console.log("nonUser2 : ",nonUser2Allowance);
  console.log("voter1   : ", voter1Allowance);
  console.log("voter2   : ",voter2Allowance);
  console.log("voter3   : ", voter3Allowance);
  console.log("dao      : ", daoAllowance);

  console.log("-")
  console.log('\x1b[36m%s\x1b[0m',"/* *************************************************************************** Création des voteurs ************************************************************* */")
  /* *************************************************************************************** ********************************************************************************* */
  
 // voter1 devient voter avec 100 tokens
 await diplomaFile.connect(voter1).becomeVoter(ethers.parseEther('100'));
        
 // voter2 devient voter avec 100 tokens
 await diplomaFile.connect(voter2).becomeVoter(ethers.parseEther('200'));
     
 // voter3 devient voter avec 100 tokens
 await diplomaFile.connect(voter3).becomeVoter(ethers.parseEther('300'));
    
 let [registrationTime, tokenAmount] = await diplomaFile.getVoter(voter1);

 console.log("---------------------------- VOTER 1 --------------------------------------")
 console.log(registrationTime, tokenAmount);
 
 [registrationTime, tokenAmount] = await diplomaFile.getVoter(voter2);
 console.log("---------------------------- VOTER 2 --------------------------------------")
 console.log(registrationTime, tokenAmount);
 
 [registrationTime, tokenAmount] = await diplomaFile.getVoter(voter3);
 console.log("---------------------------- VOTER 3 --------------------------------------")
 console.log(registrationTime, tokenAmount);
  
 let contractBalance = await rda.balanceOf(diplomaFile.target);
 console.log("Contract Balance : ", contractBalance);

 console.log('\x1b[36m%s\x1b[0m',"/* *************************************************************************** Création de dossier ************************************************************* */")
 /* *************************************************************************************** ********************************************************************************* */
 
    // Dossier 1 par user0
    await diplomaFile.createCase("Leb", "Aur", birthdayDate, "Alyra", "Dev", ExempleDate1);
        
    // Dossier 2 par user1
    await diplomaFile.connect(user1).createCase("Cyr", "Ben", birthdayDate, "Disputed", "Valid", ExempleDate1);
    
    // Dossier 3 par user1
    await diplomaFile.connect(user1).createCase("Cheater", "Long", birthdayDate, "Disputed", "Reject", ExempleDate1);
    


    /* ************************************************* Lecture et sortie console ************************************************** */

    let [lastName, firstName, birthday, school, title, dimplomaDate] = await diplomaFile.getDiploma(0);
    let [depostierAddress, creationTime, status] = await diplomaFile.getCase(0);
   
    console.log("---------------------------- DOSSIER 1 --------------------------------------")
    console.log(lastName, firstName, getDate(birthday), school, title, getDate(dimplomaDate));
    console.log(depostierAddress, creationTime, status);
   

    [lastName, firstName, birthday, school, title, dimplomaDate] = await diplomaFile.getDiploma(1);
    [depostierAddress, creationTime, status] = await diplomaFile.getCase(1);
    console.log("---------------------------- DOSSIER 2 --------------------------------------")
    console.log(lastName, firstName, getDate(birthday), school, title, getDate(dimplomaDate));
    console.log(depostierAddress, creationTime, status);


    [lastName, firstName, birthday, school, title, dimplomaDate] = await diplomaFile.getDiploma(2);
    [depostierAddress, creationTime, status] = await diplomaFile.getCase(2);
    console.log("---------------------------- DOSSIER 3 --------------------------------------")
    console.log(lastName, firstName, getDate(birthday), school, title, getDate(dimplomaDate));
    console.log(depostierAddress, creationTime, status);

    contractBalance = await rda.balanceOf(diplomaFile.target);
    console.log("Contract Balance : ", contractBalance);

   
   /*
    let userBalanceBefore = await rda.balanceOf(user0);
    await diplomaFile.simpleResolve(0);
    let userBalanceAfter = await rda.balanceOf(user0);
    let [,statusAfter,] = await diplomaFile.getCase(0);
*/


    console.log('\x1b[36m%s\x1b[0m',"/* *************************************************************************** Resolution du dossier 0 sans contestation*********************************** */")
   /* *************************************************************************************** ********************************************************************************* */
 
   /* ********************************************************** Execution *********************************************************** */

    // Resolution du dossier 0 - Pas eu de contestation 
    await diplomaFile.setDisputeDelay(0);
    userBalanceBefore = await rda.balanceOf(user0);
    [,statusBefore,] = await diplomaFile.getCase(0);
    await diplomaFile.simpleResolve(0);
    userBalanceAfter = await rda.balanceOf(user0);
    [,statusAfter,] = await diplomaFile.getCase(0);
    contractBalance = await rda.balanceOf(diplomaFile.target);

    /* ************************************************* Sortie console ************************************************** */

    console.log("---------------------------- Résoluition DOSSIER 0 --------------------------------------")
    console.log("Balance User0 Avant", userBalanceBefore);
    console.log("Balance User0 Après", userBalanceAfter);
    console.log("Status Avant", statusBefore);
    console.log("Status Après", statusAfter);
    
    console.log("Contract Balance : ", contractBalance);

    console.log("-")
    console.log('\x1b[36m%s\x1b[0m',"/* *************************************************************************** contestation du dossier 1 *********************************** */")
    /* *************************************************************************************** ********************************************************************************* */
 
    // Contestation du dossier 1 
    await diplomaFile.setDisputeDelay(400);
    userBalanceBefore = await rda.balanceOf(user2);
    [,statusBefore,] = await diplomaFile.getCase(1);
    await diplomaFile.connect(user2).disputeCase(1,0);
    userBalanceAfter = await rda.balanceOf(user2);
    [,statusAfter,] = await diplomaFile.getCase(1);
        

    /* ************************************************* Sortie console ************************************************** */

    console.log("---------------------------- Contestation DOSSIER 1 --------------------------------------")
    console.log("Balance User0 Avant", userBalanceBefore);
    console.log("Balance User0 Avant", userBalanceAfter);
    console.log("Status Avant", statusBefore);
    console.log("Status Apres", statusAfter);

    contractBalance = await rda.balanceOf(diplomaFile.target);
    console.log("Contract Balance : ", contractBalance);

    console.log("-")
    console.log('\x1b[36m%s\x1b[0m', '/* *************************************************************************** Vote *********************************** */'); 
    console.log("-")
     /* *************************************************************************************** ********************************************************************************* */
    
    
    /* ********************************************************** Execution *********************************************************** */ 
    
    await diplomaFile.setVotingDelay(400);

    let [creationTime1, yes, no, tokenAmountSquare] = await diplomaFile.getVote(0)
    console.log("Etat du vote intial")
    console.log(creationTime1, yes, no, tokenAmountSquare)

    
    await diplomaFile.connect(voter1).setVote(1,0);
    [creationTime1, yes, no, tokenAmountSquare] = await diplomaFile.getVote(0)
    console.log("Etat du vote après le vote du voter1")
    console.log(creationTime1, yes, no, tokenAmountSquare)
    
    await diplomaFile.connect(voter2).setVote(1,1);
    [creationTime1, yes, no, tokenAmountSquare] = await diplomaFile.getVote(0)
    console.log("Etat du vote après le vote du voter2")
    console.log(creationTime1, yes, no, tokenAmountSquare)

    await diplomaFile.connect(voter3).setVote(1,1);
    [creationTime1, yes, no, tokenAmountSquare] = await diplomaFile.getVote(0)
    console.log("Etat du vote après le vote du voter3")
    console.log(creationTime1, yes, no, tokenAmountSquare)

    console.log("-")
    console.log('\x1b[36m%s\x1b[0m', '/* ************************************************************Resolution après vote *********************************** */'); 
    console.log("-")
     /* *************************************************************************************** ********************************************************************************* */
    
    await diplomaFile.setVotingDelay(0);
    let balanceBefore = await rda.balanceOf(diplomaFile.target);
    console.log("BALANCE AVANT")
    console.log("Contract : ", balanceBefore);
    balanceBefore = await rda.balanceOf(user1);
    console.log("user1   : ", balanceBefore);
    balanceBefore = await rda.balanceOf(user2);
    console.log("user2   : ", balanceBefore);
    

    await diplomaFile.connect(user1).resolveAfterVote(1);
    balanceBefore = await rda.balanceOf(diplomaFile.target);
    console.log("BALANCE APRES")
    console.log("Contract : ", balanceBefore);
    balanceBefore = await rda.balanceOf(user1);
    console.log("user1   : ", balanceBefore);
    balanceBefore = await rda.balanceOf(user2);
    console.log("user2   : ", balanceBefore);


    console.log("-")
    console.log('\x1b[36m%s\x1b[0m',"/* *************************************************************************** getRewards *********************************** */")
    console.log("-")/* ************************************************************************************************************************************************************************* */
    
    /* ********************************************************** Execution *********************************************************** */
    
  //  [creationTime1, yes, no, tokenAmountSquare] = await diplomaFile.getVote(0)
   // console.log(creationTime1, yes, no, tokenAmountSquare)

    await diplomaFile.setVotingDelay(1);
    balanceBefore = await rda.balanceOf(diplomaFile.target);
    console.log("BALANCE AVANT")
    console.log("Contract : ", balanceBefore);
    balanceBefore = await rda.balanceOf(voter1);
    console.log("Voter1   : ", balanceBefore);
    balanceBefore = await rda.balanceOf(voter2);
    console.log("Voter2   : ", balanceBefore);
    balanceBefore = await rda.balanceOf(voter3);
    console.log("Voter3   : ", balanceBefore);

    await diplomaFile.connect(voter1).getRewardFromVote(0);
    await diplomaFile.connect(voter2).getRewardFromVote(0);
    await diplomaFile.connect(voter3).getRewardFromVote(0);
    console.log("BALANCE AFTER")
    balanceBefore = await rda.balanceOf(diplomaFile.target);
    console.log("Contract : ", balanceBefore);
    balanceBefore = await rda.balanceOf(voter1);
    let sum = balanceBefore;
    console.log("Voter1   : ", balanceBefore);
    balanceBefore = await rda.balanceOf(voter2);
    sum += balanceBefore
    console.log("Voter2   : ", balanceBefore);
    balanceBefore = await rda.balanceOf(voter3);
    sum += balanceBefore;
    console.log("Voter3   : ", balanceBefore);
    console.log(sum)

    console.log("-")
    console.log('\x1b[36m%s\x1b[0m',"/* *************************************************************************** Mint du NFT *********************************** */")
    console.log("-")/* ************************************************************************************************************************************************************************* */
    
    await diplomaNft.mintDiploma(0);
    let ownerAfter = await diplomaNft.ownerOf(1);
    console.log("OwnerAfter du NFT 1 : ", ownerAfter)
 
    
    let [, lastNameNft, firstNameNft, birthdayNft] = await diplomaNft.getRdaNft(0);
    console.log("lastName : ", lastNameNft);
    console.log("firsName : ", firstNameNft);
    console.log("birthday : ", birthdayNft);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


function getDate(timestamp) {
    const date = new Date(Number(timestamp * BigInt(1000)));
  
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    
    // Formater la date en chaîne de caractères
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
    }