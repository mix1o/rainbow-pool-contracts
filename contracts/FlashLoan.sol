pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IFlashLoan.sol";
import "./interfaces/IBorrowers.sol";
import "./Pool.sol";

import "hardhat/console.sol";

contract FlashLoan is Ownable, IFlashLoan, ReentrancyGuard {
  uint256 public fee;
  address public poolAddress;

  constructor(uint256 _fee, address _poolAddress) {
    fee = _fee;
    poolAddress = _poolAddress;
  }

  function borrowTokens(
    address _userContract,
    address _tokenAddress,
    uint256 _amount
  ) public override nonReentrant {
    require(
      IERC20(_tokenAddress).balanceOf(poolAddress) >= _amount,
      "Amount exceeds balance"
    );
    require(
      IERC20(_tokenAddress).allowance(poolAddress, address(this)) >= _amount,
      "Allowance is not set"
    );

    IERC20(_tokenAddress).transferFrom(poolAddress, msg.sender, _amount);

    // uint256 beforeTokens = IERC20(_tokenAddress).balanceOf(poolAddress);

    // uint256 repayment = _amount / fee + _amount;

    // require(
    //   repayment <= IERC20(_tokenAddress).balanceOf(msg.sender),
    //   "You don't have not enough tokens"
    // );

    // Borrowers(_userContract).sendBackTokens(
    //   _tokenAddress,
    //   poolAddress,
    //   repayment
    // );

    // uint256 afterTokens = IERC20(_tokenAddress).balanceOf(poolAddress);

    // require(
    //   beforeTokens + repayment == afterTokens,
    //   "Incorrect returned value"
    // );

    // uint256 reward = _amount / fee;
    // Pool(poolAddress).distributeReward(reward);
  }
}
