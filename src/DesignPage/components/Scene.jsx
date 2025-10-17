import { Canvas, useThree, extend, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import TshirtModel from "./TshirtModel";
import * as THREE from "three";
import { Suspense, useEffect, useRef, forwardRef, useImperativeHandle } from "react";

// Forward ref component to expose Three.js objects
const SceneContent = forwardRef(({ tshirtColor, designs }, ref) => {
  const { scene, gl, camera } = useThree();
  const groupRef = useRef();
  
  // Expose necessary properties to parent via ref
  useImperativeHandle(ref, () => ({
    scene:scene,
    gl,
    camera,
    tshirtGroup: groupRef.current
  }), [scene, gl, camera]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <group ref={groupRef}>
        <TshirtModel color={tshirtColor} designs={designs} />
      </group>
    </>
  );
});

// Main Scene component
const Scene = forwardRef(({ tshirtColor, designs }, ref) => {
  const canvasRef = useRef(null);
  const sceneContentRef = useRef();

  useImperativeHandle(ref, () => ({
    scene: sceneContentRef.current?.scene || null,
    gl: canvasRef.current?.gl || null,
    camera: sceneContentRef.current?.camera || null,
    tshirtGroup: sceneContentRef.current?.tshirtGroup || null,
  }));

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
        preserveDrawingBuffer: true, // required for PNG export
      }}
      onCreated={({ gl }) => {
        if ("outputColorSpace" in gl) gl.outputColorSpace = THREE.SRGBColorSpace;
        else gl.outputEncoding = THREE.sRGBEncoding;
        gl.setClearColor(0xf0f0f0, 1);
      }}
    >
      <Suspense fallback={null}>
        <SceneContent
          ref={sceneContentRef}
          tshirtColor={tshirtColor}
          designs={designs}
        />
      </Suspense>

      <OrbitControls enablePan enableZoom enableRotate minDistance={3} maxDistance={10} />
    </Canvas>
  );
});

Scene.displayName = "Scene";

export default Scene;