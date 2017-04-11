// unlock all accounts
loadScript("config/UnlockAccounts.js");
// contract code
var marketplace_sol_marketplaceContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"assetBarcode","type":"uint256"},{"name":"stockCount","type":"uint256"}],"name":"registerVendor","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"barcode","type":"uint256"}],"name":"requestAsset","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"dispose","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getMyVendorInfo","outputs":[{"name":"name","type":"string"},{"name":"acc","type":"address"},{"name":"barcode","type":"uint256"},{"name":"numAssets","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"barcode","type":"uint256"},{"name":"price","type":"uint256"}],"name":"proposePrice","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"assetBarcode","type":"uint256"},{"indexed":false,"name":"stockCount","type":"uint256"}],"name":"VendorRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"client","type":"address"},{"indexed":false,"name":"barcode","type":"uint256"}],"name":"AssetRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"vendorName","type":"string"},{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"PriceProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"BiddingFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"barcode","type":"uint256"}],"name":"PaymentReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"trackingNumber","type":"uint256"}],"name":"AssetShipped","type":"event"}]);
var marketplace_sol_marketplace = marketplace_sol_marketplaceContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000c57fe5b5b60008054600160a060020a03191633600160a060020a031617905542610708016001555b5b610844806100416000396000f300606060405236156100515763ffffffff60e060020a600035041663056b2add81146101435780632b25d4fd146101a25780634c86659e146101b75780636a807d41146101c9578063e161926914610285575b6101415b600354600090819033600160a060020a039081169116141561013a5734915060075482141561013a57600654604051600160a060020a039091169083156108fc029084906000818181858888f1505060045460408051600160a060020a033316815234602082015280820192909252517f5677b5d4cf976ac32defbd95a6a5aaf0d1fee450a11fc26f3c11aae6e6c33d0694509081900360600192509050a1506004546040805191825264124e4f5ca360208301819052815190927fb392290afa7f5b07c58b82f2a4f36a13e77050183671211ed5b5f27ca86b135e92908290030190a15b5b5b5b5050565b005b341561014b57fe5b610141600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437509496505084359460200135935061029d92505050565b005b34156101aa57fe5b610141600435610447565b005b34156101bf57fe5b6101416104c8565b005b34156101d157fe5b6101d96104e3565b604051808060200185600160a060020a0316600160a060020a03168152602001848152602001838152602001828103825286818151815260200191508051906020019080838360008314610248575b80518252602083111561024857601f199092019160209182019101610228565b505050905090810190601f1680156102745780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b341561028d57fe5b6101416004356024356105c0565b005b600160a060020a03331660009081526002602052604090205460ff16156102c45760006000fd5b6040805160a0810182526001808252602080830187815233600160a060020a03168486018190526060850188905260808501879052600090815260028352949094208351815460ff19169015151781559351805193949361032c938501929190910190610766565b5060408201518160020160006101000a815481600160a060020a030219169083600160a060020a0316021790555060608201518160030155608082015181600401559050507ff69139b4209a3ee7db09bbe1d00359ca79993b7f7e1cc501f2784240c58aca6c83338484604051808060200185600160a060020a0316600160a060020a03168152602001848152602001838152602001828103825286818151815260200191508051906020019080838360008314610405575b80518252602083111561040557601f1990920191602091820191016103e5565b505050905090810190601f1680156104315780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a15b505050565b6003805473ffffffffffffffffffffffffffffffffffffffff191633600160a060020a0390811691909117918290556004839055604080519290911682526020820183905280517f182330bdae199ac3ad3e13c76eb719f687f880653f8dee040adc74327eaf3a669281900390910190a16002600555620f423f6007555b50565b60015442106104df57600054600160a060020a0316ff5b5b5b565b6104eb6107e5565b33600160a060020a031660009081526002602081815260408084206001808201805484519281161561010002600019011695909504601f8101859004850282018501909352828152859485949293919290919083018282801561058f5780601f106105645761010080835404028352916020019161058f565b820191906000526020600020905b81548152906001019060200180831161057257829003601f168201915b505050600284015460038501546004860154949950600160a060020a039091169750955091935050505b5090919293565b600160a060020a03331660009081526002602052604090205460ff161561013a577f4cc192b974e708b4556e771d6b0425e65a284b111616339527df19b8b9c31ce46002600033600160a060020a0316600160a060020a03168152602001908152602001600020600101838360405180806020018481526020018381526020018281038252858181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156106c15780601f10610696576101008083540402835291602001916106c1565b820191906000526020600020905b8154815290600101906020018083116106a457829003601f168201915b505094505050505060405180910390a16007548110156107095760078190556006805473ffffffffffffffffffffffffffffffffffffffff191633600160a060020a03161790555b600580546000190190819055151561013a577fc17eabdf34dbdda04d4e5bc7f639984fff1d8a51ba4bb7f728e59744c3320e07600454600754604051808381526020018281526020019250505060405180910390a15b5b5b5b5050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106107a757805160ff19168380011785556107d4565b828001600101855582156107d4579182015b828111156107d45782518255916020019190600101906107b9565b5b506107e19291506107f7565b5090565b60408051602081019091526000815290565b61081591905b808211156107e157600081556001016107fd565b5090565b905600a165627a7a72305820b22f653c8b87d27b4c5882b46c1e3aa0b5c2c5c4739b7156af678f45d3acdc4c0029', 
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
	      console.log("[A payment of "+ result.args.amount + " is received from " + result.args.sender + " for the asset " + result.args.barcode + ".]");
	});
	// Event AssetShipped
        contract.AssetShipped().watch(function(error, result){
	   if (!error)
	      console.log("[The asset " + result.args.barcode + " has been shipped with the tracking number " + result.args.trackingNumber + ".]");
	});
    }
 })
