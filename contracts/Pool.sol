pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LpToken.sol";

contract Pool {
  address public tokenAddress;
  address public lpTokenAddress;
  uint256 public stake = 0;

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
      (_reward / LpToken(lpTokenAddress).balanceOf(address(this)));
  }

  function deposit(uint256 _amount) public {
    IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
    LpToken(lpTokenAddress).mint(msg.sender, _amount);
    // if (userStake[msg.sender] != 0) {
    //   LpToken(lpTokenAddress).collectRewards(
    //     stake,
    //     userStake[msg.sender],
    //     tokenAddress
    //   );
    //   userStake[msg.sender] = 0;
    // } else {
    //   userStake[msg.sender] = stake;
    // }
  }
}
