const hre = require("hardhat");


async function createSomeCase() {
 
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
}

createSomeCase().catch((error) => {
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