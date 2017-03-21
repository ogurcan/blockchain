pragma solidity ^0.4.9;

/* Contract accepting ethers during 10 minutes */
contract Trading {

    address receivingAccount;
    uint deadline;
    
    struct Asset {
        string name;
        uint price;
        uint barcode;
    }
    
    struct Stock {
        Asset asset;
        uint count;
    }
    
    struct Vendor {
        string name;
        address account;
        Stock[] stocks;
    }
    
    Asset[] assets;
    Vendor[] vendors;

    /*  at initialization, setup the owner */
    function Trading(address _vendor0, address _vendor1) {
        // create 2 assets
        assets.push(Asset("Asset0", 12, 1234));
        Asset memory asset1 = Asset("Asset1", 34, 5678);
        assets.push(asset1);
        
        // create 2 vendors
        Vendor memory vendor0 = Vendor("Vendor0", _vendor0, new Stock[](5));
        Vendor memory vendor1 = Vendor("Vendor1", _vendor1, new Stock[](5));
        
        // add assets to the stock of vendor0
        vendor0.stocks[0] = Stock(assets[0], 2);
        vendor0.stocks[1] = Stock(assets[1], 2);
        
        // add assets to the stock of vendor1
        vendor1.stocks[0] = Stock(assets[0], 1);
        vendor1.stocks[1] = Stock(assets[1], 1);
        
        // set the deadline as 10 minutes
        deadline = now + 10 * 1 minutes;
    }  

    
    function listAssets() constant returns (uint[]) {
        uint[] memory barcodes = new uint[](assets.length);
        for (uint i=0; i<assets.length; i++) {
            barcodes[i] = assets[i].barcode;
        }
        return barcodes;
    }
    
    function getVendor(uint id) constant returns (string name, address acc, uint numAssets) {
        var vendor = vendors[id];
        name = vendor.name;
        acc = vendor.account;
        numAssets = vendor.stocks.length;
    }

    modifier afterDeadline() { if (now >= deadline) _; }

    /* checks if the time limit has been reached and ends the contract */
    function dispose() afterDeadline {
        suicide(receivingAccount);
    }
}
