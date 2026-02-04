'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Shield, Zap, Sword, Eye } from 'lucide-react';
import Image from 'next/image';

interface NFTDetailModalProps {
    nft: any;
    isOpen: boolean;
    onClose: () => void;
}

export function NFTDetailModal({ nft, isOpen, onClose }: NFTDetailModalProps) {
    const [isHovered, setIsHovered] = useState(false);

    if (!isOpen || !nft) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[95vh] bg-[#0F1435] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Scrollable Content Wrapper for Mobile */}
                    <div className="flex flex-col md:flex-row overflow-y-auto">
                        {/* Image Section */}
                        <div
                            className="w-full md:w-1/2 aspect-square bg-black/50 relative cursor-pointer group flex-shrink-0"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                                <span className="font-orbitron text-6xl opacity-20">#{nft.id}</span>
                            </div>

                            {/* Static Image */}
                            {nft.image && (
                                <img
                                    src={nft.image}
                                    alt={`Riftwalker #${nft.id}`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    style={nft.hue ? { filter: `hue-rotate(${nft.hue}deg) brightness(${1 + (Number(nft.id) % 3) * 0.1})` } : undefined}
                                />
                            )}

                            {/* Video on Hover */}
                            {isHovered && nft.video && (
                                <video
                                    src={nft.video}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover z-10 opacity-0 transition-opacity duration-300"
                                    onLoadedData={(e) => e.currentTarget.classList.remove('opacity-0')}
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                />
                            )}

                            {/* Hover Hint */}
                            {nft.video && (
                                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <span className="text-xs text-white font-rajdhani font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <Eye size={14} />
                                        Hover to animate
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded bg-black/50 border border-white/10 ${nft.rarity === 'Legendary' ? 'text-yellow-500 border-yellow-500/50' : 'text-gray-400'
                                        }`}>
                                        {nft.rarity}
                                    </span>
                                    {nft.isStaked && (
                                        <span className="px-2 py-0.5 text-xs font-bold rounded bg-primary/20 text-primary border border-primary/50">
                                            Staked
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-3xl font-orbitron font-bold text-white">Riftwalker #{nft.id}</h2>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Attributes</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {nft.attributes?.map((attr: any, i: number) => (
                                            <AttributeItem
                                                key={i}
                                                label={attr.trait_type}
                                                value={attr.value}
                                                percent={attr.percent || 10}
                                                icon={<Shield size={14} />}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {nft.isStaked && (
                                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                        <div className="text-sm text-primary font-bold mb-1">Staking Active</div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Accumulated Rewards:</span>
                                            <span className="text-white font-mono">120 RIFT</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 mt-6 border-t border-white/5 flex gap-4">
                                <a
                                    href="#"
                                    target="_blank"
                                    className="flex-1 py-3 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg text-white font-rajdhani font-bold transition-colors"
                                >
                                    View on Opensea <ExternalLink size={16} />
                                </a>
                                <a
                                    href="#"
                                    target="_blank"
                                    className="flex-1 py-3 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg text-white font-rajdhani font-bold transition-colors"
                                >
                                    Etherscan <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function AttributeItem({ label, value, percent, icon }: any) {
    return (
        <div className="bg-white/5 border border-white/5 rounded p-3 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                {icon}
                <span>{label}</span>
            </div>
            <div className="flex justify-between items-end">
                <span className="text-white font-rajdhani font-medium">{value}</span>
                <span className="text-xs text-gray-500">{percent}%</span>
            </div>
        </div>
    );
}
