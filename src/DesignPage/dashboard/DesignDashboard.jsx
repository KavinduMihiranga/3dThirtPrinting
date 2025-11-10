import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Scene from "../components/Scene";
import * as THREE from "three";
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { saveAs } from "file-saver"; 
import axios from "axios";

function DesignDashboard() {
  const navigate = useNavigate();
  const [tshirtColor, setTshirtColor] = useState("#3b82f6");
  const [designs, setDesigns] = useState([]);
  const [selectedDesignIndex, setSelectedDesignIndex] = useState(null);
  const [sizes, setSizes] = useState({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, "2XL": 0, "3XL": 0,
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [exportStatus, setExportStatus] = useState({ isExporting: false, message: "" });

  const fileInputRef = useRef(null);
  const colorOptions = [
    "#000000","#ffffff","#ef4444","#10b981","#3b82f6",
    "#f59e0b","#8b5cf6","#06b6d4","#f97316","#6366f1",
  ];
  const canvasRef = useRef();

  // Enhanced Download as GLB (3D model) with error handling
  const handleDownloadGLB = () => {
    if (!canvasRef.current?.tshirtGroup) return;

    const exporter = new GLTFExporter();
    exporter.parse(
      canvasRef.current.tshirtGroup,
      (result) => {
        const blob = new Blob([result], { type: "model/gltf-binary" });
        saveAs(blob, "tshirt.glb");
      },
      { binary: true }
    );
  };

  // Download as GLTF (JSON format)
  const handleDownloadGLTF = () => {
    if (!canvasRef.current?.tshirtGroup) return;

    const exporter = new GLTFExporter();
    exporter.parse(
      canvasRef.current.tshirtGroup,
      (result) => {
        const output = JSON.stringify(result, null, 2);
        const blob = new Blob([output], { type: "application/json" });
        saveAs(blob, "tshirt.gltf");
      },
      { binary: false }
    );
  };

  // Export PNG (snapshot)
  const handleDownloadPNG = () => {
    if (!canvasRef.current?.gl) return;

    const renderer = canvasRef.current.gl;
    const dataURL = renderer.domElement.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "tshirt.png";
    link.click();
  };

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
          texture.needsUpdate = true;
          
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
            fileName: file.name,
            fileSize: file.size,
          };

          setDesigns((prev) => {
            const next = [...prev, newDesign];
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
          removed.texture.dispose();
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

  const handleCustomerInfoChange = useCallback((field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  const totalItems = Object.values(sizes).reduce((a, b) => a + b, 0);
  const calculatePrice = useCallback(() => 2000 * totalItems, [totalItems]);

  const selectedDesign = selectedDesignIndex != null ? designs[selectedDesignIndex] : null;

  // Get design summary for order
  const getDesignSummary = () => {
    return designs.map(design => ({
      type: design.type,
      ...(design.type === 'text' && { text: design.text, color: design.color, fontSize: design.fontSize }),
      ...(design.type === 'image' && { fileName: design.fileName, fileSize: design.fileSize }),
      position: design.position,
      rotation: design.rotation,
      scale: design.scale || 1
    }));
  };

  // Enhanced Save & Order function with proper data
  const handleSaveOrder = async () => {
    if (!canvasRef.current?.tshirtGroup) {
      alert('No design to save');
      return;
    }

    // Validate customer info
    if (!customerInfo.name.trim() || !customerInfo.email.trim()) {
      alert('Please enter your name and email');
      return;
    }

    // Validate order quantity
    if (totalItems === 0) {
      alert('Please select at least one item');
      return;
    }

    try {
      setExportStatus({ isExporting: true, message: "Exporting design..." });
      
      const exporter = new GLTFExporter();
      
      exporter.parse(
        canvasRef.current.tshirtGroup,
        async (gltfData) => {
          try {
            const blob = new Blob([gltfData], { type: "model/gltf-binary" });
            console.log('GLB Blob size:', blob.size, 'bytes');
            
            // Take PNG snapshot for preview
            let pngDataURL = null;
            if (canvasRef.current?.gl?.domElement) {
              pngDataURL = canvasRef.current.gl.domElement.toDataURL("image/png");
            }

            // Prepare design data
            const designData = {
              designs: getDesignSummary(),
              tshirtColor,
              sizes,
              totalItems,
              totalPrice: calculatePrice(),
              customerInfo,
              timestamp: new Date().toISOString()
            };

            // Store in localStorage for checkout
            localStorage.setItem('pendingDesignOrder', JSON.stringify({
              designData,
              preview: pngDataURL,
              timestamp: Date.now()
            }));

            // Create FormData with actual design data
            const formData = new FormData();
            formData.append('customerName', customerInfo.name);
            formData.append('email', customerInfo.email);
            formData.append('phone', customerInfo.phone || '');
            formData.append('notes', customerInfo.notes || '');
            formData.append('designData', JSON.stringify(designData));
            formData.append('totalItems', totalItems.toString());
            formData.append('totalPrice', calculatePrice().toString());
            formData.append('tshirtColor', tshirtColor);
            formData.append('sizes', JSON.stringify(sizes));
            formData.append('designPreview', pngDataURL || '');
            formData.append('designFile', blob, 'tshirt-design.glb');

            setExportStatus({ isExporting: true, message: "Uploading design..." });

            const res = await axios.post(
              "http://localhost:5000/api/design-inquiry", 
              formData,
              {
                headers: { 
                  'Content-Type': 'multipart/form-data' 
                },
                timeout: 30000
              }
            );
            
            setExportStatus({ isExporting: false, message: "Design saved successfully!" });
            
            // Redirect to order details page with the created order ID
            setTimeout(() => {
              if (res.data.data && res.data.data._id) {
                // navigate(`/designOrderDetails/${res.data.data._id}`);
                navigate(`/`);
              } else {
                navigate('/design-orders');
              }
            }, 1500);

            console.log('Response:', res.data);

          } catch (err) {
            console.error("Error sending design inquiry:", err);
            setExportStatus({ isExporting: false, message: "" });
            alert("Failed to send design inquiry: " + (err.response?.data?.message || err.message));
          }
        },
        (error) => {
          console.error('GLTFExporter error:', error);
          setExportStatus({ isExporting: false, message: "" });
          alert('Failed to export 3D model');
        },
        { 
          binary: true,
          embedImages: true,
          truncateDrawRange: true
        }
      );
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus({ isExporting: false, message: "" });
      alert('Failed to export design');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Export Status Indicator */}
      {exportStatus.message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 backdrop-blur-sm ${
          exportStatus.isExporting ? "bg-blue-100 text-blue-800 border border-blue-200" : "bg-green-100 text-green-800 border border-green-200"
        }`}>
          <div className="flex items-center space-x-2">
            {exportStatus.isExporting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800"></div>
            )}
            <span className="font-medium">{exportStatus.message}</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          T-Shirt Design Studio
        </h1>
        <p className="text-gray-600 text-lg">Create your custom t-shirt design with our 3D designer</p>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Panel - Design Tools */}
          <div className="lg:col-span-3 bg-gray-50 p-6 border-r border-gray-200">
            <div className="space-y-6">
              {/* Product Type */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Product Type
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-blue-600 hover:shadow-md">
                    👕 T-shirt
                  </button>
                  <button className="bg-cyan-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-cyan-600 hover:shadow-md">
                    👨 Men
                  </button>
                  <button className="bg-rose-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-rose-600 hover:shadow-md">
                    🎨 ScreenPrint
                  </button>
                  <button className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-green-600 hover:shadow-md">
                    📏 220GSM
                  </button>
                </div>
              </div>

              {/* Design Tools */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Design Tools
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleAddText}
                    className="flex items-center justify-between w-full p-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold">
                        T
                      </div>
                      <span className="font-medium text-gray-700">Add Text</span>
                    </div>
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <span className="text-purple-600 text-lg">+</span>
                    </div>
                  </button>

                  <label className="flex items-center justify-between w-full p-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <img
                          src="https://www.svgrepo.com/show/448213/image-add.svg"
                          alt="Add"
                          className="w-4 h-4 filter invert"
                        />
                      </div>
                      <span className="font-medium text-gray-700">Add Image</span>
                    </div>
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <span className="text-blue-600 text-lg">+</span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {designs.length > 0 && (
                    <button
                      onClick={() => handleRemoveDesign(selectedDesignIndex)}
                      disabled={selectedDesignIndex == null}
                      className="flex items-center justify-between w-full p-3 rounded-lg border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-lg">×</span>
                        </div>
                        <span className="font-medium text-gray-700">Remove Design</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Designs List */}
              {designs.length > 0 && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Your Designs ({designs.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {designs.map((design, index) => (
                      <div
                        key={design.id}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                          selectedDesignIndex === index
                            ? "bg-blue-50 border-2 border-blue-200 shadow-sm"
                            : "bg-gray-50 border-2 border-gray-100 hover:border-gray-200"
                        }`}
                        onClick={() => handleSelectDesign(index)}
                      >
                        {design.type === "image" && design.preview ? (
                          <img
                            src={design.preview}
                            alt="Design preview"
                            className="w-10 h-10 object-cover rounded-lg mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">T</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-800 truncate">
                            {design.type === "image" ? design.fileName : `Text: ${design.text}`}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{design.type}</p>
                        </div>
                        {selectedDesignIndex === index && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Design Controls */}
              {selectedDesign && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Design Settings
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Position Controls */}
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-2 block">Position</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["X", "Y", "Z"].map((axis, i) => (
                          <div key={axis}>
                            <label className="text-xs text-gray-500 block mb-1 text-center">{axis}</label>
                            <input
                              type="number"
                              step="0.05"
                              value={selectedDesign.position[i]}
                              onChange={(e) =>
                                handleDesignPositionChange(selectedDesignIndex, i, e.target.value)
                              }
                              className="w-full p-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rotation Controls */}
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-2 block">
                        Rotation <span className="text-gray-400">(radians)</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["X", "Y", "Z"].map((axis, i) => (
                          <div key={axis}>
                            <label className="text-xs text-gray-500 block mb-1 text-center">{axis}</label>
                            <input
                              type="number"
                              step="0.05"
                              value={selectedDesign.rotation[i]}
                              onChange={(e) =>
                                handleDesignRotationChange(selectedDesignIndex, i, e.target.value)
                              }
                              className="w-full p-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scale control for images */}
                    {selectedDesign.type === "image" && (
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block">Scale</label>
                        <input
                          type="number"
                          step="0.05"
                          value={selectedDesign.scale}
                          onChange={(e) =>
                            handleDesignScaleChange(selectedDesignIndex, e.target.value)
                          }
                          className="w-full p-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                        />
                      </div>
                    )}

                    {/* Text Controls */}
                    {selectedDesign.type === "text" && (
                      <>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-2 block">Text Color</label>
                          <input
                            type="color"
                            value={selectedDesign.color}
                            onChange={(e) =>
                              handleTextColorChange(selectedDesignIndex, e.target.value)
                            }
                            className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-2 block">Text Size</label>
                          <input
                            type="number"
                            step="0.05"
                            value={selectedDesign.fontSize}
                            onChange={(e) =>
                              handleTextSizeChange(selectedDesignIndex, e.target.value)
                            }
                            className="w-full p-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center - 3D Preview */}
          <div className="lg:col-span-6 bg-gradient-to-br from-gray-900 to-gray-800 relative">
            <div className="h-[600px] relative">
              <Scene 
                tshirtColor={tshirtColor} 
                designs={designs} 
                ref={canvasRef}
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/80 text-white px-4 py-2 rounded-full backdrop-blur-sm text-sm">
                  🖱️ Drag to rotate • 🔍 Scroll to zoom • 🖱️ Right-click to pan
                </div>
              </div>
              {selectedDesign && selectedDesign.type === "image" && selectedDesign.preview && (
                <div className="absolute top-4 right-4 bg-white/95 rounded-xl p-3 shadow-lg backdrop-blur-sm">
                  <div className="text-xs font-medium text-gray-600 mb-2">Selected Design</div>
                  <img
                    src={selectedDesign.preview}
                    alt="Selected design"
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Order & Color */}
          <div className="lg:col-span-3 bg-gray-50 p-6 border-l border-gray-200">
            <div className="space-y-6">
              {/* Save & Order Button */}
              <button 
                onClick={handleSaveOrder}
                disabled={exportStatus.isExporting || totalItems === 0 || !customerInfo.name || !customerInfo.email}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {exportStatus.isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Save & Order</span>
                  </>
                )}
              </button>

              {/* Color Picker */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  T-Shirt Color
                </h3>
                <div className="mb-4">
                  <div className="grid grid-cols-5 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`w-10 h-10 rounded-xl border-3 transition-all transform hover:scale-110 ${
                          tshirtColor === color
                            ? "border-gray-800 shadow-lg scale-110"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setTshirtColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 block">Custom Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={tshirtColor}
                      onChange={(e) => setTshirtColor(e.target.value)}
                      className="w-12 h-12 cursor-pointer rounded-lg border border-gray-200"
                    />
                    <input
                      type="text"
                      value={tshirtColor}
                      onChange={(e) => setTshirtColor(e.target.value)}
                      className="flex-1 p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors font-mono text-sm"
                      placeholder="#color"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Order Summary
                </h3>
                
                <div className="space-y-4">
                  {/* Total Items */}
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Total Items</div>
                      <div className="text-2xl font-bold text-gray-800">{totalItems}</div>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">📦</span>
                    </div>
                  </div>

                  {/* Sizes Distribution */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-3">Sizes Distribution</div>
                    <div className="space-y-2">
                      {Object.entries(sizes).map(([size, count]) => (
                        <div key={size} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 w-12">{size}</span>
                          <div className="flex-1 mx-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                style={{ width: `${(count / Math.max(totalItems, 1)) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <input
                            type="number"
                            value={count}
                            min="0"
                            max="100"
                            onChange={(e) => handleSizeChange(size, e.target.value)}
                            className="w-16 p-1 text-center rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Design Summary */}
                  {designs.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-sm font-medium text-gray-700 mb-2">Design Summary</div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-purple-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-purple-600">{designs.length}</div>
                          <div className="text-xs text-purple-500">Total</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-blue-600">
                            {designs.filter(d => d.type === 'text').length}
                          </div>
                          <div className="text-xs text-blue-500">Text</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-green-600">
                            {designs.filter(d => d.type === 'image').length}
                          </div>
                          <div className="text-xs text-green-500">Images</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={customerInfo.name}
                    onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                  />
                  <textarea
                    placeholder="Additional Notes"
                    value={customerInfo.notes}
                    onChange={(e) => handleCustomerInfoChange('notes', e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors resize-none"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto mt-6">
        {/* Export Options */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Export Options</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={handleDownloadGLB}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              <span>📦</span>
              <span>Download GLB</span>
            </button>
            <button 
              onClick={handleDownloadGLTF}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              <span>📄</span>
              <span>Download GLTF</span>
            </button>
            <button 
              onClick={handleDownloadPNG}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              <span>🖼️</span>
              <span>Download PNG</span>
            </button>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-blue-100 text-sm">Total Items</div>
              <div className="text-2xl font-bold">{totalItems} items</div>
            </div>
            <div className="text-right">
              <div className="text-blue-100 text-sm">Total Price</div>
              <div className="text-3xl font-bold">Rs {calculatePrice().toLocaleString()}.00</div>
            </div>
          </div>
          <div className="mt-4 text-center text-blue-100 text-sm">
            * Price includes design, printing, and standard shipping
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignDashboard;