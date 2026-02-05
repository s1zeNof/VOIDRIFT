'use client';

import { motion } from 'framer-motion';
import { Sparkles, Rocket, Clock, ExternalLink } from 'lucide-react';

export function RiftTokenTeaser() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent"
        >
            {/* Animated background glow */}
            <div className="absolute inset-0 opacity-30">
                <motion.div
                    className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/30 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{ transform: 'translate(-50%, -50%)' }}
                />
            </div>

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <Sparkles className="w-8 h-8 text-primary" />
                    </motion.div>
                    <div>
                        <h3 className="text-2xl font-orbitron font-bold text-white">
                            $RIFT Token
                        </h3>
                        <span className="text-xs font-rajdhani uppercase tracking-wider text-primary">
                            Coming Soon
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 font-inter text-sm mb-6 leading-relaxed">
                    Stake your Riftbirds to earn $RIFT tokens. Use them for exclusive drops,
                    governance voting, and special in-ecosystem perks.
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <FeatureCard
                        icon={<Rocket className="w-5 h-5" />}
                        title="Staking Rewards"
                        description="Earn daily $RIFT based on NFT rarity"
                    />
                    <FeatureCard
                        icon={<Sparkles className="w-5 h-5" />}
                        title="Exclusive Drops"
                        description="Access to limited edition mints"
                    />
                    <FeatureCard
                        icon={<Clock className="w-5 h-5" />}
                        title="Early Access"
                        description="Priority for new features"
                    />
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary/20 text-primary border border-primary/40 rounded-xl font-rajdhani font-bold hover:bg-primary/30 transition-colors"
                    >
                        <Sparkles className="w-4 h-4" />
                        Start Staking Now
                    </motion.button>

                    <motion.a
                        href="#"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-gray-300 border border-white/10 rounded-xl font-rajdhani font-bold hover:bg-white/10 hover:text-white transition-colors"
                    >
                        Learn More
                        <ExternalLink className="w-4 h-4" />
                    </motion.a>
                </div>

                {/* Disclaimer */}
                <p className="mt-4 text-[10px] text-gray-500 font-rajdhani">
                    Token launch date TBA. Staking rewards are estimates and subject to change.
                </p>
            </div>
        </motion.div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="p-3 bg-black/30 rounded-xl border border-white/5">
            <div className="text-secondary mb-2">{icon}</div>
            <h4 className="text-white font-rajdhani font-bold text-sm mb-1">{title}</h4>
            <p className="text-gray-500 text-xs">{description}</p>
        </div>
    );
}
