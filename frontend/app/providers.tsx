'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultWallets,
    connectorsForWallets,
    darkTheme,
} from '@rainbow-me/rainbowkit';
import {
    trustWallet,
    coinbaseWallet,
    okxWallet,
    phantomWallet,
    rabbyWallet,
    zerionWallet,
    safeWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';

import '@rainbow-me/rainbowkit/styles.css';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// Get default wallets (MetaMask, Rainbow, WalletConnect, etc.)
const { wallets: defaultWallets } = getDefaultWallets({
    appName: 'VOIDRIFT',
    projectId,
});

// Add more popular mobile wallets
const connectors = connectorsForWallets(
    [
        ...defaultWallets,
        {
            groupName: 'More Wallets',
            wallets: [
                trustWallet,
                coinbaseWallet,
                okxWallet,
                phantomWallet,
                rabbyWallet,
                zerionWallet,
                safeWallet,
            ],
        },
    ],
    {
        appName: 'VOIDRIFT',
        projectId,
    }
);

// Create wagmi config with connectors
const config = createConfig({
    connectors,
    chains: [sepolia, baseSepolia],
    transports: {
        [sepolia.id]: http(),
        [baseSepolia.id]: http(),
    },
    ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#00FFFF',
                        accentColorForeground: 'black',
                        borderRadius: 'medium',
                    })}
                    modalSize="compact"
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
