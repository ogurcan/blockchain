// unlock all accounts
loadScript("config/UnlockAccounts.js");
// contract code
var reputationSystemContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"evaluations","outputs":[{"name":"businessProcessID","type":"uint256"},{"name":"evaluatorID","type":"address"},{"name":"evaluatedID","type":"address"},{"name":"weight","type":"uint256"},{"name":"score","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"businessProcessID","type":"uint256"},{"name":"stakeholderID","type":"address"}],"name":"isInsideBusinessProcess","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"stakeholderID","type":"address"}],"name":"getReputation","outputs":[{"name":"reputation","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"businessProcessID","type":"uint256"},{"name":"evaluatedID","type":"address"},{"name":"score","type":"uint256"}],"name":"reputate","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"profession","type":"uint256"}],"name":"addStakeholder","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"foodProviderID","type":"address"},{"name":"breederID","type":"address"},{"name":"animalCarrierID","type":"address"},{"name":"slaughterHouseID","type":"address"},{"name":"refrigeratedCarrierID","type":"address"},{"name":"brandID","type":"address"}],"name":"createBusinessProcess","outputs":[{"name":"bpID","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]);
var reputationSystem = reputationSystemContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '0x606060405260016004556000600655341561001657fe5b5b60008054600160a060020a03191633600160a060020a03161781557ff8dd1754cdb399bc5b4e203e4acfec383074082a262a94d223f4e1ba300eaf08805460ff1990811660019081179092557fe3676086f4a883dc16130d16abf278f5c150e68c2617fc316cdd91414d82ea7480548216831790557f9fffbb9e89029b0baa965344cab51a6b05088fdd0a0df87ecf7dddfe9e4c7b7480548216831790557f85c8d53f896f29b263aef4a7c060c9014c20977dbb5ec4ce69dbd3968de6e4d380548216831790557f7e486e43646097e9bffc9198a94f3d553a3f64a8ca16793e9c9c510c31dd515180548216831790557ff675a99de4baad6b24b8fc680370f5be1b1ef4f092c28e6a215bd988d9aaeb8280548216831790557f8d4b243c7de8cb9a30e76b986ffbec4cd784be97eca524a423b4c3e14d94070980548216831790557f11351240656473593f2158e499710d9bfaae96571680fdb7c1cd583dd95efb78805482168317905560049092527fb98b78633099fa36ed8b8680c4f8092689e1e04080eb9cbb077ca38a14d7e3846020527f8c06a63ecc6821849443ffa8d7a7f4bf62fb877f13b87df88049b6d5679030e980549092161790555b5b6107ef806101e56000396000f300606060405236156100755763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166333c63b1781146100775780636aa9e8c9146100c15780639c89a0e2146100f4578063a4dd634014610122578063da9143f514610146578063f3ef7148146101a0575bfe5b341561007f57fe5b61008a6004356101ec565b60408051958652600160a060020a039485166020870152929093168483015260608401526080830191909152519081900360a00190f35b34156100c957fe5b6100e0600435600160a060020a0360243516610227565b604080519115158252519081900360200190f35b34156100fc57fe5b610110600160a060020a036004351661036a565b60408051918252519081900360200190f35b341561012a57fe5b610144600435600160a060020a03602435166044356103dd565b005b341561014e57fe5b610144600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375094965050933593506104b292505050565b005b34156101a857fe5b610110600160a060020a0360043581169060243581169060443581169060643581169060843581169060a4351661053f565b60408051918252519081900360200190f35b600560205260009081526040902080546001820154600283015460038401546004909401549293600160a060020a0392831693929091169185565b6000828152600360209081526040808320600160a060020a038516845260019092528220600281015483908190819081908190819015801561027557508754600160a060020a038b81169116145b95508660020154600114801561029a57506001880154600160a060020a038b81169116145b9450866002015460021480156102bf57506002880154600160a060020a038b81169116145b9350866002015460031480156102e457506003880154600160a060020a038b81169116145b92508660020154600414801561030957506004880154600160a060020a038b81169116145b91508660020154600514801561032e57506005880154600160a060020a038b81169116145b905085806103395750845b806103415750835b806103495750825b806103515750815b806103595750805b98505b505050505050505092915050565b60006002600382805b6006548210156103c5575060008181526005602052604090206002810154600160a060020a03878116911614156103b95760038101546004820154948101940292909201915b5b600190910190610373565b83838115156103d057fe5b0494505b50505050919050565b33600160a060020a0381811660009081526001602052604080822092861682528120906104098461036a565b6040805160a081018252898152600160a060020a0380881660208084019182528b831684860190815260608501878152608086018d81526006805460018082019092556000908152600590955297909320955186559251958501805496851673ffffffffffffffffffffffffffffffffffffffff199788161790555160028501805491909416951694909417909155516003820155905160049091015590505b50505050505050565b6040805160608101825283815233600160a060020a038116602080840182905283850186905260009182526001815293902082518051929491926104f99284920190610723565b50602082015160018201805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a039092169190911790556040909101516002909101555b505050565b600160a060020a0386166000908152600160205260408120600201541580156105845750600160a060020a038616600090815260016020819052604090912060020154145b80156105ab5750600160a060020a0385166000908152600160205260409020600290810154145b80156105d25750600160a060020a0384166000908152600160205260409020600201546003145b80156105f95750600160a060020a0383166000908152600160205260409020600201546004145b80156106205750600160a060020a0382166000908152600160205260409020600201546005145b1561071457506040805160c081018252600160a060020a0380891682528781166020808401918252888316848601908152888416606086019081528885166080870190815288861660a08801908152600480546001808201835560009182526003978890529a90209851895490891673ffffffffffffffffffffffffffffffffffffffff19918216178a55965199890180549a89169a88169a909a179099559251600288018054918816918716919091179055905192860180549386169385169390931790925590518486018054918516918416919091179055516005909301805493909216921691909117905554610718565b5060005b5b9695505050505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061076457805160ff1916838001178555610791565b82800160010185558215610791579182015b82811115610791578251825591602001919060010190610776565b5b5061079e9291506107a2565b5090565b6107c091905b8082111561079e57600081556001016107a8565b5090565b905600a165627a7a72305820451af4f88baecd91838ac88076366fc6b73ce9474d87ade02505df322d9b2f500029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
