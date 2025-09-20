import { NextRequest, NextResponse } from 'next/server';
import { web3Service } from '@/lib/web3';
import { NFT_STRATEGIES } from '@/lib/contracts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractAddress, tokenId, value, privateKey } = body;

    if (!contractAddress || !tokenId || !value || !privateKey) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

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

    // Validate private key format
    const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    
    // Create account from private key
    const web3 = web3Service.getWeb3();
    const account = web3.eth.accounts.privateKeyToAccount(formattedPrivateKey);
    web3.eth.accounts.wallet.add(account);

    // Get contract state to validate
    const state = await web3Service.getContractState(contractAddress);
    
    if (parseFloat(value) > parseFloat(state.currentFees)) {
      return NextResponse.json(
        { error: 'Insufficient contract fees' },
        { status: 400 }
      );
    }

    // Encode the buy data
    const data = web3Service.encodeBuyData(strategy.collectionAddress, tokenId);
    
    // Create contract instance
    const contract = new web3.eth.Contract([
      {
        "inputs": [
          {"internalType": "uint256", "name": "value", "type": "uint256"},
          {"internalType": "bytes", "name": "data", "type": "bytes"},
          {"internalType": "uint256", "name": "expectedId", "type": "uint256"},
          {"internalType": "address", "name": "target", "type": "address"}
        ],
        "name": "buyTargetNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ], contractAddress);

    // Execute the transaction
    const tx = await contract.methods.buyTargetNFT(
      web3.utils.toWei(value, 'ether'),
      data,
      tokenId,
      strategy.marketplaceAddress
    ).send({
      from: account.address,
      gas: 500000,
    });

    return NextResponse.json({
      success: true,
      transactionHash: tx.transactionHash,
      gasUsed: tx.gasUsed,
      strategy: strategy.name,
      tokenId,
      value,
    });
  } catch (error) {
    console.error('Error executing buy transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Transaction failed' },
      { status: 500 }
    );
  }
}
