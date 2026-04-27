import { Float, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function Orb() {
  const ref = useRef(null);

  useFrame((_state, delta) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.x += delta * 0.2;
    ref.current.rotation.y += delta * 0.35;
  });

  return (
    <Float speed={2.4} rotationIntensity={0.8} floatIntensity={1.2}>
      <Sphere ref={ref} args={[1.25, 128, 128]} scale={1.7}>
        <MeshDistortMaterial
          color="#7dd3fc"
          emissive="#4f46e5"
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.1}
          distort={0.38}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

function AiOrbCanvas() {
  return (
    <div className="h-[280px] w-full md:h-[360px]">
      <Canvas camera={{ position: [0, 0, 4.8], fov: 45 }}>
        <ambientLight intensity={1.3} />
        <directionalLight position={[2, 2, 2]} intensity={2.2} />
        <Stars
          radius={50}
          depth={20}
          count={500}
          factor={3}
          saturation={0}
          fade
          speed={0.75}
        />
        <Orb />
      </Canvas>
    </div>
  );
}

export default AiOrbCanvas;
