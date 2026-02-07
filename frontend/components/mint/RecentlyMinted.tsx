'use client';

import { Container } from '@/components/layout/Container';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { parseAbiItem, formatEther } from 'viem';
import { VOIDRIFT_NFT_ADDRESS } from '@/lib/contracts';
import { Loader2, ExternalLink } from 'lucide-react';

interface MintEvent {
    tokenId: string;
    to: string;
    txHash: string;
    blockNumber: bigint;
    timeAgo: string;
}

export function RecentlyMinted() {
    const [mints, setMints] = useState<MintEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const publicClient = usePublicClient();

    useEffect(() => {
        async function fetchRecentMints() {
            if (!publicClient) {
                setIsLoading(false);
                return;
            }

            try {
                // Get Transfer events from zero address (mints only)
                const logs = await publicClient.getLogs({
                    address: VOIDRIFT_NFT_ADDRESS as `0x${string}`,
                    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                    args: { from: '0x0000000000000000000000000000000000000000' as `0x${string}` },
                    fromBlock: BigInt(0),
                    toBlock: 'latest',
                });

                // Get latest block for time calculation
                const latestBlock = await publicClient.getBlock();
                const latestBlockNumber = latestBlock.number;
                const latestTimestamp = latestBlock.timestamp;

                // Process last 10 mints (most recent first)
                const recentLogs = logs.slice(-10).reverse();

                const mintEvents: MintEvent[] = await Promise.all(
                    recentLogs.map(async (log) => {
                        // Estimate time based on block difference (~12 sec per block on Sepolia)
                        const blockDiff = latestBlockNumber - log.blockNumber;
                        const secondsAgo = Number(blockDiff) * 12;

                        let timeAgo: string;
                        if (secondsAgo < 60) {
                            timeAgo = 'Just now';
                        } else if (secondsAgo < 3600) {
                            const mins = Math.floor(secondsAgo / 60);
                            timeAgo = `${mins} min${mins > 1 ? 's' : ''} ago`;
                        } else if (secondsAgo < 86400) {
                            const hours = Math.floor(secondsAgo / 3600);
                            timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
                        } else {
                            const days = Math.floor(secondsAgo / 86400);
                            timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
                        }

                        return {
                            tokenId: log.args.tokenId!.toString(),
                            to: log.args.to!,
                            txHash: log.transactionHash,
                            blockNumber: log.blockNumber,
                            timeAgo,
                        };
                    })
                );

                setMints(mintEvents);
            } catch (err) {
                console.error('Failed to fetch recent mints:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchRecentMints();
    }, [publicClient]);

    const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    // Don't show section if no mints
    if (!isLoading && mints.length === 0) {
        return null;
    }

    return (
        <section className="py-12 border-t border-white/5 bg-black/40">
            <Container>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-rajdhani font-bold text-white">Recently Minted</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-gray-400 font-mono">Live on-chain</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-primary mr-2" size={20} />
                        <span className="text-gray-400 text-sm">Fetching on-chain data...</span>
                    </div>
                ) : (
                    <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                        {mints.map((mint, i) => (
                            <motion.div
                                key={`${mint.tokenId}-${mint.txHash}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="min-w-[220px] bg-white/5 border border-white/5 p-4 rounded-lg flex flex-col gap-2 hover:border-primary/30 transition-colors group"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-primary font-orbitron font-bold">#{mint.tokenId}</span>
                                    <span className="text-xs px-2 py-0.5 bg-green-500/10 rounded text-green-400 border border-green-500/20">
                                        Minted
                                    </span>
                                </div>
                                <div className="text-sm text-gray-400 font-mono">{shortenAddress(mint.to)}</div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{mint.timeAgo}</span>
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${mint.txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </Container>
        </section>
    );
}
