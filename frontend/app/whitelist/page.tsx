import { Container } from '@/components/layout/Container';
import { ParticleBackground } from '@/components/animations/ParticleBackground';
import { WhitelistChecker } from '@/components/whitelist/WhitelistChecker';

export default function WhitelistPage() {
    return (
        <div className="min-h-screen flex flex-col pt-32 pb-20 relative">
            <ParticleBackground />
            <Container>
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4">
                        Whitelist Check
                    </h1>
                    <p className="text-gray-400 font-inter max-w-xl mx-auto">
                        Verify if your wallet is eligible for the exclusive Genesis Mint phase.
                    </p>
                </div>

                <WhitelistChecker />
            </Container>
        </div>
    );
}
