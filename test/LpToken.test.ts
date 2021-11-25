import { ethers } from "hardhat";
import { expect } from "chai";
import { parseUnits } from "@ethersproject/units";
import {
  LpToken,
  LpToken__factory,
  Pool,
  Pool__factory,
  MyToken__factory,
  MyToken,
} from "../typechain-types";

describe("LpToken Contract", () => {
  it("collectRewards method transfers correct amount of tokens", async () => {
    const [poolOwner, tokenOwner, alwin, borys, diablo] =
      await ethers.getSigners();

    const pool: Pool = await new Pool__factory(poolOwner).deploy();
    const myToken: MyToken = await new MyToken__factory(tokenOwner).deploy(
      "MyToken",
      "MTK"
    );
    const lpToken: LpToken = await new LpToken__factory(poolOwner).deploy(
      "LpToken",
      "LPT",
      pool.address,
      myToken.address
    );

    //1. Alwin buys LP
    await lpToken.mint(alwin.address, parseUnits("50"));
    expect((await lpToken.balanceOf(alwin.address)).toString()).to.be.equal(
      parseUnits("50")
    );

    //2. Borys buys LP
    await lpToken.mint(borys.address, parseUnits("40"));
    expect((await lpToken.balanceOf(borys.address)).toString()).to.be.equal(
      parseUnits("40")
    );

    //3. Pool makes 50 tokens
    await myToken.mint(lpToken.address, parseUnits("50"));
    expect((await myToken.balanceOf(lpToken.address)).toString()).to.be.equal(
      parseUnits("50")
    );

    //4. Borys claims
    await lpToken.connect(borys).collectRewards();
    expect((await myToken.balanceOf(borys.address)).toString()).to.be.equal(
      "22222222222222222200"
    );

    //5. Pool makes 70 tokens
    await myToken.mint(lpToken.address, parseUnits("70"));

    //6. Alwin claims and sells
    await lpToken.connect(alwin).collectRewards();
    expect((await myToken.balanceOf(alwin.address)).toString()).to.be.equal(
      "66666666666666666600"
    );

    await lpToken
      .connect(alwin)
      .burn((await lpToken.balanceOf(alwin.address)).toString());
    expect((await lpToken.balanceOf(alwin.address)).toString()).to.be.equal(
      "0"
    );

    //7. Diablo buys 20
    await lpToken.mint(diablo.address, parseUnits("20"));
    expect((await lpToken.balanceOf(diablo.address)).toString()).to.be.equal(
      parseUnits("20")
    );

    //8. Diablo claims
    await lpToken.connect(diablo).collectRewards();
    expect((await myToken.balanceOf(diablo.address)).toString()).to.be.equal(
      "0"
    );

    //9. Borys Claims
    await lpToken.connect(borys).collectRewards();
    expect((await myToken.balanceOf(borys.address)).toString()).to.be.equal(
      "53333333333333333280"
    );

    //10. Pool makes 100 rubens
    await myToken.mint(lpToken.address, parseUnits("100"));

    //11. Diablo claims
    await lpToken.connect(diablo).collectRewards();
    expect((await myToken.balanceOf(diablo.address)).toString()).to.be.equal(
      "33333333333333333320"
    );
  });
});
