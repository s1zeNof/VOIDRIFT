'use client';

import { useState } from 'react';
import { NFTCard } from '@/components/nft/NFTCard';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Mock Data
const walletNFTs = [
    { id: 9012, rarity: 'Common' as const },
    { id: 3456, rarity: 'Legendary' as const },
];

const stakedNFTs = [
    { id: 1234, rarity: 'Rare' as const },
    { id: 5678, rarity: 'Epic' as const },
    { id: 1122, rarity: 'Common' as const },
];

export function StakingGrid() {
    const [activeTab, setActiveTab] = useState<'wallet' | 'staked'>('wallet');
    const [actioningIds, setActioningIds] = useState<number[]>([]);

    const handleAction = async (id: number, action: 'stake' | 'unstake') => {
        setActioningIds(prev => [...prev, id]);

        try {
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success(`Successfully ${action}d NFT #${id}`);
            // In real app: refetch data / update list
        } catch (error) {
            toast.error(`Failed to ${action} NFT`);
        } finally {
            setActioningIds(prev => prev.filter(i => i !== id));
        }
    };

    const nfts = activeTab === 'wallet' ? walletNFTs : stakedNFTs;

    return (
        <div className="flex-1">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-white/5 p-1 rounded-lg w-fit">
                {['wallet', 'staked'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-2 rounded-md font-rajdhani font-bold transition-all cursor-pointer ${activeTab === tab
                            ? 'bg-primary text-black shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'wallet' ? walletNFTs.length : stakedNFTs.length})
                    </button>
                ))}
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {nfts.map((nft) => (
                    <NFTCard
                        key={nft.id}
                        id={nft.id}
                        rarity={nft.rarity}
                        isStaked={activeTab === 'staked'}
                        actionLabel={activeTab === 'wallet' ? 'Stake NFT' : 'Unstake'}
                        actionLoading={actioningIds.includes(nft.id)}
                        onAction={() => handleAction(nft.id, activeTab === 'wallet' ? 'stake' : 'unstake')}
                    />
                ))}
            </motion.div>
        </div>
    );
}
