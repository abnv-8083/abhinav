import { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, AdaptiveDpr } from '@react-three/drei';
import FloatingObject from './FloatingObject';
import SceneLights from './SceneLights';

function SceneFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        style={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #2a2a2a, #080808)',
          boxShadow: '0 0 60px rgba(200,255,0,0.15)',
          animation: 'pulse 3s ease-in-out infinite',
        }}
      />
    </div>
  );
}

export default function HeroScene() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 2;
    const y = -((clientY - top) / height - 0.5) * 2;
    setMouseX(x);
    setMouseY(y);
  }, []);

  return (
    <div
      className="w-full h-full"
      onMouseMove={handleMouseMove}
      role="img"
      aria-label="Interactive 3D metallic sphere"
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <AdaptiveDpr pixelated />
        <SceneLights />
        <Suspense fallback={null}>
          <FloatingObject mouseX={mouseX} mouseY={mouseY} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
