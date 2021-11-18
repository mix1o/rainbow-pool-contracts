import { ethers } from "hardhat";
import { expect } from "chai";
import {
  FlashLoan,
  FlashLoan__factory,
  MyToken,
  MyToken__factory,
  Borrower,
  Borrower__factory,
  LpToken,
  Pool,
  Pool__factory,
  LpToken__factory,
  Borrowers__factory,
} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Pool Contract", () => {
  let flashLoan: FlashLoan;
  let pool: Pool;

  let myToken: MyToken;
  let lpToken: LpToken;

  let diablo: SignerWithAddress,
    alwin: SignerWithAddress,
    poolOwner: SignerWithAddress,
    tokenOwner: SignerWithAddress;

  let borrower: Borrower;

  beforeEach(async () => {
    [diablo, alwin, poolOwner, tokenOwner] = await ethers.getSigners();

    pool = await new Pool__factory(poolOwner).deploy();
    lpToken = await new LpToken__factory(poolOwner).deploy("LpToken", "LPT");
    myToken = await new MyToken__factory(tokenOwner).deploy("MyToken", "MTK");

    flashLoan = await new FlashLoan__factory(poolOwner).deploy(
      100,
      pool.address
    );

    borrower = await new Borrower__factory(alwin).deploy();
  });

  describe("pool", () => {
    it.only("deposit", async () => {
      await myToken.mint(diablo.address, 10000);
      await myToken.connect(diablo).approve(pool.address, 10000);

      await lpToken.grantPoolRole(pool.address);
      await pool.setLpToken(lpToken.address);
      await pool.setToken(myToken.address);

      await pool.connect(diablo).deposit(10000);

      console.log("pool t", (await myToken.balanceOf(pool.address)).toString());

      console.log(
        "diablo lp",
        (await lpToken.balanceOf(diablo.address)).toString()
      );

      console.log("stake", (await pool.userStake(diablo.address)).toString());

      await myToken.mint(alwin.address, 20000);
      //   await myToken.mint(poolOwner.address, 20000);

      await myToken.connect(alwin).approve(borrower.address, 2000);

      await myToken.connect(pool).approve(flashLoan.address, 1000000); //   ERR

      await flashLoan
        .connect(alwin)
        .borrowTokens(borrower.address, myToken.address, 1000);

      //   console.log(
      //     "token pool",
      //     (await myToken.balanceOf(pool.address)).toString()
      //   );
      //   console.log(
      //     "token alwin",
      //     (await myToken.balanceOf(alwin.address)).toString()
      //   );
    });
  });
});
