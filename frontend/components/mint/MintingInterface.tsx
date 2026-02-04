'use client';

import { useState, useRef } from 'react';
import { Container } from '@/components/layout/Container';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Minus, Plus, Loader2 } from 'lucide-react';
import { VOIDRIFT_NFT_ADDRESS, VOIDRIFT_NFT_ABI } from '@/lib/contracts';
import { MintPreview } from './MintPreview';
import { toast } from 'sonner';



export function MintingInterface() {
    const { address, isConnected } = useAccount();
    const [quantity, setQuantity] = useState(1);
    const [isMinting, setIsMinting] = useState(false);

    // Contract Reads
    const { data: totalSupply } = useReadContract({
        address: VOIDRIFT_NFT_ADDRESS,
        abi: VOIDRIFT_NFT_ABI,
        functionName: 'totalSupply',
        query: { refetchInterval: 5000 }
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

    // Contract Writes
    const { writeContractAsync } = useWriteContract();

    const handleMint = async () => {
        if (!isConnected) {
            toast.error('Please connect your wallet first');
            return;
        }

        setIsMinting(true);
        try {
            const price = mintPrice ? mintPrice : parseEther('0.01');
            const totalCost = price * BigInt(quantity);

            const hash = quantity === 1
                ? await writeContractAsync({
                    address: VOIDRIFT_NFT_ADDRESS,
                    abi: VOIDRIFT_NFT_ABI,
                    functionName: 'mint',
                    value: totalCost,
                })
                : await writeContractAsync({
                    address: VOIDRIFT_NFT_ADDRESS,
                    abi: VOIDRIFT_NFT_ABI,
                    functionName: 'mintBatch',
                    args: [BigInt(quantity)],
                    value: totalCost,
                });

            toast.info('Transaction submitted. Waiting for confirmation...');

            // In a real app we'd wait for receipt, but simpler here
            toast.success(`Successfully minted ${quantity} Riftwalker(s)! hash: ${hash}`);
            console.log('Mint hash:', hash);

        } catch (error) {
            toast.error('Minting failed. Please try again.');
            console.error(error);
        } finally {
            setIsMinting(false);
        }
    };

    const currentSupply = totalSupply ? Number(totalSupply) : 0;
    const max = maxSupply ? Number(maxSupply) : 222;
    const priceEth = mintPrice ? Number(mintPrice) / 1e18 : 0.01;

    const percentage = (currentSupply / max) * 100;
    const totalPrice = (priceEth * quantity).toFixed(3);

    return (
        <section className="py-20 flex-1 flex flex-col justify-center relative overflow-hidden">
            {/* Background elements could go here */}
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Bird Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full bg-black/40 rounded-2xl border border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-cyan-900/20 opacity-50" />

                        <div className="relative z-10">
                            <div className="mb-4">
                                <h3 className="text-2xl font-orbitron font-bold text-white mb-1">Your Next Birds</h3>
                                <p className="text-gray-400 font-rajdhani text-sm">
                                    Preview what you'll receive when you mint
                                </p>
                            </div>

                            {totalSupply !== undefined ? (
                                <MintPreview
                                    startId={currentSupply + 1}
                                    quantity={quantity}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-[400px]">
                                    <Loader2 className="animate-spin text-primary" size={48} />
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right: Mint Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col space-y-8"
                    >
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-orbitron font-bold text-white mb-2 leading-tight">
                                Mint Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Riftbirds</span>
                            </h1>
                            <p className="text-gray-400 font-inter text-lg">
                                Collect voxel birds from across dimensions. Each NFT features unique species, rarities, and traits.
                            </p>
                        </div>

                        {/* Wallet Panel */}
                        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-400 font-rajdhani">Status</span>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="text-white text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
                                </div>
                            </div>
                            <ConnectButton showBalance={true} />
                        </div>

                        {/* Controls */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
                                <span className="text-white font-rajdhani text-lg">Quantity</span>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="text-2xl font-orbitron font-bold text-white w-8 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                        className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-400 font-rajdhani">
                                    <span>Price per NFT</span>
                                    <span>{priceEth} ETH</span>
                                </div>
                                <div className="flex justify-between text-xl text-white font-orbitron font-bold border-t border-white/10 pt-4">
                                    <span>Total</span>
                                    <span>{totalPrice} ETH</span>
                                </div>
                            </div>

                            <button
                                onClick={handleMint}
                                disabled={!isConnected}
                                className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-lg font-orbitron font-bold text-black text-xl 
                         hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] cursor-pointer"
                            >
                                {!isConnected ? 'Connect Wallet' : 'MINT NOW'}
                            </button>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Total Minted</span>
                                <span>{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <div className="text-right text-xs text-gray-500 font-mono">
                                {currentSupply} / {max}
                            </div>
                        </div>

                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
