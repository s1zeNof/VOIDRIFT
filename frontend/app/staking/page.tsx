'use client';

import { Container } from '@/components/layout/Container';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { usePublicClient } from 'wagmi';
import {
    VOIDRIFT_NFT_ADDRESS,
    VOIDRIFT_NFT_ABI,
    VOIDRIFT_STAKING_ADDRESS,
    VOIDRIFT_STAKING_ABI,
} from '@/lib/contracts';
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import { formatEther, parseAbiItem } from 'viem';

export default function StakingPage() {
    const { address, isConnected } = useAccount();
    const [mounted, setMounted] = useState(false);
    const [selectedToStake, setSelectedToStake] = useState<string[]>([]);
    const [selectedToUnstake, setSelectedToUnstake] = useState<string[]>([]);
    const [walletIds, setWalletIds] = useState<string[]>([]);

    const publicClient = usePublicClient();

    useEffect(() => { setMounted(true); }, []);

    const { writeContractAsync } = useWriteContract();

    // --- READS ---

    // 1. Check Approval
    const { data: isApproved } = useReadContract({
        address: VOIDRIFT_NFT_ADDRESS,
        abi: VOIDRIFT_NFT_ABI,
        functionName: 'isApprovedForAll',
        args: address ? [address, VOIDRIFT_STAKING_ADDRESS] : undefined,
    });

    // 2. Wallet Assets (Available)
    const { data: balance } = useReadContract({
        address: VOIDRIFT_NFT_ADDRESS,
        abi: VOIDRIFT_NFT_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { refetchInterval: 10000 }
    });

    // 3. Staked Assets
    const { data: stakedTokens } = useReadContract({
        address: VOIDRIFT_STAKING_ADDRESS,
        abi: VOIDRIFT_STAKING_ABI,
        functionName: 'getStakedTokens',
        args: address ? [address] : undefined,
        query: { refetchInterval: 10000 }
    });

    // 4. Rewards
    const { data: rewardsInfo } = useReadContract({
        address: VOIDRIFT_STAKING_ADDRESS,
        abi: VOIDRIFT_STAKING_ABI,
        functionName: 'calculateRewards',
        args: address ? [address] : undefined,
        query: { refetchInterval: 5000 }
    });

    // Fetch IDs for Wallet Assets via Transfer events
    const balanceNum = balance ? Number(balance) : 0;

    useEffect(() => {
        if (!address || !publicClient || balanceNum === 0) {
            setWalletIds([]);
            return;
        }

        async function fetchWalletTokenIds() {
            try {
                const receivedLogs = await publicClient!.getLogs({
                    address: VOIDRIFT_NFT_ADDRESS as `0x${string}`,
                    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                    args: { to: address },
                    fromBlock: BigInt(0),
                    toBlock: 'latest',
                });

                const sentLogs = await publicClient!.getLogs({
                    address: VOIDRIFT_NFT_ADDRESS as `0x${string}`,
                    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                    args: { from: address },
                    fromBlock: BigInt(0),
                    toBlock: 'latest',
                });

                const received = new Set(receivedLogs.map(l => l.args.tokenId!.toString()));
                const sent = new Set(sentLogs.map(l => l.args.tokenId!.toString()));
                const owned = [...received].filter(id => !sent.has(id));
                setWalletIds(owned);
            } catch (err) {
                console.error('Failed to fetch wallet token IDs:', err);
                setWalletIds(Array.from({ length: balanceNum }, (_, i) => (i + 1).toString()));
            }
        }

        fetchWalletTokenIds();
    }, [address, publicClient, balanceNum]);

    // --- ACTIONS ---

    const handleApprove = async () => {
        try {
            const hash = await writeContractAsync({
                address: VOIDRIFT_NFT_ADDRESS,
                abi: VOIDRIFT_NFT_ABI,
                functionName: 'setApprovalForAll',
                args: [VOIDRIFT_STAKING_ADDRESS, true],
            });
            toast.success('Approval granted! Now you can stake.');
        } catch (e) {
            console.error(e);
            toast.error('Approval failed');
        }
    };

    const handleStake = async () => {
        if (selectedToStake.length === 0) return;
        try {
            const ids = selectedToStake.map(id => BigInt(id));
            const hash = await writeContractAsync({
                address: VOIDRIFT_STAKING_ADDRESS,
                abi: VOIDRIFT_STAKING_ABI,
                functionName: 'stake',
                args: [ids],
            });
            toast.success('Riftwalkers sent to The Void (Staked)!');
            setSelectedToStake([]);
        } catch (e) {
            console.error(e);
            toast.error('Staking failed');
        }
    };

    const handleUnstake = async () => {
        if (selectedToUnstake.length === 0) return;
        try {
            const ids = selectedToUnstake.map(id => BigInt(id));
            const hash = await writeContractAsync({
                address: VOIDRIFT_STAKING_ADDRESS,
                abi: VOIDRIFT_STAKING_ABI,
                functionName: 'withdraw',
                args: [ids],
            });
            toast.success('Riftwalkers recalled from The Void!');
            setSelectedToUnstake([]);
        } catch (e) {
            console.error(e);
            toast.error('Unstaking failed');
        }
    };

    const handleClaim = async () => {
        try {
            const hash = await writeContractAsync({
                address: VOIDRIFT_STAKING_ADDRESS,
                abi: VOIDRIFT_STAKING_ABI,
                functionName: 'claimRewards',
            });
            toast.success('Rewards claimed!');
        } catch (e) {
            console.error(e);
            toast.error('Claim failed');
        }
    };

    const toggleSelection = (id: string, list: 'stake' | 'unstake') => {
        if (list === 'stake') {
            setSelectedToStake(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        } else {
            setSelectedToUnstake(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        }
    };

    if (!mounted) return null;

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-center">
                    <h1 className="text-3xl font-orbitron font-bold text-white mb-4">Void Expedition</h1>
                    <ConnectButton />
                </div>
            </div>
        );
    }

    const stakedIds = stakedTokens ? (stakedTokens as bigint[]).map((t: bigint) => t.toString()) : [];
    const rewardAmount = rewardsInfo ? formatEther(rewardsInfo as bigint) : '0';

    return (
        <div className="min-h-screen pt-28 pb-20">
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-orbitron font-bold text-white mb-2">
                            Void Expedition
                        </h1>
                        <p className="text-gray-400 font-rajdhani max-w-xl">
                            Send your Riftwalkers into the unknown to gather $RIFT.
                            Staked entities cannot be transferred but will continue to evolve.
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-white/10 p-6 rounded-2xl flex flex-col items-end min-w-[200px]">
                        <span className="text-gray-400 font-rajdhani text-sm uppercase tracking-wider">Unclaimed Rewards</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-3xl font-orbitron font-bold text-cyan-400">{parseFloat(rewardAmount).toFixed(2)}</span>
                            <span className="text-white font-bold">$RIFT</span>
                        </div>
                        <button
                            onClick={handleClaim}
                            disabled={parseFloat(rewardAmount) <= 0}
                            className="mt-3 text-xs w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Claim Rewards
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT: HANGAR (WALLET) */}
                    <div className="bg-black/40 border border-white/10 rounded-3xl p-6 min-h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                                <Unlock className="text-gray-400" size={24} />
                                Hangar <span className="text-xs ml-2 bg-white/10 px-2 py-1 rounded-full text-gray-300">{walletIds.length}</span>
                            </h2>
                            {/* Actions */}
                            {!isApproved ? (
                                <button
                                    onClick={handleApprove}
                                    className="bg-primary text-black font-bold px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors text-sm font-rajdhani"
                                >
                                    Approve Contract
                                </button>
                            ) : (
                                <button
                                    onClick={handleStake}
                                    disabled={selectedToStake.length === 0}
                                    className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-rajdhani"
                                >
                                    Stake Selected ({selectedToStake.length})
                                </button>
                            )}
                        </div>

                        {walletIds.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/5 rounded-xl">
                                <p>No Riftwalkers found.</p>
                                <a href="/mint" className="text-primary hover:underline mt-2 text-sm">Mint one here</a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {walletIds.map(id => {
                                    const hue = (Number(id) * 137) % 360;
                                    return (
                                        <div
                                            key={id}
                                            onClick={() => toggleSelection(id, 'stake')}
                                            style={{ borderColor: selectedToStake.includes(id) ? `hsl(${hue}, 100%, 50%)` : `hsla(${hue}, 70%, 50%, 0.3)` }}
                                            className={`
                                                relative aspect-square rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02]
                                                flex items-center justify-center overflow-hidden
                                                ${selectedToStake.includes(id) ? 'bg-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' : 'bg-gradient-to-br from-gray-900 to-black hover:border-opacity-100'}
                                            `}
                                        >
                                            {/* Visual */}
                                            <div
                                                className="absolute inset-0 opacity-20"
                                                style={{
                                                    background: `radial-gradient(circle at center, hsla(${hue}, 100%, 50%, 0.5), transparent 70%)`
                                                }}
                                            />

                                            <span
                                                className="font-orbitron font-bold text-xl z-10"
                                                style={{ color: `hsl(${hue}, 100%, 70%)`, textShadow: `0 0 10px hsla(${hue}, 100%, 50%, 0.5)` }}
                                            >
                                                #{id}
                                            </span>

                                            {selectedToStake.includes(id) && (
                                                <div
                                                    className="absolute top-2 right-2 w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                                                    style={{ backgroundColor: `hsl(${hue}, 100%, 50%)`, color: `hsl(${hue}, 100%, 50%)` }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: THE VOID (STAKED) */}
                    <div className="bg-black/40 border border-white/10 rounded-3xl p-6 min-h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                                <Lock className="text-purple-400" size={24} />
                                The Void <span className="text-xs ml-2 bg-purple-900/50 px-2 py-1 rounded-full text-purple-300">{stakedIds.length}</span>
                            </h2>

                            <button
                                onClick={handleUnstake}
                                disabled={selectedToUnstake.length === 0}
                                className="bg-red-500/10 text-red-400 border border-red-500/50 font-bold px-6 py-2 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-rajdhani"
                            >
                                Unstake ({selectedToUnstake.length})
                            </button>
                        </div>

                        {stakedIds.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/5 rounded-xl">
                                <p>The Void is empty.</p>
                                <p className="text-xs mt-1">Send Riftwalkers to start earning.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {stakedIds.map(id => {
                                    const hue = (Number(id) * 137) % 360;
                                    return (
                                        <div
                                            key={id}
                                            onClick={() => toggleSelection(id, 'unstake')}
                                            style={{ borderColor: selectedToUnstake.includes(id) ? '#ef4444' : `hsla(${hue}, 70%, 50%, 0.3)` }}
                                            className={`
                                                relative aspect-square rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02]
                                                flex items-center justify-center bg-black overflow-hidden
                                                ${selectedToUnstake.includes(id) ? 'bg-red-900/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'hover:border-opacity-100'}
                                            `}
                                        >
                                            {/* Void Animation Effect */}
                                            <div
                                                className="absolute inset-0 opacity-30 animate-pulse"
                                                style={{
                                                    background: `linear-gradient(45deg, transparent, hsla(${hue}, 100%, 20%, 0.5), transparent)`
                                                }}
                                            />

                                            <span
                                                className="font-orbitron font-bold text-xl z-10"
                                                style={{ color: `hsl(${hue}, 100%, 70%)` }}
                                            >
                                                #{id}
                                            </span>

                                            <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-rajdhani uppercase tracking-widest opacity-70 text-gray-400">
                                                Harvesting...
                                            </div>

                                            {selectedToUnstake.includes(id) && (
                                                <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_5px_#ff0000]" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </Container>
        </div>
    );
}
