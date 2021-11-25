pragma solidity ^0.8.6;
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LpToken is ERC20PresetMinterPauser, Ownable {
    address public poolAddress;
    address public tokenAddress;
    uint256 public stake = 0;
    uint256 public lastBalance = 0;

    mapping(address => uint256) public userStake;

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

    function countReward() public returns (uint256) {
        uint256 currentBalance = IERC20(tokenAddress).balanceOf(address(this));
        if (lastBalance != currentBalance) {
            uint256 reward = currentBalance - lastBalance;
            lastBalance = currentBalance;
            return reward;
        }
        return 0;
    }

    function collectRewards() public {
        _collectRewards(msg.sender);
    }

    function distributeReward(uint256 _reward) public {
        stake = stake + (_reward * 10**decimals()) / totalSupply();
    }

    function _collectRewards(address _userAddress) private {
        uint256 reward = countReward();

        distributeReward(reward);
        uint256 amount = ((stake - userStake[_userAddress]) *
            balanceOf(_userAddress)) / 10**decimals();
        userStake[_userAddress] = stake;

        IERC20(tokenAddress).transfer(_userAddress, amount);
        lastBalance -= amount;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        if (to != address(0) && totalSupply() > 0) {
            _collectRewards(to);
        }

        if (from != address(0) && totalSupply() > 0) {
            _collectRewards(from);
        }
    }
}
