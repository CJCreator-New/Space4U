import { useState } from 'react'
import { X, ArrowRight, ArrowLeft, Check } from '../config/icons'

function OnboardingTour({ onComplete }) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: 'Welcome to Space4U! ðŸ‘‹',
      description: 'Your personal mental health companion. Let\'s take a quick tour of the key features.',
      image: 'ðŸ '
    },
    {
      title: 'Track Your Mood Daily ðŸ˜Š',
      description: 'Log how you\'re feeling each day with our simple 5-point scale. Add notes to remember what influenced your mood.',
      image: 'ðŸ“Š'
    },
    {
      title: 'Discover Insights ðŸ“ˆ',
      description: 'Get AI-powered insights about your mood patterns, best days, and personalized recommendations.',
      image: 'ðŸ§ '
    },
    {
      title: 'Join Support Circles ðŸ’¬',
      description: 'Connect with others who understand. Share experiences and find support in topic-based communities.',
      image: 'ðŸ‘¥'
    },
    {
      title: 'Access Resources ðŸ“š',
      description: 'Explore breathing exercises, articles, crisis resources, and wellness tools whenever you need them.',
      image: 'ðŸ› ï¸'
    },
    {
      title: 'Your Data is Private ðŸ”’',
      description: 'Everything stays on your device. Export your data anytime. We never see your personal information.',
      image: 'ðŸ›¡ï¸'
    }
  ]

  const currentStep = steps[step]
  const isLastStep = step === steps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem('space4u_tour_completed', 'true')
      onComplete()
    } else {
      setStep(step + 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('space4u_tour_completed', 'true')
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={24} />
        </button>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === step ? 'w-8 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{currentStep.image}</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 font-secondary">
            {currentStep.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLastStep ? (
              <>
                <Check size={18} />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Skip Button */}
        {!isLastStep && (
          <button
            onClick={handleSkip}
            className="w-full mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Skip tour
          </button>
        )}
      </div>
    </div>
  )
}

export default OnboardingTour

