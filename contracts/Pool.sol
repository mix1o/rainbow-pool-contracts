pragma solidity ^0.8.6;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LpToken.sol";

contract Pool is Ownable {
    address public tokenAddress;
    address public lpTokenAddress;
    address public flashLoanAddress;

    event PoolEarned(address poolAddress, uint256 reward);

    event Deposit(address poolAddress, uint256 tokenAmount, address depositor);
    event Withdraw(
        address poolAddress,
        uint256 tokenAmount,
        address withdrawer
    );

    function setConfigurationPool(
        address _lpTokenAddress,
        address _flashLoanAddress,
        address _tokenAddress
    ) public onlyOwner {
        lpTokenAddress = _lpTokenAddress;
        tokenAddress = _tokenAddress;
        flashLoanAddress = _flashLoanAddress;

        IERC20(_tokenAddress).approve(_flashLoanAddress, type(uint256).max);
    }

    function withdraw() public {
        uint256 amount = IERC20(lpTokenAddress).balanceOf(msg.sender);

        LpToken(lpTokenAddress).burnFrom(msg.sender, amount);
        require(
            IERC20(tokenAddress).transfer(msg.sender, amount),
            "Transfer failed"
        );

        emit Withdraw(address(this), amount, msg.sender);
    }

    function deposit(uint256 _amount) public {
        require(
            IERC20(tokenAddress).transferFrom(
                msg.sender,
                address(this),
                _amount
            ),
            "Transfer failed"
        );

        LpToken(lpTokenAddress).mint(msg.sender, _amount);

        emit Deposit(address(this), _amount, msg.sender);
    }

    function sendReward(uint256 _reward) public {
        IERC20(tokenAddress).transfer(lpTokenAddress, _reward);

        emit PoolEarned(address(this), _reward);
    }
}
