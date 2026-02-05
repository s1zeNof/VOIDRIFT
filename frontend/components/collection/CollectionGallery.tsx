'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ALL_SPECIES_PREVIEW, generateTraits, getRarityColor } from '@/lib/nftUtils';
import { NFTDetailModal } from './NFTDetailModal';
import { RarityBadge } from '@/components/shared/RarityBadge';

interface CollectionGalleryProps {
    selectedRarities?: string[];
}

export function CollectionGallery({ selectedRarities = [] }: CollectionGalleryProps) {
    // Track hover state for video playback
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [selectedNFT, setSelectedNFT] = useState<any>(null);

    // Filter items by rarity
    const filteredItems = useMemo(() => {
        if (selectedRarities.length === 0) return ALL_SPECIES_PREVIEW;
        return ALL_SPECIES_PREVIEW.filter(item => selectedRarities.includes(item.rarity));
    }, [selectedRarities]);

    if (filteredItems.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400 font-rajdhani text-lg">
                    No Riftbirds match the selected filters.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((previewItem, index) => {
                    const id = previewItem.id;
                    const traits = generateTraits(id);
                    const isHovered = hoveredId === id;

                    // Color based on rarity
                    let borderColor = 'border-white/10';
                    let shadowColor = 'shadow-none';
                    let titleColor = 'text-white';

                    if (traits.rarity === 'Common') {
                        borderColor = 'border-gray-500/30';
                    } else if (traits.rarity === 'Rare') {
                        borderColor = 'border-blue-400/50';
                        titleColor = 'text-blue-200';
                    } else if (traits.rarity === 'Epic') {
                        borderColor = 'border-purple-500/50';
                        shadowColor = 'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]';
                        titleColor = 'text-purple-200';
                    } else if (traits.rarity === 'Legendary') {
                        borderColor = 'border-yellow-500/50';
                        shadowColor = 'hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]';
                        titleColor = 'text-yellow-200';
                    } else if (traits.rarity === 'Mythic') {
                        borderColor = 'border-pink-500/50';
                        shadowColor = 'hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]';
                        titleColor = 'text-pink-200';
                    }

                    return (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className={`group relative bg-black/60 border ${borderColor} rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] ${shadowColor}`}
                            onMouseEnter={() => setHoveredId(id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => setSelectedNFT({ id, ...traits, isStaked: false })}
                        >
                            {/* Image/Video Container */}
                            <div
                                className="aspect-square relative bg-gradient-to-br from-gray-900 to-black overflow-hidden"
                                onClick={() => setHoveredId(isHovered ? null : id)} // Toggle on tap for mobile
                            >
                                {/* Base Image */}
                                <img
                                    src={traits.image}
                                    alt={traits.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Video on Hover/Tap */}
                                {isHovered && (
                                    <video
                                        src={traits.video}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="absolute inset-0 w-full h-full object-cover z-10 opacity-0 transition-opacity duration-300"
                                        onLoadedData={(e) => e.currentTarget.classList.remove('opacity-0')}
                                        onError={(e) => {
                                            // Fallback: hide video if it fails to load
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}

                                {/* Rarity Badge - Top Right */}
                                <div className="absolute top-3 right-3 z-20">
                                    <RarityBadge rarity={traits.rarity} size="sm" />
                                </div>

                                {/* Info Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent pt-10 z-20 pointer-events-none">
                                    <h3 className={`font-orbitron font-bold text-lg ${titleColor}`}>
                                        {traits.species}
                                    </h3>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs font-rajdhani uppercase tracking-wider text-gray-400">
                                            Type {(Number(id) % 2 === 0 ? 1 : 2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <NFTDetailModal
                nft={selectedNFT}
                isOpen={!!selectedNFT}
                onClose={() => setSelectedNFT(null)}
            />
        </>
    );
}
