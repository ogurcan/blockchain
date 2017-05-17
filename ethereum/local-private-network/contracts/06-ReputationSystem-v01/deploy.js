// unlock all accounts
loadScript("config/UnlockAccounts.js");
// contract code
var reputationSystemContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"evaluations","outputs":[{"name":"businessProcessID","type":"uint256"},{"name":"evaluatorID","type":"address"},{"name":"evaluatedID","type":"address"},{"name":"weight","type":"uint256"},{"name":"score","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"businessProcessID","type":"uint256"},{"name":"stakeholderID","type":"address"}],"name":"isInsideBusinessProcess","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"stakeholderID","type":"address"}],"name":"getReputation","outputs":[{"name":"reputation","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"businessProcessID","type":"uint256"},{"name":"evaluatedID","type":"address"},{"name":"score","type":"uint256"}],"name":"reputate","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"profession","type":"uint256"}],"name":"addStakeholder","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"foodProviderID","type":"address"},{"name":"breederID","type":"address"},{"name":"animalCarrierID","type":"address"},{"name":"slaughterHouseID","type":"address"},{"name":"refrigeratedCarrierID","type":"address"},{"name":"brandID","type":"address"}],"name":"createBusinessProcess","outputs":[{"name":"bpID","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]);
var reputationSystem = reputationSystemContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '0x606060405260016004556000600655341561001657fe5b5b60008054600160a060020a03191633600160a060020a03161781557ff8dd1754cdb399bc5b4e203e4acfec383074082a262a94d223f4e1ba300eaf08805460ff1990811660019081179092557fe3676086f4a883dc16130d16abf278f5c150e68c2617fc316cdd91414d82ea7480548216831790557f9fffbb9e89029b0baa965344cab51a6b05088fdd0a0df87ecf7dddfe9e4c7b7480548216831790557f85c8d53f896f29b263aef4a7c060c9014c20977dbb5ec4ce69dbd3968de6e4d380548216831790557f7e486e43646097e9bffc9198a94f3d553a3f64a8ca16793e9c9c510c31dd515180548216831790557ff675a99de4baad6b24b8fc680370f5be1b1ef4f092c28e6a215bd988d9aaeb8280548216831790557f8d4b243c7de8cb9a30e76b986ffbec4cd784be97eca524a423b4c3e14d94070980548216831790557f11351240656473593f2158e499710d9bfaae96571680fdb7c1cd583dd95efb78805482168317905560049092527fb98b78633099fa36ed8b8680c4f8092689e1e04080eb9cbb077ca38a14d7e3846020527f8c06a63ecc6821849443ffa8d7a7f4bf62fb877f13b87df88049b6d5679030e980549092161790555b5b61099d806101e56000396000f3006060604052361561005c5763ffffffff60e060020a60003504166333c63b17811461005e5780636aa9e8c9146100a85780639c89a0e2146100db578063a4dd634014610109578063da9143f51461012d578063f3ef714814610187575bfe5b341561006657fe5b6100716004356101d3565b60408051958652600160a060020a039485166020870152929093168483015260608401526080830191909152519081900360a00190f35b34156100b057fe5b6100c7600435600160a060020a036024351661020e565b604080519115158252519081900360200190f35b34156100e357fe5b6100f7600160a060020a0360043516610351565b60408051918252519081900360200190f35b341561011157fe5b61012b600435600160a060020a03602435166044356103c2565b005b341561013557fe5b61012b600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843750949650509335935061060d92505050565b005b341561018f57fe5b6100f7600160a060020a0360043581169060243581169060443581169060643581169060843581169060a4351661068d565b60408051918252519081900360200190f35b600560205260009081526040902080546001820154600283015460038401546004909401549293600160a060020a0392831693929091169185565b6000828152600360209081526040808320600160a060020a038516845260019092528220600281015483908190819081908190819015801561025c57508754600160a060020a038b81169116145b95508660020154600114801561028157506001880154600160a060020a038b81169116145b9450866002015460021480156102a657506002880154600160a060020a038b81169116145b9350866002015460031480156102cb57506003880154600160a060020a038b81169116145b9250866002015460041480156102f057506004880154600160a060020a038b81169116145b91508660020154600514801561031557506005880154600160a060020a038b81169116145b905085806103205750845b806103285750835b806103305750825b806103385750815b806103405750805b98505b505050505050505092915050565b60006002600382805b6006548210156103b4575060008181526005602052604090206002810154600160a060020a03878116911614156103a8576003810154600482015460059650948101940292909201916103b9565b5b60019091019061035a565b600394505b50505050919050565b33600160a060020a03818116600090815260016020818152604080842094881684528084208151865460029581161561010002600019011694909404601f81018490049093028401608090810190925260608401838152909493610562938b93919288928492849184018282801561047b5780601f106104505761010080835404028352916020019161047b565b820191906000526020600020905b81548152906001019060200180831161045e57829003601f168201915b5050509183525050600182810154600160a060020a03166020808401919091526002938401546040938401528251895461010093811615939093026000190190921693909304601f810184900490930281016080908101909252606081018381529092889284929184918401828280156105365780601f1061050b57610100808354040283529160200191610536565b820191906000526020600020905b81548152906001019060200180831161051957829003601f168201915b50505091835250506001820154600160a060020a03166020820152600290910154604090910152610864565b156106035761057084610351565b6040805160a081018252898152600160a060020a0380881660208084019182528b831684860190815260608501878152608086018d815260068054600180820190925560009081526005909552979093209551865592519585018054968516600160a060020a03199788161790555160028501805491909416951694909417909155516003820155905160049091015590505b5b50505050505050565b6040805160608101825283815233600160a060020a0381166020808401829052838501869052600091825260018152939020825180519294919261065492849201906108d1565b506020820151600182018054600160a060020a031916600160a060020a039092169190911790556040909101516002909101555b505050565b600160a060020a0386166000908152600160205260408120600201541580156106d25750600160a060020a038616600090815260016020819052604090912060020154145b80156106f95750600160a060020a0385166000908152600160205260409020600290810154145b80156107205750600160a060020a0384166000908152600160205260409020600201546003145b80156107475750600160a060020a0383166000908152600160205260409020600201546004145b801561076e5750600160a060020a0382166000908152600160205260409020600201546005145b1561085557506040805160c081018252600160a060020a0380891682528781166020808401918252888316848601908152888416606086019081528885166080870190815288861660a08801908152600480546001808201835560009182526003978890529a902098518954908916600160a060020a0319918216178a55965199890180549a89169a88169a909a179099559251600288018054918816918716919091179055905192860180549386169385169390931790925590518486018054918516918416919091179055516005909301805493909216921691909117905554610859565b5060005b5b9695505050505050565b600060006000600061087a87876020015161020e565b925061088a87866020015161020e565b6040808801516000908152600260209081528282208984015183529052205490925060ff1690508280156108bb5750815b80156108c45750805b93505b5050509392505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061091257805160ff191683800117855561093f565b8280016001018555821561093f579182015b8281111561093f578251825591602001919060010190610924565b5b5061094c929150610950565b5090565b61096e91905b8082111561094c5760008155600101610956565b5090565b905600a165627a7a72305820687017397bd42eb15ac4918cd509cfddf5bfbdbf89773e551111004762fe8e990029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
