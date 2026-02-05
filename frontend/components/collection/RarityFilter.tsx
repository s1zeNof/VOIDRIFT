'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { RARITY_ORDER, COLLECTION_CONFIG } from '@/lib/nftUtils';

interface RarityFilterProps {
    selectedRarities: string[];
    onSelectionChange: (rarities: string[]) => void;
    showCounts?: Record<string, number>;
}

export function RarityFilter({ selectedRarities, onSelectionChange, showCounts }: RarityFilterProps) {
    const toggleRarity = (rarity: string) => {
        if (selectedRarities.includes(rarity)) {
            onSelectionChange(selectedRarities.filter(r => r !== rarity));
        } else {
            onSelectionChange([...selectedRarities, rarity]);
        }
    };

    const clearAll = () => {
        onSelectionChange([]);
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-rajdhani text-gray-400 mr-2">Rarity:</span>

            {RARITY_ORDER.map((rarity) => {
                const isSelected = selectedRarities.includes(rarity);
                const color = COLLECTION_CONFIG.rarityColors[rarity as keyof typeof COLLECTION_CONFIG.rarityColors];
                const count = showCounts?.[rarity];

                return (
                    <motion.button
                        key={rarity}
                        onClick={() => toggleRarity(rarity)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            'px-3 py-1.5 rounded-lg font-rajdhani font-bold text-sm transition-all duration-200 border',
                            isSelected
                                ? 'border-opacity-100 bg-opacity-30'
                                : 'border-opacity-30 bg-opacity-10 opacity-60 hover:opacity-100'
                        )}
                        style={{
                            borderColor: color,
                            backgroundColor: isSelected ? `${color}30` : `${color}10`,
                            color: color,
                            boxShadow: isSelected ? `0 0 15px ${color}40` : 'none',
                        }}
                    >
                        {rarity}
                        {count !== undefined && (
                            <span className="ml-1.5 text-xs opacity-70">({count})</span>
                        )}
                    </motion.button>
                );
            })}

            {selectedRarities.length > 0 && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={clearAll}
                    className="px-3 py-1.5 rounded-lg font-rajdhani font-medium text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/30 transition-all ml-2"
                >
                    Clear
                </motion.button>
            )}
        </div>
    );
}

// Compact version for tight spaces
export function RarityFilterCompact({ selectedRarities, onSelectionChange }: RarityFilterProps) {
    const toggleRarity = (rarity: string) => {
        if (selectedRarities.includes(rarity)) {
            onSelectionChange(selectedRarities.filter(r => r !== rarity));
        } else {
            onSelectionChange([...selectedRarities, rarity]);
        }
    };

    return (
        <div className="flex gap-1">
            {RARITY_ORDER.map((rarity) => {
                const isSelected = selectedRarities.includes(rarity);
                const color = COLLECTION_CONFIG.rarityColors[rarity as keyof typeof COLLECTION_CONFIG.rarityColors];

                return (
                    <button
                        key={rarity}
                        onClick={() => toggleRarity(rarity)}
                        className={cn(
                            'w-6 h-6 rounded-full transition-all duration-200 border-2',
                            isSelected ? 'scale-110' : 'opacity-40 hover:opacity-70'
                        )}
                        style={{
                            borderColor: color,
                            backgroundColor: isSelected ? color : 'transparent',
                            boxShadow: isSelected ? `0 0 10px ${color}` : 'none',
                        }}
                        title={rarity}
                    />
                );
            })}
        </div>
    );
}
