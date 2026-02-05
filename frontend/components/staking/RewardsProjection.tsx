'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Clock, Coins } from 'lucide-react';
import { getNFTById, getStakingMultiplier, COLLECTION_CONFIG } from '@/lib/nftUtils';
import { RarityBadge } from '@/components/shared/RarityBadge';

interface RewardsProjectionProps {
    ownedTokenIds: string[];
}

const BASE_RATE = 10; // RIFT tokens per day base rate

export function RewardsProjection({ ownedTokenIds }: RewardsProjectionProps) {
    const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());

    // Calculate projections
    const projections = useMemo(() => {
        const tokens = selectedTokens.size > 0 ? [...selectedTokens] : ownedTokenIds;

        let dailyTotal = 0;
        const breakdown: { id: string; rarity: string; daily: number }[] = [];

        tokens.forEach(id => {
            const nft = getNFTById(Number(id));
            if (nft) {
                const multiplier = getStakingMultiplier(nft.rarity);
                const daily = BASE_RATE * multiplier;
                dailyTotal += daily;
                breakdown.push({ id, rarity: nft.rarity, daily });
            }
        });

        return {
            daily: dailyTotal,
            weekly: dailyTotal * 7,
            monthly: dailyTotal * 30,
            yearly: dailyTotal * 365,
            breakdown,
            tokenCount: tokens.length,
        };
    }, [selectedTokens, ownedTokenIds]);

    const toggleToken = (id: string) => {
        const newSet = new Set(selectedTokens);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedTokens(newSet);
    };

    const selectAll = () => {
        if (selectedTokens.size === ownedTokenIds.length) {
            setSelectedTokens(new Set());
        } else {
            setSelectedTokens(new Set(ownedTokenIds));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-br from-secondary/10 to-primary/5 rounded-2xl border border-secondary/20"
        >
            <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-secondary" />
                <h3 className="text-xl font-orbitron font-bold text-white">
                    Rewards Projection
                </h3>
            </div>

            {/* Token Selection */}
            {ownedTokenIds.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400 font-rajdhani">
                            Select NFTs to calculate ({selectedTokens.size > 0 ? selectedTokens.size : 'all'} selected)
                        </span>
                        <button
                            onClick={selectAll}
                            className="text-xs text-primary hover:text-primary/80 font-rajdhani"
                        >
                            {selectedTokens.size === ownedTokenIds.length ? 'Clear' : 'Select All'}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ownedTokenIds.map(id => {
                            const nft = getNFTById(Number(id));
                            const isSelected = selectedTokens.has(id) || selectedTokens.size === 0;
                            const color = nft ? COLLECTION_CONFIG.rarityColors[nft.rarity as keyof typeof COLLECTION_CONFIG.rarityColors] : '#9ca3af';

                            return (
                                <button
                                    key={id}
                                    onClick={() => toggleToken(id)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all border ${
                                        isSelected
                                            ? 'bg-white/10 text-white'
                                            : 'bg-white/5 text-gray-500 opacity-50'
                                    }`}
                                    style={{
                                        borderColor: isSelected ? color : 'transparent',
                                    }}
                                >
                                    #{id}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Projection Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <ProjectionCard
                    icon={<Clock className="w-5 h-5" />}
                    label="Daily"
                    value={projections.daily}
                    color="text-green-400"
                />
                <ProjectionCard
                    icon={<TrendingUp className="w-5 h-5" />}
                    label="Weekly"
                    value={projections.weekly}
                    color="text-blue-400"
                />
                <ProjectionCard
                    icon={<Coins className="w-5 h-5" />}
                    label="Monthly"
                    value={projections.monthly}
                    color="text-purple-400"
                />
                <ProjectionCard
                    icon={<TrendingUp className="w-5 h-5" />}
                    label="Yearly"
                    value={projections.yearly}
                    color="text-yellow-400"
                    highlight
                />
            </div>

            {/* Breakdown */}
            {projections.breakdown.length > 0 && (
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                    <h4 className="text-sm font-rajdhani font-bold uppercase tracking-wider text-gray-400 mb-3">
                        Breakdown by NFT
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {projections.breakdown.map(item => (
                            <div key={item.id} className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-mono text-sm">#{item.id}</span>
                                    <RarityBadge rarity={item.rarity} size="sm" showGlow={false} />
                                </div>
                                <span className="text-primary font-orbitron font-bold">
                                    +{item.daily} $RIFT/day
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Multiplier Info */}
            <div className="mt-4 text-xs text-gray-500 font-rajdhani">
                <p>Base rate: {BASE_RATE} $RIFT/day per NFT</p>
                <p className="mt-1">
                    Multipliers: Common (1x), Rare (1.5x), Epic (2x), Legendary (3x), Mythic (5x)
                </p>
            </div>
        </motion.div>
    );
}

function ProjectionCard({
    icon,
    label,
    value,
    color,
    highlight = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`p-3 rounded-xl border ${
                highlight
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-white/5 border-white/10'
            }`}
        >
            <div className={`${color} mb-2`}>{icon}</div>
            <div className={`text-xl font-orbitron font-bold ${highlight ? 'text-yellow-400' : 'text-white'}`}>
                {value.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-400 font-rajdhani uppercase tracking-wider">
                $RIFT / {label}
            </div>
        </div>
    );
}
