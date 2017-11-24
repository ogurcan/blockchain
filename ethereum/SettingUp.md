# Setting Up a Local Private Test Network with One Node

## Before you begin

Before you begin, make sure that the Go implementation `geth` is installed as described [here](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum).

This example is prepared by using the geth version `1.5.7-stable` which is using Go version `go1.7.4` and tested on `macOS Sierra` and `Ubuntu 14.04.5`. 

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

In this document, we will create and set up a local private test network with a single node which has several accounts. The objective is to show you how to initialize a node, how to interact with that node, how to create accounts and how to set initial ethers for the accounts.

The things that are required to specify in a private chain are:

* Custom Genesis File
* Custom Data Directory
* Custom NetworkID 

We also need to create a directory for the test network. 

``` bash
$ mkdir local-private-network
```

Then enter to this directory. 

``` bash
$ cd local-private-network
```

## Create the Genesis File

The genesis block is the start of the blockchain - the first block, block 0, and the only block that does not point to a predecessor block. The protocol ensures that no other node will agree with your version of the blockchain unless they have the same genesis block, so you can make as many private testnet blockchains as you’d like!

``` bash
$ nano CustomGenesis.json
```

Paste the following code, save and exit:

``` javascript 
{
   "nonce": "0x0000000000000042",
   "timestamp": "0x0",
   "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
   "extraData": "0x0",
   "gasLimit": "0x8000000",
   "difficulty": "0x400",
   "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
   "coinbase": "0x3333333333333333333333333333333333333333",
   "alloc": {
   }
}
```

## Initialize the Node

To initialize the the first node with the custom genesis block, execute the following command:

``` bash
$ geth --identity="Node01" --datadir="./Node01" -verbosity 6 --port 30301 --rpcport 8101 --networkid="12345" init ./CustomGenesis.json 2>> ./Node01.log
```

where the name of the node is `Node01`, the data directory is `./Node01`, the unique id of the network is `12345`.

## Interact with the Node

We can interact with the node through [the Geth JavaScript console](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console). 

To do so first enter:

``` bash
$ geth --identity="Node01" --datadir="./Node01" -verbosity 6 --port 30301 --rpcport 8101 --networkid="12345" --nodiscover console 2>> ./Node01.log
```

This will open a geth console (as below) for a node named `Node01` whose `--datadir` is `./Node01`. The `--nodiscover` flag turns off peer discovery and prevents geth from trying to find peers for your network id on the internet. The `2>> ./Node01.log` flag redirects the geth output to the `Node01.log` log file.

``` bash
Welcome to the Geth JavaScript console!

instance: Geth/node01/v1.5.7-stable-da2a22c3/linux/go1.7.3
 modules: admin:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

> 
```

For seeing the logs at real-time, open another terminal window and execute the `tail` command.

``` bash
$ tail -f Node01.log
```

Now go back to the first terminal and start interacting. For example, to get the info about the node, type the following command:

``` js
> admin.nodeInfo
```

The result will be something like this:

``` js
{
  enode: "enode://7d1c6e5ea7e79ceb8123847a61aecc817683f0a715f4ccf342e6cdb516e42a7dab6ddab0c807f92cca1b28f068b4917899f58c1faae21c15e4618fc29571844f@[::]:30301",
  id: "7d1c6e5ea7e79ceb8123847a61aecc817683f0a715f4ccf342e6cdb516e42a7dab6ddab0c807f92cca1b28f068b4917899f58c1faae21c15e4618fc29571844f",
  ip: "::",
  listenAddr: "[::]:30301",
  name: "Geth/Node01/v1.5.7-stable-da2a22c3/linux/go1.7.3",
  ports: {
    discovery: 30301,
    listener: 30301
  },
  protocols: {
    eth: {
      difficulty: 1024,
      genesis: "0x6650a0ac6c5e805475e7ca48eae5df0e32a2147a154bb2222731c770ddb5c158",
      head: "0x6650a0ac6c5e805475e7ca48eae5df0e32a2147a154bb2222731c770ddb5c158",
      network: 12345
    }
  }
}
```

Note that `genesis` and `head` have the same value since there is no block yet in the blockchain, but `genesis`.

If we only get the enode, type the following command:

``` js
> admin.nodeInfo.enode
"enode://7d1c6e5ea7e79ceb8123847a61aecc817683f0a715f4ccf342e6cdb516e42a7dab6ddab0c807f92cca1b28f068b4917899f58c1faae21c15e4618fc29571844f@[::]:30301"
>
```

To be sure that `Node01` is listening to the network, type:

``` js
> net.listening
true
> 
```

However, no peers will be added since this is a private network:

``` js
> net.peerCount
0
> admin.peers
[]
>
```

## Create Accounts
Now it is time to do some real stuff like making transactions. However, the node initiated above do not have any [[Ether|ethers]] for making transactions, in addition it is not possible to mine to earn ethers.

In fact, the node do not even have any accounts for holding ethers, and they should have at least one. So, lets start from creating accounts for this node.

Creating account is accomplised by using the `personal.newAccount("password")` command with a given password. Come back to the console of `Node01` and type that command with a simple passwords three times to create three accounts:

``` js
> personal.newAccount("Node01Account00") 
"0xf50fee0099f5776a9a13ed7e5d554ee16c36bf70"
> personal.newAccount("Node01Account01") 
"0x195998f3491f37d9887cb93ae99c56eec8f67182"
> personal.newAccount("Node01Account02") 
"0xa33f1327bd37793d8b5eaca4c7f8f0fc3b302b00"
> 
```

The hash codes are the addresses of the created accounts.

> Note that, in your computer the addresses of the accounts will be different.

Note that, nodes may have several accounts (at least one) and they can be listed by using either `personal.listAccounts` or `eth.accounts` command:

``` js
> personal.listAccounts
["0xf50fee0099f5776a9a13ed7e5d554ee16c36bf70", "0x195998f3491f37d9887cb93ae99c56eec8f67182", "0xa33f1327bd37793d8b5eaca4c7f8f0fc3b302b00"]
> eth.accounts
["0xf50fee0099f5776a9a13ed7e5d554ee16c36bf70", "0x195998f3491f37d9887cb93ae99c56eec8f67182", "0xa33f1327bd37793d8b5eaca4c7f8f0fc3b302b00"]
> 
```

## Allocate Initial Ethers to the Accounts

To allocate initial ethers to the accounts, the genesis block (which is inside `CustomGenesis.json`) should be modified as below. However, to be able to make such a modification, you should first exit from the console by using the `exit` command and then stop the execution of `geth` by pressing `Ctrl+C`. 

``` js
{
   "nonce": "0x0000000000000042",
   "timestamp": "0x0",
   "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
   "extraData": "0x0",
   "gasLimit": "0x8000000",
   "difficulty": "0x400",
   "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
   "coinbase": "0x3333333333333333333333333333333333333333",
   "alloc": {
      "0xf50fee0099f5776a9a13ed7e5d554ee16c36bf70" : {
	   "balance" : "10000000000000000000"
      },
      "0x195998f3491f37d9887cb93ae99c56eec8f67182" : {
	   "balance" : "20000000000000000000"
      },
      "0xa33f1327bd37793d8b5eaca4c7f8f0fc3b302b00" : {
	   "balance" : "30000000000000000000"
      }
   }
}
``` 

Now we need to reinitialize the node and attach to it as shown above before.

To veirfy if the accounts are initialized with the correct balance values we specified in the Custom Genesis Block, use the `eth.getBalance()` command on the console of each node using their associated account numbers (which can be retrieved by the `eth.accounts` command).

``` js
> eth.getBalance(eth.accounts[0])
10000000000000000000
> eth.getBalance(eth.accounts[1])
20000000000000000000
> eth.getBalance(eth.accounts[2])
30000000000000000000
> 
``` 

Note that `getBalance()` returns ether in wei which is like 1 trillionth of an ether.
To check the balance in terms of ether, type the following command:

``` js
> web3.fromWei(eth.getBalance(eth.accounts[1]), "ether")
20
>
``` 

Perfect! Now it is time to play around in our small private test network.

## What is next?

You are ready to create transactions, do mining etc. You can continue to the [Local Private Network with One Node](./README.md) article.

