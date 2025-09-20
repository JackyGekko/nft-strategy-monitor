const { Web3 } = require('web3');
const { encodeSimpleBuy } = require('./encode-data');

/**
 * Execute buyTargetNFT for Moonbirds
 * WARNING: This will execute a real transaction!
 */

async function executeBuyMoonbird() {
  try {
    console.log('=== EXECUTE buyTargetNFT() ===\n');
    
    // Your data
    const RPC_URL = 'https://eth.llamarpc.com'; // Using public RPC
    const CONTRACT_ADDRESS = '0x6BCba7Cd81a5F12c10Ca1BF9B36761CC382658E8';
    const NFT_COLLECTION = '0x23581767a106ae21c074b2276D25e5C3e136a68b';
    const MARKETPLACE = '0x0000000000000068F116a894984e2DB1123eB395';
    
    // IMPORTANT: Add 0x prefix to your private key
    const PRIVATE_KEY = '0x364d7fe64d06e9e9f1548632bdbb5d462d46886769e80629521b90a77e936272';
    
    const web3 = new Web3(RPC_URL);
    
    // Create account from private key
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);
    
    console.log('Account:', account.address);
    console.log('Balance:', web3.utils.fromWei(await web3.eth.getBalance(account.address), 'ether'), 'ETH');
    
    // Contract ABI
    const contractABI = [
      {
        "inputs": [
          {"internalType": "uint256", "name": "value", "type": "uint256"},
          {"internalType": "bytes", "name": "data", "type": "bytes"},
          {"internalType": "uint256", "name": "expectedId", "type": "uint256"},
          {"internalType": "address", "name": "target", "type": "address"}
        ],
        "name": "buyTargetNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "currentFees",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    
    const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
    
    // Check current fees
    const currentFees = await contract.methods.currentFees().call();
    console.log('Contract fees:', web3.utils.fromWei(currentFees, 'ether'), 'ETH');
    
    // Example parameters (CHANGE THESE!)
    const tokenId = 123; // CHANGE THIS TO THE MOONBIRD YOU WANT TO BUY
    const value = web3.utils.toWei('1.0', 'ether'); // CHANGE THIS TO THE PRICE
    
    console.log('\n=== Transaction Parameters ===');
    console.log('Token ID:', tokenId);
    console.log('Value:', web3.utils.fromWei(value, 'ether'), 'ETH');
    console.log('Marketplace:', MARKETPLACE);
    
    // Encode data
    const data = encodeSimpleBuy(NFT_COLLECTION, tokenId);
    console.log('Data:', data);
    
    // Check if we have enough fees
    if (parseFloat(web3.utils.fromWei(value, 'ether')) > parseFloat(web3.utils.fromWei(currentFees, 'ether'))) {
      throw new Error('Insufficient contract fees');
    }
    
    console.log('\n=== Executing Transaction ===');
    console.log('⚠️  WARNING: This will execute a real transaction!');
    console.log('⚠️  Make sure you have ETH for gas fees!');
    
    // Uncomment the following lines to execute the transaction
    /*
    const tx = await contract.methods.buyTargetNFT(
      value,
      data,
      tokenId,
      MARKETPLACE
    ).send({
      from: account.address,
      gas: 500000
    });
    
    console.log('Transaction hash:', tx.transactionHash);
    console.log('Gas used:', tx.gasUsed);
    console.log('✅ Transaction successful!');
    */
    
    console.log('\nTo execute this transaction:');
    console.log('1. Uncomment the transaction code above');
    console.log('2. Make sure you have ETH for gas fees');
    console.log('3. Run: node execute-buy-moonbird.js');
    
  } catch (error) {
    console.error('❌ Execution failed:', error.message);
  }
}

// Only run if called directly
if (require.main === module) {
  executeBuyMoonbird();
}

module.exports = executeBuyMoonbird;
