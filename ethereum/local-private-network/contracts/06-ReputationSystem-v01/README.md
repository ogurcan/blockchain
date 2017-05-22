# The ReputationSystem Contract

## Before you begin

Before you begin, make sure that the [Solidity](http://solidity.readthedocs.io/en/develop/index.html) compiler is installed as described [here](https://github.com/ethereum/go-ethereum/wiki/Contract-Tutorial#install-solc-on-ubuntu). To verify if Solidy is installed correctly, go to the geth console and type the `eth.getCompilers()` command.

``` js
> eth.getCompilers()
["Solidity"]
> 
```

This example is prepared by using the geth version `1.5.9-stable` which is using Go version `go1.7.3` and tested on `Ubuntu 14.04.5`. 

``` bash
Geth
Version: 1.5.9-stable
Git Commit: a07539fb88db7231d18db918ed7a6a4e32f97450
Protocol Versions: [63 62]
Network Id: 1
Go Version: go1.7.3
OS: linux
GOPATH=
GOROOT=/usr/lib/go-1.7
```

## Introduction

In this example, we will develop a reputation system contract.

## Contract: ReputationSystem

### Final Contract Code

The full contract code is as below.

``` js
pragma solidity ^0.4.11;

/* Contract managing reputations of stakeholders */
contract ReputationSystem {
    
    // contract information
    address contractOwner;
    
    struct Stakeholder {
        string name; // stakeholder name
        address id; // id as address
        uint profession; // 0 food provider, 1 breeder, 2 animal carrier, 
                         // 3 slaughterhouse, 4 refrigerated carrier, 5 brand
    }
    
    mapping (address => Stakeholder) public stakeholders;
    event StakeholderAdded(string name, address id, uint profession);
    
    // 1st index evaluator profession, 2nd index evaluated profession
    mapping (uint => mapping(uint => bool)) public feedbackRelationships;
    
    struct BusinessProcess {
        address foodProviderID;
        address breederID;
        address animalCarrierID;
        address slaughterHouseID;
        address refrigeratedCarrierID;
        address brandID;
    }
    
    mapping (uint => BusinessProcess) public businessProcessList;
    uint businessProcessID = 1; // starts from 1
    event BusinessProcessCreated(uint bpID);
    
    struct Feedback {
        uint businessProcessID; // for which business process
        address evaluatorID; // by which stakeholder
        address evaluatedID; // for which stakeholder
        uint weight; // reputation level of the evaluator at evalution time
        uint rate; // rate value of the evaluator
    }
    
    // Feedback list holding all feedbacks
    mapping (uint => Feedback) public feedbacks;
    uint feedbackCount = 0;
    
    event FeedbackGiven(uint businessProcessID, string evaluatorName, string evaluatedName, uint rate);
   
    /* Constructor */
    function ReputationSystem() {
        // set the owner of this contract
        contractOwner = msg.sender;
        
        // since default bool value is false we just need to set the true ones
        // 1 can evaluate 0 and 2.
        feedbackRelationships[1][0] = true;
        feedbackRelationships[1][2] = true;
        // 2 can evaluate 1.
        feedbackRelationships[2][1] = true;
        // 3 can evaluate 1, 2 and 4.
        feedbackRelationships[3][1] = true;
        feedbackRelationships[3][2] = true;
        feedbackRelationships[3][4] = true;
        // 4 can evaluate 3.
        feedbackRelationships[4][3] = true;
        // 5 can evaluate 3 and 4.
        feedbackRelationships[5][3] = true;
        feedbackRelationships[5][4] = true;
    }  
    
    /* Add stakeholders to the system. */ 
    function addStakeholder(string name, uint profession) {
        address id = msg.sender;
        stakeholders[id] = Stakeholder(name, id, profession);
        StakeholderAdded(name, id, profession);
    }
    
    /* Create a business between stakeholders */
    function createBusinessProcess(address foodProviderID, address breederID, address animalCarrierID, 
                            address slaughterHouseID, address refrigeratedCarrierID, address brandID) returns (uint bpID) {
        if ((stakeholders[foodProviderID].profession == 0) && (stakeholders[breederID].profession == 1) &&
            (stakeholders[animalCarrierID].profession == 2) && (stakeholders[slaughterHouseID].profession == 3) &&
            (stakeholders[refrigeratedCarrierID].profession == 4) && (stakeholders[brandID].profession == 5)) {
          
            businessProcessList[businessProcessID++] = BusinessProcess(foodProviderID, breederID, animalCarrierID, 
                            slaughterHouseID, refrigeratedCarrierID, brandID);
            BusinessProcessCreated(businessProcessID);
            return businessProcessID;
        } else return 0;
    }
    
    /* Reputate a stakeholder (evaluated) for a business with a rate from 0 to 3. */
    function rate(uint businessProcessID, address evaluatedID, uint rate) {
        address evaluatorID = msg.sender;
        Stakeholder evaluator = stakeholders[evaluatorID];
        Stakeholder evaluated = stakeholders[evaluatedID];
        
        if (canRate(businessProcessID, evaluator, evaluated)) {
            uint reputationOfEvaluator = getReputation(evaluatorID);
            feedbacks[feedbackCount++] = Feedback(businessProcessID, evaluatorID, evaluatedID, reputationOfEvaluator, rate);
            FeedbackGiven(businessProcessID, evaluator.name, evaluated.name, rate);
        }
    }
    
    /* Check if the evaluator can reputate the evaluated for the business */ 
    function canRate(uint businessProcessID, Stakeholder evaluator, Stakeholder evaluated) private constant returns (bool result) {
        // check if these stakeholders are in this business
        bool b1 = isInsideBusinessProcess(businessProcessID, evaluator.id);
        bool b2 = isInsideBusinessProcess(businessProcessID, evaluated.id);
        
        // check if the evaluator has not already reputated the evaluated // TODO
        
        // check if evaluator can evaluate the evaluated regarding to the relation rules
        bool b3 = feedbackRelationships[evaluator.profession][evaluated.profession];
        
        // if all are true return true, false otherwise.
        return (b1 && b2 && b3);
    }
    
    function isInsideBusinessProcess(uint businessProcessID, address stakeholderID) constant returns (bool result) {
        BusinessProcess businessProcess = businessProcessList[businessProcessID];
        Stakeholder stakeholder = stakeholders[stakeholderID];
        bool c0 = (stakeholder.profession == 0) && (stakeholderID == businessProcess.foodProviderID);
        bool c1 = (stakeholder.profession == 1) && (stakeholderID == businessProcess.breederID);
        bool c2 = (stakeholder.profession == 2) && (stakeholderID == businessProcess.animalCarrierID);
        bool c3 = (stakeholder.profession == 3) && (stakeholderID == businessProcess.slaughterHouseID);
        bool c4 = (stakeholder.profession == 4) && (stakeholderID == businessProcess.refrigeratedCarrierID);
        bool c5 = (stakeholder.profession == 5) && (stakeholderID == businessProcess.brandID);
        return (c0 || c1 || c2 || c3 || c4 || c5);
    }    
    
    /* Calculate and return the reputation value for the given stakeholder. 
       Returns 1.5 if the stakeholder has never been reputated before. */
    function getReputation(address stakeholderID) constant returns (uint) {
        uint totalWeight = 2; // initial weight for everyone 
        uint totalWeightedRate = 3; // initial weighted rate for everyone
        
        for (uint i = 0; i < feedbackCount; i++) {
            Feedback feedback = feedbacks[i];
            if (feedback.evaluatedID == stakeholderID) {
               totalWeight += feedback.weight;
               totalWeightedRate += feedback.weight * feedback.rate;
            }
        }
        
        return totalWeightedRate/totalWeight; // calculated reputation value
    }
}
```

### Using the Contract

First prepare the local private network for testing the contract.
```js
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
```

Then deploy the contract.
```js
~/blockchain/ethereum/local-private-network$ sh bin/console.sh
Welcome to the Geth JavaScript console!

instance: Geth/Node01/v1.5.9-stable-a07539fb/linux/go1.7.3
coinbase: 0x8899906bfe74778bf17d1d76a1ac0c3ad734b738
at block: 0 (Thu, 01 Jan 1970 01:00:00 CET)
 datadir: /export/home/og240447/blockchain/ethereum/local-private-network/Node01
 modules: admin:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

> miner.start(2);
true
> loadScript("contracts/06-ReputationSystem-v01/deploy.js");
null [object Object]
true
> null [object Object]
Contract mined! address: 0x5f7cb1b96d298c9f903aa1b89f58ba47b5f78f9d transactionHash: 0x08cade4c39afb219825cf9174d2bdc4ffc7db8ac64a3ac5f25f52756d2727068
```

Now we can interact with the contract. We first need to add stakeholders to the system: `FoodProvider01`, `Breeder01`, `AnimalCarrier01`, `SlaughterHouse`, `RefrigeratedCarrier01` and `Brand01`.
> Note that each stakeholder is using a different account.

Food provider.
```js
> reputationSystem.addStakeholder("FoodProvider01", 0, {from: eth.accounts[0], gas: 100000});
"0x80f8dc9586c06d6031bf4bdfef99ca0ec9ea65877ee75493ee6004b58c82eb6e"
> [FoodProvider01 has been added as a stakeholder with the ID 0xab7c6196f903e7ba969f808ac25b0d48034687b0 and the profession number 0.]
```

Breeder.
```js
> reputationSystem.addStakeholder("Breeder01", 1, {from: eth.accounts[1], gas: 100000});
"0xa70bb2f2370d49ce13f4aa7575983105d1a72eb17f743623ec02f5752dc3107c"
> [Breeder01 has been added as a stakeholder with the ID 0xe9bf28b5de4999ac5eb8fbe3c88121bcb852de98 and the profession number 1.]
```

Animal carrier.
```js
> reputationSystem.addStakeholder("AnimalCarrier01", 2, {from: eth.accounts[2], gas: 100000});
"0x36bedea26b6944e039c87c12be579132deb4b5534df848bc99ceea2e6450e287"
> [AnimalCarrier01 has been added as a stakeholder with the ID 0x36f963acd6395c99a5b02eb518f963108e3f4c35 and the profession number 2.]
```

Slaughter house.
```js
> reputationSystem.addStakeholder("SlaughterHouse01", 3, {from: eth.accounts[3], gas: 100000});
"0x51c7ed41103f8ec6340410d0b3b21bba9b5a228a61790294765fa85b44139b9f"
> [SlaughterHouse01 has been added as a stakeholder with the ID 0x93856142a98d0407f3c5cd54f583af81a82ac7bc and the profession number 3.]
```

Refrigerated Carrier.
```js
> reputationSystem.addStakeholder("RefrigeratedCarrier01", 4, {from: eth.accounts[4], gas: 100000});
"0x181c88f7bdca57f7cf06920310bda77d1507ddb0de80dacd7fc61dd325d3a18e"
> [RefrigeratedCarrier01 has been added as a stakeholder with the ID 0x74c2b3856accd52f71de391a1c081f24b5578047 and the profession number 4.]
```

Brand.
```js
> reputationSystem.addStakeholder("Brand01", 5, {from: eth.accounts[5], gas: 100000});
"0x25d1c902ca8242e50514c837fd103c298edfe5764293a186aaf84e059d5fa2df"
> [Brand01 has been added as a stakeholder with the ID 0x0df5d4c134caeff9963e19b60280315560cd5fe3 and the profession number 5.]
```

Then create a business process between them.
```js
> reputationSystem.createBusinessProcess(eth.accounts[0], eth.accounts[1], eth.accounts[2], eth.accounts[3], eth.accounts[4], eth.accounts[5], {from: eth.coinbase, gas: 300000});
"0xecd6961aa5c32562f02881dfbf304e6b32bfd1f7354d0e20b86e742c2f147e2a"
```

Initially, the reputation of all the stakeholders are `1`.
```js
> reputationSystem.getReputation(eth.accounts[0]);
1
> reputationSystem.getReputation(eth.accounts[1]);
1
```

After a while `Breeder01` (`eth.accounts[1]`) reputates `FoodProvider01` (`eth.accounts[0]`) by a score of `3`.
```js
> reputationSystem.rate(1, eth.accounts[0], 3, {from: eth.accounts[1], gas: 300000});
"0xacb3b4562c4354900aafaaed546157d5c04c3d7bfc86bb13c1f4d0188728f2b9"
```

Now the reputation of `FoodProvider01` is `2`.
``` js
> reputationSystem.getReputation(eth.accounts[0]);
2
```

Similarly, `AnimalCarrier01` and `SlaughterHouse01` are reputating `Breeder01` with score `1` and `0` respectively.
``` js
> reputationSystem.rate(1, eth.accounts[1], 1, {from: eth.accounts[2], gas: 300000});
"0xc57e22bbed0669e515473c7414de4f51be05040b5d39684d2cfd56a0c3dc0d73"
> reputationSystem.rate(1, eth.accounts[1], 0, {from: eth.accounts[3], gas: 300000});
"0x349699477eff10ef86a801bb8e6c3e4adf2fb34a6d3c1a687cbedd6066e02038"
```

And the reputation of `Breeder01` remains the same.
```js
> reputationSystem.getReputation(eth.accounts[1]);
1
```

## Tracing the Data

In this section we will show you how to trace data written in the blockchain.

