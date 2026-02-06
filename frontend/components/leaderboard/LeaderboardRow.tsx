'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Trophy, Award, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaderboardEntry, shortenAddress } from '@/hooks/useLeaderboard';
import { RarityBadge } from '@/components/shared/RarityBadge';
import { getNFTById, RARITY_SCORES } from '@/lib/nftUtils';

interface LeaderboardRowProps {
    entry: LeaderboardEntry;
    index: number;
}

// Glitch text effect component
function GlitchText({ children, className }: { children: string; className?: string }) {
    return (
        <motion.span
            className={cn('relative inline-block', className)}
            animate={{
                textShadow: [
                    '0 0 0 transparent',
                    '2px 0 0 #00ffff, -2px 0 0 #ff00ff',
                    '-1px 0 0 #00ffff, 1px 0 0 #ff00ff',
                    '0 0 0 transparent',
                ],
            }}
            transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatDelay: 4,
            }}
        >
            {children}
        </motion.span>
    );
}

const rankStyles: Record<number, { icon: React.ReactNode; bg: string; border: string; text: string; glow: string }> = {
    1: {
        icon: <Trophy className="w-5 h-5" />,
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/50',
        text: 'text-yellow-400',
        glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
    },
    2: {
        icon: <Award className="w-5 h-5" />,
        bg: 'bg-gray-300/10',
        border: 'border-gray-400/50',
        text: 'text-gray-300',
        glow: 'shadow-[0_0_15px_rgba(156,163,175,0.2)]',
    },
    3: {
        icon: <Medal className="w-5 h-5" />,
        bg: 'bg-amber-600/10',
        border: 'border-amber-600/50',
        text: 'text-amber-500',
        glow: 'shadow-[0_0_15px_rgba(217,119,6,0.2)]',
    },
};

export function LeaderboardRow({ entry, index }: LeaderboardRowProps) {
    const rankStyle = rankStyles[entry.rank];
    const isTopThree = entry.rank <= 3;

    // Find highest rarity NFT
    let highestRarity = 'Common';
    for (const tokenId of entry.tokenIds) {
        const nft = getNFTById(Number(tokenId));
        if (nft && RARITY_SCORES[nft.rarity] > (RARITY_SCORES[highestRarity] || 0)) {
            highestRarity = nft.rarity;
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={cn(
                'flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01]',
                isTopThree
                    ? `${rankStyle.bg} ${rankStyle.border} ${rankStyle.glow}`
                    : 'bg-white/5 border-white/10 hover:border-white/20'
            )}
        >
            {/* Rank */}
            <div
                className={cn(
                    'w-12 h-12 flex items-center justify-center rounded-lg font-orbitron font-bold text-lg',
                    isTopThree
                        ? `${rankStyle.bg} ${rankStyle.text}`
                        : 'bg-white/5 text-gray-400'
                )}
            >
                {isTopThree ? rankStyle.icon : `#${entry.rank}`}
            </div>

            {/* Address */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {isTopThree ? (
                        <GlitchText className={cn('font-mono text-lg', rankStyle.text)}>
                            {shortenAddress(entry.address, 6)}
                        </GlitchText>
                    ) : (
                        <span className="font-mono text-white">
                            {shortenAddress(entry.address, 6)}
                        </span>
                    )}

                    {entry.isEarlyAdopter && (
                        <span className="px-2 py-0.5 text-[10px] font-rajdhani font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 rounded-full">
                            Early Adopter
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <RarityBadge rarity={highestRarity} size="sm" showGlow={false} />
                    <span className="text-xs text-gray-500">highest</span>
                </div>
            </div>

            {/* Stats */}
            <div className="text-right">
                <div className={cn(
                    'text-2xl font-orbitron font-bold',
                    isTopThree ? rankStyle.text : 'text-white'
                )}>
                    {entry.nftCount}
                </div>
                <div className="text-xs text-gray-400 font-rajdhani uppercase tracking-wider">
                    NFTs
                </div>
            </div>

            {/* Rarity Score */}
            <div className="text-right hidden sm:block">
                <div className="text-lg font-orbitron text-primary">
                    {entry.rarityScore}
                </div>
                <div className="text-xs text-gray-400 font-rajdhani uppercase tracking-wider">
                    Score
                </div>
            </div>

            {/* BaseScan Link */}
            <a
                href={`https://sepolia.basescan.org/address/${entry.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
            >
                <ExternalLink className="w-4 h-4" />
            </a>
        </motion.div>
    );
}
