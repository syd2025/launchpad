// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Airdrop {
    IERC20 public airdropToken;
    uint256 public totalTokenWithdrawn;

    mapping(address => bool) public wasClaimed;
    uint256 public constant TOKEN_PER_CLAIM = 100 * 10 ** 18;

    event TokensAirdropped(address beneficiary, uint256 amount);

    constructor(address _airdropToken) {
        require(_airdropToken != address(0));
        airdropToken = IERC20(_airdropToken);
    }

    // 提现
    function withdrawTokens() public {
        require(
            msg.sender == tx.origin,
            "require that message sender is tx-origin"
        );

        address beneficiary = msg.sender;
        require(!wasClaimed[beneficiary], "Already claimed");
        wasClaimed[msg.sender] = true;

        bool status = airdropToken.transfer(beneficiary, TOKEN_PER_CLAIM);
        require(status, "Token transfer status is false");

        totalTokenWithdrawn = totalTokenWithdrawn + TOKEN_PER_CLAIM;
        emit TokensAirdropped(beneficiary, TOKEN_PER_CLAIM);
    }
}
