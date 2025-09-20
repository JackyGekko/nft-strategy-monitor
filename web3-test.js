const { Web3 } = require('web3');

async function web3Test() {
  try {
    console.log('=== Web3 BIRBSTR Test ===');
    
    const RPC_URL = 'https://eth-mainnet.g.alchemy.com/v2/AESLCq92vcfhWAHHgMlX3H9HsoPexyuj';
    const CONTRACT_ADDRESS = '0x6BCba7Cd81a5F12c10Ca1BF9B36761CC382658E8';
    
    console.log('Creating Web3 instance...');
    const web3 = new Web3(RPC_URL);
    
    console.log('Getting block number...');
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('Current block:', blockNumber);
    
    console.log('Testing contract call...');
    const contract = new web3.eth.Contract([
      {
        "inputs": [],
        "name": "currentFees",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ], CONTRACT_ADDRESS);
    
    const fees = await contract.methods.currentFees().call();
    console.log('Current fees:', web3.utils.fromWei(fees, 'ether'), 'ETH');
    
    console.log('✅ Test successful!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

web3Test();
