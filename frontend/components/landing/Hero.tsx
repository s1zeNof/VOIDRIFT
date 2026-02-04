'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import Link from 'next/link';

function AnimatedSphere() {
    return (
        <Sphere visible args={[1, 100, 200]} scale={2.4}>
            <MeshDistortMaterial
                color="#8B00FF"
                attach="material"
                distort={0.5}
                speed={1.5}
                roughness={0}
            />
        </Sphere>
    );
}

export function Hero() {
    const [text, setText] = useState('');
    const fullText = 'Step Into The Rift';

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, index));
            index++;
            if (index > fullText.length) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
            <Container className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left order-2 md:order-1 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-orbitron font-bold text-4xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary mb-6 min-h-[5rem] md:min-h-[6rem]">
                            {text}
                            <span className="animate-pulse">_</span>
                        </h1>
                        <h2 className="font-rajdhani font-medium text-lg md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0">
                            Unique Riftbird NFTs on Sepolia Testnet.
                            Mint, stake, and evolve your collection.
                        </h2>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                            <Link
                                href="/mint"
                                className="px-8 py-4 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/50 rounded-lg backdrop-blur-sm 
                         font-orbitron font-bold text-white hover:scale-105 hover:border-primary transition-all duration-300
                         shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]"
                            >
                                Start Minting
                            </Link>
                            <Link
                                href="/collection"
                                className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm 
                         font-rajdhani font-bold text-white hover:bg-white/10 transition-all duration-300"
                            >
                                View Collection
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-12 grid grid-cols-3 gap-8 border-t border-white/10 pt-8"
                    >
                        <div>
                            <p className="font-orbitron text-2xl font-bold text-primary">10</p>
                            <p className="font-inter text-xs text-gray-400">Total Supply</p>
                        </div>
                        <div>
                            <p className="font-orbitron text-2xl font-bold text-secondary">0.001 E</p>
                            <p className="font-inter text-xs text-gray-400">Mint Price</p>
                        </div>
                        <div>
                            <p className="font-orbitron text-2xl font-bold text-white">Sepolia</p>
                            <p className="font-inter text-xs text-gray-400">Testnet</p>
                        </div>
                    </motion.div>
                </div>

                {/* 3D Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="flex-1 w-full h-[300px] md:h-[500px] lg:h-[600px] relative order-1 md:order-2"
                >
                    <Canvas camera={{ position: [0, 0, 4] }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <AnimatedSphere />
                        <OrbitControls enableZoom={false} autoRotate />
                    </Canvas>

                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10" />
                </motion.div>
            </Container>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-gray-500 font-inter uppercase tracking-widest">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
            </motion.div>
        </section>
    );
}
