'use client';

import { Container } from '@/components/layout/Container';
import { ParticleBackground } from '@/components/animations/ParticleBackground';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen flex flex-col pt-24 pb-12 relative">
            <ParticleBackground />
            <Container>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white">
                            Leaderboard
                        </h1>
                    </div>
                    <p className="text-gray-400 font-inter max-w-2xl">
                        Top Riftbird collectors ranked by collection size and rarity score.
                        Early adopters who minted first receive a special badge!
                    </p>
                </motion.div>

                {/* Legend */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-4 mb-8 p-4 bg-white/5 rounded-xl border border-white/10"
                >
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-gray-400 font-rajdhani">1st Place</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full bg-gray-400" />
                        <span className="text-gray-400 font-rajdhani">2nd Place</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full bg-amber-600" />
                        <span className="text-gray-400 font-rajdhani">3rd Place</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-0.5 text-[10px] font-rajdhani font-bold uppercase bg-primary/20 text-primary border border-primary/30 rounded-full">
                            Early Adopter
                        </span>
                        <span className="text-gray-400 font-rajdhani">First 20 minters</span>
                    </div>
                </motion.div>

                {/* Leaderboard Table */}
                <LeaderboardTable />
            </Container>
        </div>
    );
}
