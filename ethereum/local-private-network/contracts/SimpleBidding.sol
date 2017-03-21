pragma solidity ^0.4.9;

/* Contract accepting biddings during 30 minutes */
contract SimpleBidding {

    address contractOwnersAccount;
    uint deadline;
    
    struct Vendor {
        string name;
        address account;
        uint assetBarcode;
        uint stockCount;
    }
    
    Vendor[] vendors;

    // request information
    address requester;
    uint requestedAssetBarcode;
    
    // bidding information
    uint expectedProposals;
    address bestVendor;
    uint bestPrice;
    
    //event VendorRegistered(string name, address account, uint assetBarcode, uint stockCount);
    event AssetRequested(address requester, uint barcode);
    event VendorValidated(address vendor);
    event VendorNotValidated(address vendor);
    event PriceProposed(address vendor, uint barcode, uint price);
    event BiddingFinished(uint barcode, uint price);
    event PaymentReceived(address sender, uint amount, uint barcode);
    event AssetShipped(uint barcode, uint trackingNumber);

    /* Constructor */
    function SimpleBidding() {
        // set the deadline of the contract as 10 minutes
        deadline = now + 30 * 1 minutes;
    }  
    
    /*
    function registerVendor(string name, uint assetBarcode, uint stockCount) {
        vendors[vendorsCount++] = Vendor(name, msg.sender, assetBarcode, stockCount);
        VendorRegistered(name, msg.sender, assetBarcode, stockCount);
    }*/
    
    /* Used by clients to request assets and start bidding.     */ 
    function requestAsset(uint barcode) {
        // save the requester
        requester = msg.sender;
        
        // save the asset barcode
        requestedAssetBarcode = barcode;
        
        // create the event
        AssetRequested(requester, requestedAssetBarcode);
        
        // initialize the bidding process
        expectedProposals = 2;
        bestPrice = 999999;
    }
    
    /* Used by vendors to propose a price for an asset. */
    function proposePrice(uint barcode, uint price) {
        // check if this is a valid vendor
    /*    bool isValid = false;
        for (uint i=0; i < vendors.length; i++) {
            if ((isValid == false)&&(vendors[i].account == msg.sender)) {
                isValid = true;
            }
        }
        if (isValid == false) {
            VendorNotValidated(msg.sender);
            throw;
        } else {
            VendorValidated(msg.sender);
        }
    */
        
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
        if (msg.sender == requester) {
            uint amount = msg.value;
            if (amount == bestPrice) {
                // transfer the payment to the vendor
                bestVendor.send(amount);
                // reduce the asset from the vendor's stock
                // ...to be implemented...
                
                // create the event
                PaymentReceived(msg.sender, msg.value, requestedAssetBarcode);
                
                // ship the asset
                uint trackingNumber = 23235235;
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

    /* checks if the time limit has been reached and ends the contract */
    function dispose() afterDeadline {
        suicide(contractOwnersAccount);
    }
}
