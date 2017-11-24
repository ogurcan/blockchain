// unlock all accounts
loadScript("config/UnlockAccounts.js");

// must set the _account parameter
var _account = eth.accounts[1] ;

// creation of contract object
var untitled_receiveetherContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"deadlineReached","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"receivingAccount","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_account","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"}]);

// creation of contract instance
var untitled_receiveether = untitled_receiveetherContract.new(
   _account,
   {
     from: web3.eth.accounts[1], 
     data: '0x6060604052341561000c57fe5b60405160208061016f83398101604052515b60008054600160a060020a031916600160a060020a03831617905542610258016001555b505b61011c806100536000396000f3006060604052361560375763ffffffff60e060020a60003504166329dcb0cf8114606a578063a29b8b91146089578063e0486c39146098575b60685b600080546040513492600160a060020a039092169183156108fc02918491818181858888f150505050505b50565b005b3415607157fe5b607760c1565b60408051918252519081900360200190f35b3415609057fe5b606860c7565b005b3415609f57fe5b60a560e1565b60408051600160a060020a039092168252519081900360200190f35b60015481565b600154421060dd57600054600160a060020a0316ff5b5b5b565b600054600160a060020a0316815600a165627a7a72305820b1b703cfdcb178e303789c35b5abcc6e6c66af4b2e89e219ec8c48bfa5e0f4d20029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
