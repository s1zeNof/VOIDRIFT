'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Info, Eye, Loader2 } from 'lucide-react';
import { getTokenMetadataUrl, ipfsToHttp } from '@/lib/contracts';

interface MintPreviewProps {
    startId: number;
    quantity: number;
}

interface PreviewData {
    name: string;
    species: string;
    rarity: string;
    image: string;
    attributes: { trait_type: string; value: string | number }[];
}

function getRarityBorderColor(rarity: string): string {
    switch (rarity) {
        case 'Common': return 'border-gray-500/30';
        case 'Uncommon': return 'border-green-400/50';
        case 'Rare': return 'border-blue-400/50';
        case 'Epic': return 'border-purple-500/50';
        case 'Legendary': return 'border-yellow-500/50';
        case 'Mythic': return 'border-red-500/50';
        default: return 'border-gray-500/30';
    }
}

function getRarityBadgeColor(rarity: string): string {
    switch (rarity) {
        case 'Common': return 'bg-gray-500/20 text-gray-300 border border-gray-500/50';
        case 'Uncommon': return 'bg-green-500/20 text-green-200 border border-green-400/50';
        case 'Rare': return 'bg-blue-500/20 text-blue-200 border border-blue-400/50';
        case 'Epic': return 'bg-purple-500/20 text-purple-200 border border-purple-500/50';
        case 'Legendary': return 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/50';
        case 'Mythic': return 'bg-red-500/20 text-red-200 border border-red-500/50';
        default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/50';
    }
}

export function MintPreview({ startId, quantity }: MintPreviewProps) {
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    // Fetch actual IPFS metadata for the next token to be minted
    useEffect(() => {
        async function fetchPreview() {
            setIsLoading(true);
            try {
                const url = getTokenMetadataUrl(startId);
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    const species = data.attributes?.find((a: { trait_type: string }) => a.trait_type === 'Species')?.value || 'Unknown';
                    const rarity = data.attributes?.find((a: { trait_type: string }) => a.trait_type === 'Rarity')?.value || 'Common';
                    setPreviewData({
                        name: data.name || `Riftwalker #${startId}`,
                        species,
                        rarity,
                        image: ipfsToHttp(data.image),
                        attributes: data.attributes || [],
                    });
                } else {
                    // Fallback: show a generic preview
                    setPreviewData({
                        name: `Riftwalker #${startId}`,
                        species: '???',
                        rarity: 'Unknown',
                        image: '/birds/owl_1.png',
                        attributes: [
                            { trait_type: 'Species', value: '???' },
                            { trait_type: 'Rarity', value: 'TBD' },
                        ],
                    });
                }
            } catch {
                setPreviewData({
                    name: `Riftwalker #${startId}`,
                    species: '???',
                    rarity: 'Unknown',
                    image: '/birds/owl_1.png',
                    attributes: [],
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchPreview();
    }, [startId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (!previewData) return null;

    const borderColor = getRarityBorderColor(previewData.rarity);
    const badgeColor = getRarityBadgeColor(previewData.rarity);

    return (
        <div className="space-y-4">
            {/* Info Banner */}
            <div className="flex items-start gap-2 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <Sparkles className="text-cyan-400 flex-shrink-0 mt-0.5" size={16} />
                <div className="text-xs text-cyan-200">
                    <strong>Genesis Collection</strong> — {previewData.species} ({previewData.rarity}). 222 total supply!
                </div>
            </div>

            {/* NFT Preview */}
            <motion.div
                className={`relative rounded-2xl overflow-hidden border-2 ${borderColor} bg-black/40 backdrop-blur-sm group`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Glow Effect for Legendary */}
                {previewData.rarity === 'Legendary' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 animate-pulse z-0" />
                )}

                {/* Bird Image */}
                <div className="aspect-square relative bg-black overflow-hidden cursor-pointer">
                    <img
                        src={previewData.image}
                        alt={previewData.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20 pointer-events-none" />

                    {/* Rarity Badge Overlay */}
                    <div className="absolute top-3 right-3 z-30">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-rajdhani font-bold uppercase ${badgeColor}`}>
                            {previewData.rarity}
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
                            {previewData.species}
                        </span>
                        <span className="text-sm text-gray-400 font-mono">
                            #{startId}
                        </span>
                    </div>

                    {/* Traits from IPFS */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                        {previewData.attributes.slice(0, 4).map((attr, i) => (
                            <div key={i} className="text-xs">
                                <span className="text-gray-500">{attr.trait_type}:</span>
                                <span className="text-white ml-1">{String(attr.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Minting Info */}
            <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                <Info size={12} />
                <span>You will receive this exact NFT when you mint</span>
            </div>
        </div>
    );
}
