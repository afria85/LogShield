// src/components/ErrorBoundary.jsx
import { Component } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Track error dengan analytics jika tersedia
    if (window.plausible) {
      window.plausible('error', {
        props: {
          component: this.props.componentName || 'unknown',
          message: error.message.substring(0, 100)
        }
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    
    // Coba reload halaman
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl border border-red-200 shadow-lg p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Something went wrong
              </h1>
              
              <p className="text-gray-600 text-center mb-6">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={this.handleReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Application
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Go to Homepage
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Error details have been logged. If this persists, please contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;