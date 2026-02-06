'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    darkTheme,
    getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';

import '@rainbow-me/rainbowkit/styles.css';

const projectId = '3c5d2dfdaa004c4fbaa896baf9ae60b7';

// Use getDefaultConfig for simplicity - it handles wallets automatically
// Only Sepolia for now - contract is deployed there
const config = getDefaultConfig({
    appName: 'VOIDRIFT',
    projectId,
    chains: [sepolia],
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
                    modalSize="wide"
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
