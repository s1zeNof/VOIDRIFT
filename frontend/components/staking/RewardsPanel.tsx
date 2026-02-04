'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function RewardsPanel() {
    const rewards = 1250.50;
    const usdValue = 125.05;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-6 rounded-xl backdrop-blur-sm h-fit sticky top-24"
        >
            <h3 className="font-orbitron font-bold text-xl text-white mb-6">Claimable Rewards</h3>

            <div className="mb-8">
                <div className="text-4xl font-bold text-white font-orbitron mb-2">
                    {rewards.toFixed(2)} <span className="text-primary text-2xl">RIFT</span>
                </div>
                <div className="text-gray-400 font-rajdhani">≈ ${usdValue.toFixed(2)} USD</div>
            </div>

            <button className="w-full py-3 bg-primary hover:bg-primary/90 text-black font-bold font-orbitron rounded-lg transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] mb-6">
                Claim All Rewards
            </button>

            <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Recent Claims</h4>
                <div className="space-y-3">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                            <span className="text-white font-mono">250.50 RIFT</span>
                            <span className="text-gray-500">{i * 2 + 2} days ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
