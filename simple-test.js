const { ethers } = require('ethers');

async function simpleTest() {
  try {
    console.log('=== Simple BIRBSTR Test ===');
    
    const RPC_URL = 'https://eth-mainnet.g.alchemy.com/v2/AESLCq92vcfhWAHHgMlX3H9HsoPexyuj';
    const CONTRACT_ADDRESS = '0x6BCba7Cd81a5F12c10Ca1BF9B36761CC382658E8';
    
    console.log('Creating provider...');
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    console.log('Getting network...');
    const network = await provider.getNetwork();
    console.log('Network:', network);
    
    console.log('Getting block number...');
    const blockNumber = await provider.getBlockNumber();
    console.log('Current block:', blockNumber);
    
    console.log('Testing contract call...');
    const contract = new ethers.Contract(CONTRACT_ADDRESS, [
      'function currentFees() view returns (uint256)'
    ], provider);
    
    const fees = await contract.currentFees();
    console.log('Current fees:', ethers.formatEther(fees), 'ETH');
    
    console.log('✅ Test successful!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

simpleTest();
