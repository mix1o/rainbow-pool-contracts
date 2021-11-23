pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./LpToken.sol";

contract Pool is Ownable, AccessControl {
  address public tokenAddress;
  address public lpTokenAddress;
  address public flashLoanAddress;
  uint256 public stake = 0;
  uint256 public decimals = 18;

  mapping(address => uint256) public userStake;

  bytes32 public constant STAKE_CONTROLLER_ROLE =
    keccak256("STAKE_CONTROLLER_ROLE");

  function grantRoleController() public onlyOwner {
    _setupRole(STAKE_CONTROLLER_ROLE, flashLoanAddress);
    _setupRole(STAKE_CONTROLLER_ROLE, lpTokenAddress);
  }

  function setLpToken(address _lpTokenAddress) public onlyOwner {
    lpTokenAddress = _lpTokenAddress;
  }

  function setFlashLoan(address _flashLoanAddress) public onlyOwner {
    flashLoanAddress = _flashLoanAddress;
  }

  function setToken(address _tokenAddress) public onlyOwner {
    tokenAddress = _tokenAddress;
  }

  function distributeReward(uint256 _reward)
    public
    onlyRole(STAKE_CONTROLLER_ROLE)
  {
    stake =
      stake +
      ((_reward * 10**decimals) / IERC20(lpTokenAddress).totalSupply());
  }

  function setInitialAllowance(address _flashLoanAddress) public onlyOwner {
    IERC20(tokenAddress).approve(_flashLoanAddress, type(uint256).max);
    IERC20(tokenAddress).approve(lpTokenAddress, type(uint256).max);
  }

  function changeUserStake(address _user)
    public
    onlyRole(STAKE_CONTROLLER_ROLE)
  {
    userStake[_user] = stake;
  }

  function withdraw() public {
    uint256 amount = IERC20(lpTokenAddress).balanceOf(msg.sender);

    LpToken(lpTokenAddress).burnFrom(msg.sender, amount);
    require(
      IERC20(tokenAddress).transfer(msg.sender, amount),
      "Transfer failed"
    );
  }

  function deposit(uint256 _amount) public {
    require(
      IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount),
      "Transfer failed"
    );

    LpToken(lpTokenAddress).mint(msg.sender, _amount);
  }
}
