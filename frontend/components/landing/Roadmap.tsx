'use client';

import { Container } from '@/components/layout/Container';
import { motion } from 'framer-motion';

const roadmapPhases = [
    {
        phase: 'Phase 1',
        title: 'Genesis Launch',
        items: ['10,000 NFTs minted', 'Community building', 'Whitelist distribution'],
        done: true,
    },
    {
        phase: 'Phase 2',
        title: 'Staking Activation',
        items: ['RIFT token deployment', 'Staking pool launch', 'Daily rewards system'],
        done: false,
    },
    {
        phase: 'Phase 3',
        title: 'Utility Expansion',
        items: ['Metaverse integration', 'Exclusive merchandise', 'DAO governance'],
        done: false,
    },
    {
        phase: 'Phase 4',
        title: 'The Riftverse',
        items: ['Play-to-earn game', 'Cross-chain bridge', 'Multiverse expansion'],
        done: false,
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
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

                    <div className="space-y-12">
                        {roadmapPhases.map((phase, index) => (
                            <motion.div
                                key={phase.phase}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                <div className="flex-1" />

                                {/* Center Point */}
                                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-4 border-primary z-10 flex items-center justify-center">
                                    <div className={`w-3 h-3 rounded-full ${phase.done ? 'bg-primary' : 'bg-gray-600'}`} />
                                </div>

                                <div className="flex-1 pl-12 md:pl-0">
                                    <div className={`bg-white/5 border border-white/5 p-8 rounded-xl backdrop-blur-sm hover:border-primary/30 transition-colors ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                                        }`}>
                                        <span className="text-primary font-orbitron font-bold text-sm tracking-widest mb-2 block">
                                            {phase.phase}
                                        </span>
                                        <h3 className="text-2xl font-rajdhani font-bold text-white mb-4">
                                            {phase.title}
                                        </h3>
                                        <ul className="space-y-2">
                                            {phase.items.map((item, i) => (
                                                <li key={i} className="flex items-center text-gray-400">
                                                    <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
