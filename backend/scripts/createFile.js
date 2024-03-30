const hre = require("hardhat");

async function main() {
 
    const date = new Date("1981-09-02"); // Date que vous voulez passer
    const timestamp = Math.floor(date.getTime() / 1000); // Convertir en secondes
    const RdaAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";   

    const Rda = await ethers.getContractFactory('RealDiplomaToken');
    const rda = Rda.attach(RdaAddress);
   
    const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
   

    const DiplomaAddress ="0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
    await rda.mint(DiplomaAddress, 1000);
    const DiplomaFile = await ethers.getContractFactory('DiplomaFile');
    const diplomaFile = DiplomaFile.attach(DiplomaAddress);
    
    await  rda.approve(DiplomaAddress, 200);


    let balance = await rda.balanceOf(owner)
    console.log(balance);
    let Contractbalance = await rda.balanceOf(DiplomaAddress);
    console.log(Contractbalance);
   
    await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp );
    
    // const diplomas = await diplomaFile.getDiplomas();
    // console.log(diplomas.length);

    // const diploma = await diplomaFile.getDiploma(0);
    // console.log(diploma[0]);

    
    Contractbalance = await rda.balanceOf(DiplomaAddress);
    console.log(Contractbalance)
    
    balance = await rda.balanceOf(owner)
    console.log(balance);
    
   
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});