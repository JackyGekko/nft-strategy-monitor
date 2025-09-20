const NFTStrategyExecutor = require('./execute-buy');
const NFTStrategyMonitor = require('./monitor');
const { encodeSimpleBuy } = require('./encode-data');
require('dotenv').config();

/**
 * NFT Strategy Main Script
 * This is your main entry point for all operations
 */

class NFTStrategyBot {
  constructor() {
    this.executor = new NFTStrategyExecutor();
    this.monitor = new NFTStrategyMonitor();
  }

  /**
   * Initialize the bot
   */
  async initialize() {
    try {
      await this.executor.initialize();
      console.log('✅ Bot initialized successfully!');
    } catch (error) {
      console.error('❌ Bot initialization failed:', error);
      throw error;
    }
  }

  /**
   * Quick buy function
   * @param {number} tokenId - NFT token ID
   * @param {string} value - ETH amount in ether (e.g., "1.0")
   * @param {string} marketplace - Marketplace address
   */
  async quickBuy(tokenId, value, marketplace) {
    try {
      console.log(`\n=== Quick Buy NFT #${tokenId} ===`);
      
      // Get collection address
      const collection = await this.executor.contract.collection();
      
      // Encode data
      const data = encodeSimpleBuy(collection, tokenId);
      
      // Prepare parameters
      const params = {
        value: ethers.parseEther(value),
        data: data,
        expectedId: tokenId,
        target: marketplace
      };
      
      // Execute
      await this.executor.executeBuy(params);
      
      console.log('✅ Buy executed successfully!');
    } catch (error) {
      console.error('❌ Quick buy failed:', error);
      throw error;
    }
  }

  /**
   * Quick TWAP execution
   */
  async quickTwap() {
    try {
      console.log('\n=== Quick TWAP ===');
      await this.executor.executeTwap();
      console.log('✅ TWAP executed successfully!');
    } catch (error) {
      console.error('❌ Quick TWAP failed:', error);
      throw error;
    }
  }

  /**
   * Start monitoring
   */
  async startMonitoring() {
    try {
      await this.monitor.startMonitoring();
    } catch (error) {
      console.error('❌ Monitoring failed:', error);
      throw error;
    }
  }

  /**
   * Check contract state
   */
  async checkState() {
    try {
      await this.executor.checkState();
    } catch (error) {
      console.error('❌ State check failed:', error);
      throw error;
    }
  }

  /**
   * Check specific NFT
   * @param {number} tokenId - NFT token ID
   */
  async checkNFT(tokenId) {
    try {
      await this.executor.checkNFT(tokenId);
    } catch (error) {
      console.error(`❌ NFT #${tokenId} check failed:`, error);
      throw error;
    }
  }
}

// Command line interface
async function main() {
  const bot = new NFTStrategyBot();
  
  try {
    await bot.initialize();
    
    const command = process.argv[2];
    const args = process.argv.slice(3);
    
    switch (command) {
      case 'monitor':
        await bot.startMonitoring();
        break;
        
      case 'state':
        await bot.checkState();
        break;
        
      case 'check':
        if (args[0]) {
          await bot.checkNFT(parseInt(args[0]));
        } else {
          console.log('Usage: node index.js check <tokenId>');
        }
        break;
        
      case 'buy':
        if (args.length >= 3) {
          await bot.quickBuy(parseInt(args[0]), args[1], args[2]);
        } else {
          console.log('Usage: node index.js buy <tokenId> <value> <marketplace>');
          console.log('Example: node index.js buy 123 1.0 0xmarketplace...');
        }
        break;
        
      case 'twap':
        await bot.quickTwap();
        break;
        
      default:
        console.log('=== NFT Strategy Bot ===');
        console.log('Available commands:');
        console.log('  monitor          - Start monitoring contract');
        console.log('  state            - Check contract state');
        console.log('  check <tokenId>  - Check specific NFT');
        console.log('  buy <tokenId> <value> <marketplace> - Buy NFT');
        console.log('  twap             - Execute TWAP');
        console.log('');
        console.log('Examples:');
        console.log('  node index.js monitor');
        console.log('  node index.js state');
        console.log('  node index.js check 123');
        console.log('  node index.js buy 123 1.0 0xmarketplace...');
        console.log('  node index.js twap');
    }
    
  } catch (error) {
    console.error('❌ Main execution failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = NFTStrategyBot;
