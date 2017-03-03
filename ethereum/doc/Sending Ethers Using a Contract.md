# Sending Ethers Using a Contract

> This example is a continuation of the [Creating, Deploying and Using Contracts](./Creating, Deploying and Using a Contract.md) example.

## Before you begin

## Introduction

## Contract: SendEthers

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

    /* The function without name is the default function that is called whenever anyone sends funds to a contract */
    function () public payable {
        uint amount = msg.value;
        receivingAccount.send(amount);
    }

    modifier afterDeadline() { if (now >= deadline) _; }

    /* checks if the time limit has been reached and ends the contract */
    function deadlineReached() afterDeadline {
        suicide(receivingAccount);
    }
}
```
