loadScript("UnlockAccounts.js")
var simplebidding_sol_simplebiddingContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"barcode","type":"uint256"}],"name":"requestAsset","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"dispose","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"barcode","type":"uint256"},{"name":"price","type":"uint256"}],"name":"proposePrice","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"requester","type":"address"},{"indexed":false,"name":"barcode","type":"uint256"}],"name":"AssetRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"vendor","type":"address"},{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"PriceProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"BiddingFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"barcode","type":"uint256"}],"name":"PaymentReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"trackingNumber","type":"uint256"}],"name":"AssetShipped","type":"event"}]);
var simplebidding = simplebidding_sol_simplebiddingContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000c57fe5b5b61070842016001555b5b61030e806100266000396000f3006060604052361561003b5763ffffffff60e060020a6000350416632b25d4fd811461012b5780634c86659e14610140578063e161926914610152575b6101295b600254600090819033600160a060020a03908116911614156101235734915060065482141561012357600554604051600160a060020a039091169083156108fc029084906000818181858888f1505060035460408051600160a060020a033316815234602082015280820192909252517f5677b5d4cf976ac32defbd95a6a5aaf0d1fee450a11fc26f3c11aae6e6c33d0694509081900360600192509050a150600354604080519182526301628aa360208301819052815190927fb392290afa7f5b07c58b82f2a4f36a13e77050183671211ed5b5f27ca86b135e92908290030190a15b5b5b5050565b005b341561013357fe5b61012960043561016a565b005b341561014857fe5b6101296101eb565b005b341561015a57fe5b610129600435602435610206565b005b6002805473ffffffffffffffffffffffffffffffffffffffff191633600160a060020a0390811691909117918290556003839055604080519290911682526020820183905280517f182330bdae199ac3ad3e13c76eb719f687f880653f8dee040adc74327eaf3a669281900390910190a16002600455620f423f6006555b50565b600154421061020257600054600160a060020a0316ff5b5b5b565b60408051600160a060020a03331681526020810184905280820183905290517f753ea8d69d7d6b1f4d50c3fad4b7198d77bc061bcda3d58b777be0b28dc9b6189181900360600190a16006548110156102875760068190556005805473ffffffffffffffffffffffffffffffffffffffff191633600160a060020a03161790555b6004805460001901908190551515610123577fc17eabdf34dbdda04d4e5bc7f639984fff1d8a51ba4bb7f728e59744c3320e07600354600654604051808381526020018281526020019250505060405180910390a15b5b50505600a165627a7a72305820e2024a5be7d5210c732e933427987569baa58cc7b0bc2c654753f769d30ada760029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
         var assetRequested = simplebidding.AssetRequested();
         console.log("Event: " + assetRequested);
         assetRequested.watch(function(error, result){
            if (error) {
    	       console.log(error);
               return;
            }
	    console.log("[Asset " + result.args.barcode + " requested by " + result.args.requester + "]");
	 }); 
    }
 })
