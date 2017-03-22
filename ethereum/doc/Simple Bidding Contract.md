# Simple Bidding Contract

> This example is a continuation of the [Receiving Ethers Using a Contract](./Receiving%20Ethers%20Using%20a%20Contract.md) example.


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

In this example, we will develop a simple bidding contract to show how to define and use structures, arrays and functions in more detail.

The simplified bidding process is as follows. First, vendors register to the contract with their asset and stock information. Then a client makes a request to buy the asset. After that, the contract starts a bidding process which ends when a specific number of proposals from the vendors is made. Vendors propose prices for the dedicated asset. Upon finishing the bidding, the contract announces the cheapest proposal for the dedicated asset. The client then sends the expected amount to the contract if it wants to buy the asset with the proposed price. The contract verifies the payment, transfers the amount to the dedicated vendor (Note that the client does not know about the vendor.), updates the stock information of the vendor about the asset and finally ships the asset to the client.

> Note that in this simple example several assumptions and simplification are made. It is assumed that there will be one single asset and one single client. Stock management and transportation is made by the bidding contract also. A more realistic scenario will be given in the next example.

Now let's proceed to the implementation of this system in Solidity.

## SimpleBidder Contract

You can only directly call the functions that do not modify the state of the contract, i.e. `constant functions`. Functions modifying the state of a contract (i.e. `non-constant function`) can only be called via transactions.

## What's next?


