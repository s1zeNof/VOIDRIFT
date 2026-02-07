import { Container } from './Container';
import { Twitter, Disc, Github } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-[#050816] border-t border-white/5 py-12 mt-auto">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="font-orbitron font-bold text-xl tracking-wider text-white">
                                VOID<span className="text-secondary">RIFT</span>
                            </span>
                        </div>
                        <p className="text-gray-400 font-inter text-sm max-w-sm">
                            The ultimate NFT collection traversing the multiverse. Join the riftwalkers and discover new dimensions.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-rajdhani font-bold text-lg text-white mb-4">Project</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/mint" className="hover:text-primary transition-colors">Mint</Link></li>
                            <li><Link href="/staking" className="hover:text-primary transition-colors">Staking</Link></li>
                            <li><Link href="/collection" className="hover:text-primary transition-colors">Collection</Link></li>
                            <li><Link href="/whitelist" className="hover:text-primary transition-colors">Whitelist</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-rajdhani font-bold text-lg text-white mb-4">Socials</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-secondary hover:text-white transition-all">
                                <Disc size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-inter">
                    <p>© 2026 VOIDRIFT. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a
                            href="https://sepolia.basescan.org/address/TODO_BASE_SEPOLIA_ADDRESS"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                        >
                            Contract on BaseScan
                        </a>
                        <span>Base Sepolia Testnet</span>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
