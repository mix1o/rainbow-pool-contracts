pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IBorrowers.sol";
import "./interfaces/IFlashLoan.sol";

contract Borrower is Ownable, Borrowers {
  function sendBackTokens(
    address _tokenAddress,
    address _recipient,
    uint256 _repayment
  ) public virtual override {
    IERC20(_tokenAddress).transferFrom(owner(), _recipient, _repayment);
  }
}

contract Reentrance is Ownable, Borrowers {
  address public lender;

  constructor(address _lender) {
    lender = _lender;
  }

  function sendBackTokens(
    address _tokenAddress,
    address _recipient,
    uint256 _repayment
  ) public override {
    IERC20(_tokenAddress).transferFrom(owner(), _recipient, _repayment);

    IFlashLoan(lender).borrowTokens(address(this), _tokenAddress, 1000);
  }
}

contract Thief is Ownable, Borrowers {
  function sendBackTokens(
    address _tokenAddress,
    address _recipient,
    uint256 _repayment
  ) public override {}
}
