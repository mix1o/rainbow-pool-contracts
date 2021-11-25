/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import dotenv from "dotenv";

dotenv.config();
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    rinkeby: {
      saveDeployments: true,
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
