'use client';

import { motion } from 'framer-motion';
import { Users, Gem, RefreshCw, Loader2 } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { LeaderboardRow } from './LeaderboardRow';

export function LeaderboardTable() {
    const { leaderboard, isLoading, error, refresh, totalHolders, totalMinted } = useLeaderboard();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-gray-400 font-rajdhani">Loading leaderboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-400 font-rajdhani mb-4">{error}</p>
                <button
                    onClick={refresh}
                    className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors font-rajdhani"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Bar */}
            <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
                <div className="flex gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                    >
                        <Users className="w-5 h-5 text-primary" />
                        <span className="text-gray-400 font-rajdhani">
                            <span className="text-white font-bold">{totalHolders}</span> Holders
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-2"
                    >
                        <Gem className="w-5 h-5 text-secondary" />
                        <span className="text-gray-400 font-rajdhani">
                            <span className="text-white font-bold">{totalMinted}</span> Minted
                        </span>
                    </motion.div>
                </div>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={refresh}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/30 rounded-lg transition-all font-rajdhani"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </motion.button>
            </div>

            {/* Leaderboard */}
            {leaderboard.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 font-rajdhani text-lg">
                        No collectors yet. Be the first to mint!
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {leaderboard.map((entry, index) => (
                        <LeaderboardRow key={entry.address} entry={entry} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}
