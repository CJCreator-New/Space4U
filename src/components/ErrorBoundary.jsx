import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error for future monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // In production, send to error reporting service
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error, { extra: errorInfo })
    }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  handleGoHome = () => {
    // Clear error state and reset
    this.setState({ hasError: false, error: null, errorInfo: null })
    // Force full page reload to clear any cached errors
    if (typeof window !== 'undefined') {
      window.location.href = '/'
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="text-6xl mb-6">😕</div>
            
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-text-secondary mb-6">
              We're sorry for the inconvenience. The app encountered an unexpected error.
            </p>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                <RefreshCw size={20} />
                Reload App
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-text-primary rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                <Home size={20} />
                Go to Home
              </button>
            </div>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left bg-gray-100 p-4 rounded-xl text-sm">
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details (Development)
                </summary>
                <pre className="whitespace-pre-wrap text-red-600">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <p className="text-xs text-text-secondary mt-4">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary