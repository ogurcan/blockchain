# MarketPlace Contract v01

> This example is a continuation of the [Simple Bidding Contract](../03-SimpleBidding/README.md) example.

## Before You Begin

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

In this example, we will elaborate the `SimpleBidding` contract to develop a more realistic `MarketPlace` contract. 

## Contract: MarketPlace

In this section, we will develop the `MarketPlace` contract.

> It is assumed that you are now used to contract codes, that's why we will not present it step by step.

### Designing the Contract

To reveal the functions of the contract, we designed a sequence diagram of the aforementioned scenario.

![Market Place Scenario (v1)](sequence_diagram.png)

The next subsection will show how to implement this scenario as a contract.
