import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const generatePoints = (count, radius) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random()) * radius; 
    
    const sinPhi = Math.sin(phi);
    positions[i * 3] = r * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
};

// Night Theme: Starry Particle Field
const NightTheme = () => {
  const ref = useRef();
  const positions = useMemo(() => generatePoints(5000, 3), []);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
      
      const targetRotationX = mouse.current.y * 0.2;
      const targetRotationY = mouse.current.x * 0.2;
      
      ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * 0.05;
      ref.current.rotation.y += (targetRotationY - ref.current.rotation.y) * 0.05;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#2dd4bf"
          size={0.006}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

// Day Theme: Floating Liquid Orbs
const DayTheme = () => {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#2dd4bf" />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
        <Sphere position={[-2, 1, -3]} args={[0.8, 32, 32]}>
          <MeshDistortMaterial color="#38bdf8" distort={0.4} speed={2} transparent opacity={0.6} roughness={0} />
        </Sphere>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
        <Sphere position={[2, -1, -4]} args={[1.2, 32, 32]}>
          <MeshDistortMaterial color="#818cf8" distort={0.3} speed={1.5} transparent opacity={0.5} roughness={0} />
        </Sphere>
      </Float>
      
      <Float speed={2.5} rotationIntensity={1} floatIntensity={1}>
        <Sphere position={[0, -2, -2]} args={[0.6, 32, 32]}>
          <MeshDistortMaterial color="#34d399" distort={0.5} speed={3} transparent opacity={0.7} roughness={0} />
        </Sphere>
      </Float>
    </>
  );
};

export default function Background3D() {
  const [isLightMode, setIsLightMode] = useState(document.documentElement.getAttribute('data-theme') === 'light');

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setIsLightMode(document.documentElement.getAttribute('data-theme') === 'light');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 1.5], fov: 60 }}
        dpr={[1, 1.5]} // Crucial: limits pixel ratio on high-res displays to fix lag
        performance={{ min: 0.5 }} // Allows downgrade of quality when lagging
      >
        {isLightMode ? <DayTheme /> : <NightTheme />}
      </Canvas>
    </div>
  );
}
