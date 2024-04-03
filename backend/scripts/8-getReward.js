const hre = require("hardhat");


async function reward() {
 
    /* **************************************************************** Init **************************************** */

     //Address des contrats 
     const RdaAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";   
     const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
     const DiplomaAddress ="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    
     //Contrat Rda
     const Rda = await ethers.getContractFactory('RealDiplomaToken');
     const rda = Rda.attach(RdaAddress);
     
     //Contrat diploma file
     const DiplomaFile = await ethers.getContractFactory('DiplomaFile');
     const diplomaFile = DiplomaFile.attach(DiplomaAddress);
     
     //Récupération des signers Hardhat
     [user0, user1, user2, nonUser1, nonUser2, nonUser3, voter1, voter2, voter3, daoAddress] = await ethers.getSigners();
   
     //Creation d'une date arbitraire en secondes pour date des diplômes
     let date = new Date("2000-01-01"); 
     const ExempleDate1 = Math.floor(date.getTime() / 1000); 
     date = new Date("1990-01-01"); 
     const birthdayDate = Math.floor(date.getTime() / 1000);


    /* ********************************************************** Execution *********************************************************** */
    
    [creationTime, yes, no, tokenAmountSquare] = await diplomaFile.getVote(0);
    console.log(creationTime, yes, no, tokenAmountSquare)

    await diplomaFile.setVotingDelay(1);
    let balanceBefore = await rda.balanceOf(diplomaFile.target);
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

    

    
   
}

reward().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});