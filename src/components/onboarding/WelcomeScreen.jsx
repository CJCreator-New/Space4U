import Logo from '../Logo'

function WelcomeScreen({ onNext }) {
  return (
    <div className="p-8 text-center min-h-[600px] flex flex-col justify-center">
      <div className="mb-8 flex flex-col items-center">
        <Logo size="lg" showText={false} />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mt-6 mb-4">Space4U</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Your mind matters.<br />Your story is safe.
        </p>
      </div>
      
      <div className="flex-1 flex items-center justify-center mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-primary-light/20 to-secondary/20 rounded-full flex items-center justify-center">
          <span className="text-6xl">🌟</span>
        </div>
      </div>
      
      <button
        onClick={() => onNext({})}
        className="w-full bg-primary text-white py-4 rounded-2xl font-semibold text-lg hover:bg-primary/90 transition-colors"
      >
        Get Started
      </button>
    </div>
  )
}

export default WelcomeScreen
