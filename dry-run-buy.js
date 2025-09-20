const { Web3 } = require('web3');
const { encodeSimpleBuy } = require('./encode-data');

async function dryRunBuy() {
  try {
    console.log('=== DRY RUN: buyTargetNFT() ===\n');
    
    const RPC_URL = 'https://eth.llamarpc.com';
    const CONTRACT_ADDRESS = '0x6BCba7Cd81a5F12c10Ca1BF9B36761CC382658E8';
    const NFT_COLLECTION = '0x23581767a106ae21c074b2276D25e5C3e136a68b';
    const MARKETPLACE = '0x0000000000000068F116a894984e2DB1123eB395';
    
    const web3 = new Web3(RPC_URL);
    
    // Get contract state
    const contract = new web3.eth.Contract([
      {
        "inputs": [],
        "name": "currentFees",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ], CONTRACT_ADDRESS);
    
    const currentFees = await contract.methods.currentFees().call();
    console.log('Current fees available:', web3.utils.fromWei(currentFees, 'ether'), 'ETH');
    
    // Example: Buy Moonbird #123 for 1.0 ETH
    const tokenId = 123;
    const value = web3.utils.toWei('1.0', 'ether');
    
    console.log('\n=== Proposed Transaction ===');
    console.log('Token ID:', tokenId);
    console.log('Value:', web3.utils.fromWei(value, 'ether'), 'ETH');
    console.log('Marketplace:', MARKETPLACE);
    
    // Encode data
    const data = encodeSimpleBuy(NFT_COLLECTION, tokenId);
    console.log('Encoded data:', data);
    
    // Check if we have enough fees
    if (parseFloat(web3.utils.fromWei(value, 'ether')) <= parseFloat(web3.utils.fromWei(currentFees, 'ether'))) {
      console.log('\n✅ Transaction would be VALID');
      console.log('✅ Sufficient fees available');
      console.log('✅ Data encoding successful');
      
      console.log('\n=== What Would Happen ===');
      console.log('1. Contract would call marketplace with', web3.utils.fromWei(value, 'ether'), 'ETH');
      console.log('2. Marketplace would transfer Moonbird #' + tokenId + ' to contract');
      console.log('3. Contract would list Moonbird #' + tokenId + ' for sale at', (1.0 * 1.2).toFixed(1), 'ETH');
      console.log('4. Contract fees would decrease by', web3.utils.fromWei(value, 'ether'), 'ETH');
      
      console.log('\n=== To Execute This Transaction ===');
      console.log('You would need to:');
      console.log('1. Set up your private key (with 0x prefix)');
      console.log('2. Call buyTargetNFT with these parameters:');
      console.log('   - value:', value);
      console.log('   - data:', data);
      console.log('   - expectedId:', tokenId);
      console.log('   - target:', MARKETPLACE);
      
    } else {
      console.log('\n❌ Transaction would FAIL');
      console.log('❌ Insufficient fees');
    }
    
  } catch (error) {
    console.error('❌ Dry run failed:', error.message);
  }
}

dryRunBuy();
