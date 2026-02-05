import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, baseSepolia } from 'wagmi/chains';

// IMPORTANT: Set your WalletConnect Project ID in .env.local
// NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
// Get one free at https://cloud.walletconnect.com

export const config = getDefaultConfig({
    appName: 'VOIDRIFT',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    chains: [sepolia, baseSepolia],
    ssr: true,
});
