const hre = require("hardhat");


async function main() {
 
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
  


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


