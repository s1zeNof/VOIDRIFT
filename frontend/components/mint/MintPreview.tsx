'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateTraits, getMaxSupply, getRarityColor } from '@/lib/nftUtils';
import { Sparkles, Info, Eye } from 'lucide-react';

interface MintPreviewProps {
    startId: number;
    quantity: number;
}

function getRarityBorderColor(rarity: string): string {
    switch (rarity) {
        case 'Common':
            return 'border-gray-500/30';
        case 'Uncommon':
            return 'border-green-400/50';
        case 'Rare':
            return 'border-blue-400/50';
        case 'Epic':
            return 'border-purple-500/50';
        case 'Legendary':
            return 'border-yellow-500/50';
        case 'Mythic':
            return 'border-red-500/50';
        default:
            return 'border-gray-500/30';
    }
}

function getRarityBadgeColor(rarity: string): string {
    switch (rarity) {
        case 'Common':
            return 'bg-gray-500/20 text-gray-300 border border-gray-500/50';
        case 'Uncommon':
            return 'bg-green-500/20 text-green-200 border border-green-400/50';
        case 'Rare':
            return 'bg-blue-500/20 text-blue-200 border border-blue-400/50';
        case 'Epic':
            return 'bg-purple-500/20 text-purple-200 border border-purple-500/50';
        case 'Legendary':
            return 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/50';
        case 'Mythic':
            return 'bg-red-500/20 text-red-200 border border-red-500/50';
        default:
            return 'bg-gray-500/20 text-gray-300 border border-gray-500/50';
    }
}

export function MintPreview({ startId, quantity }: MintPreviewProps) {
    const maxSupply = getMaxSupply();
    const [isHovered, setIsHovered] = useState(false);

    // Show preview of the next token(s) that will be minted
    const nextTokenId = startId;
    const traits = generateTraits(String(nextTokenId));
    const borderColor = getRarityBorderColor(traits.rarity);
    const badgeColor = getRarityBadgeColor(traits.rarity);

    // Single NFT preview (most common case)
    if (quantity === 1) {
        return (
            <div className="space-y-4">
                {/* Info Banner */}
                <div className="flex items-start gap-2 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <Sparkles className="text-cyan-400 flex-shrink-0 mt-0.5" size={16} />
                    <div className="text-xs text-cyan-200">
                        <strong>Your Next Birds</strong> — Preview what you'll receive. Only {maxSupply} total available!
                    </div>
                </div>

                {/* Single NFT Preview */}
                <motion.div
                    className={`relative rounded-2xl overflow-hidden border-2 ${borderColor} bg-black/40 backdrop-blur-sm group`}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Glow Effect for Legendary */}
                    {traits.rarity === 'Legendary' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 animate-pulse z-0" />
                    )}

                    {/* Bird Image */}
                    <div className="aspect-square relative bg-black overflow-hidden cursor-pointer">
                        <img
                            src={traits.image}
                            alt={traits.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20 pointer-events-none" />

                        {/* Rarity Badge Overlay */}
                        <div className="absolute top-3 right-3 z-30">
                            <span className={`text-xs px-3 py-1.5 rounded-full font-rajdhani font-bold uppercase ${badgeColor}`}>
                                {traits.rarity}
                            </span>
                        </div>

                        {/* Token ID */}
                        <div className="absolute top-3 left-3 z-30">
                            <span className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/80 font-mono">
                                #{nextTokenId}
                            </span>
                        </div>

                        {/* Hover hint */}
                        <div className="absolute bottom-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 text-xs text-white font-rajdhani font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Eye size={14} />
                                Preview
                            </span>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-4 space-y-2 bg-gradient-to-b from-black/60 to-black/90 relative z-10">
                        <div className="flex justify-between items-center">
                            <span className="font-orbitron text-white font-bold text-lg">
                                {traits.name}
                            </span>
                            <span className="text-sm text-gray-400">
                                {traits.species}
                            </span>
                        </div>

                        {/* Traits */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                            {traits.attributes.slice(0, 4).map((attr, i) => (
                                <div key={i} className="text-xs">
                                    <span className="text-gray-500">{attr.trait_type}:</span>
                                    <span className="text-white ml-1">{attr.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Minting Info */}
                <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                    <Info size={12} />
                    <span>You will receive Riftwalker #{nextTokenId}</span>
                </div>
            </div>
        );
    }

    // Multiple NFTs preview
    const previewIds = Array.from({ length: quantity }, (_, i) => startId + i);
    const gridCols = quantity <= 2 ? 'grid-cols-2' : 'grid-cols-2';

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-2 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <Sparkles className="text-cyan-400 flex-shrink-0 mt-0.5" size={16} />
                <div className="text-xs text-cyan-200">
                    <strong>Batch Mint Preview</strong> — You'll receive {quantity} Riftwalkers!
                </div>
            </div>

            <div className={`grid ${gridCols} gap-4 max-h-[600px] overflow-y-auto pr-2`}>
                {previewIds.map((tokenId, index) => {
                    const nftTraits = generateTraits(String(tokenId));
                    const nftBorderColor = getRarityBorderColor(nftTraits.rarity);
                    const nftBadgeColor = getRarityBadgeColor(nftTraits.rarity);

                    return (
                        <motion.div
                            key={tokenId}
                            className={`relative rounded-xl overflow-hidden border-2 ${nftBorderColor} bg-black/40 backdrop-blur-sm hover:scale-[1.02] transition-transform`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            {/* Bird Image */}
                            <div className="aspect-square relative bg-gradient-to-br from-gray-900 to-black">
                                <img
                                    src={nftTraits.image}
                                    alt={nftTraits.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Rarity Badge */}
                                <div className="absolute top-2 right-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-rajdhani font-bold uppercase ${nftBadgeColor}`}>
                                        {nftTraits.rarity}
                                    </span>
                                </div>

                                {/* Token ID */}
                                <div className="absolute top-2 left-2">
                                    <span className="bg-black/70 px-1.5 py-0.5 rounded text-xs text-white/80 font-mono">
                                        #{tokenId}
                                    </span>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="p-3 space-y-1 bg-gradient-to-b from-black/60 to-black/80">
                                <div className="flex justify-between items-center">
                                    <span className="font-orbitron text-white font-bold text-sm">
                                        {nftTraits.species}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                <Info size={12} />
                <span>You will receive Riftwalkers #{startId} - #{startId + quantity - 1}</span>
            </div>
        </div>
    );
}
