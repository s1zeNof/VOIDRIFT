'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    darkTheme,
    connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
    metaMaskWallet,
    walletConnectWallet,
    coinbaseWallet,
    rainbowWallet,
    trustWallet,
    okxWallet,
    phantomWallet,
    rabbyWallet,
    injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';

import '@rainbow-me/rainbowkit/styles.css';

const projectId = '3c5d2dfdaa004c4fbaa896baf9ae60b7';

// Configure wallets with explicit mobile support
const connectors = connectorsForWallets(
    [
        {
            groupName: 'Popular',
            wallets: [
                metaMaskWallet,
                walletConnectWallet,
                coinbaseWallet,
                rabbyWallet,
            ],
        },
        {
            groupName: 'More Wallets',
            wallets: [
                okxWallet,
                trustWallet,
                phantomWallet,
                rainbowWallet,
                injectedWallet,
            ],
        },
    ],
    {
        appName: 'VOIDRIFT',
        projectId,
    }
);

// Create wagmi config with explicit transports
const config = createConfig({
    connectors,
    chains: [sepolia, baseSepolia],
    transports: {
        [sepolia.id]: http(),
        [baseSepolia.id]: http(),
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
                    modalSize="compact"
                    theme={darkTheme({
                        accentColor: '#00FFFF',
                        accentColorForeground: 'black',
                        borderRadius: 'medium',
                        overlayBlur: 'small',
                    })}
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
