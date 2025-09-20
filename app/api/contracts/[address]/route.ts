import { NextRequest, NextResponse } from 'next/server';
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

    // Use a simple approach with hardcoded data for now
    // This will work reliably on Vercel
    const state = {
      currentFees: '2.69', // Mock data - replace with real data later
      ethToTwap: '0.0',
      collection: strategy.collectionAddress.toLowerCase(),
      priceMultiplier: strategy.priceMultiplier,
      blockNumber: 23400000, // Mock block number
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