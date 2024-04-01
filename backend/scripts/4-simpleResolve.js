const hre = require("hardhat");


async function simpleResolve() {
 
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

    // Resolution du dossier 1 - Pas eu de contestation 
    const userBalanceBefore = await rda.balanceOf(user0);
    let [,,statusBefore] = await diplomaFile.getCase(0);
    await diplomaFile.connect(user1).simpleResolve(0);
    const userBalanceAfter = await rda.balanceOf(user0);
    let [,,statusAfter] = await diplomaFile.getCase(0);
        

    /* ************************************************* Sortie console ************************************************** */

    console.log("---------------------------- Résoluition DOSSIER 1 --------------------------------------")
    console.log("Balance User0 Avant", userBalanceBefore);
    console.log("Balance User0 Avant", userBalanceAfter);
    console.log("Status Avant", statusBefore);
    console.log("Status Avant", statusAfter);
   
}

simpleResolve().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});