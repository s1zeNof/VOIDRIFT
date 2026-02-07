'use client';

import { Container } from '@/components/layout/Container';
import { motion } from 'framer-motion';
import { Check, Circle, Clock, Rocket, Zap, Users, Gamepad2 } from 'lucide-react';

const roadmapPhases = [
    {
        phase: 'Phase 1',
        title: 'Testnet Launch',
        icon: Rocket,
        status: 'current',
        items: [
            { text: 'Smart contract deployed on Sepolia', done: true },
            { text: 'NFT metadata on IPFS (Pinata)', done: true },
            { text: 'Web3 frontend with wallet connect', done: true },
            { text: 'Free mint for testnet users', done: true },
            { text: 'Community testing & feedback', done: false },
        ],
    },
    {
        phase: 'Phase 2',
        title: 'Mainnet Preparation',
        icon: Zap,
        status: 'upcoming',
        items: [
            { text: 'Security audit of smart contracts', done: false },
            { text: 'Gas optimization for minting', done: false },
            { text: 'Base network deployment', done: false },
            { text: 'Whitelist mechanism activation', done: false },
            { text: 'Marketing & community growth', done: false },
        ],
    },
    {
        phase: 'Phase 3',
        title: 'Mainnet Launch',
        icon: Users,
        status: 'upcoming',
        items: [
            { text: 'Public mint on Base mainnet', done: false },
            { text: 'OpenSea & marketplace listings', done: false },
            { text: 'Holder verification system', done: false },
            { text: 'Exclusive holder Discord roles', done: false },
            { text: 'Secondary market royalties', done: false },
        ],
    },
    {
        phase: 'Phase 4',
        title: 'Evolution & Utility',
        icon: Gamepad2,
        status: 'upcoming',
        items: [
            { text: 'NFT evolution mechanics (Stage 2, 3)', done: false },
            { text: 'Staking rewards system', done: false },
            { text: 'Holder airdrops & benefits', done: false },
            { text: 'Community governance voting', done: false },
            { text: 'Future expansions TBA', done: false },
        ],
    },
];

export function Roadmap() {
    return (
        <section className="py-20 relative overflow-hidden">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4">
                        Roadmap
                    </h2>
                    <p className="text-gray-400 max-w-lg mx-auto font-rajdhani">
                        Our journey from testnet to a fully-fledged NFT ecosystem
                    </p>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-4" />
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-white/20 to-transparent -translate-x-1/2" />

                    <div className="space-y-12">
                        {roadmapPhases.map((phase, index) => {
                            const Icon = phase.icon;
                            const isActive = phase.status === 'current';
                            const completedItems = phase.items.filter(i => i.done).length;
                            const totalItems = phase.items.length;

                            return (
                                <motion.div
                                    key={phase.phase}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                >
                                    <div className="flex-1" />

                                    {/* Center Point */}
                                    <div className={`absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full z-10 flex items-center justify-center border-4 transition-all ${
                                        isActive
                                            ? 'bg-primary border-primary/50 shadow-[0_0_20px_rgba(0,255,255,0.5)]'
                                            : 'bg-background border-white/20'
                                    }`}>
                                        <Icon size={18} className={isActive ? 'text-black' : 'text-gray-500'} />
                                    </div>

                                    <div className="flex-1 pl-14 md:pl-0">
                                        <div className={`bg-white/5 border p-8 rounded-xl backdrop-blur-sm transition-all ${
                                            isActive
                                                ? 'border-primary/30 shadow-[0_0_30px_rgba(0,255,255,0.1)]'
                                                : 'border-white/5 hover:border-white/10'
                                        } ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>

                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`font-orbitron font-bold text-sm tracking-widest ${
                                                    isActive ? 'text-primary' : 'text-gray-500'
                                                }`}>
                                                    {phase.phase}
                                                </span>
                                                {isActive && (
                                                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full border border-primary/30 flex items-center gap-1">
                                                        <Clock size={12} />
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-2xl font-rajdhani font-bold text-white mb-4">
                                                {phase.title}
                                            </h3>

                                            {/* Progress bar for active phase */}
                                            {isActive && (
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                        <span>Progress</span>
                                                        <span>{completedItems}/{totalItems} completed</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all"
                                                            style={{ width: `${(completedItems / totalItems) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <ul className="space-y-2">
                                                {phase.items.map((item, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        {item.done ? (
                                                            <Check size={16} className="text-green-400 flex-shrink-0" />
                                                        ) : (
                                                            <Circle size={16} className="text-gray-600 flex-shrink-0" />
                                                        )}
                                                        <span className={item.done ? 'text-gray-300' : 'text-gray-500'}>
                                                            {item.text}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </section>
    );
}
