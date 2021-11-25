import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Pool__factory } from "../typechain-types";
import { contractConstructorArgs } from "../helpers/types";
import "@nomiclabs/hardhat-etherscan";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, run } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const constructorArgs = contractConstructorArgs<Pool__factory>();

  const deployment = await deploy("Pool", {
    from: deployer,
    args: constructorArgs,
    log: true,
  });

  //deployment //TODO
};

export default func;
func.tags = ["Pool"];
