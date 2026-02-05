'use client';

import { useState, useMemo } from 'react';
import { Container } from '@/components/layout/Container';
import { ParticleBackground } from '@/components/animations/ParticleBackground';
import { CollectionGallery } from '@/components/collection/CollectionGallery';
import { RarityFilter } from '@/components/collection/RarityFilter';
import { ALL_SPECIES_PREVIEW, RARITY_ORDER, getRarityBreakdown } from '@/lib/nftUtils';

export default function CollectionPage() {
    const [selectedRarities, setSelectedRarities] = useState<string[]>([]);

    // Calculate rarity counts
    const rarityCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        RARITY_ORDER.forEach(r => counts[r] = 0);
        ALL_SPECIES_PREVIEW.forEach(nft => {
            if (nft.rarity) {
                counts[nft.rarity] = (counts[nft.rarity] || 0) + 1;
            }
        });
        return counts;
    }, []);

    return (
        <div className="min-h-screen flex flex-col pt-24 relative">
            <ParticleBackground />
            <Container>
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-2">
                        Species Showcase
                    </h1>
                    <p className="text-gray-400 font-inter mb-6">
                        Explore the diversity of the Riftbirds. Hover to see them animate!
                    </p>

                    <RarityFilter
                        selectedRarities={selectedRarities}
                        onSelectionChange={setSelectedRarities}
                        showCounts={rarityCounts}
                    />
                </div>

                <CollectionGallery selectedRarities={selectedRarities} />
            </Container>
        </div>
    );
}
