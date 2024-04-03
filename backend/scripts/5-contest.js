const hre = require("hardhat");


async function contest() {
 
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

    // Contestation du dossier 1 avec la preuve 0
    await diplomaFile.setContestDelay(400);
    const userBalanceBefore = await rda.balanceOf(user2);
    let [,statusBefore,] = await diplomaFile.getCase(1);
    await diplomaFile.connect(user2).contestCase(1,0);
    const userBalanceAfter = await rda.balanceOf(user2);
    let [,statusAfter,] = await diplomaFile.getCase(1);
        

    /* ************************************************* Sortie console ************************************************** */

    console.log("---------------------------- Contestation DOSSIER 1 --------------------------------------")
    console.log("Balance User0 Avant", userBalanceBefore);
    console.log("Balance User0 Avant", userBalanceAfter);
    console.log("Status Avant", statusBefore);
    console.log("Status Apres", statusAfter);
   
}

contest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});