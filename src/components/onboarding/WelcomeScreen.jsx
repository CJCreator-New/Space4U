function WelcomeScreen({ onNext }) {
  return (
    <div className="p-8 text-center min-h-[600px] flex flex-col justify-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-white font-bold">S</span>
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">Safespace</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Your mind matters.<br />Your story is safe.
        </p>
      </div>
      
      <div className="flex-1 flex items-center justify-center mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-primary-light/20 to-secondary/20 rounded-full flex items-center justify-center">
          <span className="text-6xl">🌱</span>
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