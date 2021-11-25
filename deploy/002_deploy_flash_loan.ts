import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { FlashLoan__factory } from "../typechain-types";
import { contractConstructorArgs } from "../helpers/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;

  const { deployer } = await getNamedAccounts();

  const pool = await get("Pool");

  const constructorArgs = contractConstructorArgs<FlashLoan__factory>(
    100,
    pool.address
  );

  await deploy("FlashLoan", {
    from: deployer,
    args: constructorArgs,
    log: true,
  });
};

export default func;
func.tags = ["FlashLoan"];
