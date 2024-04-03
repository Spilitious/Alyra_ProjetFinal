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
  
   [user0, user1, user2, nonUser1, nonUser2, nonUser3, voter1, voter2, voter3, daoAddress] = await ethers.getSigners();
  //Distribution de token et allowance
  
  await rda.mint(user1, 1000);
  await rda.mint(user2, 1000);
  await rda.mint(nonUser1, 1000);
  await rda.mint(voter1, 100);
  await rda.mint(voter2,200);
  await rda.mint(voter3, 300);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


