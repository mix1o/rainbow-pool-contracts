// import { ethers } from "hardhat";
// import { expect } from "chai";
// import {
//   FlashLoan,
//   FlashLoan__factory,
//   MyToken,
//   MyToken__factory,
//   Borrower,
//   Borrower__factory,
//   Reentrance__factory,
//   Thief__factory,
// } from "../typechain-types";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// describe("Flash Loan Contract", () => {
//   let flashLoan: FlashLoan;

//   let myToken: MyToken;

//   let diablo: SignerWithAddress, alwin: SignerWithAddress;

//   let borrower: Borrower;

//   beforeEach(async () => {
//     [diablo, alwin] = await ethers.getSigners();
//     flashLoan = await new FlashLoan__factory(diablo).deploy(100);
//     myToken = await new MyToken__factory(diablo).deploy("MyToken", "MTK");
//   });

//   describe("Borrow function", () => {
//     it("borrower returns correct amount of tokens", async () => {
//       borrower = await new Borrower__factory(alwin).deploy();
//       await myToken.mint(diablo.address, 100000);
//       await myToken.approve(flashLoan.address, 100000);

//       expect(
//         (await myToken.allowance(diablo.address, flashLoan.address)).toString()
//       ).to.be.equal("100000");

//       await myToken.mint(alwin.address, 1000);

//       await myToken.connect(alwin).approve(borrower.address, 2000);
//       await flashLoan
//         .connect(alwin)
//         .borrowTokens(borrower.address, myToken.address, 1000);

//       expect((await myToken.balanceOf(diablo.address)).toString()).to.be.equal(
//         "100010"
//       );
//       expect((await myToken.balanceOf(alwin.address)).toString()).to.be.equal(
//         "990"
//       );
//     });

//     it("borrower returns not enough less tokens - revert", async () => {
//       borrower = await new Borrower__factory(alwin).deploy();
//       await myToken.mint(diablo.address, 100000);
//       await myToken.approve(flashLoan.address, 100000);

//       expect(
//         (await myToken.allowance(diablo.address, flashLoan.address)).toString()
//       ).to.be.equal("100000");

//       await myToken.connect(alwin).approve(borrower.address, 2000);

//       await expect(
//         flashLoan
//           .connect(alwin)
//           .borrowTokens(borrower.address, myToken.address, 1000)
//       ).to.be.reverted;

//       expect((await myToken.balanceOf(diablo.address)).toString()).to.be.equal(
//         "100000"
//       );
//       expect((await myToken.balanceOf(alwin.address)).toString()).to.be.equal(
//         "0"
//       );
//     });
//     it("reentrance flash loan - revert", async () => {
//       const reentrance = await new Reentrance__factory(alwin).deploy(
//         flashLoan.address
//       );

//       await myToken.mint(diablo.address, 100000);
//       await myToken.approve(flashLoan.address, 100000);

//       await myToken.mint(alwin.address, 10000);
//       await myToken.connect(alwin).approve(reentrance.address, 20000);

//       await expect(
//         flashLoan
//           .connect(alwin)
//           .borrowTokens(reentrance.address, myToken.address, 1000)
//       ).to.be.reverted;
//     });

//     it("thief borrower doesn't return tokens - revert", async () => {
//       const thief = await new Thief__factory(alwin).deploy();

//       await myToken.mint(diablo.address, 100000);
//       await myToken.approve(flashLoan.address, 100000);

//       await myToken.mint(alwin.address, 1000);
//       await myToken.connect(alwin).approve(thief.address, 2000);

//       await expect(
//         flashLoan
//           .connect(alwin)
//           .borrowTokens(thief.address, myToken.address, 1000)
//       ).to.be.revertedWith("Incorrect returned value");
//     });
//   });
// });
