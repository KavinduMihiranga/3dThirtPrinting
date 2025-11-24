import { useEffect, useMemo, useRef } from "react";
import { useGLTF, Decal } from "@react-three/drei";
import { Group } from "three";
import * as THREE from "three";

// Preload once
useGLTF.preload("/models/tshirt.glb");

// Helper function to create text texture
const createTextTexture = (text, color = '#000000', fontSize = 64) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
   // Use fixed canvas size for consistent scaling
  const canvasSize = 512;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  
  // Set canvas size based on text length
  const textWidth = Math.max(256, text.length * fontSize * 0.6);
  const textHeight = fontSize * 1.5;
  
  canvas.width = textWidth;
  canvas.height = textHeight;
  
  // Clear canvas with transparent background
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw text
  context.fillStyle = color;
  context.font = `bold ${fontSize}px Arial, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  // Create texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  if ("colorSpace" in texture) texture.colorSpace = THREE.SRGBColorSpace;
  else texture.encoding = THREE.sRGBEncoding;
  
  return texture;
};

export default function TshirtModel({ color, designs, textMeshesRef }) {
  const rootRef = useRef(new Group());
  const { scene } = useGLTF("/models/tshirt.glb");
  const textureCacheRef = useRef(new Map());
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

   // Create textures for all designs with proper caching and font size support
  const designsWithTextures = useMemo(() => {
      console.log("Creating textures for designs:", designs);

    return designs.map(design => {
      if (design.type === "text" && design.text) {
        try {
        // Create a cache key based on text content, color, and font size
        const canvasFontSize = Math.max(32, design.fontSize * 200); // Convert Three.js units to pixels
        const cacheKey = `${design.text}-${design.color}-${canvasFontSize}`;
        
        // Check if we have a cached texture
        if (textureCacheRef.current.has(cacheKey)) {
            console.log("Using cached texture for:", design.text);

          return {
            ...design,
            texture: textureCacheRef.current.get(cacheKey)
          };
        }
        
         // Create new texture
          console.log("Creating new texture for:", design.text, "with font size:", canvasFontSize);
        // Create new texture with the specified font size
        const texture = createTextTexture(design.text, design.color || "#000000", canvasFontSize);
        
        // Cache the texture
        textureCacheRef.current.set(cacheKey, texture);
        
        return {
          ...design,
          texture: texture
        };
      }catch(error){
        console.error("Error creating texture for design:", error);
        return design;
      }
    }return design;
    });
  }, [designs]); // This will regenerate when designs change (including font size)

  // Cleanup textures on unmount
  useEffect(() => {
    return () => {
      // Clean up all cached textures
      console.log("Cleaning up textures");
      textureCacheRef.current.forEach(texture => {
        texture.dispose();
      });
      textureCacheRef.current.clear();
    };
  }, []);
console.log("Rendering TshirtModel with designs:", designsWithTextures);

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
          {/* Render both images and text as decals on the target mesh */}
          {i === targetMeshIndex &&
            designsWithTextures.map((d, di) => {
              if ((d.type === "image" || d.type === "text") && d.texture) {
                return (
                  <Decal
                    key={`decal-${di}-${d.id}`}
                    position={d.position || [0, 0.2, 0.45]}
                    rotation={d.rotation || [0, 0, 0]}
                    scale={d.scale || (d.type === "text" ? d.fontSize * 2 : 0.8)}
                    map={d.texture}
                    transparent
                    polygonOffset
                    polygonOffsetFactor={-1}
                    depthTest
                    depthWrite={false}
                  />
                );
              }
              return null;
            })}
        </mesh>
      ))}
    </group>
  );
}