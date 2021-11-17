interface Borrowers {
    function sendBackTokens(
        address _tokenAddress,
        address _recipient,
        uint256 _repayment
    ) external;
}
