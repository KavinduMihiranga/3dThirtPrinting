import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import ErrorBoundary from './ErrorBoundary';
import WebGLChecker from './WebGLChecker';
import Loader from './Loader';
import TshirtModel from './TshirtModel';

const Scene = ({ tshirtColor, designTexture }) => {
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
    <WebGLChecker
      fallback={
        <div style={sceneStyles.fallback}>
          <h3>3D Content Not Available</h3>
          <p>WebGL is required to display this content.</p>
        </div>
      }
    >
      <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
        <Canvas
          ref={canvasRef}
          style={sceneStyles.canvas}
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
          
          <Suspense fallback={<Loader />}>
            <TshirtModel color={tshirtColor} texture={designTexture} />
          </Suspense>
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={10}
          />
          
        </Canvas>
      </ErrorBoundary>
    </WebGLChecker>
  );
};

const sceneStyles = {
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block'
  },
  fallback: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center'
  }
};

export default Scene;