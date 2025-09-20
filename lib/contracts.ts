export interface NFTStrategy {
  name: string;
  symbol: string;
  contractAddress: string;
  collectionAddress: string;
  marketplaceAddress: string;
  priceMultiplier: number;
}

export const NFT_STRATEGIES: NFTStrategy[] = [
  {
    name: 'Bored Ape Yacht Club',
    symbol: 'BAYC',
    contractAddress: '0x9EbF91b8D6fF68aA05545301A3D0984EaEE54A03',
    collectionAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    marketplaceAddress: '0x0000000000000068F116a894984e2DB1123eB395',
    priceMultiplier: 1200, // 1.2x
  },
  {
    name: 'Pudgy Penguins',
    symbol: 'PudgyPenguin',
    contractAddress: '0xB3d6e9e142A785ea8a4F0050fee73Bcc3438c5C5',
    collectionAddress: '0xbd3531da5cf5857e7cfaa92426877b022e612cf8',
    marketplaceAddress: '0x0000000000000068F116a894984e2DB1123eB395',
    priceMultiplier: 1200, // 1.2x
  },
  {
    name: 'Moonbirds',
    symbol: 'BIRBSTR',
    contractAddress: '0x6BCba7Cd81a5F12c10Ca1BF9B36761CC382658E8',
    collectionAddress: '0x23581767a106ae21c074b2276d25e5c3e136a68b',
    marketplaceAddress: '0x0000000000000068F116a894984e2DB1123eB395',
    priceMultiplier: 1200, // 1.2x
  },
  {
    name: 'Meebits',
    symbol: 'MEEBSTR',
    contractAddress: '0xC9b2c00f31B210FCea1242D91307A5B1e3b2Be68',
    collectionAddress: '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7',
    marketplaceAddress: '0x0000000000000068F116a894984e2DB1123eB395',
    priceMultiplier: 1200, // 1.2x
  },
  {
    name: 'CryptoDickbutts',
    symbol: 'CDB',
    contractAddress: '0x8680AcfACB3FED5408764343Fc7E8358e8c85A4c',
    collectionAddress: '0x42069abfe407c60cf4ae4112bedead391dba1cdb',
    marketplaceAddress: '0x0000000000000068F116a894984e2DB1123eB395',
    priceMultiplier: 1200, // 1.2x
  },
];

export const RPC_URLS = [
  'https://eth.llamarpc.com',
  'https://rpc.ankr.com/eth',
  'https://ethereum.publicnode.com',
  'https://eth.drpc.org',
];

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "currentFees",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ethToTwap",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "collection",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "priceMultiplier",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "nftForSale",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
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
  },
  {
    "inputs": [],
    "name": "processTokenTwap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
