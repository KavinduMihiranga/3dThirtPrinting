import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import TshirtModel from "./TshirtModel";
import * as THREE from "three";
import { Suspense, useEffect, useRef } from "react";

export default function Scene({ tshirtColor, designs }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current?.gl?.domElement;
    if (!canvas) return;

    const onLost = (e) => {
      e.preventDefault();
      console.warn("WebGL context lost");
    };
    const onRestored = () => {
      console.info("WebGL context restored");
    };

    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost, false);
      canvas.removeEventListener("webglcontextrestored", onRestored, false);
    };
  }, []);

  return (
    <Canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
      dpr={[1, 2]}
      camera={{ position: [5, 5, 5], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      onCreated={({ gl }) => {
        // Color space compatibility across three versions
        if ("outputColorSpace" in gl) gl.outputColorSpace = THREE.SRGBColorSpace;
        else gl.outputEncoding = THREE.sRGBEncoding;
        gl.setClearColor(0xf0f0f0, 1);
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <Suspense fallback={null}>
        <TshirtModel color={tshirtColor} designs={designs} />
      </Suspense>

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={3}
        maxDistance={10}
      />
    </Canvas>
  );
}
