'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, DollarSign, Flame, ShoppingCart, AlertCircle } from 'lucide-react';

interface ContractState {
  currentFees: string;
  ethToTwap: string;
  collection: string;
  priceMultiplier: number;
  blockNumber: number;
}

interface NFTForSale {
  tokenId: number;
  price: string;
}

interface Strategy {
  name: string;
  symbol: string;
  contractAddress: string;
  collectionAddress: string;
  marketplaceAddress: string;
  priceMultiplier: number;
}

interface ContractCardProps {
  strategy: Strategy;
}

export default function ContractCard({ strategy }: ContractCardProps) {
  const [state, setState] = useState<ContractState | null>(null);
  const [nftsForSale, setNftsForSale] = useState<NFTForSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/contracts/${strategy.contractAddress}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data');
      }
      
      setState(data.state);
      setNftsForSale(data.nftsForSale);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [strategy.contractAddress]);

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {strategy.name} ({strategy.symbol})
          </h3>
          <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {strategy.name} ({strategy.symbol})
          </h3>
          <button
            onClick={fetchData}
            className="text-primary-600 hover:text-primary-700"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center text-danger-600">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  const canBuyNFT = parseFloat(state?.currentFees || '0') > 0.1;
  const canExecuteTwap = parseFloat(state?.ethToTwap || '0') > 0.01;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {strategy.name} ({strategy.symbol})
        </h3>
        <button
          onClick={fetchData}
          className="text-primary-600 hover:text-primary-700"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <DollarSign className="h-5 w-5 text-success-600" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Fees</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {parseFloat(state?.currentFees || '0').toFixed(4)} ETH
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Flame className="h-5 w-5 text-warning-600" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">ETH to TWAP</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {parseFloat(state?.ethToTwap || '0').toFixed(4)} ETH
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <ShoppingCart className="h-5 w-5 text-primary-600" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">NFTs for Sale</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {nftsForSale.length}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">Price Multiplier</span>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {(state?.priceMultiplier || 1200) / 1000}x
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {canBuyNFT && (
          <div className="flex items-center text-success-600 text-sm">
            <span className="w-2 h-2 bg-success-600 rounded-full mr-2"></span>
            Ready for NFT purchase
          </div>
        )}
        {canExecuteTwap && (
          <div className="flex items-center text-warning-600 text-sm">
            <span className="w-2 h-2 bg-warning-600 rounded-full mr-2"></span>
            TWAP available for token burning
          </div>
        )}
        {!canBuyNFT && !canExecuteTwap && (
          <div className="flex items-center text-gray-500 text-sm">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            Waiting for opportunities
          </div>
        )}
      </div>

      {nftsForSale.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            NFTs for Sale
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {nftsForSale.slice(0, 5).map((nft) => (
              <div key={nft.tokenId} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  #{nft.tokenId}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {parseFloat(nft.price).toFixed(2)} ETH
                </span>
              </div>
            ))}
            {nftsForSale.length > 5 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{nftsForSale.length - 5} more...
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Contract: {strategy.contractAddress.slice(0, 6)}...{strategy.contractAddress.slice(-4)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Collection: {strategy.collectionAddress.slice(0, 6)}...{strategy.collectionAddress.slice(-4)}
        </p>
        {state?.blockNumber && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Block: {state.blockNumber}
          </p>
        )}
      </div>
    </div>
  );
}
