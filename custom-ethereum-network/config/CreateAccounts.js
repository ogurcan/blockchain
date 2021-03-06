var account00 = personal.newAccount("Node01Account00")
var account01 = personal.newAccount("Node01Account01")
var account02 = personal.newAccount("Node01Account02")
var account03 = personal.newAccount("Node01Account03")
var account04 = personal.newAccount("Node01Account04")
var account05 = personal.newAccount("Node01Account05")

console.log('{');
console.log('   "nonce": "0x0000000000000042",');
console.log('   "timestamp": "0x0",');
console.log('   "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",');
console.log('   "extraData": "0x0",');
console.log('   "gasLimit": "0x8000000000",');
console.log('   "difficulty": "0x400",');
console.log('   "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",');
console.log('   "coinbase": "0x3333333333333333333333333333333333333333",');
console.log('   "alloc": {');
console.log('      "' + account00 +'" : {');
console.log('       "balance" : "100000000000000000000"');
console.log('      },');
console.log('      "' + account01 +'" : {');
console.log('       "balance" : "200000000000000000000"');
console.log('      },');
console.log('      "' + account02 +'" : {');
console.log('       "balance" : "300000000000000000000"');
console.log('      },');
console.log('      "' + account03 +'" : {');
console.log('       "balance" : "100000000000000000000"');
console.log('      },');
console.log('      "' + account04 +'" : {');
console.log('       "balance" : "100000000000000000000"');
console.log('      },');
console.log('      "' + account05 +'" : {');
console.log('       "balance" : "100000000000000000000"');
console.log('      }');
console.log('   }');
console.log('}');
console.log('');
console.log('Replace the text above with the text inside "config/CustomGenesis.json" and run "initialize.sh" again.');
