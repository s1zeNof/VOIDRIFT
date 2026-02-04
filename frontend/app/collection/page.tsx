import { Container } from '@/components/layout/Container';
import { ParticleBackground } from '@/components/animations/ParticleBackground';
import { CollectionGallery } from '@/components/collection/CollectionGallery';

export default function CollectionPage() {
    return (
        <div className="min-h-screen flex flex-col pt-24 relative">
            <ParticleBackground />
            <Container>
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-2">
                        Species Showcase
                    </h1>
                    <p className="text-gray-400 font-inter">Explore the diversity of the Riftbirds. Hover to see them animate!</p>
                </div>

                <CollectionGallery />
            </Container>
        </div>
    );
}
