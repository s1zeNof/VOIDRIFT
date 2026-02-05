'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

export function MobileConnectButton() {
    const [isMobile, setIsMobile] = useState(false);
    const { connectors, connect } = useConnect();
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    }, []);

    // On desktop, use RainbowKit
    if (!isMobile) {
        return <ConnectButton />;
    }

    // On mobile when connected
    if (isConnected && address) {
        return (
            <button
                onClick={() => disconnect()}
                className="px-4 py-2 bg-[#0F1435] border border-cyan-500/30 rounded-xl text-white font-medium hover:border-cyan-400 transition-colors"
            >
                {address.slice(0, 6)}...{address.slice(-4)}
            </button>
        );
    }

    // Find WalletConnect connector
    const walletConnectConnector = connectors.find(
        (c) => c.id === 'walletConnect' || c.name === 'WalletConnect'
    );

    // On mobile, directly trigger WalletConnect which opens system wallet picker
    const handleConnect = async () => {
        if (walletConnectConnector) {
            try {
                await connect({ connector: walletConnectConnector });
            } catch (error) {
                console.error('Connection error:', error);
            }
        }
    };

    return (
        <button
            onClick={handleConnect}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-bold hover:opacity-90 transition-opacity active:scale-95 touch-manipulation"
        >
            Connect Wallet
        </button>
    );
}
