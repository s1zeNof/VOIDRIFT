'use client';

import { motion } from 'framer-motion';
import { generateTraits, getEnabledNFTs, getMaxSupply, getRarityColor } from '@/lib/nftUtils';
import { Sparkles, Info } from 'lucide-react';

interface MintPreviewProps {
    startId: number;
    quantity: number;
}

function getRarityBorderColor(rarity: string): string {
    switch (rarity) {
        case 'Common':
            return 'border-gray-500/30';
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
    const enabledNfts = getEnabledNFTs();
    const maxSupply = getMaxSupply();

    // For MVP: Show the single enabled NFT
    if (enabledNfts.length === 1) {
        const nft = enabledNfts[0];
        const traits = generateTraits(String(nft.id));
        const borderColor = getRarityBorderColor(traits.rarity);
        const badgeColor = getRarityBadgeColor(traits.rarity);

        return (
            <div className="space-y-4">
                {/* MVP Info Banner */}
                <div className="flex items-start gap-2 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <Sparkles className="text-cyan-400 flex-shrink-0 mt-0.5" size={16} />
                    <div className="text-xs text-cyan-200">
                        <strong>Genesis Collection MVP</strong> — Limited edition {traits.species}. Only {maxSupply} available!
                    </div>
                </div>

                {/* Single NFT Preview */}
                <motion.div
                    className={`relative rounded-2xl overflow-hidden border-2 ${borderColor} bg-black/40 backdrop-blur-sm`}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Glow Effect for Legendary */}
                    {traits.rarity === 'Legendary' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 animate-pulse" />
                    )}

                    {/* Bird Image */}
                    <div className="aspect-square relative bg-gradient-to-br from-gray-900 to-black">
                        <img
                            src={traits.image}
                            alt={traits.name}
                            className="w-full h-full object-cover"
                        />

                        {/* Rarity Badge Overlay */}
                        <div className="absolute top-3 right-3">
                            <span className={`text-xs px-3 py-1.5 rounded-full font-rajdhani font-bold uppercase ${badgeColor}`}>
                                {traits.rarity}
                            </span>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-4 space-y-2 bg-gradient-to-b from-black/60 to-black/90">
                        <div className="flex justify-between items-center">
                            <span className="font-orbitron text-white font-bold text-lg">
                                {traits.species}
                            </span>
                            <span className="text-sm text-gray-400 font-mono">
                                #{nft.id}
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
                    <span>You will receive this exact NFT</span>
                </div>
            </div>
        );
    }

    // For future: Multiple NFTs available
    const previewIds = Array.from({ length: Math.min(quantity, enabledNfts.length) }, (_, i) =>
        enabledNfts[i]?.id || 1
    );

    const gridCols = quantity === 1 ? 'grid-cols-1' : 'grid-cols-2';

    return (
        <div className="space-y-4">
            {quantity > enabledNfts.length && (
                <p className="text-sm text-gray-400 text-center">
                    Showing {enabledNfts.length} available NFTs
                </p>
            )}

            <div className={`grid ${gridCols} gap-4 max-h-[600px] overflow-y-auto pr-2`}>
                {previewIds.map((tokenId, index) => {
                    const traits = generateTraits(String(tokenId));
                    const borderColor = getRarityBorderColor(traits.rarity);
                    const badgeColor = getRarityBadgeColor(traits.rarity);

                    return (
                        <motion.div
                            key={tokenId}
                            className={`relative rounded-xl overflow-hidden border-2 ${borderColor} bg-black/40 backdrop-blur-sm hover:scale-[1.02] transition-transform`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            {/* Bird Image */}
                            <div className="aspect-square relative bg-gradient-to-br from-gray-900 to-black">
                                <img
                                    src={traits.image}
                                    alt={traits.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Rarity Badge Overlay */}
                                <div className="absolute top-2 right-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-rajdhani font-bold uppercase ${badgeColor}`}>
                                        {traits.rarity}
                                    </span>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="p-3 space-y-1 bg-gradient-to-b from-black/60 to-black/80">
                                <div className="flex justify-between items-center">
                                    <span className="font-orbitron text-white font-bold text-sm">
                                        {traits.species}
                                    </span>
                                    <span className="text-xs text-gray-500 font-mono">
                                        #{tokenId}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
