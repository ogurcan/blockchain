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
