'use client';

import { motion } from 'framer-motion';
import { Twitter, Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { calculateCollectionStats } from '@/lib/nftUtils';

interface ShareCardProps {
    tokenIds: string[];
    address?: string;
}

export function ShareCard({ tokenIds, address }: ShareCardProps) {
    const [copied, setCopied] = useState(false);
    const stats = calculateCollectionStats(tokenIds);

    const tweetText = `My Riftbird collection:

${stats.totalNFTs} NFTs
${stats.score} Rarity Score
${stats.highestRarity} highest rarity

Join the flock at @VoidriftNFT!

#VOIDRIFT #NFT #Web3`;

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    const profileUrl = address ? `https://voidrift.xyz/profile?address=${address}` : 'https://voidrift.xyz';

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20"
        >
            <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-rajdhani font-bold uppercase tracking-wider text-gray-300">
                    Share Your Flock
                </h3>
            </div>

            <div className="flex flex-wrap gap-3">
                {/* Twitter Share */}
                <motion.a
                    href={tweetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/30 rounded-lg hover:bg-[#1DA1F2]/30 transition-colors font-rajdhani font-bold"
                >
                    <Twitter className="w-4 h-4" />
                    Tweet
                </motion.a>

                {/* Copy Link */}
                <motion.button
                    onClick={copyToClipboard}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-300 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-colors font-rajdhani font-bold"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-green-400" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Copy Link
                        </>
                    )}
                </motion.button>
            </div>

            {/* Preview of what will be shared */}
            <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/5">
                <p className="text-xs text-gray-500 font-mono whitespace-pre-line">
                    {tweetText.slice(0, 100)}...
                </p>
            </div>
        </motion.div>
    );
}
