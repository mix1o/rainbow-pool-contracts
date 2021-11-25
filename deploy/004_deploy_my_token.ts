import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ERC20PresetMinterPauser__factory } from "../typechain-types";
import { contractConstructorArgs } from "../helpers/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const constructorArgs =
    contractConstructorArgs<ERC20PresetMinterPauser__factory>(
      "Rainbow Token",
      "RWT"
    );

  await deploy("ERC20PresetMinterPauser", {
    from: deployer,
    args: constructorArgs,
    log: true,
  });
};

export default func;
func.tags = ["Rainbow Token"];
