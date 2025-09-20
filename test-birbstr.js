const { ethers } = require('ethers');

/**
 * Test BIRBSTR contract with hardcoded values
 */

async function testBIRBSTR() {
  try {
    console.log('=== Testing BIRBSTR Contract ===\n');
    
    // Your actual data
    const CONTRACT_ADDRESS = '0x6BCba7Cd81a5F12c10Ca1BF9B36761CC382658E8';
    const RPC_URL = 'https://eth-mainnet.g.alchemy.com/v2/AESLCq92vcfhWAHHgMlX3H9HsoPexyuj';
    const NFT_COLLECTION = '0x23581767a106ae21c074b2276d25e5c3e136a68b';
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Contract ABI
    const contractABI = [
      'function currentFees() view returns (uint256)',
      'function ethToTwap() view returns (uint256)',
      'function collection() view returns (address)',
      'function priceMultiplier() view returns (uint256)',
      'function nftForSale(uint256) view returns (uint256)'
    ];
    
    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    
    // Check contract state
    console.log('Contract Address:', CONTRACT_ADDRESS);
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
    console.log('Expected:', NFT_COLLECTION);
    console.log('Match:', collection.toLowerCase() === NFT_COLLECTION.toLowerCase());
    
    // Get price multiplier
    const priceMultiplier = await contract.priceMultiplier();
    console.log('Price Multiplier:', priceMultiplier.toString(), '(1.2x)');
    
    // Check some NFTs for sale
    console.log('\n=== Checking NFTs for Sale ===');
    const nftContract = new ethers.Contract(collection, [
      'function balanceOf(address owner) view returns (uint256)'
    ], provider);
    
    const balance = await nftContract.balanceOf(CONTRACT_ADDRESS);
    console.log('Contract owns', balance.toString(), 'Moonbirds');
    
    // Check first 10 NFTs for sale
    console.log('\nChecking first 10 Moonbirds for sale:');
    for (let i = 1; i <= 10; i++) {
      try {
        const price = await contract.nftForSale(i);
        if (price > 0) {
          console.log(`  Moonbird #${i}: ${ethers.formatEther(price)} ETH`);
        }
      } catch (e) {
        // NFT not for sale or doesn't exist
      }
    }
    
    // Check opportunities
    console.log('\n=== Opportunities ===');
    if (currentFees > ethers.parseEther('0.1')) {
      console.log('💰 Contract has enough fees for NFT purchase!');
      console.log('   You can call buyTargetNFT() to buy a Moonbird');
    } else {
      console.log('⏳ Waiting for more fees to accumulate...');
      console.log('   Current fees:', ethers.formatEther(currentFees), 'ETH');
    }
    
    if (ethToTwap > ethers.parseEther('0.01')) {
      console.log('🔥 TWAP available for token burning!');
      console.log('   You can call processTokenTwap() to earn 0.5% reward');
    } else {
      console.log('⏳ No TWAP available yet...');
      console.log('   ETH to TWAP:', ethers.formatEther(ethToTwap), 'ETH');
    }
    
    // Test data encoding
    console.log('\n=== Data Encoding Test ===');
    const { encodeSimpleBuy } = require('./encode-data');
    const data = encodeSimpleBuy(collection, 123);
    console.log('Encoded data for Moonbird #123:', data);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBIRBSTR();
