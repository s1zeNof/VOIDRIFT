'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface NFTCardProps {
    id: number;
    image?: string;
    name?: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
    isStaked?: boolean;
    onAction?: () => void;
    actionLabel?: string;
    actionLoading?: boolean;
}

const rarityColors = {
    Common: 'border-gray-500 text-gray-500',
    Rare: 'border-blue-500 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
    Epic: 'border-purple-500 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    Legendary: 'border-yellow-500 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]',
    Mythic: 'border-pink-500 text-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.6)]',
};

export function NFTCard({ id, rarity, isStaked, onAction, actionLabel, actionLoading }: NFTCardProps) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className={cn(
                "bg-card rounded-xl overflow-hidden border transition-all duration-300 relative group",
                rarityColors[rarity]
            )}
        >
            <div className="aspect-square bg-black/50 relative overflow-hidden">
                {/* Placeholder for NFT Image - in real app use next/image */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center">
                    <span className="font-orbitron text-4xl opacity-20">#{id}</span>
                </div>

                {/* Chips */}
                <div className="absolute top-2 right-2 flex gap-2">
                    <span className={cn("px-2 py-0.5 text-xs font-bold rounded bg-black/80 border", rarityColors[rarity])}>
                        {rarity}
                    </span>
                    {isStaked && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded bg-primary/20 text-primary border border-primary/50">
                            Staked
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div>
                    <h3 className="font-orbitron font-bold text-white text-lg">Riftwalker #{id}</h3>
                    <p className="font-rajdhani text-sm text-gray-400">Gen 1</p>
                </div>

                {onAction && (
                    <button
                        onClick={onAction}
                        disabled={actionLoading}
                        className={cn(
                            "w-full py-2 rounded-lg font-bold font-rajdhani transition-all border cursor-pointer",
                            actionLoading && "opacity-50 cursor-not-allowed",
                            isStaked
                                ? "bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20"
                                : "bg-primary/10 border-primary/50 text-primary hover:bg-primary/20"
                        )}
                    >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : actionLabel}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
