'use client';

import { motion } from 'framer-motion';
import { Bird, Gem, Star, Calendar } from 'lucide-react';
import { calculateCollectionStats, RARITY_ORDER, COLLECTION_CONFIG } from '@/lib/nftUtils';
import { RarityBadge } from '@/components/shared/RarityBadge';

interface FlockStatsProps {
    tokenIds: string[];
    firstMintDate?: Date | null;
}

export function FlockStats({ tokenIds, firstMintDate }: FlockStatsProps) {
    const stats = calculateCollectionStats(tokenIds);

    const statItems = [
        {
            icon: <Bird className="w-6 h-6" />,
            value: stats.totalNFTs,
            label: 'Total NFTs',
            color: 'text-primary',
        },
        {
            icon: <Gem className="w-6 h-6" />,
            value: stats.score,
            label: 'Rarity Score',
            color: 'text-secondary',
        },
        {
            icon: <Star className="w-6 h-6" />,
            value: stats.highestRarity,
            label: 'Highest Rarity',
            color: 'text-yellow-400',
            isText: true,
        },
        {
            icon: <Calendar className="w-6 h-6" />,
            value: firstMintDate
                ? firstMintDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'N/A',
            label: 'First Mint',
            color: 'text-green-400',
            isText: true,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statItems.map((item, index) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary/30 transition-colors group"
                    >
                        <div className={`${item.color} mb-3 group-hover:scale-110 transition-transform`}>
                            {item.icon}
                        </div>
                        <div className={`text-2xl font-orbitron font-bold ${item.isText ? 'text-lg' : ''} text-white`}>
                            {item.value}
                        </div>
                        <div className="text-xs text-gray-400 font-rajdhani uppercase tracking-wider mt-1">
                            {item.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Rarity Breakdown */}
            {stats.totalNFTs > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                >
                    <h3 className="text-sm font-rajdhani font-bold uppercase tracking-wider text-gray-400 mb-4">
                        Rarity Breakdown
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {RARITY_ORDER.map((rarity) => {
                            const count = stats.breakdown[rarity] || 0;
                            if (count === 0) return null;

                            const color = COLLECTION_CONFIG.rarityColors[rarity as keyof typeof COLLECTION_CONFIG.rarityColors];

                            return (
                                <div
                                    key={rarity}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                                    style={{
                                        borderColor: `${color}50`,
                                        backgroundColor: `${color}10`,
                                    }}
                                >
                                    <RarityBadge rarity={rarity} size="sm" showGlow={false} />
                                    <span className="text-white font-orbitron font-bold">
                                        x{count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
