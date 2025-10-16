import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere, Box, Cylinder } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { Mesh } from "three";

// Check if WebGL is supported
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

interface ThreeDEnvironmentProps {
  environment: string;
}

function BambooForest() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />
      {/* Directional light for shadows */}
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#90ee90" />
      
      {/* Ground */}
      <Sphere args={[50, 32, 32]} position={[0, -50, 0]} receiveShadow>
        <meshStandardMaterial color="#2d5016" roughness={0.8} />
      </Sphere>
      
      {/* Bamboo stalks */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        const height = 8 + Math.random() * 4;
        return (
          <Cylinder
            key={i}
            args={[0.2, 0.2, height, 8]}
            position={[x, height / 2, z]}
            castShadow
          >
            <meshStandardMaterial color="#556b2f" roughness={0.6} />
          </Cylinder>
        );
      })}
      
      {/* Leaves */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 20;
        const y = 8 + Math.random() * 4;
        const z = (Math.random() - 0.5) * 20;
        return (
          <Sphere key={`leaf-${i}`} args={[0.3, 16, 16]} position={[x, y, z]}>
            <meshStandardMaterial color="#90ee90" roughness={0.5} />
          </Sphere>
        );
      })}
    </>
  );
}

function OceanDepths() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#00bfff" />
      <pointLight position={[10, 0, 10]} intensity={0.3} color="#1e90ff" />
      <pointLight position={[-10, 0, -10]} intensity={0.3} color="#4169e1" />
      
      {/* Ocean floor */}
      <Sphere args={[50, 32, 32]} position={[0, -50, 0]} receiveShadow>
        <meshStandardMaterial color="#001f3f" roughness={0.9} />
      </Sphere>
      
      {/* Bioluminescent particles */}
      {Array.from({ length: 50 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 30;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 30;
        const color = i % 3 === 0 ? "#00bfff" : i % 3 === 1 ? "#1e90ff" : "#4169e1";
        return (
          <Sphere key={i} args={[0.1, 8, 8]} position={[x, y, z]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
          </Sphere>
        );
      })}
      
      {/* Coral formations */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        return (
          <Box key={i} args={[0.5, 2 + Math.random() * 2, 0.5]} position={[x, -2, z]}>
            <meshStandardMaterial color="#ff6b9d" roughness={0.7} />
          </Box>
        );
      })}
    </>
  );
}

function AuroraSky() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 10, 5]} intensity={0.5} color="#b19cd9" />
      <pointLight position={[10, 5, 0]} intensity={0.8} color="#98fb98" />
      <pointLight position={[-10, 5, 0]} intensity={0.8} color="#87ceeb" />
      
      {/* Stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      
      {/* Aurora waves */}
      {Array.from({ length: 3 }).map((_, i) => (
        <Sphere
          key={i}
          args={[30, 32, 32]}
          position={[0, 0, -20 - i * 5]}
          rotation={[Math.PI / 4, 0, 0]}
        >
          <meshStandardMaterial
            color={i === 0 ? "#98fb98" : i === 1 ? "#87ceeb" : "#b19cd9"}
            transparent
            opacity={0.3}
            roughness={0.1}
            metalness={0.5}
          />
        </Sphere>
      ))}
      
      {/* Snowy ground */}
      <Sphere args={[50, 32, 32]} position={[0, -50, 0]} receiveShadow>
        <meshStandardMaterial color="#f0f8ff" roughness={0.8} />
      </Sphere>
    </>
  );
}

function TempleGarden() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.9} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffd700" />
      
      {/* Ground */}
      <Sphere args={[50, 32, 32]} position={[0, -50, 0]} receiveShadow>
        <meshStandardMaterial color="#8b7355" roughness={0.9} />
      </Sphere>
      
      {/* Temple pillars */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 10;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <Cylinder key={i} args={[0.5, 0.5, 8, 8]} position={[x, 4, z]} castShadow>
            <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.7} />
          </Cylinder>
        );
      })}
      
      {/* Sacred lotus flowers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 15;
        return (
          <Sphere key={i} args={[0.3, 16, 16]} position={[x, 0.3, z]}>
            <meshStandardMaterial color="#ff69b4" roughness={0.4} />
          </Sphere>
        );
      })}
      
      {/* Zen rocks */}
      {Array.from({ length: 10 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 18;
        const z = (Math.random() - 0.5) * 18;
        return (
          <Box key={i} args={[1, 0.5, 1]} position={[x, 0.25, z]}>
            <meshStandardMaterial color="#808080" roughness={0.8} />
          </Box>
        );
      })}
    </>
  );
}

export function ThreeDEnvironment({ environment }: ThreeDEnvironmentProps) {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
  }, []);

  // While checking WebGL support
  if (webGLSupported === null) {
    return null;
  }

  // Fallback to gradient when WebGL is not supported
  if (!webGLSupported) {
    const gradients = {
      bamboo: "bg-gradient-to-br from-emerald-900/40 to-green-950/60",
      ocean: "bg-gradient-to-br from-blue-900/40 to-cyan-950/60",
      aurora: "bg-gradient-to-br from-purple-900/40 to-indigo-950/60",
      temple: "bg-gradient-to-br from-amber-900/40 to-orange-950/60",
    };
    const bgClass = gradients[environment as keyof typeof gradients] || gradients.bamboo;
    
    return (
      <div className={`fixed inset-0 -z-10 ${bgClass}`} data-testid="3d-fallback-gradient" />
    );
  }

  // WebGL is supported, render 3D Canvas
  return (
    <div className="fixed inset-0 -z-10" data-testid="3d-canvas-container">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        onCreated={(state) => {
          console.log('Three.js Canvas created successfully');
        }}
      >
        {environment === "bamboo" && <BambooForest />}
        {environment === "ocean" && <OceanDepths />}
        {environment === "aurora" && <AuroraSky />}
        {environment === "temple" && <TempleGarden />}
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={30}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
