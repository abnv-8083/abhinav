import { useRef } from 'react';

export default function SceneLights() {
  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.15} />

      {/* Key light — accent color */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        color="#c8ff00"
      />

      {/* Rim light — cool blue */}
      <pointLight
        position={[-4, -2, -4]}
        intensity={2}
        color="#0066ff"
        distance={12}
      />

      {/* Fill — warm */}
      <pointLight
        position={[3, -3, 2]}
        intensity={0.8}
        color="#ff6633"
        distance={10}
      />

      {/* Top subtle */}
      <spotLight
        position={[0, 8, 0]}
        intensity={0.5}
        color="#ffffff"
        penumbra={1}
      />
    </>
  );
}
