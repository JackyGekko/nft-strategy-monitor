'use client';

import { useState } from 'react';
import ContractCard from '@/components/ContractCard';
import BuyNFTForm from '@/components/BuyNFTForm';
import { NFT_STRATEGIES } from '@/lib/contracts';
import { RefreshCw, ShoppingCart, Monitor } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'monitor' | 'buy'>('monitor');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleBuySuccess = (result: any) => {
    console.log('Buy transaction successful:', result);
    // Refresh all contract data
    handleRefresh();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          NFT Strategy Monitor
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Monitor NFT Strategy contracts in real-time and execute buyTargetNFT() calls
          to purchase NFTs using accumulated trading fees.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('monitor')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'monitor'
                ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>Monitor</span>
          </button>
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'buy'
                ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Buy NFT</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'monitor' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Contract Monitoring
            </h2>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 btn-primary"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh All</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {NFT_STRATEGIES.map((strategy) => (
              <ContractCard
                key={`${strategy.contractAddress}-${refreshKey}`}
                strategy={strategy}
              />
            ))}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How It Works
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                <p>NFT Strategy contracts collect trading fees from token transactions</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                <p>When enough fees accumulate, anyone can call buyTargetNFT() to purchase floor NFTs</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                <p>Purchased NFTs are automatically listed for sale at 1.2x the purchase price</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">4</span>
                <p>When NFTs sell, the proceeds are used to burn tokens, creating deflationary pressure</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'buy' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Execute buyTargetNFT()
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Use accumulated contract fees to purchase NFTs from the floor
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <BuyNFTForm onSuccess={handleBuySuccess} />
          </div>
        </div>
      )}
    </div>
  );
}
