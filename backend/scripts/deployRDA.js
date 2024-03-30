const hre = require("hardhat");

async function main() {
 
  console.log("bonjour");

  const Rda = await hre.ethers.deployContract("RealDiplomaToken");
  await Rda.waitForDeployment();

  
 
  console.log(`RDA contract has been deployer at ${Rda.target}`);

  const [owner] = await hre.ethers.getSigners();
  console.log(`Owner address: ${owner.address}`);

   


  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});