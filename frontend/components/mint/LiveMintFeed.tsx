'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ExternalLink, Loader2 } from 'lucide-react';
import { useLiveMints, shortenAddress, formatTimeAgo, MintEvent } from '@/hooks/useLiveMints';
import { RarityBadge } from '@/components/shared/RarityBadge';
import { getTokenMetadataUrl, ipfsToHttp } from '@/lib/contracts';

interface MintDisplayData {
    name: string;
    species: string;
    rarity: string;
    image: string;
}

// Cache IPFS metadata lookups
const mintDisplayCache = new Map<string, MintDisplayData>();

async function fetchMintDisplay(tokenId: string): Promise<MintDisplayData> {
    if (mintDisplayCache.has(tokenId)) return mintDisplayCache.get(tokenId)!;

    const fallback: MintDisplayData = {
        name: `Riftwalker #${tokenId}`,
        species: 'Unknown',
        rarity: 'Common',
        image: '/birds/owl_1.png',
    };

    try {
        const url = getTokenMetadataUrl(tokenId);
        const res = await fetch(url);
        if (!res.ok) return fallback;
        const data = await res.json();
        const display: MintDisplayData = {
            name: data.name || fallback.name,
            species: data.attributes?.find((a: { trait_type: string }) => a.trait_type === 'Species')?.value || 'Unknown',
            rarity: data.attributes?.find((a: { trait_type: string }) => a.trait_type === 'Rarity')?.value || 'Common',
            image: ipfsToHttp(data.image),
        };
        mintDisplayCache.set(tokenId, display);
        return display;
    } catch {
        return fallback;
    }
}

export function LiveMintFeed() {
    const { recentMints, isLoading, isLive, error } = useLiveMints();

    return (
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={isLive ? {
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.7, 1],
                        } : {}}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-500'}`}
                    />
                    <h3 className="text-lg font-orbitron font-bold text-white">
                        Live Mint Feed
                    </h3>
                    {isLive && (
                        <span className="text-[10px] font-rajdhani uppercase tracking-wider text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/30">
                            LIVE
                        </span>
                    )}
                </div>
                <Radio className={`w-5 h-5 ${isLive ? 'text-green-400' : 'text-gray-500'}`} />
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-sm">{error}</p>
                </div>
            ) : recentMints.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-sm">No mints yet. Be the first!</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <AnimatePresence mode="popLayout">
                        {recentMints.map((mint, index) => (
                            <MintEventCard key={`${mint.txHash}-${mint.tokenId}`} mint={mint} index={index} />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

function MintEventCard({ mint, index }: { mint: MintEvent; index: number }) {
    const [display, setDisplay] = useState<MintDisplayData | null>(null);

    useEffect(() => {
        fetchMintDisplay(mint.tokenId).then(setDisplay);
    }, [mint.tokenId]);

    const species = display?.species || '...';
    const rarity = display?.rarity || mint.rarity || 'Common';
    const image = display?.image || '/birds/owl_1.png';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/30 transition-colors group"
        >
            {/* NFT Preview */}
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/50 border border-white/10 flex-shrink-0">
                <img
                    src={image}
                    alt={`#${mint.tokenId}`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-mono text-sm">
                        {shortenAddress(mint.address)}
                    </span>
                    <span className="text-gray-500 text-sm">minted</span>
                    <span className="text-primary font-orbitron font-bold">
                        {species} #{mint.tokenId}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <RarityBadge rarity={rarity} size="sm" showGlow={false} />
                    <span className="text-xs text-gray-500">
                        {formatTimeAgo(mint.timestamp)}
                    </span>
                </div>
            </div>

            {/* Etherscan Link */}
            <a
                href={`https://sepolia.etherscan.io/tx/${mint.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
            >
                <ExternalLink className="w-4 h-4" />
            </a>
        </motion.div>
    );
}

// Compact horizontal version for smaller spaces
export function LiveMintFeedCompact() {
    const { recentMints, isLive } = useLiveMints();

    return (
        <div className="relative overflow-hidden">
            {/* Live indicator */}
            <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 bg-gradient-to-r from-black to-transparent">
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={isLive ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-500'}`}
                    />
                    <span className="text-xs font-rajdhani uppercase tracking-wider text-gray-400">Live</span>
                </div>
            </div>

            {/* Scrolling feed */}
            <div className="flex gap-4 overflow-x-auto pb-2 pl-20 scrollbar-none">
                {recentMints.slice(0, 10).map((mint) => (
                    <CompactMintCard key={`${mint.txHash}-${mint.tokenId}`} mint={mint} />
                ))}
            </div>
        </div>
    );
}

function CompactMintCard({ mint }: { mint: MintEvent }) {
    const [display, setDisplay] = useState<MintDisplayData | null>(null);

    useEffect(() => {
        fetchMintDisplay(mint.tokenId).then(setDisplay);
    }, [mint.tokenId]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10"
        >
            <div className="w-8 h-8 rounded overflow-hidden">
                <img src={display?.image || '/birds/owl_1.png'} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
                <p className="text-xs text-white font-mono">
                    {shortenAddress(mint.address, 3)}
                </p>
                <p className="text-[10px] text-gray-400">
                    #{mint.tokenId}
                </p>
            </div>
        </motion.div>
    );
}
