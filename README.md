# NFT Strategy Monitor

A web application for monitoring NFT Strategy contracts and executing `buyTargetNFT()` calls to purchase NFTs using accumulated trading fees.

🚀 **Live Demo**: [Deployed on Vercel](https://nft-strategy-monitor.vercel.app)

## Features

- **Real-time Monitoring**: Monitor multiple NFT Strategy contracts simultaneously
- **Contract State**: View current fees, ETH to TWAP, NFTs for sale, and price multipliers
- **Buy Execution**: Execute `buyTargetNFT()` calls directly from the web interface
- **Multi-Collection Support**: Support for BAYC, Pudgy Penguins, Moonbirds, Meebits, and CryptoDickbutts
- **Responsive Design**: Works on desktop and mobile devices

## Supported Contracts

| Collection | Symbol | Contract Address |
|------------|--------|------------------|
| Bored Ape Yacht Club | BAYC | `0x9EbF91b8D6fF68aA05545301A3D0984EaEE54A03` |
| Pudgy Penguins | PudgyPenguin | `0xB3d6e9e142A785ea8a4F0050fee73Bcc3438c5C5` |
| Moonbirds | BIRBSTR | `0x6BCba7Cd81a5F12c10Ca1BF9B36761CC382658E8` |
| Meebits | MEEBSTR | `0xC9b2c00f31B210FCea1242D91307A5B1e3b2Be68` |
| CryptoDickbutts | CDB | `0x8680AcfACB3FED5408764343Fc7E8358e8c85A4c` |

## How It Works

1. **Fee Collection**: NFT Strategy contracts collect trading fees from token transactions
2. **NFT Purchase**: When enough fees accumulate, anyone can call `buyTargetNFT()` to purchase floor NFTs
3. **Auto-Listing**: Purchased NFTs are automatically listed for sale at 1.2x the purchase price
4. **Token Burning**: When NFTs sell, proceeds are used to burn tokens, creating deflationary pressure

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Ethereum wallet with ETH for gas fees

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nft-strategy-monitor
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment

#### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

#### Manual Deployment

```bash
npm run build
npm start
```

## Usage

### Monitoring Contracts

1. Navigate to the "Monitor" tab
2. View real-time contract state for all supported strategies
3. Look for opportunities when contracts have sufficient fees
4. Refresh data every 30 seconds automatically

### Buying NFTs

1. Navigate to the "Buy NFT" tab
2. Select the strategy contract
3. Enter the NFT token ID you want to purchase
4. Enter the ETH value (must be ≤ contract's current fees)
5. Enter your private key (with 0x prefix)
6. Click "Execute buyTargetNFT()"

### Security Considerations

- **Private Key**: Never share your private key with anyone
- **Gas Fees**: Ensure you have ETH in your wallet for transaction gas fees
- **Double Check**: Verify all parameters before executing transactions
- **Test First**: Consider testing on testnets before mainnet

## API Endpoints

### GET /api/contracts/[address]
Get contract state and NFTs for sale

### POST /api/buy
Execute buyTargetNFT transaction

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Web3.js, Ethers.js
- **Deployment**: Vercel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Disclaimer

This application is for educational and informational purposes only. Always verify contract addresses and parameters before executing transactions. The authors are not responsible for any financial losses.