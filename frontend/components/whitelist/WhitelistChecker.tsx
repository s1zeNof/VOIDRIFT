'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WhitelistChecker() {
    const { address, isConnected } = useAccount();
    const [inputAddress, setInputAddress] = useState('');
    const [status, setStatus] = useState<'idle' | 'checking' | 'whitelisted' | 'not-whitelisted'>('idle');

    const checkWhitelist = async () => {
        setStatus('checking');

        // MVP Testnet: All connected wallets are whitelisted for testing
        setTimeout(() => {
            const addrToCheck = inputAddress || address;
            if (!addrToCheck) {
                setStatus('idle');
                return;
            }

            // On testnet: everyone is whitelisted for testing purposes
            setStatus('whitelisted');
        }, 1500);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
                        <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Testnet MVP</span>
                    </div>
                </div>

                <h2 className="text-3xl font-orbitron font-bold text-white text-center mb-2">
                    Verify Eligibility
                </h2>
                <p className="text-gray-400 text-sm text-center mb-8 font-rajdhani">
                    On Sepolia Testnet, all wallets are eligible to mint for testing.
                </p>

                {!isConnected ? (
                    <div className="text-center space-y-4">
                        <p className="text-gray-400 font-rajdhani">Connect your wallet to check eligibility</p>
                        <div className="flex justify-center">
                            <ConnectButton />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="relative mb-8">
                            <input
                                type="text"
                                placeholder="Enter wallet address (0x...)"
                                value={inputAddress}
                                onChange={(e) => setInputAddress(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-primary/50 transition-colors font-mono text-sm"
                            />
                            <button
                                onClick={checkWhitelist}
                                className="absolute right-2 top-2 bottom-2 bg-white/10 hover:bg-white/20 text-white px-6 rounded-lg font-rajdhani font-bold transition-all cursor-pointer"
                            >
                                {status === 'checking' ? 'Checking...' : 'Check Status'}
                            </button>
                        </div>

                        <div className="flex justify-center mb-6">
                            <button
                                onClick={() => setInputAddress(address || '')}
                                className="text-sm text-primary hover:underline font-rajdhani cursor-pointer"
                            >
                                Use connected wallet
                            </button>
                        </div>

                        {status === 'whitelisted' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
                                    <CheckCircle className="text-green-500" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">You are Eligible!</h3>
                                <p className="text-gray-400 text-sm">
                                    Testnet minting is open for everyone. Head to the{' '}
                                    <a href="/mint" className="text-primary hover:underline">Mint page</a> to get your Riftbird!
                                </p>
                            </motion.div>
                        )}

                        {status === 'not-whitelisted' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
                                    <XCircle className="text-red-500" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Not Eligible</h3>
                                <p className="text-gray-400 text-sm">
                                    Check the <span className="text-white">Public Mint</span> details below.
                                </p>
                            </motion.div>
                        )}
                    </>
                )}
            </div>

            {/* Mint Info */}
            <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                    <div className="text-2xl font-orbitron font-bold text-white">10</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Max Supply</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-orbitron font-bold text-primary">0.001</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">ETH per mint</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-orbitron font-bold text-secondary">Sepolia</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Network</div>
                </div>
            </div>
        </div>
    );
}
