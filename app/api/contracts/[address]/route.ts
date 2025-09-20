import { NextRequest, NextResponse } from 'next/server';
import { NFT_STRATEGIES, CONTRACT_ABI, RPC_URLS } from '@/lib/contracts';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const contractAddress = params.address;
    
    // Find the strategy configuration
    const strategy = NFT_STRATEGIES.find(s => 
      s.contractAddress.toLowerCase() === contractAddress.toLowerCase()
    );
    
    if (!strategy) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    // Correct function selectors for our contract (first 4 bytes of keccak256 hash)
    const functionSelectors = {
      currentFees: '0x' + require('crypto').createHash('sha3-256').update('currentFees()').digest('hex').substring(0, 8),
      ethToTwap: '0x' + require('crypto').createHash('sha3-256').update('ethToTwap()').digest('hex').substring(0, 8),
      priceMultiplier: '0x' + require('crypto').createHash('sha3-256').update('priceMultiplier()').digest('hex').substring(0, 8),
    };

    // Function to make RPC call
    const makeRPCCall = async (method: string, params: any[], rpcUrl: string) => {
      try {
        const response = await fetch(rpcUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: 1,
          }),
        });
        
        const data = await response.json();
        return data.result;
      } catch (error) {
        throw new Error(`RPC call failed: ${error}`);
      }
    };

    // Try multiple RPC endpoints
    let contractBalance = '0';
    let ethToTwap = '0';
    let priceMultiplier = 1200;
    let collectionFromContract = strategy.collectionAddress; // fallback to config
    let blockNumber = 0;

    for (const rpcUrl of RPC_URLS) {
      try {
        // Get contract ETH balance (this represents currentFees)
        const balanceHex = await makeRPCCall('eth_getBalance', [contractAddress, 'latest'], rpcUrl);
        
        if (balanceHex) {
          contractBalance = (parseInt(balanceHex, 16) / 1e18).toFixed(4);
        }

        // Get ETH to TWAP
        const ethToTwapHex = await makeRPCCall('eth_call', [{
          to: contractAddress,
          data: functionSelectors.ethToTwap
        }, 'latest'], rpcUrl);
        
        if (ethToTwapHex) {
          ethToTwap = (parseInt(ethToTwapHex, 16) / 1e18).toFixed(4);
        }

        // Get price multiplier
        const priceMultiplierHex = await makeRPCCall('eth_call', [{
          to: contractAddress,
          data: functionSelectors.priceMultiplier
        }, 'latest'], rpcUrl);
        
        if (priceMultiplierHex) {
          priceMultiplier = parseInt(priceMultiplierHex, 16);
        }

        // Get collection address from contract
        const collectionHex = await makeRPCCall('eth_call', [{
          to: contractAddress,
          data: '0x' + require('crypto').createHash('sha3-256').update('collection()').digest('hex').substring(0, 8)
        }, 'latest'], rpcUrl);
        
        if (collectionHex) {
          collectionFromContract = '0x' + collectionHex.slice(-40);
        }

        // Get current block number
        const blockHex = await makeRPCCall('eth_blockNumber', [], rpcUrl);
        if (blockHex) {
          blockNumber = parseInt(blockHex, 16);
        }

        // If we got data from this RPC, break
        if (balanceHex) {
          break;
        }
      } catch (error) {
        console.log(`RPC ${rpcUrl} failed, trying next...`);
        continue;
      }
    }

    const state = {
      currentFees: contractBalance, // Contract ETH balance
      ethToTwap,
      collection: collectionFromContract.toLowerCase(), // NFT collection address from contract
      priceMultiplier,
      blockNumber,
    };

    return NextResponse.json({
      strategy,
      state,
      nftsForSale: [], // Empty for now
    });
  } catch (error) {
    console.error('Error fetching contract data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contract data: ' + (error as Error).message },
      { status: 500 }
    );
  }
}