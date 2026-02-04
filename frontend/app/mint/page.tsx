import { MintingInterface } from '@/components/mint/MintingInterface';
import { RecentlyMinted } from '@/components/mint/RecentlyMinted';
import { ParticleBackground } from '@/components/animations/ParticleBackground';

export default function MintPage() {
    return (
        <div className="min-h-screen flex flex-col pt-20 relative">
            <ParticleBackground />
            <MintingInterface />
            <RecentlyMinted />
        </div>
    );
}
