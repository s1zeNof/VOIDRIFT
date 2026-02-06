'use client';

import { Container } from '@/components/layout/Container';
import { useAccount, useReadContract, useBalance, useChainId } from 'wagmi';
import { usePublicClient } from 'wagmi';
import { VOIDRIFT_NFT_ADDRESS, VOIDRIFT_NFT_ABI, SUPPORTED_CHAIN_ID, getTokenMetadataUrl, ipfsToHttp } from '@/lib/contracts';
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Loader2, User, Shield, Zap, Sparkles, Wallet, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { NFTDetailModal } from '@/components/collection/NFTDetailModal';
import { generateTraits } from '@/lib/nftUtils';
import { parseAbiItem, formatEther, createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { FlockStats } from '@/components/profile/FlockStats';
import { ShareCard } from '@/components/profile/ShareCard';
import { RarityBadge } from '@/components/shared/RarityBadge';

// Fallback client - always reads from Base Sepolia
const baseSepoliaClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
});

// Cache for fetched IPFS metadata
interface IPFSMetadata {
    name: string;
    description: string;
    image: string;
    attributes: { trait_type: string; value: string | number }[];
}

const metadataCache = new Map<string, IPFSMetadata>();

async function fetchTokenMetadata(tokenId: string): Promise<IPFSMetadata | null> {
    if (metadataCache.has(tokenId)) return metadataCache.get(tokenId)!;
    try {
        const url = getTokenMetadataUrl(tokenId);
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        metadataCache.set(tokenId, data);
        return data;
    } catch {
        return null;
    }
}

export default function ProfilePage() {
    const [simulating, setSimulating] = useState(false);
    // Modal State
    const [selectedNftId, setSelectedNftId] = useState<string | null>(null);

    const { address, isConnected, chain } = useAccount();
    const chainId = useChainId();
    const [mounted, setMounted] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

    const [_hoveredNftId, setHoveredNftId] = useState<string | null>(null);
    const [showDevTools, setShowDevTools] = useState(false);

    // Token IDs owned by user (fetched via Transfer events)
    const [ownedTokenIds, setOwnedTokenIds] = useState<string[]>([]);
    const [isLoadingIds, setIsLoadingIds] = useState(false);

    // IPFS metadata for owned tokens
    const [tokenMetadata, setTokenMetadata] = useState<Map<string, IPFSMetadata>>(new Map());

    const wagmiClient = usePublicClient();
    // Always use Sepolia client for reading NFT data
    const publicClient = chainId === SUPPORTED_CHAIN_ID ? wagmiClient : baseSepoliaClient;

    const isWrongChain = chainId !== SUPPORTED_CHAIN_ID;

    // Sepolia ETH Balance (only on correct chain)
    const { data: ethBalance } = useBalance({
        address: address,
        chainId: SUPPORTED_CHAIN_ID,
    });

    // Prevent hydration errors
    useEffect(() => {
        setMounted(true);
        const storedAvatar = localStorage.getItem('voidrift_avatar');
        if (storedAvatar) setSelectedAvatar(storedAvatar);
        // Dev tools are only visible via ?devtools=true URL param
        const params = new URLSearchParams(window.location.search);
        setShowDevTools(params.get('devtools') === 'true');
    }, []);

    // 1. Get NFT Balance (always from Sepolia)
    const { data: balance } = useReadContract({
        address: VOIDRIFT_NFT_ADDRESS,
        abi: VOIDRIFT_NFT_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        chainId: SUPPORTED_CHAIN_ID,
    });

    const balanceNum = balance ? Number(balance) : 0;

    // 2. Fetch owned token IDs via Transfer events (always from Sepolia)
    useEffect(() => {
        if (!address || balanceNum === 0) {
            setOwnedTokenIds([]);
            setTokenMetadata(new Map());
            return;
        }

        async function fetchTokenIds() {
            setIsLoadingIds(true);
            const client = baseSepoliaClient;
            try {
                // Get current block to limit range
                const currentBlock = await client.getBlockNumber();
                const startBlock = currentBlock > BigInt(100000) ? currentBlock - BigInt(100000) : BigInt(0);

                // Get all Transfer events TO this address
                const receivedLogs = await client.getLogs({
                    address: VOIDRIFT_NFT_ADDRESS as `0x${string}`,
                    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                    args: { to: address },
                    fromBlock: startBlock,
                    toBlock: 'latest',
                });

                // Get all Transfer events FROM this address
                const sentLogs = await client.getLogs({
                    address: VOIDRIFT_NFT_ADDRESS as `0x${string}`,
                    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                    args: { from: address },
                    fromBlock: startBlock,
                    toBlock: 'latest',
                });

                // Calculate which tokens are still owned
                const received = new Set(receivedLogs.map(l => l.args.tokenId!.toString()));
                const sent = new Set(sentLogs.map(l => l.args.tokenId!.toString()));

                const owned = [...received].filter(id => !sent.has(id));
                setOwnedTokenIds(owned);

                // Fetch IPFS metadata for each owned token
                const metadataMap = new Map<string, IPFSMetadata>();
                await Promise.all(
                    owned.map(async (id) => {
                        const metadata = await fetchTokenMetadata(id);
                        if (metadata) {
                            metadataMap.set(id, metadata);
                        }
                    })
                );
                setTokenMetadata(metadataMap);
            } catch (err) {
                console.error('Failed to fetch token IDs:', err);
                // Fallback: show token IDs 1..balanceNum as approximation
                const fallbackIds = Array.from({ length: balanceNum }, (_, i) => (i + 1).toString());
                setOwnedTokenIds(fallbackIds);

                // Still try to fetch metadata
                const metadataMap = new Map<string, IPFSMetadata>();
                await Promise.all(
                    fallbackIds.map(async (id) => {
                        const metadata = await fetchTokenMetadata(id);
                        if (metadata) {
                            metadataMap.set(id, metadata);
                        }
                    })
                );
                setTokenMetadata(metadataMap);
            } finally {
                setIsLoadingIds(false);
            }
        }

        fetchTokenIds();
    }, [address, balanceNum]);

    const handleSetAvatar = (id: string) => {
        localStorage.setItem('voidrift_avatar', id);
        setSelectedAvatar(id);
        toast.success(`Riftwalker #${id} set as avatar`);
    };

    if (!mounted) return null;

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-orbitron font-bold text-white mb-4">Access Restricted</h1>
                    <ConnectButton />
                </div>
            </div>
        );
    }

    // Helper to get display data for a token (from IPFS or fallback to local)
    const getTokenDisplay = (id: string) => {
        const meta = tokenMetadata.get(id);
        if (meta) {
            const species = meta.attributes?.find(a => a.trait_type === 'Species')?.value as string || 'Unknown';
            const rarity = meta.attributes?.find(a => a.trait_type === 'Rarity')?.value as string || 'Common';
            return {
                name: meta.name || `Riftwalker #${id}`,
                species,
                rarity,
                image: ipfsToHttp(meta.image),
                attributes: meta.attributes || [],
            };
        }
        // Fallback to local traits
        const traits = generateTraits(id);
        return {
            name: traits.name,
            species: traits.species,
            rarity: traits.rarity,
            image: traits.image,
            attributes: traits.attributes,
        };
    };

    return (
        <div className="min-h-screen pt-24 pb-12">
            <Container>
                {/* Wrong chain warning */}
                {isConnected && isWrongChain && (
                    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="text-yellow-400 flex-shrink-0" size={20} />
                        <div>
                            <p className="text-yellow-200 font-bold text-sm">Wrong Network</p>
                            <p className="text-yellow-200/70 text-xs">
                                VOIDRIFT NFTs are on Base Sepolia. Please switch to Base Sepolia in your wallet. Your NFTs are still shown below.
                            </p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                    <div className="flex items-center space-x-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-black border border-primary/30 flex items-center justify-center relative overflow-hidden group shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                            {selectedAvatar ? (
                                <>
                                    <img
                                        src={generateTraits(selectedAvatar).image}
                                        alt={`Riftwalker #${selectedAvatar}`}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-1 right-1 text-xs font-orbitron font-bold text-white/80 bg-black/50 px-1.5 py-0.5 rounded">
                                        #{selectedAvatar}
                                    </span>
                                </>
                            ) : (
                                <User size={40} className="text-gray-500 group-hover:text-primary transition-colors" />
                            )}
                        </div>

                        <div>
                            <h1 className="text-4xl font-orbitron font-bold text-white mb-1">
                                Agent Profile
                            </h1>
                            <p className="text-primary font-mono text-sm bg-primary/10 px-3 py-1 rounded-full border border-primary/20 inline-block">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </p>
                        </div>
                    </div>

                    <div className="flex space-x-4 flex-wrap gap-y-4">
                        <div className="bg-black/40 border border-white/10 rounded-xl p-4 min-w-[120px] backdrop-blur-sm">
                            <p className="text-gray-400 text-[10px] font-rajdhani uppercase tracking-wider">Owned Assets</p>
                            <p className="text-2xl font-orbitron font-bold text-white mt-1">
                                {balanceNum}
                            </p>
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-xl p-4 min-w-[120px] backdrop-blur-sm">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Wallet size={12} className="text-cyan-400" />
                                <p className="text-gray-400 text-[10px] font-rajdhani uppercase tracking-wider">
                                    {chain?.name || 'Sepolia'} ETH
                                </p>
                            </div>
                            <p className="text-2xl font-orbitron font-bold text-white mt-1">
                                {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0.0000'}
                            </p>
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-xl p-4 min-w-[120px] backdrop-blur-sm">
                            <p className="text-gray-400 text-[10px] font-rajdhani uppercase tracking-wider">Rank</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Shield size={16} className="text-cyan-400" />
                                <p className="text-xl font-orbitron font-bold text-white">
                                    Initiate
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flock Stats Section */}
                {balanceNum > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                            <Sparkles className="text-primary" size={24} />
                            Your Flock Stats
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <FlockStats tokenIds={ownedTokenIds} firstMintDate={null} />
                            </div>
                            <div>
                                <ShareCard tokenIds={ownedTokenIds} address={address} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Gallery */}
                <div>
                    <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                        <Zap className="text-secondary" size={24} />
                        Your Collection
                    </h2>

                    {isLoadingIds ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    ) : balanceNum === 0 ? (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                            <p className="text-gray-400 font-rajdhani text-lg">No Riftwalkers detected.</p>
                            <div className="mt-4">
                                <ConnectButton />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {ownedTokenIds.map((id) => {
                                const display = getTokenDisplay(id);
                                const rarityColor = display.rarity === 'Legendary' ? 'text-yellow-500' : display.rarity === 'Mythic' ? 'text-red-500' : display.rarity === 'Epic' ? 'text-purple-400' : display.rarity === 'Rare' ? 'text-blue-400' : 'text-gray-400';
                                // Get class from IPFS metadata
                                const meta = tokenMetadata.get(id);
                                const nftClass = meta?.attributes?.find(a => a.trait_type === 'Class')?.value as string || 'Hatchling';

                                return (
                                    <div key={id} className={`bg-black/60 border rounded-xl overflow-hidden group transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)] ${simulating ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border-white/10 hover:border-primary/50'}`}>

                                        {/* Image Area — Real NFT Image */}
                                        <div
                                            onClick={() => setSelectedNftId(id)}
                                            onMouseEnter={() => setHoveredNftId(id)}
                                            onMouseLeave={() => setHoveredNftId(null)}
                                            className="aspect-square relative flex items-center justify-center overflow-hidden cursor-pointer bg-black"
                                        >
                                            {/* NFT Image from IPFS */}
                                            <img
                                                src={display.image}
                                                alt={display.name}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />

                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />

                                            {/* Rarity Badge */}
                                            <div className="absolute top-3 left-3 z-20">
                                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md border ${
                                                    display.rarity === 'Legendary' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                                                    display.rarity === 'Mythic' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                                                    display.rarity === 'Epic' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' :
                                                    display.rarity === 'Rare' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                                                    'bg-white/10 border-white/20 text-gray-300'
                                                }`}>
                                                    {display.rarity}
                                                </span>
                                            </div>

                                            {/* Stage Badge */}
                                            <div className={`absolute top-3 right-3 px-3 py-1 rounded backdrop-blur-md border flex items-center gap-2 transition-all duration-500 z-20
                                                ${simulating ? 'bg-purple-900/80 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-black/60 border-white/10 text-white'}`}>
                                                <Zap size={12} className={simulating ? "fill-cyan-300 text-cyan-300" : "text-yellow-400"} />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                                    {simulating ? 'Stage 3' : 'Stage 1'}
                                                </span>
                                            </div>

                                            {/* Name overlay at bottom */}
                                            <div className="absolute bottom-3 left-3 right-3 z-20">
                                                <h3 className="font-orbitron font-bold text-white text-lg drop-shadow-lg">{display.name}</h3>
                                                <p className="text-xs text-gray-300 font-rajdhani">{display.species} &bull; #{id}</p>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className={`text-xs font-rajdhani uppercase tracking-wider transition-colors duration-500 ${simulating ? 'text-cyan-400' : 'text-gray-500'}`}>
                                                        {simulating ? 'Status: Awakened' : 'Status: Dormant'}
                                                    </p>
                                                </div>
                                                <span className={`text-xs font-bold ${rarityColor}`}>{display.rarity}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                                                <div className="bg-white/5 rounded p-2 border border-white/5">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Species</p>
                                                    <p className="text-gray-300 font-mono">{display.species}</p>
                                                </div>
                                                <div className="bg-white/5 rounded p-2 border border-white/5">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Class</p>
                                                    <p className="text-gray-300 font-mono">{simulating ? 'Sentinel' : nftClass}</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleSetAvatar(id)}
                                                className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border cursor-pointer
                                                    ${selectedAvatar === id
                                                        ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/30'
                                                    }`}
                                            >
                                                {selectedAvatar === id ? <Sparkles size={14} /> : <User size={14} />}
                                                {selectedAvatar === id ? 'Active Avatar' : 'Set Avatar'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* DEBUG: Time Travel - only visible with ?devtools=true */}
                {showDevTools && <div className="mt-24 pt-8 border-t border-white/10">
                    <h3 className="text-xl font-orbitron font-bold text-gray-400 mb-6 flex items-center gap-2">
                        <Zap size={20} className="text-yellow-500" />
                        Dev Tools: Time Dilation
                    </h3>
                    <div className="bg-gradient-to-r from-yellow-900/10 to-transparent border border-yellow-500/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50" />
                        <div>
                            <p className="text-yellow-100 font-bold mb-2 font-orbitron text-lg">Simulate Maturity (+90 Days)</p>
                            <p className="text-sm text-gray-400 max-w-xl font-rajdhani leading-relaxed">
                                This tool creates a local simulation of the blockchain state 90 days in the future.
                                It visualizes the potential <span className="text-yellow-200">Stage 3 Evolution</span> of your Riftwalkers based on their current metadata.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setSimulating(!simulating);
                                toast(simulating ? 'Simulation Deactivated' : 'Time Dilation Active: +90 Days', {
                                    icon: simulating ? '⏪' : '⏩',
                                    description: simulating ? 'Returning to present timeline.' : 'Future metadata projection loaded.',
                                });
                            }}
                            className={`px-6 py-3 rounded-xl font-mono text-sm uppercase tracking-wider transition-all border flex items-center gap-2 shadow-lg
                                ${simulating
                                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-500/20 hover:bg-cyan-500/30'
                                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-500/50'}
                            `}
                        >
                            {simulating ? 'Reset Timeline' : 'Activate Simulation'}
                        </button>
                    </div>
                </div>}
            </Container>

            {/* Modal */}
            <NFTDetailModal
                isOpen={!!selectedNftId}
                onClose={() => setSelectedNftId(null)}
                nft={selectedNftId ? (() => {
                    const display = getTokenDisplay(selectedNftId);
                    const meta = tokenMetadata.get(selectedNftId);
                    return {
                        id: selectedNftId,
                        rarity: display.rarity,
                        isStaked: false,
                        image: display.image,
                        video: '',
                        attributes: meta
                            ? meta.attributes.map(a => ({ trait_type: a.trait_type, value: String(a.value), percent: 100 }))
                            : generateTraits(selectedNftId).attributes,
                        species: display.species,
                        name: display.name,
                    };
                })() : null}
            />

            {/* Global Styles for Simulation */}
            <style jsx global>{`
                .simulated-evolution .stage-badge {
                    background-color: rgba(168, 85, 247, 0.8) !important;
                    border-color: rgba(216, 180, 254, 0.5) !important;
                    color: white !important;
                }
                .simulated-evolution .stage-badge span {
                    display: none;
                }
                .simulated-evolution .stage-badge::after {
                    content: 'Stage 3';
                }
                .simulated-evolution .status-text {
                    color: #22d3ee !important;
                }
                .simulated-evolution .status-text::after {
                    content: '';
                } 
                .simulated-evolution .nft-image-placeholder {
                    filter: brightness(1.1);
                    box-shadow: 0 0 30px rgba(168, 85, 247, 0.4);
                }
            `}</style>
        </div>
    );
}

// Deterministic trait generator and image selector

