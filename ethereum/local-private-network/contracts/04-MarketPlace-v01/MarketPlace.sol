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
    }
    mapping (address => Vendor) vendors;
    event VendorRegistered(string name, address account, uint assetBarcode, uint stockCount);

    // request information
    address client;
    uint requestedAssetBarcode;
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
    function registerVendor(string name, uint assetBarcode, uint stockCount) {
        // if the vendor is already registered, exit the function.
        if (vendors[msg.sender].isRegistered) throw;
        // else register the vendor.
        vendors[msg.sender] = Vendor(true, name, msg.sender, assetBarcode, stockCount);
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
    
    /* used for checking if a function is called by a registered vendor */
    modifier onlyVendor() { if (vendors[msg.sender].isRegistered) _; }
    
    /* Used by vendors to propose a price for an asset. */
    function proposePrice(uint barcode, uint price) onlyVendor {
        // process the proposal
        PriceProposed(vendors[msg.sender].name, barcode, price);
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
    
    /* used for checking if a function is called by a registered vendor */
    modifier onlyClient() { if (msg.sender == client) _; }
    
    /* The function without name is the default function that is called whenever 
       anyone sends funds to a contract */
    function () public payable onlyClient {
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
