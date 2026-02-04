'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.cjs';
import * as THREE from 'three';

function StarField(props: Record<string, unknown>) {
    const ref = useRef<THREE.Points>(null);

    // Generate random points in a sphere
    const sphere = useMemo(() => {
        // 5000 stars, radius 1.5
        return random.inSphere(new Float32Array(5000), { radius: 1.5 }) as Float32Array;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#00FFFF" // Neon Cyan stars
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

export function ParticleBackground() {
    return (
        <div className="fixed inset-0 z-[-1] bg-[#0A0E27]">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <StarField />
            </Canvas>
        </div>
    );
}
