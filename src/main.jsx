import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Import custom styles
import './index.css'

console.log('Main.jsx loading...');

// Add error boundary for debugging
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = (error) => {
      console.error('React Error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-danger text-white">
        <div className="text-center">
          <h1>🚨 Application Error</h1>
          <p>Something went wrong. Check the console for details.</p>
          <button className="btn btn-light" onClick={() => setHasError(false)}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

console.log('React app rendered');
