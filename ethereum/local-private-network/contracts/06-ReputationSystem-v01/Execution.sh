~/blockchain/ethereum/local-private-network$ sh bin/init.sh 
~/blockchain/ethereum/local-private-network$ sh bin/console.sh
Welcome to the Geth JavaScript console!

instance: Geth/Node01/v1.5.9-stable-a07539fb/linux/go1.7.3
 modules: admin:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

> loadScript("config/CreateAccounts.js");
{
   "nonce": "0x0000000000000042",
   "timestamp": "0x0",
   "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
   "extraData": "0x0",
   "gasLimit": "0x8000000000",
   "difficulty": "0x400",
   "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
   "coinbase": "0x3333333333333333333333333333333333333333",
   "alloc": {
      "0x8899906bfe74778bf17d1d76a1ac0c3ad734b738" : {
       "balance" : "100000000000000000000"
      },
      "0xb1ff723d28ae308a898554651a2ffd5a8e33d74d" : {
       "balance" : "200000000000000000000"
      },
      "0x2647dfabb60a4fa8e16d2cf0d9c42ef9ae7fb50a" : {
       "balance" : "300000000000000000000"
      },
      "0x75157bb7632b8888afe9d496ff0b1a6bd3cc4d8d" : {
       "balance" : "100000000000000000000"
      },
      "0xfc3dcc616c24cf571c61350bd79aa081d17b06fd" : {
       "balance" : "100000000000000000000"
      },
      "0xb6c4da65612e0941aea2097df2fedcb50f4df57a" : {
       "balance" : "100000000000000000000"
      }
   }
}

Replace the text above with the text inside "config/CustomGenesis.json" and run "initialize.sh" again.
true
> 
> exit
~/blockchain/ethereum/local-private-network$ gedit config/CustomGenesis.json
~/blockchain/ethereum/local-private-network$ sh bin/reinit.sh 
~/blockchain/ethereum/local-private-network$ sh bin/console.sh
Welcome to the Geth JavaScript console!

instance: Geth/Node01/v1.5.9-stable-a07539fb/linux/go1.7.3
coinbase: 0x8899906bfe74778bf17d1d76a1ac0c3ad734b738
at block: 0 (Thu, 01 Jan 1970 01:00:00 CET)
 datadir: /export/home/og240447/zaynah/blockchain/ethereum/local-private-network/Node01
 modules: admin:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

> miner.start(2);
true
> loadScript("contracts/06-ReputationSystem-v01/deploy.js");
null [object Object]
true
> null [object Object]
Contract mined! address: 0x5f7cb1b96d298c9f903aa1b89f58ba47b5f78f9d transactionHash: 0x08cade4c39afb219825cf9174d2bdc4ffc7db8ac64a3ac5f25f52756d2727068
> reputationSystem.addStakeholder("FoodProvider01", 0, {from: eth.accounts[0], gas: 100000});
"0x80f8dc9586c06d6031bf4bdfef99ca0ec9ea65877ee75493ee6004b58c82eb6e"
> reputationSystem.addStakeholder("Breeder01", 1, {from: eth.accounts[1], gas: 100000});
"0xa70bb2f2370d49ce13f4aa7575983105d1a72eb17f743623ec02f5752dc3107c"
> reputationSystem.addStakeholder("AnimalCarrier01", 2, {from: eth.accounts[2], gas: 100000});
"0x36bedea26b6944e039c87c12be579132deb4b5534df848bc99ceea2e6450e287"
> reputationSystem.addStakeholder("SalughterHouse01", 3, {from: eth.accounts[3], gas: 100000});
"0x51c7ed41103f8ec6340410d0b3b21bba9b5a228a61790294765fa85b44139b9f"
> reputationSystem.addStakeholder("RefrigeratedCarrier01", 4, {from: eth.accounts[4], gas: 100000});
"0x181c88f7bdca57f7cf06920310bda77d1507ddb0de80dacd7fc61dd325d3a18e"
> reputationSystem.addStakeholder("Brand01", 5, {from: eth.accounts[5], gas: 100000});
"0x25d1c902ca8242e50514c837fd103c298edfe5764293a186aaf84e059d5fa2df"
> reputationSystem.createBusinessProcess(eth.accounts[0], eth.accounts[1], eth.accounts[2], eth.accounts[3], eth.accounts[4], eth.accounts[5], {from: eth.coinbase, gas: 100000});
"0xecd6961aa5c32562f02881dfbf304e6b32bfd1f7354d0e20b86e742c2f147e2a"
> reputationSystem.getReputation(eth.accounts[0]);
1
> reputationSystem.getReputation(eth.accounts[1]);
1
> reputationSystem.reputate(1, eth.accounts[0], 3, {from: eth.accounts[1], gas: 100000});
"0xacb3b4562c4354900aafaaed546157d5c04c3d7bfc86bb13c1f4d0188728f2b9"
> reputationSystem.getReputation(eth.accounts[0]);
2
> reputationSystem.reputate(1, eth.accounts[1], 1, {from: eth.accounts[2], gas: 100000});
"0xc57e22bbed0669e515473c7414de4f51be05040b5d39684d2cfd56a0c3dc0d73"
> reputationSystem.reputate(1, eth.accounts[1], 0, {from: eth.accounts[3], gas: 100000});
"0x349699477eff10ef86a801bb8e6c3e4adf2fb34a6d3c1a687cbedd6066e02038"
> reputationSystem.getReputation(eth.accounts[1]);
1
