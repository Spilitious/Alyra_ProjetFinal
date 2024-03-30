// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
 
  

  const Diploma = await hre.ethers.getContractFactory("DiplomaFile");
  const diploma = await Diploma.deploy("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");
  await diploma.waitForDeployment();
 
  console.log(`DiplomaFile contract has been deployer at ${diploma.target}`);

  const [owner] = await hre.ethers.getSigners();
  console.log(`Owner address: ${owner.address}`);

   
 //0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});