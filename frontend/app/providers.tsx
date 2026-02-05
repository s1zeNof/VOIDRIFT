'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    darkTheme,
    connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
    metaMaskWallet,
    rainbowWallet,
    walletConnectWallet,
    coinbaseWallet,
    trustWallet,
    okxWallet,
    phantomWallet,
    rabbyWallet,
    safeWallet,
    uniswapWallet,
    zerionWallet,
    braveWallet,
    ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';

import '@rainbow-me/rainbowkit/styles.css';

const projectId = '3c5d2dfdaa004c4fbaa896baf9ae60b7';

// Configure all wallets explicitly
const connectors = connectorsForWallets(
    [
        {
            groupName: 'Popular',
            wallets: [
                metaMaskWallet,
                walletConnectWallet,
                coinbaseWallet,
                okxWallet,
            ],
        },
        {
            groupName: 'More',
            wallets: [
                trustWallet,
                phantomWallet,
                rabbyWallet,
                rainbowWallet,
                uniswapWallet,
                zerionWallet,
                safeWallet,
                braveWallet,
                ledgerWallet,
            ],
        },
    ],
    {
        appName: 'VOIDRIFT',
        projectId,
    }
);

const config = createConfig({
    connectors,
    chains: [sepolia, baseSepolia],
    transports: {
        [sepolia.id]: http('https://rpc.sepolia.org'),
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
                    initialChain={sepolia}
                    showRecentTransactions={true}
                    theme={darkTheme({
                        accentColor: '#00FFFF',
                        accentColorForeground: 'black',
                        borderRadius: 'medium',
                        overlayBlur: 'small',
                    })}
                    modalSize="wide"
                    appInfo={{
                        appName: 'VOIDRIFT',
                        learnMoreUrl: 'https://ethereum.org/wallets',
                    }}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
