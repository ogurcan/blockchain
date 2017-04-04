# Setting Up a Local Private Test Network with One Node

## Before you begin

Before you begin, make sure that the Go implementation `geth` is installed as described [here](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum here).

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

In this example, we will create a local private test network with a single node which has several accounts. The objective is to show you how to initialize a node, how to interact with that node, how to create accounts, how to set initial ethers for the accounts and how to make transactions (e.g., to send ethers).

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

Note that, nodes may have several accounts (at least one) and they can be listed by using the command:

``` js
> personal.listAccounts
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

To veirfy if the accounts are initialized with the correct balance values we specified in the Custom Genesis Block, use the `eth.getBalance()` command on the console of each node using their associated account numbers (which can be retrieved by the `personal.listAccounts` command).

``` js
> eth.getBalance(personal.listAccounts[0])
10000000000000000000
> eth.getBalance(personal.listAccounts[1])
20000000000000000000
> eth.getBalance(personal.listAccounts[2])
30000000000000000000
> 
``` 

Note that `getBalance()` returns ether in wei which is like 1 trillionth of an ether.
To check the balance in terms of ether, type the following command:

``` js
> web3.fromWei(eth.getBalance(personal.listAccounts[1]), "ether")
20
>
``` 

Perfect! Now it is time to play around in our small private test network.

## Start Ethereum Mining

The ethereum network needs a mining node to process transactions:

``` js
> miner.start(1)
true
>
``` 

> The `(1)` signifies the number of threads you want to use during mining. That number depends on the prowess of your system, and how much total percent of cpu on your system you want to use. You can generally run it at `miner.start(1)` or `miner.start(2)`. To mine with your gpu, which is better at mining ether, use the following command `miner.startAutoDAG()`.

The first time you run geth on your machine, it will generate a `DAG`. This can take several minutes depending upon the speed of your CPU. Once it finishes generating the DAG.

``` bash
...
I0213 16:28:01.652643 vendor/github.com/ethereum/ethash/ethash.go:291] Generating DAG: 22%
I0213 16:28:04.881279 vendor/github.com/ethereum/ethash/ethash.go:291] Generating DAG: 23%
I0213 16:28:07.210075 eth/downloader/downloader.go:1474] Quality of service: rtt 20s, conf 1.000, ttl 1m0s
I0213 16:28:08.136458 vendor/github.com/ethereum/ethash/ethash.go:291] Generating DAG: 24%
I0213 16:28:11.633341 vendor/github.com/ethereum/ethash/ethash.go:291] Generating DAG: 25%
...
```

When start `Generating DAG` reaches `100%`, you will know that the mining has started. Depending on your cpu and ram, it can take from a few minutes to an hour. For this example with the configuration given in the beginning, it took around 7 minutes to start mining.

The mining node (`Node01`) deposits ethereum into its `coinbase` (queried by `eth.coinbase`). By default, the coinbase of a node is its `Account 0` (queried by `personal.listAccounts[0]`).
To check if the node is mining, you can time to time check the balance of the `coinbase` or `Account 0`.

``` js
> eth.getBalance(eth.coinbase)
220781250000000000000
> eth.getBalance(personal.listAccounts[0])
220781250000000000000
>
``` 

## Make a Transaction: Send ether from one account to another

Suppose, we want to send  `1.23` ethers from `Account 1` to `Account 2`. To do so, we need to create a transaction object `tx` first:

``` js
> var tx = {from:  personal.listAccounts[1], to: personal.listAccounts[2], value: web3.toWei(1.23, "ether")}
undefined
> 
``` 

Do not take into account the message "undefined". The transaction object `tx` is created. Now we can execute this transaction as follows (by providing the password of the sender account):

``` js
> personal.sendTransaction(tx, "Node01Account01")
"0x9c1116b8718fad9e84422e51d94045265d5ef78d553ada1833d8e4964943f5d5"
> 
``` 

Voila! The transaction is on the way. It can be seen inside pending transactions. Howeber, with a fast enough computer, you will see this list empty since the transaction has already been performed.

``` js
> eth.pendingTransactions
[{
    blockHash: null,
    blockNumber: null,
    from: "0xf50fee0099f5776a9a13ed7e5d554ee16c36bf70",
    gas: 90000,
    gasPrice: 21771860000,
    hash: "0x9c1116b8718fad9e84422e51d94045265d5ef78d553ada1833d8e4964943f5d5",
    input: "0x",
    nonce: 0,
    r: "0x60229effbf98b4e664a5aac86ef8cbe209860be78f9c2f08d67bf753a61feaf3",
    s: "0x37cab764d8b865303aa2a7cf992f7daefbfe4deb3df43d090f4840fdb2bca46b",
    to: "0x195998f3491f37d9887cb93ae99c56eec8f67182",
    transactionIndex: 0,
    v: "0x1b",
    value: 1230000000000000000
}]
>
``` 

After the transaction is mined and put inside a block, the pending transactions will be empty and the transaction will have a `blockHash`, a `blockNumber` and a `nonce`.

``` js
> eth.pendingTransactions
[]
> eth.getTransaction("0xbfdfbb1658f8eba1b769a809ab2be6deb4645533e558489e9acfc8f81adcdc5d")
{
  blockHash: "0x2be3249c2c44b4dd5f4de0c8321f18a97bf4a38e88e0e5fd438a9cada8a11128",
  blockNumber: 6448,
    from: "0xf50fee0099f5776a9a13ed7e5d554ee16c36bf70",
    gas: 90000,
    gasPrice: 21771860000,
    hash: "0x9c1116b8718fad9e84422e51d94045265d5ef78d553ada1833d8e4964943f5d5",
    input: "0x",
    nonce: 11,
    r: "0x60229effbf98b4e664a5aac86ef8cbe209860be78f9c2f08d67bf753a61feaf3",
    s: "0x37cab764d8b865303aa2a7cf992f7daefbfe4deb3df43d090f4840fdb2bca46b",
    to: "0x195998f3491f37d9887cb93ae99c56eec8f67182",
    transactionIndex: 0,
    v: "0x1b",
    value: 1230000000000000000
}
>
```



Check the balances of the two accounts and verify the transaction about ether transfer.

``` js
> eth.getBalance(personal.listAccounts[1])
18769580000000000000
> eth.getBalance(personal.listAccounts[2])
31230000000000000000
```

These values are a bit hard to read. So we check the balances as ethers.

``` js
> web3.fromWei(eth.getBalance(personal.listAccounts[1]), "ether")
18.76958
> web3.fromWei(eth.getBalance(personal.listAccounts[2]), "ether")
31.23000
>
``` 

The balance of `Account 1` is reduced by `1.23042` and the balance of `Account 2` is increase by `1.23`. The reason more than `1.23` is gone from the ether balance of `Account 1` is because it costs ether to execute the send ether transaction.  This transaction fee is given to the miner, i.e. `Account 0`.

## What is next?

You are ready to learn about contracts now. You can continue to the [Creating, Deploying and Using Contracts](./contracts/HelloWorld/README.md) example.

