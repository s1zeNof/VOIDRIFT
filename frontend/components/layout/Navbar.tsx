'use client';

import Link from 'next/link';
import { MobileConnectButton } from '@/components/shared/MobileConnectButton';
import { AvatarConnectButton } from '@/components/shared/AvatarConnectButton';
import { Container } from './Container';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Mint', href: '/mint' },
        { name: 'Staking', href: '/staking' },
        { name: 'Collection', href: '/collection' },
        { name: 'Leaderboard', href: '/leaderboard' },
        { name: 'Profile', href: '/profile' },
    ];

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
                isScrolled ? 'bg-background/80 backdrop-blur-md border-white/10' : 'bg-transparent'
            )}
        >
            <Container>
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-primary rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
                        <span className="font-orbitron font-bold text-2xl tracking-wider text-white">
                            VOID<span className="text-secondary">RIFT</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="font-rajdhani font-medium text-lg text-gray-300 hover:text-primary transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <AvatarConnectButton />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </Container>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col space-y-4 animate-in slide-in-from-top-4 z-40">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="font-rajdhani font-bold text-xl text-white py-2 border-b border-white/5"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-2">
                        <MobileConnectButton />
                    </div>
                </div>
            )}
        </nav>
    );
}
