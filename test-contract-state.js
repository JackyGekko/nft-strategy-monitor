const { ethers } = require('ethers');
require('dotenv').config();

/**
 * Test contract state without private key
 */

async function testContractState() {
  try {
    console.log('=== Testing BIRBSTR Contract State ===\n');
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    
    // Contract ABI
    const contractABI = [
      'function currentFees() view returns (uint256)',
      'function ethToTwap() view returns (uint256)',
      'function collection() view returns (address)',
      'function priceMultiplier() view returns (uint256)',
      'function nftForSale(uint256) view returns (uint256)'
    ];
    
    // Create contract instance
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, provider);
    
    // Check contract state
    console.log('Contract Address:', process.env.CONTRACT_ADDRESS);
    console.log('Network:', await provider.getNetwork());
    console.log('');
    
    // Get current fees
    const currentFees = await contract.currentFees();
    console.log('Current Fees:', ethers.formatEther(currentFees), 'ETH');
    
    // Get ETH to TWAP
    const ethToTwap = await contract.ethToTwap();
    console.log('ETH to TWAP:', ethers.formatEther(ethToTwap), 'ETH');
    
    // Get collection address
    const collection = await contract.collection();
    console.log('Collection:', collection);
    console.log('Expected:', process.env.NFT_COLLECTION_ADDRESS);
    console.log('Match:', collection.toLowerCase() === process.env.NFT_COLLECTION_ADDRESS.toLowerCase());
    
    // Get price multiplier
    const priceMultiplier = await contract.priceMultiplier();
    console.log('Price Multiplier:', priceMultiplier.toString(), '(1.2x)');
    
    // Check some NFTs for sale
    console.log('\n=== Checking NFTs for Sale ===');
    const nftContract = new ethers.Contract(collection, [
      'function balanceOf(address owner) view returns (uint256)'
    ], provider);
    
    const balance = await nftContract.balanceOf(process.env.CONTRACT_ADDRESS);
    console.log('Contract owns', balance.toString(), 'Moonbirds');
    
    // Check first 10 NFTs for sale
    for (let i = 1; i <= 10; i++) {
      try {
        const price = await contract.nftForSale(i);
        if (price > 0) {
          console.log(`Moonbird #${i}: ${ethers.formatEther(price)} ETH`);
        }
      } catch (e) {
        // NFT not for sale or doesn't exist
      }
    }
    
    // Check opportunities
    console.log('\n=== Opportunities ===');
    if (currentFees > ethers.parseEther('0.1')) {
      console.log('💰 Contract has enough fees for NFT purchase!');
    } else {
      console.log('⏳ Waiting for more fees to accumulate...');
    }
    
    if (ethToTwap > ethers.parseEther('0.01')) {
      console.log('🔥 TWAP available for token burning!');
    } else {
      console.log('⏳ No TWAP available yet...');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testContractState();
