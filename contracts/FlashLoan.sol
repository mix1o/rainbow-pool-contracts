pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IFlashLoan.sol";
import "./interfaces/IBorrowers.sol";

contract FlashLoan is Ownable, IFlashLoan, ReentrancyGuard {
  uint256 public fee;

  constructor(uint256 _fee) {
    fee = _fee;
  }

  function borrowTokens(
    address _userContract,
    address _tokenAddress,
    uint256 _amount
  ) public override nonReentrant {
    require(
      IERC20(_tokenAddress).balanceOf(owner()) >= _amount,
      "Amount exceeds balance"
    );
    require(
      IERC20(_tokenAddress).allowance(owner(), address(this)) >= _amount,
      "Allowance is not set"
    );

    IERC20(_tokenAddress).transferFrom(owner(), msg.sender, _amount);

    uint256 beforeTokens = IERC20(_tokenAddress).balanceOf(owner());

    uint256 repayment = _amount / fee + _amount;

    require(
      repayment <= IERC20(_tokenAddress).balanceOf(msg.sender),
      "You don't have not enough tokens"
    );

    Borrowers(_userContract).sendBackTokens(_tokenAddress, owner(), repayment);

    uint256 afterTokens = IERC20(_tokenAddress).balanceOf(owner());

    require(
      beforeTokens + repayment == afterTokens,
      "Incorrect returned value"
    );
  }
}
