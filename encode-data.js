const { ethers } = require('ethers');

/**
 * NFT Strategy Data Encoder
 * This script encodes marketplace function calls for buyTargetNFT()
 */

// Marketplace interfaces for different platforms
const MARKETPLACE_INTERFACES = {
  // OpenSea Seaport
  opensea: new ethers.Interface([
    'function fulfillBasicOrder(BasicOrderParameters calldata parameters) payable'
  ]),
  
  // Blur Marketplace
  blur: new ethers.Interface([
    'function execute(Execution calldata execution) payable'
  ]),
  
  // LooksRare
  looksrare: new ethers.Interface([
    'function matchAskWithTakerBid(Order calldata takerBid, Order calldata makerAsk) payable'
  ]),
  
  // Simple buy function (generic)
  simple: new ethers.Interface([
    'function buy(address nftContract, uint256 tokenId) payable'
  ])
};

/**
 * Encode data for simple buy function
 * @param {string} nftContract - NFT collection address
 * @param {number} tokenId - NFT token ID
 * @returns {string} - Encoded data
 */
function encodeSimpleBuy(nftContract, tokenId) {
  return MARKETPLACE_INTERFACES.simple.encodeFunctionData('buy', [
    nftContract,
    tokenId
  ]);
}

/**
 * Encode data for OpenSea Seaport
 * @param {Object} orderParameters - BasicOrderParameters struct
 * @returns {string} - Encoded data
 */
function encodeOpenSeaBuy(orderParameters) {
  return MARKETPLACE_INTERFACES.opensea.encodeFunctionData('fulfillBasicOrder', [
    orderParameters
  ]);
}

/**
 * Encode data for Blur Marketplace
 * @param {Object} execution - Execution struct
 * @returns {string} - Encoded data
 */
function encodeBlurBuy(execution) {
  return MARKETPLACE_INTERFACES.blur.encodeFunctionData('execute', [
    execution
  ]);
}

/**
 * Get function selector for any function signature
 * @param {string} signature - Function signature
 * @returns {string} - Function selector
 */
function getFunctionSelector(signature) {
  return ethers.id(signature).slice(0, 10);
}

/**
 * Manually encode parameters
 * @param {Array} types - Parameter types
 * @param {Array} values - Parameter values
 * @returns {string} - Encoded parameters
 */
function encodeParameters(types, values) {
  return ethers.AbiCoder.defaultAbiCoder().encode(types, values);
}

// Example usage
if (require.main === module) {
  console.log('=== NFT Strategy Data Encoder ===\n');
  
  // Example 1: Simple buy function
  const nftContract = '0x1234567890123456789012345678901234567890';
  const tokenId = 123;
  
  const simpleData = encodeSimpleBuy(nftContract, tokenId);
  console.log('Simple Buy Data:', simpleData);
  
  // Example 2: Manual encoding
  const selector = getFunctionSelector('buy(address,uint256)');
  const params = encodeParameters(['address', 'uint256'], [nftContract, tokenId]);
  const manualData = selector + params.slice(2);
  
  console.log('Manual Data:', manualData);
  console.log('Match:', simpleData === manualData);
  
  // Example 3: Different marketplaces
  console.log('\n=== Marketplace Examples ===');
  console.log('OpenSea Selector:', getFunctionSelector('fulfillBasicOrder(BasicOrderParameters)'));
  console.log('Blur Selector:', getFunctionSelector('execute(Execution)'));
  console.log('LooksRare Selector:', getFunctionSelector('matchAskWithTakerBid(Order,Order)'));
}

module.exports = {
  encodeSimpleBuy,
  encodeOpenSeaBuy,
  encodeBlurBuy,
  getFunctionSelector,
  encodeParameters,
  MARKETPLACE_INTERFACES
};
