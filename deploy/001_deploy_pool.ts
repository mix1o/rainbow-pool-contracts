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

  if (deployment.newlyDeployed && deployment.transactionHash) {
    const chainId = await hre.getChainId();
    const ETHERSCAN_CHAINS = ["1", "2", "3", "4", "5"];

    await hre.ethers.provider.waitForTransaction(deployment.transactionHash, 5);
    if (ETHERSCAN_CHAINS.includes(chainId)) {
      return hre.run("verify:verify", {
        address: deployment.address,
        constructorArguments: constructorArgs,
      });
    } else {
      return hre.run("sourcify");
    }
  }
};

export default func;
func.tags = ["Pool"];
