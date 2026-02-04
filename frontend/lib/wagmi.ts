import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'VOIDRIFT',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    chains: [sepolia, baseSepolia],
    ssr: true,
});
