import { ContractFactory } from "ethers";

export const contractConstructorArgs = <T extends ContractFactory>(
  ...args: Parameters<T["deploy"]>
) => args;
