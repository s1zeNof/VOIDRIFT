'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { generateTraits } from '@/lib/nftUtils';
import Link from 'next/link';

export function AvatarConnectButton() {
    const { isConnected } = useAccount();
    const [avatarId, setAvatarId] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('voidrift_avatar');
        if (stored) setAvatarId(stored);

        // Listen for storage changes (when avatar is set on profile page)
        const handleStorage = () => {
            const updated = localStorage.getItem('voidrift_avatar');
            setAvatarId(updated);
        };
        window.addEventListener('storage', handleStorage);

        // Also poll for changes (same tab)
        const interval = setInterval(() => {
            const current = localStorage.getItem('voidrift_avatar');
            if (current !== avatarId) setAvatarId(current);
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, [avatarId]);

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-bold hover:opacity-90 transition-opacity"
                                    >
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button
                                        onClick={openChainModal}
                                        className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 font-medium"
                                    >
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <div className="flex items-center gap-3">
                                    {/* Chain selector */}
                                    <button
                                        onClick={openChainModal}
                                        className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-white/30 transition-colors"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                className="w-5 h-5 rounded-full overflow-hidden"
                                                style={{ background: chain.iconBackground }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        className="w-5 h-5"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </button>

                                    {/* Account with avatar */}
                                    <button
                                        onClick={openAccountModal}
                                        className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl hover:border-primary/50 transition-colors group"
                                    >
                                        {/* NFT Avatar */}
                                        <Link
                                            href="/profile"
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 group-hover:border-primary/50 transition-colors flex-shrink-0"
                                        >
                                            {avatarId ? (
                                                <img
                                                    src={generateTraits(avatarId).image}
                                                    alt={`NFT #${avatarId}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-cyan-900 flex items-center justify-center">
                                                    <span className="text-[10px] text-white/50">?</span>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Address */}
                                        <span className="text-white font-medium text-sm">
                                            {account.displayName}
                                        </span>
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
