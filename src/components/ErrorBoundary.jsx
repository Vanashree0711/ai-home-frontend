import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A192F',
          color: 'white',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          padding: '40px'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Something went wrong</h2>
          <p style={{ color: '#aaa', marginBottom: '24px' }}>The page encountered an error. Please reload to try again.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#D4AF37',
              color: '#0A192F',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
