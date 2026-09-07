import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function FloatingObject({ mouseX = 0, mouseY = 0 }) {
  const meshRef = useRef();
  const { viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();

    // Slow autonomous rotation
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mouseY * 0.3 + Math.sin(t * 0.3) * 0.1,
      0.05
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouseX * 0.3 + t * 0.15,
      0.05
    );

    // Subtle scale breathing
    const scale = 1 + Math.sin(t * 0.8) * 0.02;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.05, 0.05]}
    >
      <Sphere ref={meshRef} args={[1.6, 128, 128]}>
        <MeshDistortMaterial
          color="#1a1a1a"
          distort={0.45}
          speed={2.5}
          roughness={0.1}
          metalness={0.95}
          envMapIntensity={2}
        />
      </Sphere>
    </Float>
  );
}
