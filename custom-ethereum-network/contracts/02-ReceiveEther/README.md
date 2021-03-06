# Receiving Ethers Using a Contract

> This example is a continuation of the [Creating, Deploying and Using Contracts](../01-HelloWorld/README.md) example.

## Before you begin

Before you begin, make sure that the [Solidity](http://solidity.readthedocs.io/en/develop/index.html) compiler is installed as described [here](https://github.com/ethereum/go-ethereum/wiki/Contract-Tutorial#install-solc-on-ubuntu). To verify if Solidy is installed correctly, go to the geth console and type the `eth.getCompilers()` command. 

``` js
> eth.getCompilers()
["Solidity"]
> 
```

This example is prepared by using the geth version `1.5.9-stable` which is using Go version `go1.7.3` and tested on `Ubuntu 14.04.5`. 

``` bash
Geth
Version: 1.5.9-stable
Git Commit: a07539fb88db7231d18db918ed7a6a4e32f97450
Protocol Versions: [63 62]
Network Id: 1
Go Version: go1.7.3
OS: linux
GOPATH=
GOROOT=/usr/lib/go-1.7
```

## Introduction

In this example, we will create, deploy and use a simple contract to show how contracts process transactions. 

> This contract has aldready been developed and can be found in `./contracts/02-ReceiveEther/ReceiveEther.sol` file. If you are only interested in the deployment and usage of the contract, you can continue from this [section](#deploying-the-contract).

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

    /* a modifier works as a guard for its dedicated function */
    modifier afterDeadline() { if (now >= deadline) _; }

    /* if invoked after the deadline, it ends the contract and makes a refund. */
    function dispose() afterDeadline {
        // mark this contract as deleted, remove it from the Ethereum Virtual Machine (EVM)'s state
        // and transfer the refund to the account.
        selfdestruct(receivingAccount);
    }
}
```

The constructor `ReceiveEther(address _account)` sets the `receivingAccount` using the parameter provided and the deadline as 10 minutes. The nameless function `()` is invoked each time a transaction towards the address of this contract is executed. After the  `afterDeadline()` is reached, the contract can be disposed by using the `dispose()` function.

The `selfdestruct(address)` function (it was called `suicide(address)` previously) uses negative gas because the operation frees up space on the blockchain by clearing all of the contract's data from the Ethereum Virtual Machine (EVM). As a result, when you check the balance of `receivingAccount`, you should see that the balance is increased.

### Compiling the Contract

Upon compiling the above solidty code using the [online Solidity compiler](https://ethereum.github.io/browser-solidity/), we will have a JavaScript code as below.

``` js
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
 
 
``` js
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

``` js
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

Now save the above code as `deploy.js` and deploy it using `loadScript("deploy.js")`.

``` bash
> loadScript("contracts/02-ReceiveEther/deploy.js")
null [object Object]
true
> null [object Object]
Contract mined! address: 0x32da52e91e55334e36bc9eab5023698bcd475490 transactionHash: 0x61a24948b2586adc3e5a690c9b197fa14b39507b1aa1f105dbb58493699f330f
>  
```

### Using the Contract

After the contract is mined successfully, a transaction can be performed from another address towards this contract using its address (`0x32da52e91e55334e36bc9eab5023698bcd475490`). For example, suppose we want to send `1.0` ethers to the contract from `Account 2`.

``` bash
> var tx = {from:  personal.listAccounts[2], to: "0x32da52e91e55334e36bc9eab5023698bcd475490", value: web3.toWei(1.0, "ether")}
undefined
> personal.sendTransaction(tx, "node01account")
"0xbaa63adb5c669fde8867a13efa321f9f23ea84d0f7cf54563940093047708b1a"
>
```

Verify the transaction by checking the balances of both accounts using `web3.fromWei(eth.getBalance(eth.accounts[1]), "ether")` and `web3.fromWei(eth.getBalance(eth.accounts[2]), "ether")`. 

Also verify, after the deadline, the refund to `Account 2`.

### Adding an Event

Let's make the contract a bit more realistic and create a contract event for logging ether receivals. Solidity is able to emit events for the external (outside of EVM) listeners to listen to them. Suppose we want to keep track of receival of ethers. We can define an event `event EtherReceival(address sender, uint amount);` for this.

``` js
pragma solidity ^0.4.9;

/* Contract accepting ethers during 10 minutes */
contract ReceiveEther {

    address public receivingAccount;
    uint public deadline;
    event EtherReceival(address sender, uint amount);

    /*  at initialization, setup the owner */
    function ReceiveEther(address _account) {
        // set the receiving account
        receivingAccount = _account;
        // set the deadline as 10 minutes
        deadline = now + 10 * 1 minutes;
    }   

    /* The function without name is the default function that is called whenever 
       anyone sends funds to a contract */
    function () public payable {
        uint amount = msg.value;
        receivingAccount.send(amount);
        EtherReceival(msg.sender, amount);
    }

    modifier afterDeadline() { if (now >= deadline) _; }

    /* checks if the time limit has been reached and ends the contract */
    function dispose() afterDeadline {
        suicide(receivingAccount);
    }
}
```

The compiled code is very similar to the previous one.

``` js
var _account = /* var of type address here */ ;
var untitled_receiveetherContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"dispose","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"receivingAccount","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_account","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"EtherReceival","type":"event"}]);
var untitled_receiveether = untitled_receiveetherContract.new(
   _account,
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000c57fe5b6040516020806101c383398101604052515b60008054600160a060020a031916600160a060020a03831617905542610258016001555b505b610170806100536000396000f3006060604052361561003b5763ffffffff60e060020a60003504166329dcb0cf81146100b45780634c86659e146100d6578063e0486c39146100e8575b6100b25b600080546040513492600160a060020a039092169183156108fc02918491818181858888f1505060408051600160a060020a03331681526020810186905281517f75f33ed68675112c77094e7c5b073890598be1d23e27cd7f6907b4a7d98ac61995509081900390910192509050a15b50565b005b34156100bc57fe5b6100c4610114565b60408051918252519081900360200190f35b34156100de57fe5b6100b261011a565b005b34156100f057fe5b6100f8610135565b60408051600160a060020a039092168252519081900360200190f35b60015481565b600154421061013157600054600160a060020a0316ff5b5b5b565b600054600160a060020a0316815600a165627a7a72305820d2129f605fb897fe6d124911dc1638d20b53e5ab620b8e3638a1400ef15e4eef0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
```

We need to configure it like before and add the statements for processing the event.

``` js
// must unlock the account we are creating the contract from so we can use it
personal.unlockAccount(eth.accounts[1],"Node01Account01")
// must set the _account parameter
var _account = eth.accounts[1] ;
var untitled_receiveetherContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"dispose","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"receivingAccount","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_account","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"EtherReceival","type":"event"}]);
var untitled_receiveether = untitled_receiveetherContract.new(
   _account,
   {
     from: web3.eth.accounts[1], 
     data: '0x6060604052341561000c57fe5b6040516020806101c383398101604052515b60008054600160a060020a031916600160a060020a03831617905542610258016001555b505b610170806100536000396000f3006060604052361561003b5763ffffffff60e060020a60003504166329dcb0cf81146100b45780634c86659e146100d6578063e0486c39146100e8575b6100b25b600080546040513492600160a060020a039092169183156108fc02918491818181858888f1505060408051600160a060020a03331681526020810186905281517f75f33ed68675112c77094e7c5b073890598be1d23e27cd7f6907b4a7d98ac61995509081900390910192509050a15b50565b005b34156100bc57fe5b6100c4610114565b60408051918252519081900360200190f35b34156100de57fe5b6100b261011a565b005b34156100f057fe5b6100f8610135565b60408051600160a060020a039092168252519081900360200190f35b60015481565b600154421061013157600054600160a060020a0316ff5b5b5b565b600054600160a060020a0316815600a165627a7a72305820d2129f605fb897fe6d124911dc1638d20b53e5ab620b8e3638a1400ef15e4eef0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
     console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
	 // configure the event to watch for changes
	 var event = untitled_receiveether.EtherReceival();
	 event.watch(function(error, result){
	   if (!error)
	     console.log("[Ether received: Sender: " + result.args.sender + ", Amount: " + web3.fromWei(result.args.amount, "ether")+" ether(s)]");
	 });
    }
 })
```

Now save the above code as `deployWithLog.js` and use it like before.

``` bash
> loadScript("deployWithLog.js")

null [object Object]
true
> null [object Object]
Contract mined! address: 0xcc2bad220fa388be781b37e3ab125c2ecfccb915 transactionHash: 0xda50d82226337fc3a14446fc61c991f15fc5e10bb9760fa7d0b75d270bdd16ed
> var tx = {from:  personal.listAccounts[2], to: "0xcc2bad220fa388be781b37e3ab125c2ecfccb915", value: web3.toWei(1.0, "ether")}
undefined
> personal.sendTransaction(tx, "Node01Account02")
"0xac13170644ad844b03d76c28b12eda1924abfc99f30a8a4400a6991aa78f3fcc"
> [Ether received: Sender: 0xc306c64d00f58e58526d4ac820d13d6d61747f7b, Amount: 1 ether(s)]
> var tx = {from:  personal.listAccounts[2], to: "0xcc2bad220fa388be781b37e3ab125c2ecfccb915", value: web3.toWei(2.1,undefined}
> personal.sendTransaction(tx, "Node01Account02")

"0x3edd4f46667510dde371d23756e8cef1ea59965105d4e7e885d772f07de855c6"
> [Ether received: Sender: 0xc306c64d00f58e58526d4ac820d13d6d61747f7b, Amount: 2.1 ether(s)]
```

As you can see, each time a transaction is processed by the contract the `[Ether received: Sender: 0x???, Amount: ?.??? ether(s)]` log entry is created.

## What is next?

You have learned how to get payments using contracts. Now it is time to design a simple trading contract. You can continue to the [Simple Bidding Contract](../03-SimpleBidding/README.md) example.
