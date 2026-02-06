'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePublicClient, useChainId } from 'wagmi';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { baseSepolia } from 'viem/chains';
import { VOIDRIFT_NFT_ADDRESS, SUPPORTED_CHAIN_ID } from '@/lib/contracts';

// Fallback client - always reads from Base Sepolia
const fallbackClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
});

export interface MintEvent {
    address: string;
    tokenId: string;
    timestamp: number;
    txHash: string;
    blockNumber: bigint;
    species?: string;
    rarity?: string;
}

interface UseLiveMintsResult {
    recentMints: MintEvent[];
    isLoading: boolean;
    isLive: boolean;
    error: string | null;
}

const MAX_MINTS = 20;
const POLL_INTERVAL = 10000; // 10 seconds
// Only scan the last ~50k blocks (~7 days on Sepolia) to avoid RPC limits
const BLOCK_RANGE = BigInt(50000);

export function useLiveMints(): UseLiveMintsResult {
    const wagmiClient = usePublicClient();
    const chainId = useChainId();
    const publicClient = wagmiClient || fallbackClient;
    const [recentMints, setRecentMints] = useState<MintEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLive, setIsLive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastBlock, setLastBlock] = useState<bigint>(BigInt(0));
    const fetchedRef = useRef(false);

    // Check if on the correct chain
    const isCorrectChain = chainId === SUPPORTED_CHAIN_ID || !wagmiClient;

    // Fetch initial mints and set up polling
    const fetchMints = useCallback(async (fromBlock?: bigint) => {
        if (!publicClient) return;

        // Use fallback client to always read from Sepolia regardless of connected chain
        const client = isCorrectChain ? publicClient : fallbackClient;

        try {
            // Get current block number to limit range
            const currentBlock = await client.getBlockNumber();
            const startBlock = fromBlock || (currentBlock > BLOCK_RANGE ? currentBlock - BLOCK_RANGE : BigInt(0));

            // Try Minted events first
            let mintLogs: Awaited<ReturnType<typeof client.getLogs>> = [];
            try {
                mintLogs = await client.getLogs({
                    address: VOIDRIFT_NFT_ADDRESS as `0x${string}`,
                    event: parseAbiItem('event Minted(address indexed to, uint256 indexed tokenId)'),
                    fromBlock: startBlock,
                    toBlock: 'latest',
                });
            } catch {
                mintLogs = [];
            }

            if (mintLogs.length === 0 && !fromBlock) {
                // Fallback: try Transfer events from zero address (mints)
                const transferLogs = await client.getLogs({
                    address: VOIDRIFT_NFT_ADDRESS as `0x${string}`,
                    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                    args: { from: '0x0000000000000000000000000000000000000000' as `0x${string}` },
                    fromBlock: startBlock,
                    toBlock: 'latest',
                });

                const mints: MintEvent[] = transferLogs
                    .slice(-MAX_MINTS)
                    .reverse()
                    .map(log => {
                        const tokenId = log.args.tokenId!.toString();
                        return {
                            address: log.args.to as string,
                            tokenId,
                            timestamp: Date.now(),
                            txHash: log.transactionHash || '',
                            blockNumber: log.blockNumber || BigInt(0),
                        };
                    });

                setRecentMints(mints);
                if (transferLogs.length > 0) {
                    setLastBlock(transferLogs[transferLogs.length - 1].blockNumber || currentBlock);
                } else {
                    setLastBlock(currentBlock);
                }
            } else {
                // Process Minted events
                const newMints: MintEvent[] = mintLogs.map(log => {
                    const tokenId = (log as { args: { tokenId?: bigint; to?: string } }).args.tokenId!.toString();
                    return {
                        address: (log as { args: { to?: string } }).args.to as string,
                        tokenId,
                        timestamp: Date.now(),
                        txHash: (log as { transactionHash: string | null }).transactionHash || '',
                        blockNumber: (log as { blockNumber: bigint | null }).blockNumber || BigInt(0),
                    };
                });

                if (fromBlock) {
                    setRecentMints(prev => [...newMints.reverse(), ...prev].slice(0, MAX_MINTS));
                } else {
                    setRecentMints(newMints.slice(-MAX_MINTS).reverse());
                }

                if (mintLogs.length > 0) {
                    setLastBlock(mintLogs[mintLogs.length - 1].blockNumber || currentBlock);
                } else {
                    setLastBlock(currentBlock);
                }
            }

            setIsLive(true);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch mint events:', err);
            setError('Failed to load mint feed');
            setIsLive(false);
        } finally {
            setIsLoading(false);
        }
    }, [publicClient, isCorrectChain]);

    // Initial fetch
    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        fetchMints();
    }, [fetchMints]);

    // Polling for new mints
    useEffect(() => {
        if (!publicClient || lastBlock === BigInt(0)) return;

        const interval = setInterval(() => {
            fetchMints(lastBlock + BigInt(1));
        }, POLL_INTERVAL);

        return () => clearInterval(interval);
    }, [publicClient, lastBlock, fetchMints]);

    return {
        recentMints,
        isLoading,
        isLive,
        error,
    };
}

export function shortenAddress(address: string, chars = 4): string {
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}
