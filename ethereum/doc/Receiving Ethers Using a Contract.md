# Receiving Ethers Using a Contract

> This example is a continuation of the [Creating, Deploying and Using Contracts](./Creating, Deploying and Using a Contract.md) example.

## Before you begin

## Introduction

## Contract: ReceiveEther

We will build a `ReceiveEther` contract on the ethereum command line that accepts ethers during 10 minutes. When a transaction send ether to this contract, it is going to transfer the `amount` received to a predefined `receivingAccount`.

``` js
pragma solidity ^0.4.9;

/* Contract accepting ethers during 10 minutes */
contract ReceiveEther {

    address public receivingAccount;
    uint public deadline;

    /*  at initialization, setup the owner */
    function ReceiveEther(address _account) {
        receivingAccount = _account;
        deadline = now + 10 * 1 minutes;
    }   

    /* The function without name is the default function that is called whenever 
       anyone sends funds to a contract */
    function () public payable {
        uint amount = msg.value;
        receivingAccount.send(amount);
    }

    modifier afterDeadline() { if (now >= deadline) _; }

    /* checks if the time limit has been reached and ends the contract */
    function deadlineReached() afterDeadline {
        // mark this contract as deleted, remove it from the Ethereum Virtual Machine (EVM)'s state
        // and transfer the refund to the account.
        suicide(receivingAccount);
    }
}
```

The `suicide(address)` method uses negative gas because the operation frees up space on the blockchain by clearing all of the contract's data from the Ethereum Virtual Machine (EVM). As a result, when you check the balance of `Account1`, you should see that the balance is increased.
