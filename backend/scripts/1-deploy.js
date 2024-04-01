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
  const Diploma = await hre.ethers.getContractFactory("DiplomaFile");
  const diploma = await Diploma.deploy(rda.target, dao);
  await diploma.waitForDeployment();
  console.log(`DiplomaFile contract has been deployer at ${diploma.target}`);
  console.log(`Dao address : ${dao.address}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


