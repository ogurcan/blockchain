rm -rf ./Node01*
geth --identity="Node01" --datadir="./Node01" -verbosity 6 --port 30301 --rpcport 8101 --networkid="12345" init ./config/CustomGenesis.json 2>> ./Node01.log
