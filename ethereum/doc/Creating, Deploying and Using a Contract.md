# Creating, Deploying and Using a Contract

> This example is based on the [Setting Up a Local Private Test Network with One Node](./Setting%20Up%20a%20Local%20Private%20Test%20Network%20with%20One%20Node.md) example.

## Before you begin

Before you begin, make sure that the [Solidity](http://solidity.readthedocs.io/en/develop/index.html) compiler is installed as described [here](https://github.com/ethereum/go-ethereum/wiki/Contract-Tutorial#install-solc-on-ubuntu). To verify if Solidy is installed correctly, go to the geth console and type the `eth.getCompilers()` command. 

``` js
> eth.getCompilers()
["Solidity"]
> 
```

This example is prepared by using the geth version `1.5.7-stable` which is using Go version `go1.7.4` and tested on `Ubuntu 14.04.5`. 

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

In this example, we will create, deploy and use a simple `HelloWorld` contract. 

## Contract: Hello World!

In this section, we will build a `Hello World!` contract on the ethereum command line.

### Creating the Contract

For creating contracts, you need an editor. For instance, we will `nano` but then we will switch to a more sophisticated editor that has highlighting capability for Solidy, like using [Emacs](https://github.com/ethereum/emacs-solidity#emacs-solidity-mode) with Solidity mode or using [Vim](http://www.vim.org/) with a [Solidity syntax file](https://github.com/tomlion/vim-solidity/) or using [Visual Studio Code](https://code.visualstudio.com/Download)  with the Solidity plugin.

Let's create our first contract as:

``` bash
$ nano HelloWorld.sol
``` 

Paste the Solidity code below inside `HelloWorld.sol`, save and exit.

``` js
pragma solidity ^0.4.9;
contract HelloWorld {
    /* define variable of the type string */
    string message;

    /* this runs when the contract is executed */
    function HelloWorld() public {
        message = "HelloWorld";
    }

    /* main function */
    function sayHello() constant returns (string) {
        return message;
    }
}
``` 

### Compiling the Contract

Contracts can be compiled either using an online compiler or an offline compiler.

#### Online Compiling

If you do not have the Solidity compiler `solc` installed, you can simply use the [online Solidity compiler](https://ethereum.github.io/browser-solidity/). On the online compiler, create a new file `HelloWorld.sol` and then copy the source code above into this file. After a second, the compiled code should appear on the right pane. 

Now go back to the terminal window and create a `HelloWorld.js` file.

``` bash
$ nano HelloWorld.js
``` 

And then go back to the online compiler and copy the code in the box labeled `Web3 deploy` into `HelloWorld.js`.

``` bash
var helloworld_sol_helloworldContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"sayHello","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]);
var helloworld_sol_helloworld = helloworld_sol_helloworldContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000c57fe5b5b604060405190810160405280600a81526020017f48656c6c6f576f726c640000000000000000000000000000000000000000000081525060009080519060200190610059929190610060565b505b610105565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100a157805160ff19168380011785556100cf565b828001600101855582156100cf579182015b828111156100ce5782518255916020019190600101906100b3565b5b5090506100dc91906100e0565b5090565b61010291905b808211156100fe5760008160009055506001016100e6565b5090565b90565b6101bd806101146000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063ef5fb05b1461003b575bfe5b341561004357fe5b61004b6100d4565b604051808060200182810382528381815181526020019150805190602001908083836000831461009a575b80518252602083111561009a57602082019150602081019050602083039250610076565b505050905090810190601f1680156100c65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6100dc61017d565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156101725780601f1061014757610100808354040283529160200191610172565b820191906000526020600020905b81548152906001019060200180831161015557829003601f168201915b505050505090505b90565b6020604051908101604052806000815250905600a165627a7a72305820a96c132424b791c602e66b9b217ed288c635c144a667749f26910a38166ce5fe0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
``` 


#### Offline Compiling

Offline compiling will be explained after.

### Deploying the Contract

To deploy the HelloWorld contract, we need to go back to the geth JavaScript console execute. If you check again the compiled code above, you will see that by default the compiler is adding `from: web3.eth.accounts[0]` because this is the address from which we are deploying
i.e. the account that pays for the deploy costs. In this sense, if this account is locked, first we need to unlock it. 

``` js
> personal.unlockAccount(eth.accounts[0],"Node01Account01")
true
> 
``` 

After unlocking the account, we can deploy the contract by using the `loadScript()` command. However, to see how much we pay for the deployment, check the balance of this account first. Note that, if this is the mining account, you will not be able to easily see that the balance goes down since it will increase again in a few seconds.

``` js
> web3.fromWei(eth.getBalance(eth.accounts[0]), "ether")
15.55916000
> 
``` 

Then deploy the contract.

``` js
> loadScript("HelloWorld.js")
null [object Object]
true
> null [object Object]
Contract mined! address: 0xdaa915dc454a3dea4e0030c7ec47bf3195591a97 transactionHash: 0x6ffb8e69dd7ec29cbcc575fdfd578dc067b1c5ae592c32574125359024c7baca
>
``` 

You should wait until you see the `Contract mined` message and then check the balance again.

``` js
> web3.fromWei(eth.getBalance(eth.accounts[0]), "ether")
15.55568538
>  
``` 

As you can easily see, `15.55916000` - `15.55568538` =  `0.00347462` is paid by `Account 0` as a deployment cost.

### Using the Contract

Now we can use the deployed contract by calling the `sayHello()` method. However, to see that 

``` js
> helloworld_sol_helloworld.sayHello()
"HelloWorld"
>
```

## What is next?

Ethereum contracts are account holding objects on the ethereum blockchain. They contain code functions and can interact with other contracts, make decisions, store data, and send ether to others.
Contracts are defined by their creators, but their execution, and by extension the services they offer, is provided by the ethereum network itself. They will exist and be executable as long as the whole network exists, and will only disappear if they were programmed to self destruct.
