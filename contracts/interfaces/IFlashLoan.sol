interface IFlashLoan {
    function borrowTokens(
        address _userContract,
        address _tokenAddress,
        uint256 _amount
    ) external;
}
