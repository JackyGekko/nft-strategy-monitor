const { ethers } = require('ethers');
const { encodeSimpleBuy } = require('./encode-data');
require('dotenv').config();

/**
 * NFT Strategy Buy Executor
 * This script executes buyTargetNFT() calls
 */

// Contract ABI
const CONTRACT_ABI = [
  'function buyTargetNFT(uint256 value, bytes calldata data, uint256 expectedId, address target) external',
  'function currentFees() view returns (uint256)',
  'function collection() view returns (address)',
  'function nftForSale(uint256) view returns (uint256)',
  'function processTokenTwap() external'
];

// NFT Collection ABI
const NFT_ABI = [
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)'
];

class NFTStrategyExecutor {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, CONTRACT_ABI, this.wallet);
    this.nftContract = null; // Will be set when we get collection address
  }

  /**
   * Initialize the executor
   */
  async initialize() {
    try {
      const collectionAddress = await this.contract.collection();
      this.nftContract = new ethers.Contract(collectionAddress, NFT_ABI, this.provider);
      
      console.log('=== NFT Strategy Executor Initialized ===');
      console.log('Contract:', process.env.CONTRACT_ADDRESS);
      console.log('Collection:', collectionAddress);
      console.log('Wallet:', this.wallet.address);
      console.log('Network:', await this.provider.getNetwork());
    } catch (error) {
      console.error('Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Check contract state
   */
  async checkState() {
    try {
      const currentFees = await this.contract.currentFees();
      const collection = await this.contract.collection();
      
      console.log('\n=== Contract State ===');
      console.log('Current Fees:', ethers.formatEther(currentFees), 'ETH');
      console.log('Collection:', collection);
      
      return {
        currentFees: currentFees,
        collection: collection
      };
    } catch (error) {
      console.error('Failed to check state:', error);
      throw error;
    }
  }

  /**
   * Check if NFT is available for purchase
   * @param {number} tokenId - NFT token ID
   * @returns {Object} - NFT status
   */
  async checkNFT(tokenId) {
    try {
      const owner = await this.nftContract.ownerOf(tokenId);
      const isForSale = await this.contract.nftForSale(tokenId);
      
      console.log(`\n=== NFT #${tokenId} Status ===`);
      console.log('Owner:', owner);
      console.log('For Sale:', ethers.formatEther(isForSale), 'ETH');
      console.log('Contract Owns:', owner === process.env.CONTRACT_ADDRESS);
      
      return {
        owner: owner,
        isForSale: isForSale,
        contractOwns: owner === process.env.CONTRACT_ADDRESS
      };
    } catch (error) {
      console.error(`Failed to check NFT #${tokenId}:`, error);
      throw error;
    }
  }

  /**
   * Execute buyTargetNFT
   * @param {Object} params - Buy parameters
   */
  async executeBuy(params) {
    const { value, data, expectedId, target } = params;
    
    try {
      console.log('\n=== Executing buyTargetNFT ===');
      console.log('Value:', ethers.formatEther(value), 'ETH');
      console.log('Data:', data);
      console.log('Expected ID:', expectedId);
      console.log('Target:', target);
      
      // Check if we have enough fees
      const currentFees = await this.contract.currentFees();
      if (value > currentFees) {
        throw new Error(`Insufficient fees. Required: ${ethers.formatEther(value)} ETH, Available: ${ethers.formatEther(currentFees)} ETH`);
      }
      
      // Check if contract already owns the NFT
      const owner = await this.nftContract.ownerOf(expectedId);
      if (owner === process.env.CONTRACT_ADDRESS) {
        throw new Error(`Contract already owns NFT #${expectedId}`);
      }
      
      // Execute the transaction
      const tx = await this.contract.buyTargetNFT(value, data, expectedId, target, {
        gasLimit: 500000
      });
      
      console.log('Transaction sent:', tx.hash);
      console.log('Waiting for confirmation...');
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed!');
      console.log('Gas used:', receipt.gasUsed.toString());
      
      return receipt;
    } catch (error) {
      console.error('Buy execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute processTokenTwap
   */
  async executeTwap() {
    try {
      console.log('\n=== Executing processTokenTwap ===');
      
      const tx = await this.contract.processTokenTwap({
        gasLimit: 300000
      });
      
      console.log('Transaction sent:', tx.hash);
      console.log('Waiting for confirmation...');
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed!');
      console.log('Gas used:', receipt.gasUsed.toString());
      
      return receipt;
    } catch (error) {
      console.error('TWAP execution failed:', error);
      throw error;
    }
  }
}

// Example usage
async function main() {
  try {
    const executor = new NFTStrategyExecutor();
    await executor.initialize();
    
    // Check contract state
    await executor.checkState();
    
    // Example: Buy NFT #123 for 1 ETH
    const nftContract = await executor.contract.collection();
    const data = encodeSimpleBuy(nftContract, 123);
    
    const buyParams = {
      value: ethers.parseEther('1.0'),
      data: data,
      expectedId: 123,
      target: process.env.MARKETPLACE_ADDRESS
    };
    
    // Check NFT status first
    await executor.checkNFT(123);
    
    // Uncomment to execute (be careful!)
    // await executor.executeBuy(buyParams);
    
    // Execute TWAP
    // await executor.executeTwap();
    
  } catch (error) {
    console.error('Main execution failed:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = NFTStrategyExecutor;
