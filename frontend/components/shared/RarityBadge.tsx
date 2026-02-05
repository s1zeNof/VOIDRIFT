'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { COLLECTION_CONFIG } from '@/lib/nftUtils';

interface RarityBadgeProps {
    rarity: string;
    size?: 'sm' | 'md' | 'lg';
    showGlow?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
};

const rarityStyles: Record<string, { border: string; bg: string; text: string; glow: string }> = {
    Common: {
        border: 'border-gray-500',
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        glow: '',
    },
    Rare: {
        border: 'border-blue-500',
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        glow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)]',
    },
    Epic: {
        border: 'border-purple-500',
        bg: 'bg-purple-500/20',
        text: 'text-purple-400',
        glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]',
    },
    Legendary: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]',
    },
    Mythic: {
        border: 'border-pink-500',
        bg: 'bg-pink-500/20',
        text: 'text-pink-400',
        glow: 'shadow-[0_0_25px_rgba(236,72,153,0.6)]',
    },
};

export function RarityBadge({ rarity, size = 'md', showGlow = true, className }: RarityBadgeProps) {
    const styles = rarityStyles[rarity] || rarityStyles.Common;
    const color = COLLECTION_CONFIG.rarityColors[rarity as keyof typeof COLLECTION_CONFIG.rarityColors] || '#9ca3af';

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                'inline-flex items-center font-rajdhani font-bold uppercase tracking-wider rounded border',
                sizeClasses[size],
                styles.border,
                styles.bg,
                styles.text,
                showGlow && styles.glow,
                className
            )}
            style={{
                textShadow: showGlow ? `0 0 8px ${color}` : undefined,
            }}
        >
            {rarity}
        </motion.span>
    );
}

export function RarityDot({ rarity, size = 8 }: { rarity: string; size?: number }) {
    const color = COLLECTION_CONFIG.rarityColors[rarity as keyof typeof COLLECTION_CONFIG.rarityColors] || '#9ca3af';
    const styles = rarityStyles[rarity] || rarityStyles.Common;

    return (
        <span
            className={cn('inline-block rounded-full', styles.glow)}
            style={{
                width: size,
                height: size,
                backgroundColor: color,
            }}
        />
    );
}
