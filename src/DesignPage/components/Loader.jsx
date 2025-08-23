const Loader = () => {
  return (
    <div style={loaderStyles.container}>
      <div style={loaderStyles.spinner}></div>
      <p style={loaderStyles.text}>Loading 3D content...</p>
    </div>
  );
};

const loaderStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  text: {
    marginTop: '16px',
    color: '#666',
    fontSize: '14px'
  }
};

// Add this to your global CSS
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default Loader;