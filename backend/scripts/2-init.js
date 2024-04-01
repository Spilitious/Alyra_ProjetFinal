const hre = require("hardhat");
// const {getRdaAddress} = require('./1-deploy');

async function init() {
 
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



    /* ********************************************************** Execution *********************************************************** */


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

   
    
    /* ************************************************* Lecture et sortie console ************************************************** */

    //Récupération des constantes de DiplomaFile
    const price = await diplomaFile.price();
    const fee = await  diplomaFile.fee();
    const bonus = await diplomaFile.getBonus();
    const fees = (price*fee)/BigInt(100);
    const priceHT = price - fees; 

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
}


init().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = {
  init: init
};