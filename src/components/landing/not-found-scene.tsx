'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Icosahedron, PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Scene() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <Icosahedron ref={meshRef} args={[1, 15]} scale={2}>
                    <MeshDistortMaterial
                        color="#000000"
                        attach="material"
                        distort={0.6}
                        speed={1.5}
                        roughness={0.4}
                        metalness={0.9}
                        wireframe
                    />
                </Icosahedron>
            </Float>
        </>
    );
}

export default function NotFoundScene() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <Scene />
            </Canvas>
        </div>
    );
}
