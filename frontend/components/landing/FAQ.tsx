'use client';

import { Container } from '@/components/layout/Container';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: 'What is VOIDRIFT?',
        answer: 'VOIDRIFT is a premium NFT collection of 10,000 unique Riftwalkers. It combines high-quality art with a complete ecosystem including staking, tokenomics, and future gamification.',
    },
    {
        question: 'How do I mint?',
        answer: 'Connect your wallet using the button in the top right. Ensure you have enough ETH on Sepolia testnet. Click "Mint" on the mint page and confirm the transaction.',
    },
    {
        question: 'What benefits do holders get?',
        answer: 'Holders get access to the staking platform to earn RIFT tokens, voting rights in the DAO, early access to future drops, and entry into the upcoming P2E game.',
    },
    {
        question: 'What is the utility of RIFT token?',
        answer: 'RIFT is the native utility token used for upgrading NFTs, purchasing exclusive items in the marketplace, and governance voting.',
    },
    {
        question: 'Is this project audited?',
        answer: 'Yes, our smart contracts follow industry standards (OpenZeppelin) and have been thoroughly tested. However, always do your own research.',
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 bg-black/30">
            <Container className="max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4">
                        FAQ
                    </h2>
                    <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="border border-white/5 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="font-rajdhani font-bold text-lg text-white">
                                    {faq.question}
                                </span>
                                <span className="text-primary">
                                    {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-gray-400 font-inter leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
