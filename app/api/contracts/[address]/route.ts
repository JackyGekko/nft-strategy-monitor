import { NextRequest, NextResponse } from 'next/server';
import { web3Service } from '@/lib/web3';
import { NFT_STRATEGIES } from '@/lib/contracts';

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

    // Get contract state
    const state = await web3Service.getContractState(contractAddress);
    
    // Get NFTs for sale
    const nftsForSale = await web3Service.getNFTsForSale(
      contractAddress,
      state.collection,
      20 // Limit to first 20 NFTs
    );

    return NextResponse.json({
      strategy,
      state,
      nftsForSale,
    });
  } catch (error) {
    console.error('Error fetching contract data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contract data' },
      { status: 500 }
    );
  }
}
