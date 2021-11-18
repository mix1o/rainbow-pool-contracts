pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LpToken is ERC20PresetMinterPauser {
  constructor(string memory _name, string memory _symbol)
    ERC20PresetMinterPauser(_name, _symbol)
  {}

  function grantPoolRole(address _poolAddress) public {
    grantRole(MINTER_ROLE, _poolAddress);
  }

  function collectRewards(
    uint256 _stake,
    uint256 _userStake,
    address _tokenAddress
  ) public {
    uint256 amount = (_stake - _userStake) *
      IERC20(_tokenAddress).balanceOf(msg.sender);

    IERC20(_tokenAddress).transfer(msg.sender, amount);
  }
}
