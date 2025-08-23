// WebGLChecker.js (no changes needed)
import { useEffect, useState } from 'react';

const WebGLChecker = ({ children, fallback }) => {
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
          setWebGLAvailable(false);
          return;
        }
        setWebGLAvailable(true);
      } catch (error) {
        console.warn('WebGL check failed:', error);
        setWebGLAvailable(false);
      }
    };

    checkWebGLSupport();
  }, []);

  if (!webGLAvailable) {
    return fallback || (
      <div style={webglCheckerStyles.container}>
        <div style={webglCheckerStyles.content}>
          <h3>WebGL Not Supported</h3>
          <p>Your browser or device does not support WebGL, which is required for 3D visualization.</p>
          <ul style={webglCheckerStyles.list}>
            <li>Update your browser to the latest version</li>
            <li>Enable WebGL in your browser settings</li>
            <li>Check if your graphics drivers are up to date</li>
          </ul>
        </div>
      </div>
    );
  }

  return children;
};

const webglCheckerStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    padding: '20px'
  },
  content: {
    textAlign: 'center',
    maxWidth: '400px'
  },
  list: {
    textAlign: 'left',
    margin: '15px 0',
    paddingLeft: '20px'
  }
};

export default WebGLChecker;