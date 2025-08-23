import React, { useState, useRef, useCallback } from "react";
import Scene from "../components/Scene";
import * as THREE from "three";

function Dashboard() {
  const [tshirtColor, setTshirtColor] = useState("#3b82f6");
  const [designs, setDesigns] = useState([]);
  const [selectedDesignIndex, setSelectedDesignIndex] = useState(null);
  const [sizes, setSizes] = useState({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, "2XL": 0, "3XL": 0,
  });

  const fileInputRef = useRef(null);
  const colorOptions = [
    "#000000","#ffffff","#ef4444","#10b981","#3b82f6",
    "#f59e0b","#8b5cf6","#06b6d4","#f97316","#6366f1",
  ];

  // Image upload -> GPU texture
  const handleImageUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;

      const loader = new THREE.TextureLoader();
      loader.load(
        imageUrl,
        (texture) => {
          // three r150+: colorSpace; older: encoding
          if ("colorSpace" in texture) texture.colorSpace = THREE.SRGBColorSpace;
          else texture.encoding = THREE.sRGBEncoding;
          texture.flipY = false;
          texture.anisotropy = 8;

          const newDesign = {
            id: crypto.randomUUID?.() || String(Date.now()),
            type: "image",
            texture,
            position: [0, 0.5, 0.4],
            rotation: [0, 0, 0],
            scale: 0.8,
            preview: imageUrl,
          };

          setDesigns((prev) => {
            const next = [...prev, newDesign];
            // Select the newly added design
            setSelectedDesignIndex(next.length - 1);
            return next;
          });
        },
        undefined,
        (err) => {
          console.error("Texture load error:", err);
          alert("Failed to load image");
        }
      );
    };
    reader.onerror = () => alert("Error reading image file");
    reader.readAsDataURL(file);

    // reset input so same file can re-trigger
    event.target.value = "";
  }, []);

  const handleAddText = useCallback(() => {
    const text = prompt("Enter text for your T-shirt:")?.trim();
    if (!text) return;
    const newDesign = {
      id: crypto.randomUUID?.() || String(Date.now()),
      type: "text",
      text,
      color: "#000000",
      fontSize: 0.2,
      position: [0, 0.2, 0.45],
      rotation: [0, 0, 0],
    };
    setDesigns((prev) => {
      const next = [...prev, newDesign];
      setSelectedDesignIndex(next.length - 1);
      return next;
    });
  }, []);

  const handleRemoveDesign = useCallback(
    (index) => {
      if (index == null || index < 0) return;
      setDesigns((prev) => {
        const copy = [...prev];
        const removed = copy[index];
        if (removed?.type === "image" && removed.texture) {
          removed.texture.dispose(); // free GPU memory
        }
        copy.splice(index, 1);
        return copy;
      });

      setSelectedDesignIndex((sel) => {
        if (sel == null) return sel;
        if (sel === index) return null;
        if (sel > index) return sel - 1;
        return sel;
      });
    },
    []
  );

  const handleSelectDesign = useCallback((index) => {
    setSelectedDesignIndex(index);
  }, []);

  // Position/rotation/scale controls
  const handleDesignPositionChange = useCallback((index, axis, value) => {
    const n = parseFloat(value);
    setDesigns((prev) => {
      const next = [...prev];
      const pos = [...(next[index].position || [0, 0, 0])];
      pos[axis] = Number.isFinite(n) ? n : 0;
      next[index] = { ...next[index], position: pos };
      return next;
    });
  }, []);

  const handleDesignRotationChange = useCallback((index, axis, value) => {
    const n = parseFloat(value);
    setDesigns((prev) => {
      const next = [...prev];
      const rot = [...(next[index].rotation || [0, 0, 0])];
      rot[axis] = Number.isFinite(n) ? n : 0;
      next[index] = { ...next[index], rotation: rot };
      return next;
    });
  }, []);

  const handleDesignScaleChange = useCallback((index, value) => {
    const n = parseFloat(value);
    setDesigns((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], scale: Number.isFinite(n) ? n : 0.8 };
      return next;
    });
  }, []);

  const handleTextColorChange = useCallback((index, color) => {
    setDesigns((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], color };
      return next;
    });
  }, []);

  const handleTextSizeChange = useCallback((index, size) => {
    const n = parseFloat(size);
    setDesigns((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], fontSize: Number.isFinite(n) ? n : 0.2 };
      return next;
    });
  }, []);

  const handleSizeChange = useCallback((size, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      setSizes((prev) => ({ ...prev, [size]: numValue }));
    }
  }, []);

  const totalItems = Object.values(sizes).reduce((a, b) => a + b, 0);
  const calculatePrice = useCallback(() => 2000 * totalItems, [totalItems]);

  const selectedDesign =
    selectedDesignIndex != null ? designs[selectedDesignIndex] : null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-md grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Left Panel */}
        <div className="col-span-1 space-y-3">
          <div className="space-y-2">
            <button className="bg-blue-300 px-4 py-2 rounded-full w-full">👕 T-shirt</button>
            <button className="bg-cyan-200 px-4 py-2 rounded-full w-full">👨 Men</button>
            <button className="bg-rose-400 px-4 py-2 rounded-full w-full">🎨 ScreenPrint</button>
            <button className="bg-green-400 px-4 py-2 rounded-full w-full">📏 220GSM</button>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleAddText}
              className="flex items-center gap-2 border p-2 rounded w-full hover:bg-gray-50 transition-colors"
            >
              <span className="bg-black px-3 py-1 rounded text-white text-sm">T</span>
              Add Text
            </button>

            <label className="flex items-center gap-2 border p-2 rounded w-full hover:bg-gray-50 transition-colors cursor-pointer">
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
                className="flex items-center gap-2 border p-2 rounded w-full hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
                disabled={selectedDesignIndex == null}
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
                    key={design.id}
                    className={`flex items-center p-2 rounded cursor-pointer ${
                      selectedDesignIndex === index
                        ? "bg-blue-100 border border-blue-300"
                        : "bg-white"
                    }`}
                    onClick={() => handleSelectDesign(index)}
                  >
                    {design.type === "image" && design.preview ? (
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
                      {design.type === "image" ? "Image" : `Text: ${design.text}`}
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
                  {["X", "Y", "Z"].map((axis, i) => (
                    <div key={axis}>
                      <label className="text-xs block mb-1">{axis}</label>
                      <input
                        type="number"
                        step="0.05"
                        value={selectedDesign.position[i]}
                        onChange={(e) =>
                          handleDesignPositionChange(selectedDesignIndex, i, e.target.value)
                        }
                        className="w-full p-1 text-xs rounded border border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Rotation Controls (radians) */}
              <div className="mb-3">
                <div className="text-xs font-medium mb-1">
                  Rotation (radians, e.g. 3.1416 = 180°)
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["X", "Y", "Z"].map((axis, i) => (
                    <div key={axis}>
                      <label className="text-xs block mb-1">{axis}</label>
                      <input
                        type="number"
                        step="0.05"
                        value={selectedDesign.rotation[i]}
                        onChange={(e) =>
                          handleDesignRotationChange(selectedDesignIndex, i, e.target.value)
                        }
                        className="w-full p-1 text-xs rounded border border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Scale control for images */}
              {selectedDesign.type === "image" && (
                <div className="mb-3">
                  <label className="text-xs font-medium block mb-1">Scale</label>
                  <input
                    type="number"
                    step="0.05"
                    value={selectedDesign.scale}
                    onChange={(e) =>
                      handleDesignScaleChange(selectedDesignIndex, e.target.value)
                    }
                    className="w-full p-1 text-xs rounded border border-gray-300"
                  />
                </div>
              )}

              {/* Text Controls */}
              {selectedDesign.type === "text" && (
                <>
                  <div className="mb-3">
                    <label className="text-xs font-medium block mb-1">Text Color</label>
                    <input
                      type="color"
                      value={selectedDesign.color}
                      onChange={(e) =>
                        handleTextColorChange(selectedDesignIndex, e.target.value)
                      }
                      className="w-full h-8 rounded border border-gray-300"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="text-xs font-medium block mb-1">Text Size</label>
                    <input
                      type="number"
                      step="0.05"
                      value={selectedDesign.fontSize}
                      onChange={(e) =>
                        handleTextSizeChange(selectedDesignIndex, e.target.value)
                      }
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
                    tshirtColor === color
                      ? "border-gray-700 ring-2 ring-offset-1"
                      : "border-gray-300 hover:border-gray-500"
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
          <Scene tshirtColor={tshirtColor} designs={designs} />
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-xs text-gray-600 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm">
            🖱️ Drag to rotate • 🔍 Scroll to zoom
          </div>
          {selectedDesign && selectedDesign.type === "image" && selectedDesign.preview && (
            <div className="absolute top-2 right-2 bg-white/90 rounded-lg p-2 shadow-md">
              <img
                src={selectedDesign.preview}
                alt="Selected design"
                className="w-12 h-12 object-contain rounded"
              />
            </div>
          )}
        </div>

        {/* Right Panel (order + sizes) */}
        <div className="col-span-1 space-y-4">
          <button
            onClick={() => {
              if (totalItems === 0) return alert("Please add at least one item");
              alert(`Order placed successfully! Total: Rs ${calculatePrice()}.00`);
            }}
            disabled={totalItems === 0}
            className="bg-green-600 text-white px-4 py-3 rounded-lg w-full hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            💾 Save and Order
          </button>

          <div className="bg-gray-100 rounded-lg p-3 md:p-4 text-center">
            <div className="text-sm font-medium mb-2">Selected Color</div>
            <div
              className="w-16 h-16 mx-auto rounded-lg border-2 border-gray-300 shadow-md"
              style={{ backgroundColor: tshirtColor }}
            />
            <div className="text-xs text-gray-600 mt-2 font-mono break-all">{tshirtColor}</div>
          </div>

          <div className="bg-gray-100 rounded-lg p-3 md:p-4">
            <div className="text-sm font-medium mb-2">Total Items</div>
            <div className="text-2xl font-bold text-center text-green-600">{totalItems}</div>
            <div className="text-xs text-gray-500 text-center mt-1">across all sizes</div>
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
          <div className="text-2xl font-bold text-green-600">Rs {calculatePrice()}.00</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
