# Deployment Guide

## Quick Deploy to Vercel

### Option 1: GitHub Integration (Recommended)

1. **Create GitHub Repository**
   ```bash
   # Create a new repository on GitHub
   # Then push your code:
   git remote add origin https://github.com/YOUR_USERNAME/nft-strategy-monitor.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Deploy automatically

### Option 2: Direct Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

## Environment Variables

No environment variables are required for the basic functionality. The app uses public RPC endpoints.

## Features Included

✅ **Real-time Contract Monitoring**
- Current fees, ETH to TWAP, NFTs for sale
- Auto-refresh every 30 seconds
- Multi-contract support

✅ **Buy NFT Interface**
- Select strategy contract
- Enter token ID and value
- Execute buyTargetNFT() transactions
- Private key input (secure)

✅ **Responsive Design**
- Mobile-friendly interface
- Dark/light mode support
- Tailwind CSS styling

✅ **Security Features**
- Private key handling
- Input validation
- Error handling
- Transaction confirmation

## Supported Contracts

| Collection | Contract Address | Collection Address |
|------------|------------------|-------------------|
| BAYC | `0x9EbF91b8D6fF68aA05545301A3D0984EaEE54A03` | `0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d` |
| Pudgy Penguins | `0xB3d6e9e142A785ea8a4F0050fee73Bcc3438c5C5` | `0xbd3531da5cf5857e7cfaa92426877b022e612cf8` |
| Moonbirds | `0x6BCba7Cd81a5F12c10Ca1BF9B36761CC382658E8` | `0x23581767a106ae21c074b2276d25e5c3e136a68b` |
| Meebits | `0xC9b2c00f31B210FCea1242D91307A5B1e3b2Be68` | `0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7` |
| CryptoDickbutts | `0x8680AcfACB3FED5408764343Fc7E8358e8c85A4c` | `0x42069abfe407c60cf4ae4112bedead391dba1cdb` |

## Usage Instructions

### For Users

1. **Monitor Contracts**
   - View real-time data for all supported strategies
   - Look for opportunities when fees accumulate
   - Check which NFTs are for sale

2. **Buy NFTs**
   - Select the strategy contract
   - Enter the NFT token ID you want to buy
   - Enter the ETH value (must be ≤ contract fees)
   - Enter your private key (with 0x prefix)
   - Execute the transaction

### For Developers

1. **Local Development**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

2. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

3. **Add New Contracts**
   - Edit `lib/contracts.ts`
   - Add new strategy to `NFT_STRATEGIES` array
   - Deploy updated version

## Security Notes

- Private keys are only used client-side for transaction signing
- No private keys are stored or transmitted to servers
- All transactions are executed directly on Ethereum
- Users need ETH for gas fees
- Always verify contract addresses before executing

## Troubleshooting

### Common Issues

1. **RPC Errors**
   - App automatically switches between multiple RPC endpoints
   - If all fail, check network connectivity

2. **Transaction Failures**
   - Ensure sufficient ETH for gas fees
   - Verify contract has enough fees
   - Check if NFT is already owned by contract

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check Node.js version (18+ required)

### Support

For issues or questions:
- Check the GitHub repository issues
- Review the contract documentation
- Verify all parameters before executing transactions
