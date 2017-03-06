# Receiving Ethers Using a Contract

> This example is a continuation of the [Creating, Deploying and Using Contracts](./Creating, Deploying and Using a Contract.md) example.

## Before you begin

## Introduction

## Contract: ReceiveEther

We will build a `ReceiveEther` contract on the ethereum command line that accepts ethers during 10 minutes. When a transaction send ether to this contract, it is going to transfer the `amount` received to a predefined `receivingAccount`.

### Creating the Contract

``` js
pragma solidity ^0.4.9;

/* Contract accepting ethers during 10 minutes */
contract ReceiveEther {

    address public receivingAccount;
    uint public deadline;

    /* at initialization, setup the owner account 
       and the deadline of the contract */
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
    function dispose() afterDeadline {
        // mark this contract as deleted, remove it from the Ethereum Virtual Machine (EVM)'s state
        // and transfer the refund to the account.
        suicide(receivingAccount);
    }
}
```

The constructor `ReceiveEther(address _account)` sets the `receivingAccount` using the parameter provided and the deadline as 10 minutes. The nameless function `()` is invoked each time a transaction towards the address of this contract is executed. When `afterDeadline()` is reached, the contract `dispose()` itself.

The `suicide(address)` method uses negative gas because the operation frees up space on the blockchain by clearing all of the contract's data from the Ethereum Virtual Machine (EVM). As a result, when you check the balance of `Account 1`, you should see that the balance is increased.

### Compiling the Contract

Upon compiling the above solidty code using the [online Solidity compiler](https://ethereum.github.io/browser-solidity/), we will have a JavaScript code as below.

```
var _account = /* var of type address here */ ;
var untitled_receiveetherContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"deadlineReached","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"receivingAccount","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_account","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"}]);
var untitled_receiveether = untitled_receiveetherContract.new(
   _account,
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000c57fe5b60405160208061016f83398101604052515b60008054600160a060020a031916600160a060020a03831617905542610258016001555b505b61011c806100536000396000f3006060604052361560375763ffffffff60e060020a60003504166329dcb0cf8114606a578063a29b8b91146089578063e0486c39146098575b60685b600080546040513492600160a060020a039092169183156108fc02918491818181858888f150505050505b50565b005b3415607157fe5b607760c1565b60408051918252519081900360200190f35b3415609057fe5b606860c7565b005b3415609f57fe5b60a560e1565b60408051600160a060020a039092168252519081900360200190f35b60015481565b600154421060dd57600054600160a060020a0316ff5b5b5b565b600054600160a060020a0316815600a165627a7a723058200744edd8d6041bd63b49e11716bbf334b2baa91462aae800218eecbded25494f0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
 ```
 
 However, before deploying it, we need to configure the account we want to use, say `Account 1`. In this sense, first we set the `_account` parameter (i.e. receiving account) as `eth.accounts[1]`. Then we modify `from: web3.eth.accounts[0]` to `from: web3.eth.accounts[1]` (the account used during deployment). 
 
 
```
// must set the _account parameter
var _account = eth.accounts[1] ;
var untitled_receiveetherContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"deadlineReached","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"receivingAccount","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_account","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"}]);
var untitled_receiveether = untitled_receiveetherContract.new(
   _account,
   {
     from: web3.eth.accounts[1], 
     data: '0x6060604052341561000c57fe5b60405160208061016f83398101604052515b60008054600160a060020a031916600160a060020a03831617905542610258016001555b505b61011c806100536000396000f3006060604052361560375763ffffffff60e060020a60003504166329dcb0cf8114606a578063a29b8b91146089578063e0486c39146098575b60685b600080546040513492600160a060020a039092169183156108fc02918491818181858888f150505050505b50565b005b3415607157fe5b607760c1565b60408051918252519081900360200190f35b3415609057fe5b606860c7565b005b3415609f57fe5b60a560e1565b60408051600160a060020a039092168252519081900360200190f35b60015481565b600154421060dd57600054600160a060020a0316ff5b5b5b565b600054600160a060020a0316815600a165627a7a723058200744edd8d6041bd63b49e11716bbf334b2baa91462aae800218eecbded25494f0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
 ```

One thing here we are missing is that, in geth, accounts are locked by default. Thus, if the contract is deployed as above, `Account 1` should also be manually unlocked, otherwise the contract will not be able transfer ethers. One way to tackle this is to embed the unlock command inside the JavaSacript code.

```
// must unlock the account we are creating the contract from so we can use it
personal.unlockAccount(eth.accounts[1],"Node01Account01")
// must set the _account parameter
var _account = eth.accounts[1] ;
var untitled_receiveetherContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"deadlineReached","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"receivingAccount","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_account","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"}]);
var untitled_receiveether = untitled_receiveetherContract.new(
   _account,
   {
     from: web3.eth.accounts[1], 
     data: '0x6060604052341561000c57fe5b60405160208061016f83398101604052515b60008054600160a060020a031916600160a060020a03831617905542610258016001555b505b61011c806100536000396000f3006060604052361560375763ffffffff60e060020a60003504166329dcb0cf8114606a578063a29b8b91146089578063e0486c39146098575b60685b600080546040513492600160a060020a039092169183156108fc02918491818181858888f150505050505b50565b005b3415607157fe5b607760c1565b60408051918252519081900360200190f35b3415609057fe5b606860c7565b005b3415609f57fe5b60a560e1565b60408051600160a060020a039092168252519081900360200190f35b60015481565b600154421060dd57600054600160a060020a0316ff5b5b5b565b600054600160a060020a0316815600a165627a7a723058200744edd8d6041bd63b49e11716bbf334b2baa91462aae800218eecbded25494f0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
 ```
 
### Deploying the Contract

Now save the above code as `ReceiveEther.js` and deploy it using `loadScript("ReceiveEther.js")`.

```
> loadScript("ReceiveEther.js")
null [object Object]
true
> null [object Object]
Contract mined! address: 0x32da52e91e55334e36bc9eab5023698bcd475490 transactionHash: 0x61a24948b2586adc3e5a690c9b197fa14b39507b1aa1f105dbb58493699f330f
>  
```

### Using the Contract

After the contract is mined successfully, a transaction can be performed from another address towards this contract using its address (`0x32da52e91e55334e36bc9eab5023698bcd475490`). For example, suppose we want to send `1.0` ethers to the contract from `Account 2`.

```
> var tx = {from:  personal.listAccounts[2], to: "0x32da52e91e55334e36bc9eab5023698bcd475490", value: web3.toWei(1.0, "ether")}
undefined
> personal.sendTransaction(tx, "Node01Account02")
"0xbaa63adb5c669fde8867a13efa321f9f23ea84d0f7cf54563940093047708b1a"
>
```

## What is next?


