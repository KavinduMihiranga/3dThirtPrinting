import { useEffect, useMemo, useRef } from "react";
import { useGLTF, Decal, Text } from "@react-three/drei";
import { Group } from "three";
import * as THREE from "three";

// Preload once
useGLTF.preload("/models/tshirt.glb");

export default function TshirtModel({ color, designs }) {
  const rootRef = useRef(new Group());
  const { scene } = useGLTF("/models/tshirt.glb");

  // One shared material (prevents creating many materials)
  const materialRef = useRef(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.7,
      metalness: 0.1,
    })
  );

  // Keep material color in sync
  useEffect(() => {
    materialRef.current.color.set(color);
    materialRef.current.needsUpdate = true;
  }, [color]);

  // Extract and clone all meshes from the GLTF once
  const meshes = useMemo(() => {
    const out = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        const m = child.clone(true);
        // Ensure geometry has bounds for decal intersection
        m.geometry.computeBoundingBox?.();
        m.geometry.computeBoundingSphere?.();
        out.push(m);
      }
    });
    return out;
  }, [scene]);

  // Pick the largest mesh (by bbox volume) as the default decal surface
  const targetMeshIndex = useMemo(() => {
    let idx = 0;
    let best = -Infinity;
    meshes.forEach((m, i) => {
      const bb = m.geometry.boundingBox;
      const vol =
        (bb.max.x - bb.min.x) * (bb.max.y - bb.min.y) * (bb.max.z - bb.min.z);
      if (vol > best) {
        best = vol;
        idx = i;
      }
    });
    return idx;
  }, [meshes]);

  // Render all meshes with one shared material.
  // Place decals as children of the *target mesh* so they project correctly.
  return (
    <group ref={rootRef} scale={[2, 2, 2]} position={[0, 0, 0]} dispose={null}>
      {meshes.map((m, i) => (
        <mesh
          key={i}
          geometry={m.geometry}
          position={m.position}
          rotation={m.rotation}
          scale={m.scale}
          castShadow
          receiveShadow
          material={materialRef.current}
        >
          {i === targetMeshIndex &&
            designs.map((d, di) => {
              if (d.type === "image" && d.texture) {
                return (
                  <Decal
                    // Decal uses its *parent mesh* as the surface
                    key={`decal-${di}-${d.id}`}
                    position={d.position || [0, 0.5, 0.4]}
                    rotation={d.rotation || [0, 0, 0]}
                    scale={d.scale || 0.8}
                    map={d.texture}
                    transparent
                    polygonOffset
                    polygonOffsetFactor={-1}
                    depthTest
                    depthWrite={false}
                  />
                );
              } else if (d.type === "text" && d.text) {
                return (
                  <Text
                    key={`text-${di}-${d.id}`}
                    position={d.position || [0, 0.2, 0.45]}
                    rotation={d.rotation || [0, 0, 0]}
                    fontSize={d.fontSize || 0.2}
                    color={d.color || "#000000"}
                    anchorX="center"
                    anchorY="middle"
                  >
                    {d.text}
                  </Text>
                );
              }
              return null;
            })}
        </mesh>
      ))}
    </group>
  );
}
