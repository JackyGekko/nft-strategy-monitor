const { Web3 } = require('web3');

async function testWithPublicRPC() {
  try {
    console.log('=== BIRBSTR Test with Public RPC ===');
    
    // Using a free public RPC
    const RPC_URL = 'https://eth.llamarpc.com';
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
      },
      {
        "inputs": [],
        "name": "ethToTwap",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "collection",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "priceMultiplier",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ], CONTRACT_ADDRESS);
    
    const fees = await contract.methods.currentFees().call();
    console.log('Current fees:', web3.utils.fromWei(fees, 'ether'), 'ETH');
    
    const ethToTwap = await contract.methods.ethToTwap().call();
    console.log('ETH to TWAP:', web3.utils.fromWei(ethToTwap, 'ether'), 'ETH');
    
    const collection = await contract.methods.collection().call();
    console.log('Collection:', collection);
    
    const priceMultiplier = await contract.methods.priceMultiplier().call();
    console.log('Price Multiplier:', priceMultiplier, '(1.2x)');
    
    // Check opportunities
    console.log('\n=== Opportunities ===');
    if (parseFloat(web3.utils.fromWei(fees, 'ether')) > 0.1) {
      console.log('💰 Contract has enough fees for NFT purchase!');
    } else {
      console.log('⏳ Waiting for more fees to accumulate...');
    }
    
    if (parseFloat(web3.utils.fromWei(ethToTwap, 'ether')) > 0.01) {
      console.log('🔥 TWAP available for token burning!');
    } else {
      console.log('⏳ No TWAP available yet...');
    }
    
    console.log('✅ Test successful!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWithPublicRPC();
