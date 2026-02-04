'use client';

import { Container } from '@/components/layout/Container';
import { motion } from 'framer-motion';

const recentMints = [
    { id: 9843, user: '0x12...5678', time: '2 min ago' },
    { id: 9844, user: '0xAB...CD90', time: '2 min ago' },
    { id: 9845, user: '0x99...1122', time: '3 min ago' },
    { id: 9846, user: '0x44...5566', time: '5 min ago' },
    { id: 9847, user: '0x77...8899', time: '7 min ago' },
];

export function RecentlyMinted() {
    return (
        <section className="py-12 border-t border-white/5 bg-black/40">
            <Container>
                <h3 className="text-xl font-rajdhani font-bold text-white mb-6">Recently Minted</h3>
                <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                    {recentMints.map((mint, i) => (
                        <motion.div
                            key={mint.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="min-w-[200px] bg-white/5 border border-white/5 p-4 rounded-lg flex flex-col gap-2 hover:border-primary/30 transition-colors"
                        >
                            <div className="flex justify-between items-center text-primary font-orbitron font-bold">
                                <span>#{mint.id}</span>
                                <span className="text-xs px-2 py-0.5 bg-primary/10 rounded text-primary">Minted</span>
                            </div>
                            <div className="text-sm text-gray-400 font-mono">{mint.user}</div>
                            <div className="text-xs text-gray-600">{mint.time}</div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
