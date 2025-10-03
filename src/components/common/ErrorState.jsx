function ErrorState({ type, title, description, onRetry, onReport, className = "" }) {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="text-6xl mb-4">
        {type === 'network' && '📡'}
        {type === 'generic' && '😕'}
        {type === 'unavailable' && '🔒'}
        {type === 'payment' && '💳'}
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-6 max-w-md mx-auto">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        )}
        {onReport && (
          <button
            onClick={onReport}
            className="px-6 py-3 border border-gray-200 text-text-primary rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Report Issue
          </button>
        )}
      </div>
    </div>
  )
}

export const ErrorStates = {
  Network: (props) => (
    <ErrorState
      type="network"
      title="Connection Lost"
      description="Check your internet connection and try again"
      {...props}
    />
  ),
  
  Generic: (props) => (
    <ErrorState
      type="generic"
      title="Oops! Something Went Wrong"
      description="We're working on fixing this. Please try again in a moment."
      {...props}
    />
  ),
  
  FeatureUnavailable: (props) => (
    <ErrorState
      type="unavailable"
      title="Coming Soon"
      description="This feature is currently in development and will be available soon"
      {...props}
    />
  ),
  
  PaymentFailed: (props) => (
    <ErrorState
      type="payment"
      title="Payment Unsuccessful"
      description="Your payment could not be processed. Please check your payment details and try again."
      {...props}
    />
  )
}

export default ErrorState