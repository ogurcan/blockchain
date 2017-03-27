// unlock all accounts
loadScript("UnlockAccounts.js");
// contract code
var simplebidding_sol_simplebiddingContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"assetBarcode","type":"uint256"},{"name":"stockCount","type":"uint256"}],"name":"registerVendor","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"barcode","type":"uint256"}],"name":"requestAsset","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"dispose","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getVendor","outputs":[{"name":"name","type":"string"},{"name":"acc","type":"address"},{"name":"barcode","type":"uint256"},{"name":"numAssets","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"barcode","type":"uint256"},{"name":"price","type":"uint256"}],"name":"proposePrice","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"assetBarcode","type":"uint256"},{"indexed":false,"name":"stockCount","type":"uint256"}],"name":"VendorRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"client","type":"address"},{"indexed":false,"name":"barcode","type":"uint256"}],"name":"AssetRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"vendor","type":"address"}],"name":"VendorValidated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"vendor","type":"address"}],"name":"VendorNotValidated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"vendor","type":"address"},{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"PriceProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"BiddingFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"barcode","type":"uint256"}],"name":"PaymentReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"barcode","type":"uint256"},{"indexed":false,"name":"trackingNumber","type":"uint256"}],"name":"AssetShipped","type":"event"}]);
var simplebidding_sol_simplebidding = simplebidding_sol_simplebiddingContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000c57fe5b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061070842016001819055505b5b610abc8061006a6000396000f3006060604052361561006b576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063056b2add146101f85780632b25d4fd146102645780634c86659e1461028457806365de1eb314610296578063e16192691461037e575b6101f65b60006000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156101f1573491506007548214156101f057600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051809050600060405180830381858888f19350505050507f5677b5d4cf976ac32defbd95a6a5aaf0d1fee450a11fc26f3c11aae6e6c33d063334600454604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a164124e4f5ca390507fb392290afa7f5b07c58b82f2a4f36a13e77050183671211ed5b5f27ca86b135e60045482604051808381526020018281526020019250505060405180910390a15b5b5b5050565b005b341561020057fe5b610262600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919080359060200190919080359060200190919050506103a7565b005b341561026c57fe5b6102826004808035906020019091905050610582565b005b341561028c57fe5b61029461066f565b005b341561029e57fe5b6102b460048080359060200190919050506106b9565b60405180806020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001848152602001838152602001828103825286818151815260200191508051906020019080838360008314610341575b8051825260208311156103415760208201915060208101905060208303925061031d565b505050905090810190601f16801561036d5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b341561038657fe5b6103a560048080359060200190919080359060200190919050506107c9565b005b6080604051908101604052808481526020013373ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152506002600280548091906001016103f591906108f6565b81548110151561040157fe5b906000526020600020906004020160005b50600082015181600001908051906020019061042f929190610928565b5060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020155606082015181600301559050507ff69139b4209a3ee7db09bbe1d00359ca79993b7f7e1cc501f2784240c58aca6c8333848460405180806020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001848152602001838152602001828103825286818151815260200191508051906020019080838360008314610540575b8051825260208311156105405760208201915060208101905060208303925061051c565b505050905090810190601f16801561056c5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a15b505050565b33600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806004819055507f182330bdae199ac3ad3e13c76eb719f687f880653f8dee040adc74327eaf3a66600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600454604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a16002600581905550620f423f6007819055505b50565b600154421015156106b657600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b5b565b6106c16109a8565b60006000600060006002868154811015156106d857fe5b906000526020600020906004020160005b509050806000018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107845780601f1061075957610100808354040283529160200191610784565b820191906000526020600020905b81548152906001019060200180831161076757829003601f168201915b505050505094508060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16935080600201549250806003015491505b509193509193565b7f753ea8d69d7d6b1f4d50c3fad4b7198d77bc061bcda3d58b777be0b28dc9b618338383604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a160075481101561088f578060078190555033600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b60056000815480929190600190039190505550600060055414156108f1577fc17eabdf34dbdda04d4e5bc7f639984fff1d8a51ba4bb7f728e59744c3320e07600454600754604051808381526020018281526020019250505060405180910390a15b5b5050565b8154818355818115116109235760040281600402836000526020600020918201910161092291906109bc565b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061096957805160ff1916838001178555610997565b82800160010185558215610997579182015b8281111561099657825182559160200191906001019061097b565b5b5090506109a49190610a23565b5090565b602060405190810160405280600081525090565b610a2091905b80821115610a1c5760006000820160006109dc9190610a48565b6001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600090556003820160009055506004016109c2565b5090565b90565b610a4591905b80821115610a41576000816000905550600101610a29565b5090565b90565b50805460018160011615610100020316600290046000825580601f10610a6e5750610a8d565b601f016020900490600052602060002090810190610a8c9190610a23565b5b505600a165627a7a72305820b9de33bf790acbf7dce9bdd183f5cbaa8c04a83cd6f9fded1bbd1f07bde9e98b0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
    	// Contract is mined.
    	console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);	 
    	// Event AssetRequested
    	contract.AssetRequested().watch(function(error, result){
			if (!error)
				console.log("[Asset " + result.args.barcode + " requested by " + result.args.client + "]");
		});   
		// Event PriceProposed      
	 	contract.PriceProposed().watch(function(error, result){
			if (!error)
	    		console.log("[A price " + result.args.price + " is proposed for the asset " + result.args.barcode + " by " + result.args.vendor + "]");
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