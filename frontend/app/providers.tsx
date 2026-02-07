'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    darkTheme,
    connectorsForWallets,
    Wallet,
} from '@rainbow-me/rainbowkit';
import {
    // Popular & Recommended
    metaMaskWallet,
    coinbaseWallet,
    walletConnectWallet,
    rainbowWallet,
    // Injected/Browser Extension
    injectedWallet,
    rabbyWallet,
    braveWallet,
    // Mobile-first
    trustWallet,
    zerionWallet,
    okxWallet,
    phantomWallet,
    // More options
    argentWallet,
    ledgerWallet,
    safeWallet,
    // Additional popular wallets
    imTokenWallet,
    omniWallet,
    tokenPocketWallet,
    bitgetWallet,
    // Hardware & Security
    frameWallet,
    tahoWallet,
    xdefiWallet,
    enkryptWallet,
    // Other networks crossover
    uniswapWallet,
    bybitWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

import '@rainbow-me/rainbowkit/styles.css';

const projectId = '3c5d2dfdaa004c4fbaa896baf9ae60b7';

// Custom wallet groups with 25+ wallets for maximum compatibility
const connectors = connectorsForWallets(
    [
        {
            groupName: 'Recommended',
            wallets: [
                metaMaskWallet,
                coinbaseWallet,
                walletConnectWallet,
                rainbowWallet,
            ],
        },
        {
            groupName: 'Detected',
            wallets: [
                injectedWallet, // Auto-detects any injected wallet
                rabbyWallet,
                braveWallet,
                phantomWallet,
                frameWallet,
            ],
        },
        {
            groupName: 'Mobile Wallets',
            wallets: [
                trustWallet,
                zerionWallet,
                okxWallet,
                imTokenWallet,
                omniWallet,
                tokenPocketWallet,
                bitgetWallet,
                bybitWallet,
            ],
        },
        {
            groupName: 'Hardware & Security',
            wallets: [
                ledgerWallet,
                safeWallet,
                argentWallet,
            ],
        },
        {
            groupName: 'More Wallets',
            wallets: [
                uniswapWallet,
                tahoWallet,
                xdefiWallet,
                enkryptWallet,
            ],
        },
    ],
    {
        appName: 'VOIDRIFT',
        projectId,
    }
);

// Create wagmi config with custom connectors
const config = createConfig({
    connectors,
    chains: [baseSepolia],
    transports: {
        [baseSepolia.id]: http('https://sepolia.base.org'),
    },
    ssr: true,
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    initialChain={baseSepolia}
                    modalSize="wide"
                    showRecentTransactions={true}
                    theme={darkTheme({
                        accentColor: '#00FFFF',
                        accentColorForeground: 'black',
                        borderRadius: 'large',
                        overlayBlur: 'small',
                        fontStack: 'system',
                    })}
                    appInfo={{
                        appName: 'VOIDRIFT',
                        learnMoreUrl: 'https://ethereum.org/wallets',
                    }}
                    locale="en"
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
