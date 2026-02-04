'use client';

import { Container } from '@/components/layout/Container';
import { motion } from 'framer-motion';

const stats = [
    { label: 'Your Staked NFTs', value: '12 / 15', icon: '📦' },
    { label: 'Total Rewards', value: '1,250.50', suffix: 'RIFT', icon: '💎' },
    { label: 'Current APY', value: '125%', icon: '📈' },
    { label: 'Next Reward', value: '00:12:34', icon: '⏰' },
];

export function StakingPanel() {
    return (
        <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-orbitron font-bold text-white">{stat.value}</span>
                            {stat.suffix && <span className="text-sm font-bold text-primary">{stat.suffix}</span>}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
