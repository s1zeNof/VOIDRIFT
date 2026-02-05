'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePublicClient, useChainId } from 'wagmi';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { sepolia } from 'viem/chains';
import { VOIDRIFT_NFT_ADDRESS } from '@/lib/contracts';
import { calculateRarityScore } from '@/lib/nftUtils';

// Fallback client for when wallet is not connected
const fallbackClient = createPublicClient({
    chain: sepolia,
    transport: http(),
});

export interface LeaderboardEntry {
    address: string;
    nftCount: number;
    rarityScore: number;
    tokenIds: string[];
    isEarlyAdopter: boolean;
    rank: number;
}

interface UseLeaderboardResult {
    leaderboard: LeaderboardEntry[];
    isLoading: boolean;
    error: string | null;
    refresh: () => void;
    totalHolders: number;
    totalMinted: number;
}

const EARLY_ADOPTER_THRESHOLD = 20; // First N unique minters

export function useLeaderboard(): UseLeaderboardResult {
    const wagmiClient = usePublicClient();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalHolders, setTotalHolders] = useState(0);
    const [totalMinted, setTotalMinted] = useState(0);

    const fetchLeaderboard = useCallback(async () => {
        // Use wagmi client if available, otherwise fallback
        const publicClient = wagmiClient || fallbackClient;

        setIsLoading(true);
        setError(null);

        try {
            // Fetch all Transfer events
            const transferLogs = await publicClient.getLogs({
                address: VOIDRIFT_NFT_ADDRESS as `0x${string}`,
                event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                fromBlock: BigInt(0),
                toBlock: 'latest',
            });

            // Build ownership map: tokenId -> current owner
            const ownershipMap = new Map<string, string>();
            const mintOrder: string[] = []; // Track order of first mints by address

            transferLogs.forEach(log => {
                const from = log.args.from as string;
                const to = log.args.to as string;
                const tokenId = log.args.tokenId!.toString();

                ownershipMap.set(tokenId, to);

                // Track mint (from zero address)
                if (from === '0x0000000000000000000000000000000000000000') {
                    if (!mintOrder.includes(to)) {
                        mintOrder.push(to);
                    }
                }
            });

            // Aggregate tokens by owner
            const holdingsMap = new Map<string, string[]>();
            ownershipMap.forEach((owner, tokenId) => {
                // Skip zero address (burned tokens)
                if (owner === '0x0000000000000000000000000000000000000000') return;

                const tokens = holdingsMap.get(owner) || [];
                tokens.push(tokenId);
                holdingsMap.set(owner, tokens);
            });

            // Create early adopter set (first N unique minters)
            const earlyAdopters = new Set(mintOrder.slice(0, EARLY_ADOPTER_THRESHOLD));

            // Build leaderboard
            const entries: Omit<LeaderboardEntry, 'rank'>[] = [];
            holdingsMap.forEach((tokenIds, address) => {
                entries.push({
                    address,
                    nftCount: tokenIds.length,
                    rarityScore: calculateRarityScore(tokenIds),
                    tokenIds,
                    isEarlyAdopter: earlyAdopters.has(address),
                });
            });

            // Sort by NFT count (primary) and rarity score (secondary)
            entries.sort((a, b) => {
                if (b.nftCount !== a.nftCount) return b.nftCount - a.nftCount;
                return b.rarityScore - a.rarityScore;
            });

            // Add ranks
            const rankedEntries = entries.map((entry, index) => ({
                ...entry,
                rank: index + 1,
            }));

            setLeaderboard(rankedEntries);
            setTotalHolders(entries.length);
            setTotalMinted(ownershipMap.size);
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err);
            setError('Failed to load leaderboard data');
        } finally {
            setIsLoading(false);
        }
    }, [wagmiClient]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    return {
        leaderboard,
        isLoading,
        error,
        refresh: fetchLeaderboard,
        totalHolders,
        totalMinted,
    };
}

export function shortenAddress(address: string, chars = 4): string {
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
