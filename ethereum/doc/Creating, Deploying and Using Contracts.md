# Creating, Deploying and Using Contracts

## Before you begin

Before you begin, make sure that the [Solidity](http://solidity.readthedocs.io/en/develop/index.html) compiler is installed as described [here](https://github.com/ethereum/go-ethereum/wiki/Contract-Tutorial#install-solc-on-ubuntu). To verify if Solidy is installed correctly, go to the geth console and type the `eth.getCompilers()` command. 

``` js
> eth.getCompilers()
["Solidity"]
> 
```

This example is based on [Setting Up a Local Private Test Network](./Setting%20Up%20a%20Local%20Private%20Test%20Network%20with%20One%20Node.md) example.

It is prepared by using the geth version `1.5.7-stable` which is using Go version `go1.7.4` and tested on `macOS Sierra` and `Ubuntu 14.04.5`. 

``` bash
Geth
Version: 1.5.7-stable
Git Commit: da2a22c384a9b621ec853fe4b1aa651d606cf42b
Protocol Versions: [63 62]
Network Id: 1
Go Version: go1.7.4
OS: darwin
GOPATH=
GOROOT=/usr/local/Cellar/go/1.7.4_2/libexec
```

## Introduction

In this example, we will create, deploy and use contracts. Ethereum contracts are account holding objects on the ethereum blockchain. They contain code functions and can interact with other contracts, make decisions, store data, and send ether to others.
Contracts are defined by their creators, but their execution, and by extension the services they offer, is provided by the ethereum network itself. They will exist and be executable as long as the whole network exists, and will only disappear if they were programmed to self destruct.

## Contract 1: Hello World!

In this section, we will build a `Hello World!` contract on the ethereum command line.

### Creating the Contract

### Deploying the Contract

### Using the Contract

## Contract 2: Sending Ether to Others

## Contract 3: Storing Data

## Contract 4: Making Decisions

## Contract 5: Interacting with Other Contracts
