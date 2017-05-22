// unlock all accounts
loadScript("config/UnlockAccounts.js");
// now create the transition
reputationSystem.createTransition(eth.accounts[0], eth.accounts[1], eth.accounts[2], eth.accounts[3], eth.accounts[4], eth.accounts[5], {from: eth.coinbase, gas: 300000});
