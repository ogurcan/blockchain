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

> This contract has aldready been developed and can be found in `./contracts/04-MarketPlace-v01/MarketPlace.sol` file. 

## Contract: MarketPlace

In this section, we will develop the `MarketPlace` contract.

> It is assumed that you are now used to contract codes, that's why we will not present it step by step. If you do not feel confortable, go back to the `SimpleBidding` example and revise the steps.

### Designing the Contract

To reveal the functions of the contract, we designed a sequence diagram of the aforementioned scenario.

![Market Place Scenario (v1)](sequence_diagram.png)

The next subsection will show how to implement this scenario as a contract.

### Creating the Contract

The full contract code is as below.

``` js
pragma solidity ^0.4.10;

/* Contract accepting bids during 30 minutes */
contract MarketPlace {

    // contract information
    address contractOwner;
    uint deadline;
    
    // vendor information
    struct Vendor {
        bool isRegistered;
        string name;
        address account;
        uint assetBarcode;
        uint stockCount;
        uint deliverySpeed;
    }
    mapping (address => Vendor) vendors;
    event VendorRegistered(string name, address account, uint assetBarcode, uint stockCount, uint deliverySpeed);

    // request information
    struct Request {
        address client;
        uint assetBarcode;
        uint quantity;
        uint maxDays;
    }
    Request request;
    event AssetRequested(address client, uint barcode);
    
    // bidding information
    uint expectedProposals;
    address bestVendor;
    uint bestPrice;
    event PriceProposed(string vendorName, uint barcode, uint price);
    event BiddingFinished(uint barcode, uint price);

    // payment information
    event PaymentReceived(address sender, uint amount, uint barcode);
    event AssetShipped(uint barcode, uint trackingNumber);

    /* Constructor */
    function MarketPlace() {
        // set the owner of this contract
        contractOwner = msg.sender;
        // set the deadline of the contract as 10 minutes
        deadline = now + 30 * 1 minutes;
    }  
    
    /* Used by vendors to register themselves. */
    function registerVendor(string name, uint assetBarcode, uint stockCount, uint deliverySpeed) {
        // if the vendor is already registered, exit the function.
        if (vendors[msg.sender].isRegistered) throw;
        // else register the vendor.
        vendors[msg.sender] = Vendor(true, name, msg.sender, assetBarcode, stockCount, deliverySpeed);
        VendorRegistered(name, msg.sender, assetBarcode, stockCount, deliverySpeed);
    }
    
    /* Used by clients to request assets and start bidding.     */ 
    function requestAsset(uint barcode, uint quantity, uint maxDays) {
        // save the request
        request = Request(msg.sender, barcode, quantity, maxDays);
        
        // create the event
        AssetRequested(request.client, barcode);
        
        // initialize the bidding process
        expectedProposals = 2;
        bestPrice = 999999;
    }
    
    /* used for checking if a function is called by a registered vendor */
    modifier onlyVendor() { if (vendors[msg.sender].isRegistered) _; }
    
    /* Used by vendors to propose a price for an asset. */
    function makeOffer(uint barcode, uint price) onlyVendor {
        Vendor vendor = vendors[msg.sender];

        if (!inStock(vendor, barcode)) throw;

        processTheOffer(vendor, barcode, price);
        
        // update bidding condition
        expectedProposals--;
        
        if (expectedProposals == 0) {
            BiddingFinished(request.assetBarcode, bestPrice);
        }
    }
    
    /* return true if there is enough stock */
    function inStock(Vendor vendor, uint barcode) private returns (bool result) {
        result = vendor.stockCount >= request.quantity;
    }
    
    /* process the offer to calculate the best offer */
    function processTheOffer(Vendor vendor, uint barcode, uint price) private {
        // process the proposal
        PriceProposed(vendors[msg.sender].name, barcode, price);
        if (price < bestPrice) {
            bestPrice = price;
            bestVendor = msg.sender;
        }        
    }
    
    /* used for checking if a function is called by a registered vendor */
    modifier onlyClient() { if (msg.sender == request.client) _; }
    
    /* The function without name is the default function that is called whenever 
       anyone sends funds to a contract */
    function () public payable onlyClient {
        uint amount = msg.value;
        if (verifyPayment(amount)) {
            // transfer the payment to the vendor
            bestVendor.send(amount);
            // reduce the asset from the vendor's stock
            vendors[bestVendor].stockCount = vendors[bestVendor].stockCount - request.quantity;
            
            // create the event
            PaymentReceived(msg.sender, msg.value, request.assetBarcode);
                
            // ship the asset
            uint trackingNumber = 78623235235;
            AssetShipped(request.assetBarcode, trackingNumber);
        }
    }
    
    /* verifies if the payment made with the correct amount */
    function verifyPayment(uint amount) private returns (bool result) {
        result = amount == bestPrice;
    }
    
    /* reset the request because the client refused the offer */
    function refuseOffer() onlyClient {
        request.client = 0;
    }
    
    /* reset the request because the client canceled the request */
    function cancelRequest() onlyClient {
        request.client = 0;
    }
    
    /* returns the vendor information of the caller */
    function getMyVendorInfo() constant returns (string name, address acc, uint barcode, uint numAssets) {
        var vendor = vendors[msg.sender];
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

### Compiling the Contract

Upon compiling the above solidty code using the [online Solidity compiler](https://ethereum.github.io/browser-solidity/), we will have a JavaScript code as below.

``` js
var marketplace_sol_marketplaceContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"barcode","type":"uint256"},{"name":"price","type":"uint256"}],"name":"makeOffer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"assetBarcode","type":"uint256"},{"name":"stockCount","type":"uint256"},{"name":"deliverySpeed","type":"uint256"}],"name":"registerVendor","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"dispose","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"refuseOffer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getMyVendorInfo","outputs":[{"name":"name","type":"string"},{"name":"acc","type":"address"},{"name":"barcode","type":"uint256"},{"name":"numAssets","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"cancelRequest","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"barcode","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"maxDays","type":"uint256"}],"name":"requestAsset","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"assetBarcode","type":"uint256"},{"indexed":false,"name":"stockCount","type":"uint256"},{"indexed":false,"name":"deliverySpeed","type":"uint256"}],"name":"VendorRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"client","type":"address"},{"indexed":false,"name":"barcode","type":"uint256"}],"name":"AssetRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"vendorName","type":"string"},{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"PriceProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"BiddingFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"barcode","type":"uint256"}],"name":"PaymentReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"trackingNumber","type":"uint256"}],"name":"AssetShipped","type":"event"}]);
var marketplace_sol_marketplace = marketplace_sol_marketplaceContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000c57fe5b5b60008054600160a060020a03191633600160a060020a031617905542610708016001555b5b610b52806100416000396000f300606060405236156100675763ffffffff60e060020a60003504166305b7cdd38114610188578063158f7f89146101a05780634c86659e14610205578063581f7f05146102175780636a807d4114610229578063851b16f5146102175780638cafdaba146102f7575b6101865b600354600090819033600160a060020a039081169116141561017f5734915061009382610312565b1561017f57600854604051600160a060020a039091169083156108fc029084906000818181858888f15050600554600854600160a060020a0390811660009081526002602090815260409182902060049081018054959095039094559254815133909316835234938301939093528181019290925290517f5677b5d4cf976ac32defbd95a6a5aaf0d1fee450a11fc26f3c11aae6e6c33d0694509081900360600192509050a1506004546040805191825264124e4f5ca360208301819052815190927fb392290afa7f5b07c58b82f2a4f36a13e77050183671211ed5b5f27ca86b135e92908290030190a15b5b5b5b5050565b005b341561019057fe5b61018660043560243561031d565b005b34156101a857fe5b610186600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437509496505084359460208101359450604001359250610591915050565b005b341561020d57fe5b610186610755565b005b341561021f57fe5b610186610770565b005b341561023157fe5b61023961079c565b604051808060200185600160a060020a0316600160a060020a031681526020018481526020018381526020018281038252868181518152602001915080519060200190808383600083146102a8575b8051825260208311156102a857601f199092019160209182019101610288565b505050905090810190601f1680156102d45780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b341561021f57fe5b610186610770565b005b34156102ff57fe5b6101866004356024356044356108a5565b005b60095481145b919050565b600160a060020a03331660009081526002602052604081205460ff1615610589575033600160a060020a0316600090815260026020818152604092839020835160c081018552815460ff16151581526001808301805487516101009382161593909302600019011695909504601f81018590048502820185019096528581529194610440949193869385820193909290918301828280156103ff5780601f106103d4576101008083540402835291602001916103ff565b820191906000526020600020905b8154815290600101906020018083116103e257829003601f168201915b50505091835250506002820154600160a060020a03166020820152600382015460408201526004820154606082015260059091015460809091015284610942565b1561044b5760006000fd5b6040805160c081018252825460ff16151581526001808401805484516020601f600260001996851615610100029690960190931694909404918201849004840281018401909552808552610535948693808601939192908301828280156104f35780601f106104c8576101008083540402835291602001916104f3565b820191906000526020600020905b8154815290600101906020018083116104d657829003601f168201915b50505091835250506002820154600160a060020a0316602082015260038201546040820152600482015460608201526005909101546080909101528484610953565b60078054600019019081905515156105895760045460095460408051928352602083019190915280517fc17eabdf34dbdda04d4e5bc7f639984fff1d8a51ba4bb7f728e59744c3320e079281900390910190a15b5b5b5b505050565b600160a060020a03331660009081526002602052604090205460ff16156105b85760006000fd5b6040805160c0810182526001808252602080830188815233600160a060020a0316848601819052606085018990526080850188905260a08501879052600090815260028352949094208351815460ff191690151517815593518051939493610627938501929190910190610a74565b5060408201518160020160006101000a815481600160a060020a030219169083600160a060020a03160217905550606082015181600301556080820151816004015560a082015181600501559050507f1dc49785dedc67935d7f766e5ded15433217e5b6d8b756f6a82808acbb4705f28433858585604051808060200186600160a060020a0316600160a060020a03168152602001858152602001848152602001838152602001828103825287818151815260200191508051906020019080838360008314610711575b80518252602083111561071157601f1990920191602091820191016106f1565b505050905090810190601f16801561073d5780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390a15b50505050565b600154421061076c57600054600160a060020a0316ff5b5b5b565b60035433600160a060020a039081169116141561076c5760038054600160a060020a03191690555b5b5b565b6107a4610af3565b33600160a060020a031660009081526002602081815260408084206001808201805484519281161561010002600019011695909504601f810185900485028201850190935282815285948594929391929091908301828280156108485780601f1061081d57610100808354040283529160200191610848565b820191906000526020600020905b81548152906001019060200180831161082b57829003601f168201915b505050600284015460038501546004860154949950600160a060020a039091169750955091935050505b5090919293565b60035433600160a060020a039081169116141561076c5760038054600160a060020a03191690555b5b5b565b60408051608081018252600160a060020a033381168083526020808401889052838501879052606090930185905260038054600160a060020a0319169091179081905560048790556005869055600685905583519116815290810185905281517f182330bdae199ac3ad3e13c76eb719f687f880653f8dee040adc74327eaf3a66929181900390910190a16002600755620f423f6009555b505050565b600554608083015110155b92915050565b7f4cc192b974e708b4556e771d6b0425e65a284b111616339527df19b8b9c31ce46002600033600160a060020a0316600160a060020a0316815260200190815260200160002060010183836040518080602001848152602001838152602001828103825285818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015610a335780601f10610a0857610100808354040283529160200191610a33565b820191906000526020600020905b815481529060010190602001808311610a1657829003601f168201915b505094505050505060405180910390a160095481101561058957600981905560088054600160a060020a03191633600160a060020a03161790555b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610ab557805160ff1916838001178555610ae2565b82800160010185558215610ae2579182015b82811115610ae2578251825591602001919060010190610ac7565b5b50610aef929150610b05565b5090565b60408051602081019091526000815290565b610b2391905b80821115610aef5760008155600101610b0b565b5090565b905600a165627a7a723058209b07dc2cbb4dc7f25ff1672ade2298c849dfe574ff403b25310df94f4a941a8e0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
```

After managing unlocking the accounts and the watchers for the events, the final deployment script becomes as below.

``` js
// unlock all accounts
loadScript("config/UnlockAccounts.js");
// contract code
var marketplace_sol_marketplaceContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"barcode","type":"uint256"},{"name":"price","type":"uint256"}],"name":"makeOffer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"assetBarcode","type":"uint256"},{"name":"stockCount","type":"uint256"},{"name":"deliverySpeed","type":"uint256"}],"name":"registerVendor","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"dispose","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"refuseOffer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getMyVendorInfo","outputs":[{"name":"name","type":"string"},{"name":"acc","type":"address"},{"name":"barcode","type":"uint256"},{"name":"numAssets","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"cancelRequest","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"barcode","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"maxDays","type":"uint256"}],"name":"requestAsset","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"assetBarcode","type":"uint256"},{"indexed":false,"name":"stockCount","type":"uint256"},{"indexed":false,"name":"deliverySpeed","type":"uint256"}],"name":"VendorRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"client","type":"address"},{"indexed":false,"name":"barcode","type":"uint256"}],"name":"AssetRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"vendorName","type":"string"},{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"PriceProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"BiddingFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"barcode","type":"uint256"}],"name":"PaymentReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"trackingNumber","type":"uint256"}],"name":"AssetShipped","type":"event"}]);
var marketplace_sol_marketplace = marketplace_sol_marketplaceContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000c57fe5b5b60008054600160a060020a03191633600160a060020a031617905542610708016001555b5b610b52806100416000396000f300606060405236156100675763ffffffff60e060020a60003504166305b7cdd38114610188578063158f7f89146101a05780634c86659e14610205578063581f7f05146102175780636a807d4114610229578063851b16f5146102175780638cafdaba146102f7575b6101865b600354600090819033600160a060020a039081169116141561017f5734915061009382610312565b1561017f57600854604051600160a060020a039091169083156108fc029084906000818181858888f15050600554600854600160a060020a0390811660009081526002602090815260409182902060049081018054959095039094559254815133909316835234938301939093528181019290925290517f5677b5d4cf976ac32defbd95a6a5aaf0d1fee450a11fc26f3c11aae6e6c33d0694509081900360600192509050a1506004546040805191825264124e4f5ca360208301819052815190927fb392290afa7f5b07c58b82f2a4f36a13e77050183671211ed5b5f27ca86b135e92908290030190a15b5b5b5b5050565b005b341561019057fe5b61018660043560243561031d565b005b34156101a857fe5b610186600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437509496505084359460208101359450604001359250610591915050565b005b341561020d57fe5b610186610755565b005b341561021f57fe5b610186610770565b005b341561023157fe5b61023961079c565b604051808060200185600160a060020a0316600160a060020a031681526020018481526020018381526020018281038252868181518152602001915080519060200190808383600083146102a8575b8051825260208311156102a857601f199092019160209182019101610288565b505050905090810190601f1680156102d45780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b341561021f57fe5b610186610770565b005b34156102ff57fe5b6101866004356024356044356108a5565b005b60095481145b919050565b600160a060020a03331660009081526002602052604081205460ff1615610589575033600160a060020a0316600090815260026020818152604092839020835160c081018552815460ff16151581526001808301805487516101009382161593909302600019011695909504601f81018590048502820185019096528581529194610440949193869385820193909290918301828280156103ff5780601f106103d4576101008083540402835291602001916103ff565b820191906000526020600020905b8154815290600101906020018083116103e257829003601f168201915b50505091835250506002820154600160a060020a03166020820152600382015460408201526004820154606082015260059091015460809091015284610942565b1561044b5760006000fd5b6040805160c081018252825460ff16151581526001808401805484516020601f600260001996851615610100029690960190931694909404918201849004840281018401909552808552610535948693808601939192908301828280156104f35780601f106104c8576101008083540402835291602001916104f3565b820191906000526020600020905b8154815290600101906020018083116104d657829003601f168201915b50505091835250506002820154600160a060020a0316602082015260038201546040820152600482015460608201526005909101546080909101528484610953565b60078054600019019081905515156105895760045460095460408051928352602083019190915280517fc17eabdf34dbdda04d4e5bc7f639984fff1d8a51ba4bb7f728e59744c3320e079281900390910190a15b5b5b5b505050565b600160a060020a03331660009081526002602052604090205460ff16156105b85760006000fd5b6040805160c0810182526001808252602080830188815233600160a060020a0316848601819052606085018990526080850188905260a08501879052600090815260028352949094208351815460ff191690151517815593518051939493610627938501929190910190610a74565b5060408201518160020160006101000a815481600160a060020a030219169083600160a060020a03160217905550606082015181600301556080820151816004015560a082015181600501559050507f1dc49785dedc67935d7f766e5ded15433217e5b6d8b756f6a82808acbb4705f28433858585604051808060200186600160a060020a0316600160a060020a03168152602001858152602001848152602001838152602001828103825287818151815260200191508051906020019080838360008314610711575b80518252602083111561071157601f1990920191602091820191016106f1565b505050905090810190601f16801561073d5780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390a15b50505050565b600154421061076c57600054600160a060020a0316ff5b5b5b565b60035433600160a060020a039081169116141561076c5760038054600160a060020a03191690555b5b5b565b6107a4610af3565b33600160a060020a031660009081526002602081815260408084206001808201805484519281161561010002600019011695909504601f810185900485028201850190935282815285948594929391929091908301828280156108485780601f1061081d57610100808354040283529160200191610848565b820191906000526020600020905b81548152906001019060200180831161082b57829003601f168201915b505050600284015460038501546004860154949950600160a060020a039091169750955091935050505b5090919293565b60035433600160a060020a039081169116141561076c5760038054600160a060020a03191690555b5b5b565b60408051608081018252600160a060020a033381168083526020808401889052838501879052606090930185905260038054600160a060020a0319169091179081905560048790556005869055600685905583519116815290810185905281517f182330bdae199ac3ad3e13c76eb719f687f880653f8dee040adc74327eaf3a66929181900390910190a16002600755620f423f6009555b505050565b600554608083015110155b92915050565b7f4cc192b974e708b4556e771d6b0425e65a284b111616339527df19b8b9c31ce46002600033600160a060020a0316600160a060020a0316815260200190815260200160002060010183836040518080602001848152602001838152602001828103825285818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015610a335780601f10610a0857610100808354040283529160200191610a33565b820191906000526020600020905b815481529060010190602001808311610a1657829003601f168201915b505094505050505060405180910390a160095481101561058957600981905560088054600160a060020a03191633600160a060020a03161790555b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610ab557805160ff1916838001178555610ae2565b82800160010185558215610ae2579182015b82811115610ae2578251825591602001919060010190610ac7565b5b50610aef929150610b05565b5090565b60408051602081019091526000815290565b610b2391905b80821115610aef5760008155600101610b0b565b5090565b905600a165627a7a723058209b07dc2cbb4dc7f25ff1672ade2298c849dfe574ff403b25310df94f4a941a8e0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
    	// Contract is mined.
    	console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);	 
        // Event VendorRegistered
    	contract.VendorRegistered().watch(function(error, result){
	   if (!error)
	      console.log("[" + result.args.name + " has been registered as a vendor with the account number " + result.args.account + ". It has " + result.args.stockCount + " number of the asset " + result.args.barcode + " in its stock and it delivers in " + result.args.deliverySpeed + ".]");
	});
    	// Event AssetRequested
    	contract.AssetRequested().watch(function(error, result){
	   if (!error)
	      console.log("[Asset " + result.args.barcode + " requested by " + result.args.client + "]");
	});   
	// Event PriceProposed      
	contract.PriceProposed().watch(function(error, result){
	   if (!error)
	      console.log("[A price " + result.args.price + " is proposed for the asset " + result.args.barcode + " by " + result.args.vendorName + "]");
	});	 
	// Event BiddingFinished
	contract.BiddingFinished().watch(function(error, result){
	   if (!error)
	      console.log("[Bidding finished for the asset " + result.args.barcode + " with the price " + result.args.price + ". Make the payment if you want to buy the asset.]");
	});
	// Event PaymentReceived
	contract.PaymentReceived().watch(function(error, result){
	   if (!error)
	      console.log("[A payment of "+ result.args.amount + " is received from " + result.args.sender + " for the asset " + result.args.barcode + " successfully.]");
	});
	// Event AssetShipped
        contract.AssetShipped().watch(function(error, result){
	   if (!error)
	      console.log("[The asset " + result.args.barcode + " has been shipped with the tracking number " + result.args.trackingNumber + ".]");
	});
    }
 })
```

Save the above code as `deploy.js` under `contracts/04-MarketPlace-v01/`.
