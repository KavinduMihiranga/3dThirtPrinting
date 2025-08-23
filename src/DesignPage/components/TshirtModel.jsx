import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from '@react-three/drei';
import * as THREE from 'three';
import { OrbitControls, useGLTF, Decal, Text } from '@react-three/drei';

// TshirtModel Component
const TshirtModel = ({ color, designs }) => {
  const groupRef = useRef();
  const { scene } = useGLTF("/models/tshirt.glb");
  const [clonedScene, setClonedScene] = useState(null);

  // Clone the scene and create a custom material
  useEffect(() => {
    if (!scene) return;
    
    const sceneClone = scene.clone();
    setClonedScene(sceneClone);
    
    const customMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.7,
      metalness: 0.1,
    });
    
    sceneClone.traverse((child) => {
      if (child.isMesh) {
        child.material = customMaterial;
      }
    });
  }, [scene]);

  // Update material color when color changes
  useEffect(() => {
    if (!clonedScene) return;
    
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(color);
        child.material.needsUpdate = true;
      }
    });
  }, [color, clonedScene]);

  if (!clonedScene) return null;

  return (
    <group ref={groupRef} scale={[2, 2, 2]} position={[0, 0, 0]}>
      <primitive object={clonedScene} position={[0, 0, 0]}/>
      
      {/* Render all designs */}
      {designs.map((design, index) => {
        if (design.type === 'image' && design.texture) {
          return (
            <Decal
              key={index}
              position={design.position || [0, 0.5, 0.4]}
              rotation={design.rotation || [0, 0, 0]}
              scale={design.scale || 0.8}
              map={design.texture}
              transparent
            />
          );
        } else if (design.type === 'text' && design.text) {
          return (
            <Text
              key={index}
              position={design.position || [0, 0.2, 0.45]}
              rotation={design.rotation || [0, 0, 0]}
              fontSize={design.fontSize || 0.2}
              color={design.color || "black"}
              anchorX="center"
              anchorY="middle"
            >
              {design.text}
            </Text>
          );
        }
        return null;
      })}
    </group>
  );
};

// Scene Component
const Scene = ({ tshirtColor, designs }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const handleContextLost = (event) => {
      event.preventDefault();
      console.warn('WebGL context lost');
    };

    const handleContextRestored = () => {
      console.info('WebGL context restored');
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost, false);
      canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, []);

  return (
    <div style={{width: '100%', height: '100%', display: 'block'}}>
      <Canvas
        ref={canvasRef}
        style={{width: '100%', height: '100%', display: 'block'}}
        gl={{
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
          antialias: true,
          alpha: true
        }}
        dpr={[1, 2]}
        camera={{ position: [5, 5, 5], fov: 45 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0xf0f0f0, 1);
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <TshirtModel color={tshirtColor} designs={designs} />
        </Suspense>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

// Dashboard Component
function Dashboard() {
  const [tshirtColor, setTshirtColor] = useState('#3b82f6');
  const [designs, setDesigns] = useState([]);
  const [selectedDesignIndex, setSelectedDesignIndex] = useState(null);
  const [sizes, setSizes] = useState({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0,
  });
  const fileInputRef = useRef(null);

  const handleSizeChange = useCallback((size, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      setSizes(prev => ({ ...prev, [size]: numValue }));
    }
  }, []);

  const colorOptions = [
    '#000000', '#ffffff', '#ef4444', '#10b981', '#3b82f6', 
    '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#6366f1'
  ];

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
          imageUrl,
          (texture) => {
            texture.encoding = THREE.sRGBEncoding;
            texture.flipY = false;
            
            // Add the new design to the list
            setDesigns(prev => [
              ...prev, 
              {
                type: 'image',
                texture: texture,
                position: [0, 0.5, 0.4],
                rotation: [0, 0, 0],
                scale: 0.8,
                preview: imageUrl
              }
            ]);
            setSelectedDesignIndex(designs.length);
          },
          undefined,
          (error) => {
            console.error('Error loading texture:', error);
            alert('Failed to load image');
          }
        );
      };
      
      reader.onerror = () => {
        alert('Error reading image file');
      };
      
      reader.readAsDataURL(file);
    }
  }, [designs.length]);

  const handleAddText = useCallback(() => {
    const text = prompt('Enter text for your T-shirt:');
    if (text && text.trim()) {
      setDesigns(prev => [
        ...prev, 
        {
          type: 'text',
          text: text.trim(),
          color: '#000000',
          fontSize: 0.2,
          position: [0, 0.2, 0.45],
          rotation: [0, 0, 0]
        }
      ]);
      setSelectedDesignIndex(designs.length);
    }
  }, [designs.length]);

  const handleRemoveDesign = useCallback((index) => {
    setDesigns(prev => prev.filter((_, i) => i !== index));
    if (selectedDesignIndex === index) {
      setSelectedDesignIndex(null);
    } else if (selectedDesignIndex > index) {
      setSelectedDesignIndex(selectedDesignIndex - 1);
    }
  }, [selectedDesignIndex]);

  const handleSelectDesign = useCallback((index) => {
    setSelectedDesignIndex(index);
  }, []);

  const handleDesignPositionChange = useCallback((index, axis, value) => {
    setDesigns(prev => {
      const newDesigns = [...prev];
      const newPosition = [...newDesigns[index].position];
      newPosition[axis] = parseFloat(value) || 0;
      newDesigns[index] = {
        ...newDesigns[index],
        position: newPosition
      };
      return newDesigns;
    });
  }, []);

  const handleDesignRotationChange = useCallback((index, axis, value) => {
    setDesigns(prev => {
      const newDesigns = [...prev];
      const newRotation = [...newDesigns[index].rotation];
      newRotation[axis] = parseFloat(value) || 0;
      newDesigns[index] = {
        ...newDesigns[index],
        rotation: newRotation
      };
      return newDesigns;
    });
  }, []);

  const handleDesignScaleChange = useCallback((index, value) => {
    setDesigns(prev => {
      const newDesigns = [...prev];
      newDesigns[index] = {
        ...newDesigns[index],
        scale: parseFloat(value) || 0.8
      };
      return newDesigns;
    });
  }, []);

  const handleTextColorChange = useCallback((index, color) => {
    setDesigns(prev => {
      const newDesigns = [...prev];
      newDesigns[index] = {
        ...newDesigns[index],
        color: color
      };
      return newDesigns;
    });
  }, []);

  const handleTextSizeChange = useCallback((index, size) => {
    setDesigns(prev => {
      const newDesigns = [...prev];
      newDesigns[index] = {
        ...newDesigns[index],
        fontSize: parseFloat(size) || 0.2
      };
      return newDesigns;
    });
  }, []);

  const calculateTotalItems = useCallback(() => {
    return Object.values(sizes).reduce((total, count) => total + count, 0);
  }, [sizes]);

  const calculatePrice = useCallback(() => {
    const basePrice = 2000;
    const totalItems = calculateTotalItems();
    return basePrice * totalItems;
  }, [calculateTotalItems]);

  const handleSaveAndOrder = useCallback(() => {
    const totalItems = calculateTotalItems();
    if (totalItems === 0) {
      alert('Please add at least one item to your order');
      return;
    }
    
    alert(`Order placed successfully! Total: Rs ${calculatePrice()}.00`);
  }, [calculatePrice, calculateTotalItems]);

  const totalItems = calculateTotalItems();
  const selectedDesign = selectedDesignIndex !== null ? designs[selectedDesignIndex] : null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-md grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        
        {/* Left Panel */}
        <div className="col-span-1 space-y-3">
          <div className="space-y-2">
            <button className="bg-blue-300 px-4 py-2 rounded-full w-full hover:bg-blue-400 transition-colors text-sm md:text-base">
              👕 T-shirt
            </button>
            <button className="bg-cyan-200 px-4 py-2 rounded-full w-full hover:bg-cyan-300 transition-colors text-sm md:text-base">
              👨 Men
            </button>
            <button className="bg-rose-400 px-4 py-2 rounded-full w-full hover:bg-rose-500 transition-colors text-sm md:text-base">
              🎨 ScreenPrint
            </button>
            <button className="bg-green-400 px-4 py-2 rounded-full w-full hover:bg-green-500 transition-colors text-sm md:text-base">
              📏 220GSM
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <button 
              onClick={handleAddText}
              className="flex items-center gap-2 border p-2 rounded w-full hover:bg-gray-50 transition-colors text-sm md:text-base"
            >
              <span className="bg-black px-3 py-1 rounded text-white text-sm">T</span> 
              Add Text
            </button>
            
            <label className="flex items-center gap-2 border p-2 rounded w-full hover:bg-gray-50 transition-colors cursor-pointer text-sm md:text-base">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <img 
                src="https://www.svgrepo.com/show/448213/image-add.svg" 
                alt="Add" 
                className="w-5 h-5" 
              />
              Add Image
            </label>

            {designs.length > 0 && (
              <button 
                onClick={() => handleRemoveDesign(selectedDesignIndex)}
                className="flex items-center gap-2 border p-2 rounded w-full hover:bg-red-50 text-red-600 transition-colors text-sm md:text-base"
                disabled={selectedDesignIndex === null}
              >
                <span className="text-red-600">✕</span>
                Remove Selected Design
              </button>
            )}
          </div>

          {/* Designs List */}
          {designs.length > 0 && (
            <div className="bg-gray-100 rounded p-3 md:p-4 mt-4">
              <div className="text-sm font-medium mb-3">🎨 Your Designs</div>
              <div className="space-y-2">
                {designs.map((design, index) => (
                  <div 
                    key={index}
                    className={`flex items-center p-2 rounded cursor-pointer ${selectedDesignIndex === index ? 'bg-blue-100 border border-blue-300' : 'bg-white'}`}
                    onClick={() => handleSelectDesign(index)}
                  >
                    {design.type === 'image' && design.preview ? (
                      <img 
                        src={design.preview} 
                        alt="Design preview" 
                        className="w-8 h-8 object-contain mr-2"
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-200 mr-2 rounded">
                        <span className="text-xs">T</span>
                      </div>
                    )}
                    <span className="text-sm">
                      {design.type === 'image' ? 'Image' : `Text: ${design.text}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Design Controls */}
          {selectedDesign && (
            <div className="bg-gray-100 rounded p-3 md:p-4 mt-4">
              <div className="text-sm font-medium mb-3">⚙️ Design Settings</div>
              
              {/* Position Controls */}
              <div className="mb-3">
                <div className="text-xs font-medium mb-1">Position</div>
                <div className="grid grid-cols-3 gap-2">
                  {['X', 'Y', 'Z'].map((axis, i) => (
                    <div key={axis}>
                      <label className="text-xs block mb-1">{axis}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={selectedDesign.position[i]}
                        onChange={(e) => handleDesignPositionChange(selectedDesignIndex, i, e.target.value)}
                        className="w-full p-1 text-xs rounded border border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Rotation Controls */}
              <div className="mb-3">
                <div className="text-xs font-medium mb-1">Rotation</div>
                <div className="grid grid-cols-3 gap-2">
                  {['X', 'Y', 'Z'].map((axis, i) => (
                    <div key={axis}>
                      <label className="text-xs block mb-1">{axis}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={selectedDesign.rotation[i]}
                        onChange={(e) => handleDesignRotationChange(selectedDesignIndex, i, e.target.value)}
                        className="w-full p-1 text-xs rounded border border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Scale Control for Images */}
              {selectedDesign.type === 'image' && (
                <div className="mb-3">
                  <label className="text-xs font-medium block mb-1">Scale</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedDesign.scale}
                    onChange={(e) => handleDesignScaleChange(selectedDesignIndex, e.target.value)}
                    className="w-full p-1 text-xs rounded border border-gray-300"
                  />
                </div>
              )}
              
              {/* Text Controls */}
              {selectedDesign.type === 'text' && (
                <>
                  <div className="mb-3">
                    <label className="text-xs font-medium block mb-1">Text Color</label>
                    <input
                      type="color"
                      value={selectedDesign.color}
                      onChange={(e) => handleTextColorChange(selectedDesignIndex, e.target.value)}
                      className="w-full h-8 rounded border border-gray-300"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="text-xs font-medium block mb-1">Text Size</label>
                    <input
                      type="number"
                      step="0.05"
                      value={selectedDesign.fontSize}
                      onChange={(e) => handleTextSizeChange(selectedDesignIndex, e.target.value)}
                      className="w-full p-1 text-xs rounded border border-gray-300"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Color Picker */}
          <div className="bg-gray-100 rounded p-3 md:p-4 mt-4">
            <div className="text-sm font-medium mb-3">🎨 T-Shirt Color</div>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 transition-colors ${
                    tshirtColor === color ? 'border-gray-700 ring-2 ring-offset-1' : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setTshirtColor(color)}
                  title={color}
                />
              ))}
            </div>
            <div className="mt-3">
              <label className="text-sm font-medium mb-1 block">Custom Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={tshirtColor}
                  onChange={(e) => setTshirtColor(e.target.value)}
                  className="w-10 h-10 cursor-pointer rounded"
                />
                <input
                  type="text"
                  value={tshirtColor}
                  onChange={(e) => setTshirtColor(e.target.value)}
                  className="flex-1 p-2 rounded border border-gray-300 text-sm"
                  placeholder="#color"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center 3D Preview */}
        <div className="col-span-3 h-80 lg:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg relative overflow-hidden">
          <Scene 
            tshirtColor={tshirtColor} 
            designs={designs}
            key={`${tshirtColor}-${designs.length}`}
          />
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-xs text-gray-600 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm">
            🖱️ Drag to rotate • 🔍 Scroll to zoom
          </div>
          
          {selectedDesign && selectedDesign.type === 'image' && selectedDesign.preview && (
            <div className="absolute top-2 right-2 bg-white/90 rounded-lg p-2 shadow-md">
              <img 
                src={selectedDesign.preview} 
                alt="Selected design" 
                className="w-12 h-12 object-contain rounded"
              />
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="col-span-1 space-y-4">
          <button 
            onClick={handleSaveAndOrder}
            disabled={totalItems === 0}
            className="bg-green-600 text-white px-4 py-3 rounded-lg w-full hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm md:text-base"
          >
            💾 Save and Order
          </button>

          <div className="bg-gray-100 rounded-lg p-3 md:p-4 text-center">
            <div className="text-sm font-medium mb-2">Selected Color</div>
            <div 
              className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-lg border-2 border-gray-300 shadow-md"
              style={{ backgroundColor: tshirtColor }}
            ></div>
            <div className="text-xs text-gray-600 mt-2 font-mono break-all">
              {tshirtColor}
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-3 md:p-4">
            <div className="text-sm font-medium mb-2">Total Items</div>
            <div className="text-2xl font-bold text-center text-green-600">
              {totalItems}
            </div>
            <div className="text-xs text-gray-500 text-center mt-1">
              across all sizes
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-3 md:p-4">
            <div className="font-medium mb-3 text-sm">Sizes Distribution</div>
            {Object.entries(sizes).map(([size, count]) => (
              <div key={size} className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{size}</span>
                <input
                  type="number"
                  value={count}
                  min="0"
                  max="100"
                  onChange={(e) => handleSizeChange(size, e.target.value)}
                  className="w-14 text-center p-1 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="max-w-7xl mx-auto mt-4 md:mt-6 p-4 md:p-6 bg-white rounded-lg shadow flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-600">Total Items</div>
          <div className="text-lg font-semibold">{totalItems} items</div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Price</div>
          <div className="text-2xl font-bold text-green-600">
            Rs {calculatePrice()}.00
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;