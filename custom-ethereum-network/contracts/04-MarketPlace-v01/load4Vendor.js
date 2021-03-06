// unlock all accounts
loadScript("config/UnlockAccounts.js");

// creation of contract object
var marketplace_sol_marketplaceContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"barcode","type":"uint256"},{"name":"price","type":"uint256"}],"name":"makeOffer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"assetBarcode","type":"uint256"},{"name":"stockCount","type":"uint256"},{"name":"deliverySpeed","type":"uint256"}],"name":"registerVendor","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"dispose","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"refuseOffer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getMyVendorInfo","outputs":[{"name":"name","type":"string"},{"name":"acc","type":"address"},{"name":"barcode","type":"uint256"},{"name":"numAssets","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"cancelRequest","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"barcode","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"maxDays","type":"uint256"}],"name":"requestAsset","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"assetBarcode","type":"uint256"},{"indexed":false,"name":"stockCount","type":"uint256"},{"indexed":false,"name":"deliverySpeed","type":"uint256"}],"name":"VendorRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"client","type":"address"},{"indexed":false,"name":"barcode","type":"uint256"}],"name":"AssetRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"vendorName","type":"string"},{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"PriceProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"BiddingFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"barcode","type":"uint256"}],"name":"PaymentReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"trackingNumber","type":"uint256"}],"name":"AssetShipped","type":"event"}]);

// initiate contract for an address
var marketplace_sol_marketplace = marketplace_sol_marketplaceContract.at(contractAddress);

// add a watch for the event VendorRegistered
marketplace_sol_marketplace.VendorRegistered().watch(function(error, result){
   if (!error)
      console.log("[" + result.args.name + " has been registered as a vendor with the account number " + result.args.account + ". It has " + result.args.stockCount + " number of the asset " + result.args.barcode + " in its stock and it delivers in " + result.args.deliverySpeed + ".]");
});

// add a watch for the event VendorRegistered
marketplace_sol_marketplace.AssetRequested().watch(function(error, result){
   if (!error)
      console.log("[Asset " + result.args.barcode + " requested by " + result.args.client + "]");
});

// add a watch for the event PriceProposed
marketplace_sol_marketplace.PriceProposed().watch(function(error, result){
   if (!error)
      console.log("[A price " + result.args.price + " is proposed for the asset " + result.args.barcode + " by " + result.args.vendorName + "]");
});

// add a watch for the event BiddingFinished
marketplace_sol_marketplace.BiddingFinished().watch(function(error, result){
   if (!error)
      console.log("[Bidding finished for the asset " + result.args.barcode + " with the price " + result.args.price + ". Make the payment if you want to buy the asset.]");
});
