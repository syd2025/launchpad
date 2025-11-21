import { test, describe, beforeEach } from "node:test";
import { network } from "hardhat";
import { expect } from "chai";

const TOTAL_SUPPLY = 100000000n;
const NAME = "C2N Token";
const SYMBOL = "C2N";

let breToken: any;
let owner: any;
let ownerAddr: any;
let anotherAccount: any;
let anotherAccountAddr: any;
let recipient: any;
let recipientAddr: any;

async function setupContractAndAccounts() {
  const { viem } = await network.connect();
 
  let accounts = await viem.getWalletClients();
  owner = accounts[0];
  ownerAddr = await owner.account.address;
  anotherAccount = accounts[1];
  anotherAccountAddr = await anotherAccount.account.address;
  recipient = accounts[2];
  recipientAddr = await recipient.account.address;

  breToken = await viem.deployContract("C2NToken", [NAME, SYMBOL, TOTAL_SUPPLY, 18], {
    client: owner
  });
}

// ==================== 简单测试用例 ====================
describe("C2NToken - Simple Tests", function () {
  beforeEach(async function () {
    await setupContractAndAccounts();
  });

  test("should have correct token name", async function () {
    expect(await breToken.read.name()).to.equal(NAME);
  });

  test("should have correct token symbol", async function () {
    expect(await breToken.read.symbol()).to.equal(SYMBOL);
  });

  test("should have correct decimals", async function () {
    expect(await breToken.read.decimals()).to.equal(18);
  });

  test("should have correct total supply", async function () {
    expect(await breToken.read.totalSupply()).to.equal(TOTAL_SUPPLY);
  });

  test("should have correct initial owner balance", async function () {
    expect(await breToken.read.balanceOf([ownerAddr])).to.equal(TOTAL_SUPPLY);
  });

  test("should have zero initial balance for other accounts", async function () {
    expect(await breToken.read.balanceOf([anotherAccountAddr])).to.equal(0n);
    expect(await breToken.read.balanceOf([recipientAddr])).to.equal(0n);
  });

  test("should transfer basic amount correctly", async function () {
    const transferAmount = 1000n;
    
    await breToken.write.transfer([anotherAccountAddr, transferAmount], { 
      account: owner.account 
    });

    expect(await breToken.read.balanceOf([anotherAccountAddr])).to.equal(transferAmount);
  });

  test("should approve basic amount correctly", async function () {
    const approveAmount = 5000n;
    
    await breToken.write.approve([anotherAccountAddr, approveAmount], { 
      account: owner.account 
    });

    expect(await breToken.read.allowance([ownerAddr, anotherAccountAddr])).to.equal(approveAmount);
  });

  test("should burn basic amount correctly", async function () {
    const burnAmount = 1000n;
    const initialBalance = await breToken.read.balanceOf([ownerAddr]);
    
    await breToken.write.burn([burnAmount], { 
      account: owner.account 
    });

    expect(await breToken.read.balanceOf([ownerAddr])).to.equal(initialBalance - burnAmount);
  });

  test("should mint basic amount correctly", async function () {
    const mintAmount = 5000n;
    const initialBalance = await breToken.read.balanceOf([ownerAddr]);
    
    await breToken.write.mint([mintAmount], { 
      account: owner.account 
    });

    expect(await breToken.read.balanceOf([ownerAddr])).to.equal(initialBalance + mintAmount);
  });
});

// ==================== 中等难度测试用例 ====================
describe("C2NToken - Medium Tests", function () {
  beforeEach(async function () {
    await setupContractAndAccounts();
  });

  test("should handle multiple transfers correctly", async function () {
    const transfer1 = 1000n;
    const transfer2 = 2000n;
    
    await breToken.write.transfer([anotherAccountAddr, transfer1], { 
      account: owner.account 
    });
    
    await breToken.write.transfer([recipientAddr, transfer2], { 
      account: owner.account 
    });

    expect(await breToken.read.balanceOf([anotherAccountAddr])).to.equal(transfer1);
    expect(await breToken.read.balanceOf([recipientAddr])).to.equal(transfer2);
    
    const expectedOwnerBalance = TOTAL_SUPPLY - transfer1 - transfer2;
    expect(await breToken.read.balanceOf([ownerAddr])).to.equal(expectedOwnerBalance);
  });

  test("should transferFrom with approval correctly", async function () {
    const approveAmount = 3000n;
    const transferAmount = 1000n;
    
    // Owner approves anotherAccount
    await breToken.write.approve([anotherAccountAddr, approveAmount], { 
      account: owner.account 
    });
    
    // anotherAccount transfers from owner to recipient
    await breToken.write.transferFrom([ownerAddr, recipientAddr, transferAmount], { 
      account: anotherAccount.account 
    });

    expect(await breToken.read.balanceOf([recipientAddr])).to.equal(transferAmount);
    expect(await breToken.read.allowance([ownerAddr, anotherAccountAddr])).to.equal(approveAmount - transferAmount);
  });

  test("should fail when transferring more than balance", async function () {
    const balance = await breToken.read.balanceOf([ownerAddr]);
    const transferAmount = balance + 1n;

    await expect(
      breToken.write.transfer([anotherAccountAddr, transferAmount], { 
        account: owner.account 
      })
    ).to.be.rejected;
  });

  test("should fail transferFrom without approval", async function () {
    const transferAmount = 1000n;
    
    await expect(
      breToken.write.transferFrom([ownerAddr, recipientAddr, transferAmount], { 
        account: anotherAccount.account 
      })
    ).to.be.rejected;
  });

  test("should fail when burning more than balance", async function () {
    const balance = await breToken.read.balanceOf([ownerAddr]);
    const burnAmount = balance + 1n;

    await expect(
      breToken.write.burn([burnAmount], { 
        account: owner.account 
      })
    ).to.be.rejected;
  });

  test("should handle approval changes correctly", async function () {
    const initialApprove = 5000n;
    const newApprove = 3000n;
    
    // Initial approval
    await breToken.write.approve([anotherAccountAddr, initialApprove], { 
      account: owner.account 
    });
    
    // Change approval
    await breToken.write.approve([anotherAccountAddr, newApprove], { 
      account: owner.account 
    });

    expect(await breToken.read.allowance([ownerAddr, anotherAccountAddr])).to.equal(newApprove);
  });

  test("should handle partial allowance consumption", async function () {
    const approveAmount = 5000n;
    const transfer1 = 2000n;
    const transfer2 = 1500n;
    
    // Approve
    await breToken.write.approve([anotherAccountAddr, approveAmount], { 
      account: owner.account 
    });
    
    // First transfer
    await breToken.write.transferFrom([ownerAddr, recipientAddr, transfer1], { 
      account: anotherAccount.account 
    });
    
    // Second transfer
    await breToken.write.transferFrom([ownerAddr, anotherAccountAddr, transfer2], { 
      account: anotherAccount.account 
    });

    expect(await breToken.read.allowance([ownerAddr, anotherAccountAddr])).to.equal(approveAmount - transfer1 - transfer2);
    expect(await breToken.read.balanceOf([recipientAddr])).to.equal(transfer1);
    expect(await breToken.read.balanceOf([anotherAccountAddr])).to.equal(transfer2);
  });

  test("should handle total supply changes correctly", async function () {
    const burnAmount = 1000n;
    const mintAmount = 2000n;
    const initialSupply = await breToken.read.totalSupply();
    
    // Burn
    await breToken.write.burn([burnAmount], { 
      account: owner.account 
    });
    
    expect(await breToken.read.totalSupply()).to.equal(initialSupply - burnAmount);
    
    // Mint
    await breToken.write.mint([mintAmount], { 
      account: owner.account 
    });
    
    expect(await breToken.read.totalSupply()).to.equal(initialSupply - burnAmount + mintAmount);
  });

  test("should handle zero value transfers", async function () {
    const zeroAmount = 0n;
    const initialBalance = await breToken.read.balanceOf([ownerAddr]);
    
    await breToken.write.transfer([anotherAccountAddr, zeroAmount], { 
      account: owner.account 
    });

    expect(await breToken.read.balanceOf([ownerAddr])).to.equal(initialBalance);
    expect(await breToken.read.balanceOf([anotherAccountAddr])).to.equal(0n);
  });

  test("should handle self-transfers correctly", async function () {
    const transferAmount = 1000n;
    const initialBalance = await breToken.read.balanceOf([ownerAddr]);
    
    await breToken.write.transfer([ownerAddr, transferAmount], { 
      account: owner.account 
    });

    expect(await breToken.read.balanceOf([ownerAddr])).to.equal(initialBalance);
  });
});

// ==================== 复杂测试用例 ====================
describe("C2NToken - Complex Tests", function () {
  beforeEach(async function () {
    await setupContractAndAccounts();
  });

  test("should handle complex multi-user operations sequence", async function () {
    const transferAmount = 1000n;
    const approveAmount = 2000n;
    const transferFromAmount = 500n;
    const burnAmount = 300n;
    const mintAmount = 1000n;
    
    const initialOwnerBalance = await breToken.read.balanceOf([ownerAddr]);
    const initialTotalSupply = await breToken.read.totalSupply();

    // Step 1: Transfer tokens to anotherAccount
    await breToken.write.transfer([anotherAccountAddr, transferAmount], { 
      account: owner.account 
    });

    // Step 2: Owner approves anotherAccount to spend tokens
    await breToken.write.approve([anotherAccountAddr, approveAmount], { 
      account: owner.account 
    });
    
    // Step 3: anotherAccount transfers tokens from owner to recipient
    await breToken.write.transferFrom([ownerAddr, recipientAddr, transferFromAmount], { 
      account: anotherAccount.account 
    });

    // Step 4: Burn tokens from owner
    await breToken.write.burn([burnAmount], { 
      account: owner.account 
    });

    // Step 5: Mint tokens to owner
    await breToken.write.mint([mintAmount], { 
      account: owner.account 
    });

    // Verify final state
    const expectedOwnerBalance = initialOwnerBalance - transferAmount - transferFromAmount - burnAmount + mintAmount;
    const expectedAnotherBalance = transferAmount;
    const expectedRecipientBalance = transferFromAmount;
    const expectedTotalSupply = initialTotalSupply - burnAmount + mintAmount;

    expect(await breToken.read.balanceOf([ownerAddr])).to.equal(expectedOwnerBalance);
    expect(await breToken.read.balanceOf([anotherAccountAddr])).to.equal(expectedAnotherBalance);
    expect(await breToken.read.balanceOf([recipientAddr])).to.equal(expectedRecipientBalance);
    expect(await breToken.read.totalSupply()).to.equal(expectedTotalSupply);
  });

  test("should handle circular transferFrom operations", async function () {
    const amount1 = 2000n;
    const amount2 = 1500n;
    const amount3 = 800n;
    
    // Setup: Give tokens to other accounts
    await breToken.write.transfer([anotherAccountAddr, amount1], { 
      account: owner.account 
    });
    await breToken.write.transfer([recipientAddr, amount2], { 
      account: owner.account 
    });

    // Setup approvals
    await breToken.write.approve([anotherAccountAddr, amount3], { 
      account: owner.account 
    });
    await breToken.write.approve([recipientAddr, amount3], { 
      account: anotherAccount.account 
    });
    await breToken.write.approve([ownerAddr, amount3], { 
      account: recipient.account 
    });

    // Get initial balances after setup
    const ownerBalanceAfterSetup = await breToken.read.balanceOf([ownerAddr]);
    const anotherBalanceAfterSetup = await breToken.read.balanceOf([anotherAccountAddr]);
    const recipientBalanceAfterSetup = await breToken.read.balanceOf([recipientAddr]);

    // Circular transfers
    await breToken.write.transferFrom([ownerAddr, anotherAccountAddr, amount3], { 
      account: anotherAccount.account 
    });
    await breToken.write.transferFrom([anotherAccountAddr, recipientAddr, amount3], { 
      account: recipient.account 
    });
    await breToken.write.transferFrom([recipientAddr, ownerAddr, amount3], { 
      account: owner.account 
    });

    // Verify final state by checking changes
    expect(await breToken.read.balanceOf([ownerAddr])).to.equal(ownerBalanceAfterSetup - amount3 + amount3);
    expect(await breToken.read.balanceOf([anotherAccountAddr])).to.equal(anotherBalanceAfterSetup + amount3 - amount3);
    expect(await breToken.read.balanceOf([recipientAddr])).to.equal(recipientBalanceAfterSetup + amount3 - amount3);
  });

  test("should handle large approval amounts", async function () {
    const largeAmount = 1000000000000000000n; // 1e18
    
    // Test with large approval amount
    await breToken.write.approve([anotherAccountAddr, largeAmount], { 
      account: owner.account 
    });

    expect(await breToken.read.allowance([ownerAddr, anotherAccountAddr])).to.equal(largeAmount);
    
    // Test transfer with reasonable amount
    const transferAmount = 1000n;
    await breToken.write.transferFrom([ownerAddr, recipientAddr, transferAmount], { 
      account: anotherAccount.account 
    });

    expect(await breToken.read.balanceOf([recipientAddr])).to.equal(transferAmount);
    expect(await breToken.read.allowance([ownerAddr, anotherAccountAddr])).to.equal(largeAmount - transferAmount);
  });

  test("should handle sequential operations", async function () {
    const operations = [];
    const amounts = [100n, 200n, 300n, 400n, 500n];
    
    // Execute operations sequentially to avoid race conditions
    for (const amount of amounts) {
      await breToken.write.transfer([anotherAccountAddr, amount], { 
        account: owner.account 
      });
    }
    
    // Verify final state
    const totalTransferred = amounts.reduce((sum, amount) => sum + amount, 0n);
    expect(await breToken.read.balanceOf([anotherAccountAddr])).to.equal(totalTransferred);
    expect(await breToken.read.balanceOf([ownerAddr])).to.equal(TOTAL_SUPPLY - totalTransferred);
  });

  test("should handle complex approval and transfer scenarios", async function () {
    const approveAmount = 10000n;
    const transfers = [1000n, 2000n, 1500n, 500n];
    
    // Setup approval
    await breToken.write.approve([anotherAccountAddr, approveAmount], { 
      account: owner.account 
    });

    // Execute multiple transfers from owner to different recipients
    await breToken.write.transferFrom([ownerAddr, recipientAddr, transfers[0]], { 
      account: anotherAccount.account 
    });
    await breToken.write.transferFrom([ownerAddr, anotherAccountAddr, transfers[1]], { 
      account: anotherAccount.account 
    });
    await breToken.write.transferFrom([ownerAddr, recipientAddr, transfers[2]], { 
      account: anotherAccount.account 
    });
    await breToken.write.transferFrom([ownerAddr, anotherAccountAddr, transfers[3]], { 
      account: anotherAccount.account 
    });

    // Verify final state
    const totalTransferred = transfers.reduce((sum, amount) => sum + amount, 0n);
    const totalToRecipient = transfers[0] + transfers[2];
    const totalToAnother = transfers[1] + transfers[3];
    
    expect(await breToken.read.balanceOf([recipientAddr])).to.equal(totalToRecipient);
    expect(await breToken.read.balanceOf([anotherAccountAddr])).to.equal(totalToAnother);
    expect(await breToken.read.allowance([ownerAddr, anotherAccountAddr])).to.equal(approveAmount - totalTransferred);
  });

  test("should handle mint and burn interaction with transfers", async function () {
    const initialTransfer = 5000n;
    const mintAmount = 3000n;
    const burnAmount = 2000n;
    const finalTransfer = 1500n;
    
    const initialOwnerBalance = await breToken.read.balanceOf([ownerAddr]);
    const initialTotalSupply = await breToken.read.totalSupply();
    
    // Initial transfer
    await breToken.write.transfer([anotherAccountAddr, initialTransfer], { 
      account: owner.account 
    });
    
    // Mint new tokens
    await breToken.write.mint([mintAmount], { 
      account: owner.account 
    });
    
    // Burn some tokens
    await breToken.write.burn([burnAmount], { 
      account: owner.account 
    });
    
    // Final transfer
    await breToken.write.transfer([recipientAddr, finalTransfer], { 
      account: owner.account 
    });
    
    // Verify final state
    const expectedOwnerBalance = initialOwnerBalance - initialTransfer - burnAmount + mintAmount - finalTransfer;
    const expectedTotalSupply = initialTotalSupply - burnAmount + mintAmount;
    
    expect(await breToken.read.balanceOf([ownerAddr])).to.equal(expectedOwnerBalance);
    expect(await breToken.read.balanceOf([anotherAccountAddr])).to.equal(initialTransfer);
    expect(await breToken.read.balanceOf([recipientAddr])).to.equal(finalTransfer);
    expect(await breToken.read.totalSupply()).to.equal(expectedTotalSupply);
  });

  test("should handle approval reset scenarios", async function () {
    const initialApprove = 5000n;
    const resetApprove = 1000n;
    const transferAmount = 2000n;
    
    // Initial approval
    await breToken.write.approve([anotherAccountAddr, initialApprove], { 
      account: owner.account 
    });
    
    // Reset approval to lower amount
    await breToken.write.approve([anotherAccountAddr, resetApprove], { 
      account: owner.account 
    });
    
    // Try to transfer more than new approval (should fail)
    await expect(
      breToken.write.transferFrom([ownerAddr, recipientAddr, transferAmount], { 
        account: anotherAccount.account 
      })
    ).to.be.rejected;
    
    // Transfer within new approval limit
    await breToken.write.transferFrom([ownerAddr, recipientAddr, resetApprove], { 
      account: anotherAccount.account 
    });
    
    expect(await breToken.read.balanceOf([recipientAddr])).to.equal(resetApprove);
    expect(await breToken.read.allowance([ownerAddr, anotherAccountAddr])).to.equal(0n);
  });

  test("should handle zero address edge cases", async function () {
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const transferAmount = 1000n;
    const approveAmount = 5000n;
    
    // Should fail to transfer to zero address
    await expect(
      breToken.write.transfer([zeroAddress, transferAmount], { 
        account: owner.account 
      })
    ).to.be.rejected;
    
    // Should fail to approve zero address
    await expect(
      breToken.write.approve([zeroAddress, approveAmount], { 
        account: owner.account 
      })
    ).to.be.rejected;
    
    // Should fail to transferFrom to zero address
    await breToken.write.approve([anotherAccountAddr, approveAmount], { 
      account: owner.account 
    });
    
    await expect(
      breToken.write.transferFrom([ownerAddr, zeroAddress, transferAmount], { 
        account: anotherAccount.account 
      })
    ).to.be.rejected;
  });

  test("should handle state consistency after complex operations", async function () {
    const operations = [];
    const expectedBalances = new Map();
    const expectedAllowances = new Map();
    
    // Initialize expected state
    expectedBalances.set(ownerAddr, TOTAL_SUPPLY);
    expectedBalances.set(anotherAccountAddr, 0n);
    expectedBalances.set(recipientAddr, 0n);
    
    // Perform a series of complex operations
    const transfers = [
      { to: anotherAccountAddr, amount: 1000n },
      { to: recipientAddr, amount: 2000n },
      { to: anotherAccountAddr, amount: 500n }
    ];
    
    for (const transfer of transfers) {
      await breToken.write.transfer([transfer.to, transfer.amount], { 
        account: owner.account 
      });
      expectedBalances.set(ownerAddr, expectedBalances.get(ownerAddr) - transfer.amount);
      expectedBalances.set(transfer.to, expectedBalances.get(transfer.to) + transfer.amount);
    }
    
    // Setup approvals and perform transferFrom operations
    const approveAmount = 3000n;
    await breToken.write.approve([anotherAccountAddr, approveAmount], { 
      account: owner.account 
    });
    expectedAllowances.set(`${ownerAddr}-${anotherAccountAddr}`, approveAmount);
    
    const transferFromAmount = 1500n;
    await breToken.write.transferFrom([ownerAddr, recipientAddr, transferFromAmount], { 
      account: anotherAccount.account 
    });
    expectedBalances.set(ownerAddr, expectedBalances.get(ownerAddr) - transferFromAmount);
    expectedBalances.set(recipientAddr, expectedBalances.get(recipientAddr) + transferFromAmount);
    expectedAllowances.set(`${ownerAddr}-${anotherAccountAddr}`, approveAmount - transferFromAmount);
    
    // Verify all balances match expected state
    expect(await breToken.read.balanceOf([ownerAddr])).to.equal(expectedBalances.get(ownerAddr));
    expect(await breToken.read.balanceOf([anotherAccountAddr])).to.equal(expectedBalances.get(anotherAccountAddr));
    expect(await breToken.read.balanceOf([recipientAddr])).to.equal(expectedBalances.get(recipientAddr));
    expect(await breToken.read.allowance([ownerAddr, anotherAccountAddr])).to.equal(expectedAllowances.get(`${ownerAddr}-${anotherAccountAddr}`));
  });
});