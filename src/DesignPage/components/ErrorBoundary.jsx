import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Canvas Error:', error);
    console.error('Error Info:', errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      const showDetails = this.props.showDetails ?? (process.env.NODE_ENV === 'development');
      
      return (
        <div style={errorBoundaryStyles.container}>
          <div style={errorBoundaryStyles.content}>
            <h3 style={errorBoundaryStyles.title}>⚠️ 3D Visualization Unavailable</h3>
            <p style={errorBoundaryStyles.message}>
              The 3D content could not be loaded due to a graphics context issue.
            </p>
            {showDetails && (
              <details style={errorBoundaryStyles.details}>
                <summary>Error Details</summary>
                <pre style={errorBoundaryStyles.errorText}>
                  {this.state.error?.toString()}
                  {"\n"}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button 
              onClick={this.handleRetry}
              style={errorBoundaryStyles.button}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const errorBoundaryStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px'
  },
  content: {
    textAlign: 'center',
    maxWidth: '400px'
  },
  title: {
    color: '#dc3545',
    marginBottom: '12px',
    fontSize: '18px'
  },
  message: {
    color: '#6c757d',
    marginBottom: '16px',
    lineHeight: '1.5'
  },
  details: {
    marginBottom: '16px',
    textAlign: 'left'
  },
  errorText: {
    fontSize: '12px',
    color: '#dc3545',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '4px',
    overflow: 'auto',
    maxHeight: '150px',
    whiteSpace: 'pre-wrap'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#0056b3'
    }
  }
};

export default ErrorBoundary;