'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Scene() {
    const sphereRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (sphereRef.current) {
            sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 10]} intensity={2} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />

            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <Sphere ref={sphereRef} args={[1, 100, 100]} scale={1.5}>
                    <MeshDistortMaterial
                        color="#000000"
                        attach="material"
                        distort={0.4}
                        speed={2}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </Sphere>
            </Float>
        </>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <Scene />
            </Canvas>
        </div>
    );
}
