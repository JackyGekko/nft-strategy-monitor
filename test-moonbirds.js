const { ethers } = require('ethers');
const { encodeSimpleBuy } = require('./encode-data');

/**
 * Test script for Moonbirds collection
 */

// Your actual data
const CONTRACT_ADDRESS = '0x6BCba7Cd81a5F12c10Ca1BF9B36761CC382658E8';
const NFT_COLLECTION = '0x23581767a106ae21c074b2276d25e5c3e136a68b';
const MARKETPLACE = '0x0000000000000068F116a894984e2DB1123eB395';

console.log('=== Moonbirds Data Encoding Test ===\n');

// Test encoding for different Moonbirds
const testNFTs = [1, 100, 1000, 5000, 10000];

testNFTs.forEach(tokenId => {
  const data = encodeSimpleBuy(NFT_COLLECTION, tokenId);
  console.log(`Moonbird #${tokenId}:`);
  console.log(`  Collection: ${NFT_COLLECTION}`);
  console.log(`  Data: ${data}`);
  console.log(`  Length: ${data.length} characters`);
  console.log('');
});

// Test function selector
const selector = ethers.id('buy(address,uint256)').slice(0, 10);
console.log('Function Selector:', selector);
console.log('Expected: 0xcce7ec13');

// Test parameter encoding
const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
  ['address', 'uint256'],
  [NFT_COLLECTION, 123]
);
console.log('Encoded Parameters:', encodedParams);

console.log('\n=== Ready for buyTargetNFT() ===');
console.log('Contract:', CONTRACT_ADDRESS);
console.log('Collection:', NFT_COLLECTION);
console.log('Marketplace:', MARKETPLACE);
