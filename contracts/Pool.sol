pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LpToken.sol";

contract Pool is Ownable {
  address public tokenAddress;
  address public lpTokenAddress;
  uint256 public stake = 0;
  uint256 public decimals = 18;

  mapping(address => uint256) public userStake;

  function setLpToken(address _lpTokenAddress) public {
    lpTokenAddress = _lpTokenAddress;
  }

  function setToken(address _tokenAddress) public {
    tokenAddress = _tokenAddress;
  }

  function distributeReward(uint256 _reward) public {
    stake =
      stake +
      ((_reward * 10**decimals) / IERC20(lpTokenAddress).totalSupply());
  }

  function setInitialAllowance(address _flashLoanAddress) public onlyOwner {
    IERC20(tokenAddress).approve(_flashLoanAddress, type(uint256).max);
    IERC20(tokenAddress).approve(lpTokenAddress, type(uint256).max);
  }

  function changeUserStake(address _user) public {
    userStake[_user] = stake;
  }

  function withdraw() public {
    uint256 amount = IERC20(lpTokenAddress).balanceOf(msg.sender);

    LpToken(lpTokenAddress).burnFrom(msg.sender, amount);

    IERC20(tokenAddress).transfer(msg.sender, amount);
  }

  function deposit(uint256 _amount) public {
    IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);

    LpToken(lpTokenAddress).mint(msg.sender, _amount);
  }
}
