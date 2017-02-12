# Setting Up a Local Private Test Network with One Node

In this example, we will create a local private test network with a single node which has several accounts. The objective is to show you how to initialize a node, how to interact with that node, how to create accounts, how to set initial ethers in accounts, how to make transactions and how to create, deploy and execute contracts.

## Introduction

The things that are required to specify in a private chain are:

* Custom Genesis File
* Custom Data Directory
* Custom NetworkID 

We also need to create a directory for the test network. 

``` bash
$ mkdir local_private_network
```

Then enter to this directory. 

``` bash
$ cd local_private_network
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

We can interact with the node through [https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console the Geth JavaScript console]. 

To do so first enter:

``` bash
$ geth --identity="Node01" --datadir="./Node01" -verbosity 6 --port 30301 --rpcport 8101 --networkid="12345" --nodiscover
```

This will start a geth instance with a node named `Node01` whose `--datadir` is `./Node01`. The `--nodiscover` flag turns off peer discovery and prevents geth from trying to find peers for your network id on the internet. Upon the execution of this geth instance, a `geth.ipc` file is created under the data directory (ipc stands for inter-process communication) and its absolute path is verbosed on the terminal as something like this:

``` bash
...
I0213 00:37:21.613819 node/node.go:341] IPC endpoint opened: /Users/ogurcan/ethereum_test_networks/deneme/Node01/geth.ipc
...
```


Open another terminal window and attach to the running geth instance using this `ipc` file:

``` bash
$ geth attach ipc:///Users/ogurcan/ethereum_test_networks/local_private_network/Node01/geth.ipc
```

This will open a console as below:

``` bash
Welcome to the Geth JavaScript console!

instance: Geth/node01/v1.5.7-stable-da2a22c3/linux/go1.7.3
 modules: admin:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

> 
```

To be able to interact, you can use the commands listed in the “Management API Reference” section in [2]. For example, to get the info about the node, type the following command:

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
> personal.newAccount("Node01Account01") 
"0xf50fee0099f5776a9a13ed7e5d554ee16c36bf70"
> personal.newAccount("Node01Account02") 
"0x195998f3491f37d9887cb93ae99c56eec8f67182"
> personal.newAccount("Node01Account03") 
"0xa33f1327bd37793d8b5eaca4c7f8f0fc3b302b00"
> 
```

The hash codes are the addresses of the created accounts.

Note that, nodes may have several accounts (at least one) and they can be listed by using the command:

``` js
> personal.listAccounts
["0xf50fee0099f5776a9a13ed7e5d554ee16c36bf70", "0x195998f3491f37d9887cb93ae99c56eec8f67182", "0xa33f1327bd37793d8b5eaca4c7f8f0fc3b302b00"]
> 
```

## Allocate Initial Ethers to the Accounts

To allocate initial ethers to the accounts, the genesis block (which is inside `CustomGenesis.json`) should be modified as below:

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

Now we need to reinitialize the node as shown before.

``` bash
$ geth --identity="Node01" --datadir="./Node01" -verbosity 6 --ipcdisable --port 30301 --rpcport 8101 --networkid="12345" init ./CustomGenesis.json 2>> ./Node01.log
``` 

Then we can interact with it as before.

``` bash
$ geth --identity="Node01" --datadir="./Node01" -verbosity 6 --ipcdisable --port 30301 --rpcport 8101 --networkid="12345" console 2>> ./Node01.log
``` 

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
> miner.start
function()
>
``` 

The first time you run geth on your machine, it will generate a `DAG`. This can take several minutes depending upon the speed of your CPU. Once it finishes generating the DAG, it will start mining and generating messages like this:

The mining node (`Node01`) deposits ethereum into its coinbase (`eth.coinbase`). By default, the coinbase of a node is its first account (`personal.listAccounts[0]`).

To see if the node is mining, you can time to time check the balance of the coinbase or the first account.

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

The balanca of `Account 1` is reduced by `1.23042` and the balance of `Account 2` is increase by `1.23`. The reason more than `1.23` is gone from the ether balance of `Account 1` is because it costs ether to execute the send ether transaction.  This transaction fee is given to the miner, i.e. `Account 0`.

## Create, Deploy and Use a Contract

