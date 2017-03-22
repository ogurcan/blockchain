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

> Note that in this simple example several assumptions and simplification are made. It is assumed that there will be one single asset and one single client. Stock management and transportation is made by the bidding contract. A more realistic scenario will be given in the next example.

The sequence diagram of this scenario could be as below.



Now let's proceed to the development of this system in Solidity.

## Contract: SimpleBidding

In this section, we will develop step by step the `SimpleBidding` contract. 

### Creating the Contract

Finally, the full contract code will be as below.

``` js
pragma solidity ^0.4.10;

/* Contract accepting bids during 30 minutes */
contract SimpleBidding {

    address contractOwner;
    uint deadline;
    
    struct Vendor {
        string name;
        address account;
        uint assetBarcode;
        uint stockCount;
    }
    
    Vendor[] vendors;

    // request information
    address client;
    uint requestedAssetBarcode;
    
    // bidding information
    uint expectedProposals;
    address bestVendor;
    uint bestPrice;
    
    event VendorRegistered(string name, address account, uint assetBarcode, uint stockCount);
    event AssetRequested(address client, uint barcode);
    event VendorValidated(address vendor);
    event VendorNotValidated(address vendor);
    event PriceProposed(address vendor, uint barcode, uint price);
    event BiddingFinished(uint barcode, uint price);
    event PaymentReceived(address sender, uint amount, uint barcode);
    event AssetShipped(uint barcode, uint trackingNumber);

    /* Constructor */
    function SimpleBidding() {
        // set the owner of this contract
        contractOwner = msg.sender;
        // set the deadline of the contract as 10 minutes
        deadline = now + 30 * 1 minutes;
    }  
    
    /* Used by vendors to register themselves. */
    function registerVendor(string name, uint assetBarcode, uint stockCount) {
        vendors[vendors.length++] = Vendor(name, msg.sender, assetBarcode, stockCount);
        VendorRegistered(name, msg.sender, assetBarcode, stockCount);
    }
    
    /* Used by clients to request assets and start bidding.     */ 
    function requestAsset(uint barcode) {
        // save the requester
        client = msg.sender;
        
        // save the asset barcode
        requestedAssetBarcode = barcode;
        
        // create the event
        AssetRequested(client, requestedAssetBarcode);
        
        // initialize the bidding process
        expectedProposals = 2;
        bestPrice = 999999;
    }
    
    /* Used by vendors to propose a price for an asset. */
    function proposePrice(uint barcode, uint price) {
        // process the proposal
        PriceProposed(msg.sender, barcode, price);
        if (price < bestPrice) {
            bestPrice = price;
            bestVendor = msg.sender;
        }
        
        // update bidding condition
        expectedProposals--;
        
        if (expectedProposals == 0) {
            BiddingFinished(requestedAssetBarcode, bestPrice);
        }
    }
    
     /* The function without name is the default function that is called whenever 
       anyone sends funds to a contract */
    function () public payable {
        if (msg.sender == client) {
            uint amount = msg.value;
            if (amount == bestPrice) {
                // transfer the payment to the vendor
                bestVendor.send(amount);
                // reduce the asset from the vendor's stock
                // ...to be implemented...
                
                // create the event
                PaymentReceived(msg.sender, msg.value, requestedAssetBarcode);
                
                // ship the asset
                uint trackingNumber = 78623235235;
                AssetShipped(requestedAssetBarcode, trackingNumber);
            }
            
        }
    }
    
    function getVendor(uint id) constant returns (string name, address acc, uint barcode, uint numAssets) {
        var vendor = vendors[id];
        name = vendor.name;
        acc = vendor.account;
        barcode = vendor.assetBarcode;
        numAssets = vendor.stockCount;
    }

    modifier afterDeadline() { if (now >= deadline) _; }

    /* when the time limit has been reached and the contract can be ended. */
    function dispose() afterDeadline {
        selfdestruct(contractOwner);
    }
}
```

You can only directly call the functions that do not modify the state of the contract, i.e. `constant functions`. Functions modifying the state of a contract (i.e. `non-constant function`) can only be called via transactions.

### Deploying the Contract



## What's next?


