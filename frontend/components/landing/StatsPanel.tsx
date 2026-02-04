'use client';

import { Container } from '@/components/layout/Container';
import { motion } from 'framer-motion';
import { useReadContract } from 'wagmi';
import { VOIDRIFT_NFT_ADDRESS, VOIDRIFT_NFT_ABI } from '@/lib/contracts';

export function StatsPanel() {
    const { data: totalSupply } = useReadContract({
        address: VOIDRIFT_NFT_ADDRESS,
        abi: VOIDRIFT_NFT_ABI,
        functionName: 'totalSupply',
        query: { refetchInterval: 10000 },
    });

    const { data: maxSupply } = useReadContract({
        address: VOIDRIFT_NFT_ADDRESS,
        abi: VOIDRIFT_NFT_ABI,
        functionName: 'maxSupply',
    });

    const { data: mintPrice } = useReadContract({
        address: VOIDRIFT_NFT_ADDRESS,
        abi: VOIDRIFT_NFT_ABI,
        functionName: 'mintPrice',
    });

    const minted = totalSupply !== undefined ? Number(totalSupply) : 0;
    const supply = maxSupply !== undefined ? Number(maxSupply) : 10;
    const price = mintPrice !== undefined ? (Number(mintPrice) / 1e18).toString() : '0.001';

    const stats = [
        { label: 'Total Supply', value: supply.toLocaleString(), icon: '🎯' },
        { label: 'Minted', value: minted.toLocaleString(), icon: '💎' },
        { label: 'Mint Price', value: `${price} ETH`, icon: '🔥' },
        { label: 'Network', value: 'Sepolia', icon: '🌐' },
    ];

    return (
        <section className="py-20 border-y border-white/5 bg-black/20 backdrop-blur-sm">
            <Container>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center p-6 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 transition-colors group"
                        >
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-orbitron font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                {stat.value}
                            </h3>
                            <p className="text-sm font-rajdhani font-medium text-gray-400 uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
