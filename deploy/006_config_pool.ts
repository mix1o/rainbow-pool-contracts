import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Pool__factory, Pool, LpToken } from "../typechain-types";

const deployment: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, ethers } = hre;

  const { Pool, FlashLoan, LpToken, MyToken } = await deployments.all();

  const poolInstance = await ethers.getContractAt<Pool>("Pool", Pool.address);
  const configTx = await poolInstance.setConfigurationPool(
    LpToken.address,
    FlashLoan.address,
    MyToken.address
  );

  const lpTokenInstance = await ethers.getContractAt<LpToken>(
    "LpToken",
    LpToken.address
  );
  const configLpTokenTx = await lpTokenInstance.grantPoolRole();

  configTx.wait();
};

deployment.dependencies = ["Pool", "LpToken", "MyToken", "FlashLoan"];

export default deployment;
