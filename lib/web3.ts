import { Web3 } from 'web3';
import { CONTRACT_ABI, RPC_URLS } from './contracts';

export class Web3Service {
  private web3: Web3;
  private currentRpcIndex = 0;

  constructor() {
    this.web3 = new Web3(RPC_URLS[0]);
  }

  private async switchRpc() {
    this.currentRpcIndex = (this.currentRpcIndex + 1) % RPC_URLS.length;
    this.web3 = new Web3(RPC_URLS[this.currentRpcIndex]);
  }

  async getContractState(contractAddress: string) {
    try {
      const contract = new this.web3.eth.Contract(CONTRACT_ABI, contractAddress);
      
      const [currentFees, ethToTwap, collection, priceMultiplier] = await Promise.all([
        contract.methods.currentFees().call(),
        contract.methods.ethToTwap().call(),
        contract.methods.collection().call(),
        contract.methods.priceMultiplier().call(),
      ]);

      return {
        currentFees: this.web3.utils.fromWei(String(currentFees), 'ether'),
        ethToTwap: this.web3.utils.fromWei(String(ethToTwap), 'ether'),
        collection: String(collection).toLowerCase(),
        priceMultiplier: Number(priceMultiplier),
        blockNumber: await this.web3.eth.getBlockNumber(),
      };
    } catch (error) {
      console.error('Error getting contract state:', error);
      await this.switchRpc();
      throw error;
    }
  }

  async checkNFTForSale(contractAddress: string, tokenId: number) {
    try {
      const contract = new this.web3.eth.Contract(CONTRACT_ABI, contractAddress);
      const price = await contract.methods.nftForSale(tokenId).call();
      return {
        tokenId,
        price: Number(price) > 0 ? this.web3.utils.fromWei(String(price), 'ether') : '0',
        isForSale: Number(price) > 0,
      };
    } catch (error) {
      console.error('Error checking NFT for sale:', error);
      return {
        tokenId,
        price: '0',
        isForSale: false,
      };
    }
  }

  async getNFTsForSale(contractAddress: string, collectionAddress: string, limit = 50) {
    try {
      const contract = new this.web3.eth.Contract(CONTRACT_ABI, contractAddress);
      const nftContract = new this.web3.eth.Contract([
        {
          "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
          "name": "balanceOf",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        }
      ], collectionAddress);

      const balance = await nftContract.methods.balanceOf(contractAddress).call();
      const nftsForSale = [];

      for (let i = 1; i <= Math.min(Number(balance), limit); i++) {
        try {
          const price = await contract.methods.nftForSale(i).call();
          if (Number(price) > 0) {
            nftsForSale.push({
              tokenId: i,
              price: this.web3.utils.fromWei(String(price), 'ether'),
            });
          }
        } catch (e) {
          // NFT not for sale or doesn't exist
        }
      }

      return nftsForSale;
    } catch (error) {
      console.error('Error getting NFTs for sale:', error);
      return [];
    }
  }

  encodeBuyData(collectionAddress: string, tokenId: number): string {
    const functionSignature = 'buy(address,uint256)';
    const selector = this.web3.utils.keccak256(functionSignature).slice(0, 10);
    const encodedParams = this.web3.eth.abi.encodeParameters(
      ['address', 'uint256'],
      [collectionAddress, tokenId]
    );
    return selector + encodedParams.slice(2);
  }

  getWeb3() {
    return this.web3;
  }
}

export const web3Service = new Web3Service();
