import { MintingInterface } from '@/components/mint/MintingInterface';
import { ParticleBackground } from '@/components/animations/ParticleBackground';
import { LiveMintFeed } from '@/components/mint/LiveMintFeed';
import { Container } from '@/components/layout/Container';

export default function MintPage() {
    return (
        <div className="min-h-screen flex flex-col pt-20 pb-12 relative">
            <ParticleBackground />
            <MintingInterface />

            {/* Live Mint Feed Section */}
            <Container>
                <div className="mt-12">
                    <LiveMintFeed />
                </div>
            </Container>
        </div>
    );
}
