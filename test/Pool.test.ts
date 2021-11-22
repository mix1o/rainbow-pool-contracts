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
  LpToken__factory,
  Pool,
  Pool__factory,
} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseUnits } from "@ethersproject/units";

describe("Pool Contract", () => {
  let flashLoan: FlashLoan;
  let pool: Pool;

  let myToken: MyToken;
  let lpToken: LpToken;

  let diablo: SignerWithAddress,
    alwin: SignerWithAddress,
    poolOwner: SignerWithAddress,
    tokenOwner: SignerWithAddress,
    cheater: SignerWithAddress;

  let borrower: Borrower;

  beforeEach(async () => {
    [diablo, alwin, poolOwner, tokenOwner, cheater] = await ethers.getSigners();

    pool = await new Pool__factory(poolOwner).deploy();
    myToken = await new MyToken__factory(tokenOwner).deploy("MyToken", "MTK");
    lpToken = await new LpToken__factory(poolOwner).deploy(
      "LpToken",
      "LPT",
      pool.address,
      myToken.address
    );

    flashLoan = await new FlashLoan__factory(poolOwner).deploy(
      100,
      pool.address
    );

    borrower = await new Borrower__factory(alwin).deploy();

    await myToken.mint(diablo.address, parseUnits("30"));
    await myToken.mint(alwin.address, parseUnits("20"));

    await myToken.connect(diablo).approve(pool.address, parseUnits("30"));
    await myToken.connect(alwin).approve(borrower.address, parseUnits("20"));

    await lpToken.grantPoolRole();

    await pool.setLpToken(lpToken.address);
    await pool.setToken(myToken.address);
    await pool.setInitialAllowance(flashLoan.address);

    await pool.connect(diablo).deposit(parseUnits("30"));

    expect((await myToken.balanceOf(diablo.address)).toString()).to.be.equal(
      "0"
    );

    await flashLoan
      .connect(alwin)
      .borrowTokens(borrower.address, myToken.address, parseUnits("10"));
  });

  it("user calls function collectRewards twice - should get only one reward", async () => {
    await lpToken.connect(diablo).collectRewards();

    expect((await myToken.balanceOf(diablo.address)).toString()).to.be.equal(
      "99999999999999990"
    );

    await lpToken.connect(diablo).collectRewards();

    expect((await myToken.balanceOf(diablo.address)).toString()).to.be.equal(
      "99999999999999990"
    );
  });

  it("user is not able to cheat pool contract", async () => {
    await lpToken.connect(diablo).collectRewards();

    expect((await myToken.balanceOf(diablo.address)).toString()).to.be.equal(
      "99999999999999990"
    );

    await lpToken.connect(diablo).transfer(cheater.address, parseUnits("2"));

    expect((await lpToken.balanceOf(cheater.address)).toString()).to.be.equal(
      parseUnits("2")
    );

    expect((await myToken.balanceOf(cheater.address)).toString()).to.be.equal(
      "0"
    );

    await lpToken.connect(cheater).collectRewards();

    expect((await myToken.balanceOf(cheater.address)).toString()).to.be.equal(
      "0"
    );
  });
  it("function withdraw works correctly", async () => {
    expect((await lpToken.balanceOf(diablo.address)).toString()).to.be.equal(
      parseUnits("30")
    );
    await lpToken
      .connect(diablo)
      .approve(
        pool.address,
        (await lpToken.balanceOf(diablo.address)).toString()
      );
    await pool.connect(diablo).withdraw();
    expect((await lpToken.balanceOf(diablo.address)).toString()).to.be.equal(
      parseUnits("0")
    );

    expect((await myToken.balanceOf(diablo.address)).toString()).to.be.equal(
      "30099999999999999990"
    );
  });
});
