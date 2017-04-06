// must unlock the account we are creating the contract from so we can use it
loadScript("UnlockAccounts.js")
// must set the _account parameter
_account = eth.accounts[1]
// contract code
var receiveether_sol_receiveetherContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"dispose","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_account","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"EtherReceival","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contractName","type":"string"},{"indexed":false,"name":"time","type":"uint256"}],"name":"ContractDisposed","type":"event"}]);
var receiveether_sol_receiveether = receiveether_sol_receiveetherContract.new(
   _account,
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000c57fe5b6040516020806101af83398101604052515b60008054600160a060020a031916600160a060020a03831617905542610258016001555b505b61015c806100536000396000f300606060405236156100255763ffffffff60e060020a6000350416634c86659e811461009e575b61009c5b600080546040513492600160a060020a039092169183156108fc02918491818181858888f1505060408051600160a060020a03331681526020810186905281517f75f33ed68675112c77094e7c5b073890598be1d23e27cd7f6907b4a7d98ac61995509081900390910192509050a15b50565b005b34156100a657fe5b61009c6100b0565b005b600154421061012c5760408051426020820152818152600c818301527f5265636569766545746865720000000000000000000000000000000000000000606082015290517f223c10abd9be53f20e899d6a493799dadfb2534befd381ad380ce06a14b1d41f9181900360800190a1600054600160a060020a0316ff5b5b5b5600a165627a7a72305820391aec2c5f68f456a73c07b6a1e5e8fe465c9de6a4820cb5606e0191dd09a2de0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
	 // configure the event to watch for changes
	 contract.EtherReceival({}, function(error, result){
	   if (!error)
	     console.log("[Ether received: Sender: " + result.args.sender + ", Amount: " + web3.fromWei(result.args.amount, "ether")+" ether(s)]");
	 });
	 contract.ContractDisposed({}, function(error, result){
	   if (!error)
	     console.log("[Contract " + result.args.contractName + " has been disposed.]");
	 });
    }
 })
