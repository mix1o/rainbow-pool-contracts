pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Pool.sol";

contract LpToken is ERC20PresetMinterPauser, Ownable {
  address public poolAddress;
  address public tokenAddress;

  constructor(
    string memory _name,
    string memory _symbol,
    address _poolAddress,
    address _tokenAddress
  ) ERC20PresetMinterPauser(_name, _symbol) {
    poolAddress = _poolAddress;
    tokenAddress = _tokenAddress;
  }

  function grantPoolRole() public onlyOwner {
    grantRole(MINTER_ROLE, poolAddress);
  }

  function collectRewards() public {
    _collectRewards(msg.sender);
  }

  function _collectRewards(address _userAddress) private {
    uint256 amount = ((Pool(poolAddress).stake() -
      Pool(poolAddress).userStake(_userAddress)) *
      this.balanceOf(_userAddress)) / 10**Pool(poolAddress).decimals();

    IERC20(tokenAddress).transferFrom(poolAddress, _userAddress, amount);
    Pool(poolAddress).changeUserStake(_userAddress);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal virtual override {
    super._beforeTokenTransfer(from, to, amount);

    if (to != address(0)) {
      _collectRewards(to);
    }
    if (from != address(0)) {
      _collectRewards(from);
    }
  }
}
