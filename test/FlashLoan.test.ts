import { ethers } from "hardhat";
import { expect } from "chai";
import {
  FlashLoan,
  FlashLoan__factory,
  MyToken,
  MyToken__factory,
  Borrower,
  Borrower__factory,
  Reentrance,
  Reentrance__factory,
  Thief,
  Thief__factory,
} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Flash Loan Contract", () => {
  let flashLoan: FlashLoan;
  let depositSecondConnected: FlashLoan;

  let myToken: MyToken, myUserToken: MyToken;

  let owner: SignerWithAddress, second: SignerWithAddress;

  let borrower: Borrower;
  let reentrance: Reentrance;
  let thief: Thief;

  beforeEach(async () => {
    [owner, second] = await ethers.getSigners();
    flashLoan = await new FlashLoan__factory(owner).deploy(100);
    myToken = await new MyToken__factory(owner).deploy("MyToken", "MTK");

    depositSecondConnected = flashLoan.connect(second);
    myUserToken = myToken.connect(second);
  });

  describe("Borrow function", () => {
    it("borrower returns correct amount of tokens", async () => {
      borrower = await new Borrower__factory(second).deploy();
      await myToken.mint(owner.address, 100000);
      await myToken.approve(flashLoan.address, 100000);

      expect(
        (await myToken.allowance(owner.address, flashLoan.address)).toString()
      ).to.be.equal("100000");

      await myToken.mint(second.address, 1000);

      await myUserToken.approve(borrower.address, 2000);
      await depositSecondConnected.borrowTokens(
        borrower.address,
        myToken.address,
        1000
      );

      expect((await myToken.balanceOf(owner.address)).toString()).to.be.equal(
        "100010"
      );
      expect((await myToken.balanceOf(second.address)).toString()).to.be.equal(
        "990"
      );
    });

    it("borrower returns too less tokens - revert", async () => {
      borrower = await new Borrower__factory(second).deploy();
      await myToken.mint(owner.address, 100000);
      await myToken.approve(flashLoan.address, 100000);

      expect(
        (await myToken.allowance(owner.address, flashLoan.address)).toString()
      ).to.be.equal("100000");

      await myUserToken.approve(borrower.address, 2000);

      await expect(
        depositSecondConnected.borrowTokens(
          borrower.address,
          myToken.address,
          1000
        )
      ).to.be.reverted;

      expect((await myToken.balanceOf(owner.address)).toString()).to.be.equal(
        "100000"
      );
      expect((await myToken.balanceOf(second.address)).toString()).to.be.equal(
        "0"
      );
    });
    it("reentrance flash loan - revert", async () => {
      reentrance = await new Reentrance__factory(second).deploy(
        flashLoan.address
      );

      await myToken.mint(owner.address, 100000);
      await myToken.approve(flashLoan.address, 100000);

      await myToken.mint(second.address, 10000);
      await myUserToken.approve(reentrance.address, 20000);

      await expect(
        depositSecondConnected.borrowTokens(
          reentrance.address,
          myToken.address,
          1000
        )
      ).to.be.reverted;
    });

    it("thief borrower doesn't return tokens - revert", async () => {
      thief = await new Thief__factory(second).deploy();

      await myToken.mint(owner.address, 100000);
      await myToken.approve(flashLoan.address, 100000);

      await myToken.mint(second.address, 1000);
      await myUserToken.approve(thief.address, 2000);

      await expect(
        depositSecondConnected.borrowTokens(
          thief.address,
          myToken.address,
          1000
        )
      ).to.be.revertedWith("incorrect returned value");
    });
  });
});
