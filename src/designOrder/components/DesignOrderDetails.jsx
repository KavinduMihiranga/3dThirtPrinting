import React, { useEffect, useState, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  AlertCircle, 
  Mail, 
  Phone, 
  Package, 
  User, 
  Calendar, 
  FileText,
  Palette,
  Ruler,
  Image as ImageIcon,
  Type,
  Download
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

function ModelViewer({ designFile }) {
  const [modelUrl, setModelUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!designFile) {
      setError('No design file provided');
      return;
    }

    if (typeof designFile === 'string' && designFile.startsWith('/uploads')) {
      setModelUrl(`http://localhost:5000${designFile}`);
      return;
    }

    if (typeof designFile === 'string' && (designFile.startsWith('http://') || designFile.startsWith('https://'))) {
      setModelUrl(designFile);
      return;
    }

    // Handle base64 encoded files
    if (typeof designFile === 'string' && designFile.startsWith('data:model/gltf-binary;base64,')) {
      try {
        const base64Data = designFile.split(',')[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: 'model/gltf-binary' });
        const blobUrl = URL.createObjectURL(blob);
        setModelUrl(blobUrl);

        return () => URL.revokeObjectURL(blobUrl);
      } catch (err) {
        console.error('Failed to convert base64 to blob:', err);
        setError('Failed to process 3D model data');
      }
      return;
    }

    if (typeof designFile === 'object') {
      const path = designFile.url || designFile.path || designFile.location || designFile.filename;
      if (path) {
        setModelUrl(path.startsWith('http') ? path : `http://localhost:5000${path}`);
        return;
      }
    }

    setError('Invalid model file format');
  }, [designFile]);

  const isValidModelUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url.match(/\.(gltf|glb)$/i) || url.includes('/uploads/designs/');
    }
    
    return url.match(/\.(gltf|glb)$/i);
  };

  if (error) {
    return (
      <div className="h-96 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <AlertCircle className="mx-auto mb-3 text-red-500" size={48} />
          <p className="text-gray-700 font-medium">Failed to Load 3D Model</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!modelUrl) {
    return (
      <div className="h-96 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 3D Model...</p>
        </div>
      </div>
    );
  }

  if (!isValidModelUrl(modelUrl)) {
    return (
      <div className="h-96 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <AlertCircle className="mx-auto mb-3 text-yellow-500" size={48} />
          <p className="text-gray-700 font-medium">3D Model Not Available</p>
          <p className="text-sm text-gray-500 mt-2">
            The design file format is not supported or not uploaded
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 border-2 border-gray-200 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      <Canvas
        camera={{ position: [0, 1, 3], fov: 50 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#f8fafc');
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 2, -3]} intensity={0.3} />
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={10}
        />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function DesignOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/design-inquiry/${id}`);
        console.log("Order data:", res.data.data);
        setOrder(res.data.data);
        setPriceInput(res.data.data.price || "");
        setError(null);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError(error.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/design-inquiry/${id}`, {
        ...order,
        status: newStatus,
      });
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please check if the update endpoint is available.");
    }
  };

  const handlePriceUpdate = async () => {
    try {
      const numericPrice = parseFloat(priceInput);
      if (isNaN(numericPrice) || numericPrice < 0) {
        alert("Please enter a valid price");
        return;
      }

      await axios.put(`http://localhost:5000/api/design-inquiry/${id}`, {
        ...order,
        price: numericPrice,
      });
      
      setOrder({ ...order, price: numericPrice });
      setEditingPrice(false);
      alert("Price updated successfully!");
    } catch (err) {
      console.error("Error updating price:", err);
      alert("Failed to update price. Please try again.");
    }
  };

  // Parse design data from the order
  const parseDesignData = () => {
    try {
      if (order?.designData && typeof order.designData === 'string') {
        return JSON.parse(order.designData);
      }
      return order?.designData || {};
    } catch (error) {
      console.error('Error parsing design data:', error);
      return {};
    }
  };

  const designData = parseDesignData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 mb-6 text-gray-600 hover:text-gray-800 transition-colors bg-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={20} />
            <span>Back to Orders</span>
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Order</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center py-12">
            <p className="text-gray-600 text-lg">Order not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors bg-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={20} />
            <span>Back to Orders</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Order ID</div>
              <div className="font-mono text-sm text-gray-700">{order._id}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Order Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{order.customerName}</h1>
                <p className="text-blue-100 text-lg">{order.description || "Custom T-Shirt Design"}</p>
                
                {/* Price Editor */}
                <div className="flex items-center space-x-4 mt-4">
                  {!editingPrice ? (
                    <>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <div className="text-blue-100 text-sm">Total Price</div>
                        <div className="text-2xl font-bold">
                          LKR {order.price ? order.price.toLocaleString() : "Not set"}
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingPrice(true)}
                        className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Edit Price
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <span className="text-blue-100 font-medium">Price: LKR</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        className="px-3 py-1 rounded border border-blue-300 text-gray-800 w-32 focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                      <button
                        onClick={handlePriceUpdate}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingPrice(false);
                          setPriceInput(order.price || "");
                        }}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status Dropdown */}
              <div className="flex flex-col items-start lg:items-end space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-100 font-medium">Status:</span>
                  <select
                    value={order.status || "pending"}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
                  >
                    <option value="pending" className="text-gray-800">Pending</option>
                    <option value="in-progress" className="text-gray-800">In Progress</option>
                    <option value="completed" className="text-gray-800">Completed</option>
                    <option value="cancelled" className="text-gray-800">Cancelled</option>
                  </select>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                  order.status === 'completed' ? 'bg-green-500 text-white' :
                  order.status === 'in-progress' ? 'bg-blue-500 text-white' :
                  order.status === 'cancelled' ? 'bg-red-500 text-white' :
                  'bg-yellow-500 text-white'
                }`}>
                  {order.status || 'pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Order Details */}
              <div className="xl:col-span-1 space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="mr-3 text-blue-500" size={24} />
                    Customer Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <User size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">Full Name</div>
                        <div className="font-medium text-gray-800">{order.customerName}</div>
                      </div>
                    </div>
                    
                    {order.email && (
                      <div className="flex items-start space-x-3">
                        <Mail size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-500">Email</div>
                          <div className="font-medium text-gray-800">{order.email}</div>
                        </div>
                      </div>
                    )}
                    
                    {order.phone && (
                      <div className="flex items-start space-x-3">
                        <Phone size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-500">Phone</div>
                          <div className="font-medium text-gray-800">{order.phone}</div>
                        </div>
                      </div>
                    )}
                    
                    {order.notes && (
                      <div className="flex items-start space-x-3">
                        <FileText size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-500">Notes</div>
                          <div className="font-medium text-gray-800 text-sm">{order.notes}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Specifications */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="mr-3 text-green-500" size={24} />
                    Order Specifications
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Total Items */}
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Package size={20} className="text-green-500" />
                        <div>
                          <div className="text-sm text-gray-500">Total Items</div>
                          <div className="font-medium text-gray-800">
                            {designData.totalItems || order.totalItems || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* T-Shirt Color */}
                    {designData.tshirtColor && (
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <Palette size={20} className="text-purple-500" />
                          <div>
                            <div className="text-sm text-gray-500">T-Shirt Color</div>
                            <div className="font-medium text-gray-800">{designData.tshirtColor}</div>
                          </div>
                        </div>
                        <div 
                          className="w-8 h-8 rounded-lg border border-gray-300 shadow-sm"
                          style={{ backgroundColor: designData.tshirtColor }}
                        ></div>
                      </div>
                    )}

                    {/* Sizes Distribution */}
                    {designData.sizes && (
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Ruler size={20} className="text-blue-500" />
                          <div className="text-sm font-medium text-gray-700">Sizes Distribution</div>
                        </div>
                        <div className="space-y-2">
                          {Object.entries(designData.sizes).map(([size, count]) => (
                            count > 0 && (
                              <div key={size} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 font-medium">{size}</span>
                                <div className="flex items-center space-x-3">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                      style={{ width: `${(count / (designData.totalItems || 1)) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="font-bold text-gray-800 w-8 text-right">{count}</span>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Design Elements */}
                {designData.designs && designData.designs.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FileText className="mr-3 text-orange-500" size={24} />
                      Design Elements
                    </h2>
                    
                    <div className="space-y-3">
                      {designData.designs.map((design, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center space-x-3 mb-2">
                            {design.type === 'text' ? (
                              <Type size={16} className="text-blue-500" />
                            ) : (
                              <ImageIcon size={16} className="text-green-500" />
                            )}
                            <span className="font-medium text-gray-800 capitalize">
                              {design.type} {index + 1}
                            </span>
                          </div>
                          
                          {design.type === 'text' && (
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Text:</span>
                                <span className="font-medium">{design.text}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Color:</span>
                                <div className="flex items-center space-x-2">
                                  <div 
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: design.color }}
                                  ></div>
                                  <span className="font-mono text-xs">{design.color}</span>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Size:</span>
                                <span className="font-medium">{design.fontSize}</span>
                              </div>
                            </div>
                          )}
                          
                          {design.type === 'image' && (
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">File:</span>
                                <span className="font-medium truncate ml-2">{design.fileName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Scale:</span>
                                <span className="font-medium">{design.scale}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Design Preview */}
              <div className="xl:col-span-2 space-y-6">
                {/* Design Preview Image */}
                {order.designPreview && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <ImageIcon className="mr-3 text-purple-500" size={24} />
                      Design Preview
                    </h2>
                    <div className="flex justify-center">
                      <img
                        src={order.designPreview}
                        alt="Design preview"
                        className="max-w-full h-auto max-h-96 rounded-xl shadow-lg border border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {/* 3D Model Viewer */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Download className="mr-3 text-blue-500" size={24} />
                    3D Model Viewer
                  </h2>
                  <ModelViewer designFile={order.designFile} />
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    🖱️ Drag to rotate • 🔍 Scroll to zoom • 🖱️ Right-click to pan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Metadata */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-500">
              <div className="flex items-center space-x-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <div className="font-medium text-gray-600">Order Created</div>
                  <div>{new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <div className="font-medium text-gray-600">Last Updated</div>
                  <div>{new Date(order.updatedAt || order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignOrderDetails;