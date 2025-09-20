const { ethers } = require('ethers');
const NFTStrategyExecutor = require('./execute-buy');
require('dotenv').config();

/**
 * NFT Strategy Monitor
 * This script monitors the contract for opportunities
 */

class NFTStrategyMonitor {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, [
      'function currentFees() view returns (uint256)',
      'function ethToTwap() view returns (uint256)',
      'function collection() view returns (address)',
      'function nftForSale(uint256) view returns (uint256)',
      'event NFTBoughtByProtocol(uint256 indexed tokenId, uint256 purchasePrice, uint256 listPrice)',
      'event NFTSoldByProtocol(uint256 indexed tokenId, uint256 price, address buyer)'
    ], this.provider);
    
    this.isMonitoring = false;
    this.lastFees = ethers.BigNumber.from(0);
    this.lastTwap = ethers.BigNumber.from(0);
  }

  /**
   * Start monitoring
   */
  async startMonitoring() {
    console.log('=== Starting NFT Strategy Monitor ===');
    console.log('Contract:', process.env.CONTRACT_ADDRESS);
    console.log('Network:', await this.provider.getNetwork());
    
    this.isMonitoring = true;
    
    // Initial state check
    await this.checkState();
    
    // Start event monitoring
    this.startEventMonitoring();
    
    // Start periodic state checks
    this.startPeriodicChecks();
  }

  /**
   * Check current contract state
   */
  async checkState() {
    try {
      const currentFees = await this.contract.currentFees();
      const ethToTwap = await this.contract.ethToTwap();
      const collection = await this.contract.collection();
      
      console.log('\n=== Contract State ===');
      console.log('Current Fees:', ethers.formatEther(currentFees), 'ETH');
      console.log('ETH to TWAP:', ethers.formatEther(ethToTwap), 'ETH');
      console.log('Collection:', collection);
      
      // Check for changes
      if (!currentFees.eq(this.lastFees)) {
        console.log('🔄 Fees changed!');
        this.lastFees = currentFees;
      }
      
      if (!ethToTwap.eq(this.lastTwap)) {
        console.log('🔄 TWAP balance changed!');
        this.lastTwap = ethToTwap;
      }
      
      // Check for opportunities
      if (currentFees.gt(ethers.parseEther('0.1'))) {
        console.log('💰 Opportunity: Contract has enough fees for NFT purchase!');
      }
      
      if (ethToTwap.gt(ethers.parseEther('0.01'))) {
        console.log('🔥 Opportunity: TWAP available for token burning!');
      }
      
    } catch (error) {
      console.error('Failed to check state:', error);
    }
  }

  /**
   * Start monitoring events
   */
  startEventMonitoring() {
    console.log('\n=== Starting Event Monitoring ===');
    
    // Monitor NFT purchases
    this.contract.on('NFTBoughtByProtocol', (tokenId, purchasePrice, listPrice, event) => {
      console.log('\n🎯 NFT BOUGHT BY PROTOCOL!');
      console.log('Token ID:', tokenId.toString());
      console.log('Purchase Price:', ethers.formatEther(purchasePrice), 'ETH');
      console.log('List Price:', ethers.formatEther(listPrice), 'ETH');
      console.log('Transaction:', event.transactionHash);
      console.log('Block:', event.blockNumber);
    });
    
    // Monitor NFT sales
    this.contract.on('NFTSoldByProtocol', (tokenId, price, buyer, event) => {
      console.log('\n💸 NFT SOLD BY PROTOCOL!');
      console.log('Token ID:', tokenId.toString());
      console.log('Sale Price:', ethers.formatEther(price), 'ETH');
      console.log('Buyer:', buyer);
      console.log('Transaction:', event.transactionHash);
      console.log('Block:', event.blockNumber);
    });
  }

  /**
   * Start periodic state checks
   */
  startPeriodicChecks() {
    console.log('\n=== Starting Periodic Checks ===');
    
    setInterval(async () => {
      if (this.isMonitoring) {
        await this.checkState();
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    console.log('\n=== Stopping Monitor ===');
    this.isMonitoring = false;
    this.contract.removeAllListeners();
  }

  /**
   * Check specific NFT status
   * @param {number} tokenId - NFT token ID
   */
  async checkNFT(tokenId) {
    try {
      const nftContract = new ethers.Contract(
        await this.contract.collection(),
        ['function ownerOf(uint256 tokenId) view returns (address)'],
        this.provider
      );
      
      const owner = await nftContract.ownerOf(tokenId);
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
   * Get all NFTs for sale
   */
  async getNFTsForSale() {
    try {
      console.log('\n=== Checking NFTs for Sale ===');
      
      const nftContract = new ethers.Contract(
        await this.contract.collection(),
        ['function balanceOf(address owner) view returns (uint256)'],
        this.provider
      );
      
      const balance = await nftContract.balanceOf(process.env.CONTRACT_ADDRESS);
      console.log('Contract owns', balance.toString(), 'NFTs');
      
      // Check first 100 token IDs for sale
      const forSale = [];
      for (let i = 1; i <= 100; i++) {
        try {
          const price = await this.contract.nftForSale(i);
          if (price.gt(0)) {
            forSale.push({
              tokenId: i,
              price: ethers.formatEther(price)
            });
          }
        } catch (e) {
          // Token doesn't exist or not for sale
        }
      }
      
      if (forSale.length > 0) {
        console.log('\nNFTs for Sale:');
        forSale.forEach(nft => {
          console.log(`  #${nft.tokenId}: ${nft.price} ETH`);
        });
      } else {
        console.log('No NFTs currently for sale');
      }
      
      return forSale;
    } catch (error) {
      console.error('Failed to get NFTs for sale:', error);
      throw error;
    }
  }
}

// Example usage
async function main() {
  try {
    const monitor = new NFTStrategyMonitor();
    await monitor.startMonitoring();
    
    // Check specific NFT
    // await monitor.checkNFT(123);
    
    // Get all NFTs for sale
    // await monitor.getNFTsForSale();
    
    // Keep running
    console.log('\nPress Ctrl+C to stop monitoring...');
    
  } catch (error) {
    console.error('Monitor failed:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = NFTStrategyMonitor;
