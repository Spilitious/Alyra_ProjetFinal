const hre = require("hardhat");

async function main() {
 
   
    const RdaAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";   
    const Rda = await ethers.getContractFactory('RealDiplomaToken');
    const rda = Rda.attach(RdaAddress);
   
    const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const DiplomaAddress ="0xDC11f7E700A4c898AE5CAddB1082cFfa76512aDD";
    
    
    // await rda.mint(DiplomaAddress, 1000);
    const DiplomaFile = await ethers.getContractFactory('DiplomaFile');
    const diplomaFile = DiplomaFile.attach(DiplomaAddress);
    
    // await  rda.approve(DiplomaAddress, 200);
    await  rda.approve(DiplomaAddress, 200);

    let balance = await rda.balanceOf(owner)
    console.log(balance);
    let Contractbalance = await rda.balanceOf(DiplomaAddress);
    console.log(Contractbalance);
   
    // await diplomaFile.createCase("Leb", "Aur", timestamp, "Alyra", "Dev", timestamp );
    
    // const diplomas = await diplomaFile.getDiplomas();
    // console.log(diplomas.length);

    // const diploma = await diplomaFile.getDiploma(0);
    // console.log(diploma[0]);

    
    Contractbalance = await rda.balanceOf(DiplomaAddress);
    console.log(Contractbalance)
    
    balance = await rda.balanceOf(owner)
    console.log(balance);

  
    await diplomaFile.createConstest(1,0);

    
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