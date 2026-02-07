'use client';

import { Container } from '@/components/layout/Container';
import { motion } from 'framer-motion';
import { Lock, Zap, Sparkles, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StakingPage() {
    return (
        <div className="min-h-screen pt-28 pb-20">
            <Container>
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-rajdhani mb-6">
                            <Clock size={16} />
                            Coming in Phase 4
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-orbitron font-bold text-white mb-4">
                            Void Expedition
                        </h1>
                        <p className="text-gray-400 font-rajdhani text-lg max-w-xl mx-auto">
                            Send your Riftwalkers into the unknown to gather $RIFT tokens.
                            Staking will be available after mainnet launch.
                        </p>
                    </motion.div>

                    {/* Feature Preview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-2xl p-6"
                        >
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Lock size={24} className="text-purple-400" />
                            </div>
                            <h3 className="text-lg font-orbitron font-bold text-white mb-2">Stake NFTs</h3>
                            <p className="text-gray-500 text-sm font-rajdhani">
                                Lock your Riftwalkers in the Void to earn passive rewards while they continue to evolve.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-cyan-900/20 to-transparent border border-cyan-500/20 rounded-2xl p-6"
                        >
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Zap size={24} className="text-cyan-400" />
                            </div>
                            <h3 className="text-lg font-orbitron font-bold text-white mb-2">Earn $RIFT</h3>
                            <p className="text-gray-500 text-sm font-rajdhani">
                                Accumulate $RIFT tokens daily based on the rarity and evolution stage of your NFTs.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-yellow-900/20 to-transparent border border-yellow-500/20 rounded-2xl p-6"
                        >
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Sparkles size={24} className="text-yellow-400" />
                            </div>
                            <h3 className="text-lg font-orbitron font-bold text-white mb-2">Bonus Rewards</h3>
                            <p className="text-gray-500 text-sm font-rajdhani">
                                Early stakers and large flock holders receive multiplied rewards and exclusive benefits.
                            </p>
                        </motion.div>
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-cyan-900/30 border border-white/10 rounded-3xl p-8 md:p-12 text-center"
                    >
                        <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
                            Get Ready for Staking
                        </h2>
                        <p className="text-gray-400 font-rajdhani mb-8 max-w-lg mx-auto">
                            Build your flock now during the testnet phase. The more Riftwalkers you have,
                            the more $RIFT you'll earn when staking goes live.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/mint"
                                className="px-8 py-3 bg-gradient-to-r from-primary to-cyan-400 text-black font-rajdhani font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                <Zap size={18} />
                                Mint Riftwalkers
                            </Link>
                            <Link
                                href="/profile"
                                className="px-8 py-3 bg-white/5 border border-white/10 text-white font-rajdhani font-bold rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                            >
                                View Collection
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Roadmap Reminder */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-gray-500 text-sm font-rajdhani">
                            Check our{' '}
                            <Link href="/#roadmap" className="text-primary hover:underline">
                                Roadmap
                            </Link>
                            {' '}to track staking development progress.
                        </p>
                    </motion.div>
                </div>
            </Container>
        </div>
    );
}
