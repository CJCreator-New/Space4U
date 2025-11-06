import Logo from './Logo'

function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-pulse mb-6">
          <Logo size="xl" showText={false} />
        </div>
        <p className="text-text-secondary animate-pulse">{message}</p>
      </div>
    </div>
  )
}

export default LoadingScreen
