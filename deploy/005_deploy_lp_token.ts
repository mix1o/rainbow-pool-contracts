import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { LpToken__factory } from "../typechain-types";
import { contractConstructorArgs } from "../helpers/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;

  const { deployer } = await getNamedAccounts();

  const pool = await get("Pool");
  const rainbowToken = await get("ERC20PresetMinterPauser");

  const constructorArgs = contractConstructorArgs<LpToken__factory>(
    "LpToken",
    "LPT",
    pool.address,
    rainbowToken.address
  );

  await deploy("LpToken", {
    from: deployer,
    args: constructorArgs,
    log: true,
  });
};

export default func;
func.tags = ["LpToken"];
