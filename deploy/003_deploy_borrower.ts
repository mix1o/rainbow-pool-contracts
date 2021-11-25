import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Borrower__factory } from "../typechain-types";
import { contractConstructorArgs } from "../helpers/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const constructorArgs = contractConstructorArgs<Borrower__factory>();

  await deploy("Borrower", {
    from: deployer,
    args: constructorArgs,
    log: true,
  });
};

export default func;
func.tags = ["Borrower"];
