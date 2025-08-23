import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import TshirtModel from "./TshirtModel";

export default function DesignCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 3], fov: 50 }}
      style={{ background: "#ffffff" }} // white background
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Model */}
      <TshirtModel color="white" />

      {/* Controls (no grid lines, just rotate/zoom) */}
      <OrbitControls enablePan={false} />

      {/* Nice lighting env (optional) */}
      <Environment preset="studio" />
    </Canvas>
  );
}
