'use client';

import { useState } from 'react';
import { ShoppingCart, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { NFT_STRATEGIES } from '@/lib/contracts';

interface BuyNFTFormProps {
  onSuccess?: (result: any) => void;
}

export default function BuyNFTForm({ onSuccess }: BuyNFTFormProps) {
  const [selectedStrategy, setSelectedStrategy] = useState(NFT_STRATEGIES[0]);
  const [tokenId, setTokenId] = useState('');
  const [value, setValue] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenId || !value || !privateKey) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractAddress: selectedStrategy.contractAddress,
          tokenId: parseInt(tokenId),
          value: parseFloat(value),
          privateKey: privateKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Transaction failed');
      }

      setSuccess(`Transaction successful! Hash: ${data.transactionHash}`);
      onSuccess?.(data);
      
      // Clear form
      setTokenId('');
      setValue('');
      setPrivateKey('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <ShoppingCart className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Buy NFT via Contract
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Strategy Contract
          </label>
          <select
            value={selectedStrategy.contractAddress}
            onChange={(e) => {
              const strategy = NFT_STRATEGIES.find(s => s.contractAddress === e.target.value);
              if (strategy) setSelectedStrategy(strategy);
            }}
            className="input-field"
          >
            {NFT_STRATEGIES.map((strategy) => (
              <option key={strategy.contractAddress} value={strategy.contractAddress}>
                {strategy.name} ({strategy.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            NFT Token ID
          </label>
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="e.g., 123"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Value (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g., 1.0"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Private Key
          </label>
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="0x..."
            className="input-field"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Your private key will be used to sign the transaction. Make sure you have ETH for gas fees.
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-danger-600 bg-danger-50 dark:bg-danger-900/20 p-3 rounded-lg">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-success-600 bg-success-50 dark:bg-success-900/20 p-3 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Executing Transaction...</span>
            </div>
          ) : (
            'Execute buyTargetNFT()'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium mb-1">⚠️ Important Security Notice</p>
            <ul className="space-y-1 text-xs">
              <li>• Never share your private key with anyone</li>
              <li>• This transaction will use the contract's fees to buy an NFT</li>
              <li>• The NFT will be listed for sale at {selectedStrategy.priceMultiplier / 1000}x the purchase price</li>
              <li>• Make sure you have ETH in your wallet for gas fees</li>
              <li>• Double-check all parameters before submitting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
