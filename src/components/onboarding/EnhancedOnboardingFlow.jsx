import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabaseAuth } from '../../contexts/AuthContext'
import EnhancedWelcomeScreen from './EnhancedWelcomeScreen'
import EnhancedCountryStep from './EnhancedCountryStep'
import EnhancedUsernameStep from './EnhancedUsernameStep'
import EnhancedAvatarStep from './EnhancedAvatarStep'
import EnhancedInterestStep from './EnhancedInterestStep'
import EnhancedAgeConfirmationStep from './EnhancedAgeConfirmationStep'
import OnboardingComplete from './OnboardingComplete'
import { saveUserCountry } from '../../data/countryData'

function EnhancedOnboardingFlow({ onComplete }) {
  const { user } = useSupabaseAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [showCompletion, setShowCompletion] = useState(false)
  const [userData, setUserData] = useState({
    country: 'US',
    username: '',
    avatar: '',
    interests: [],
    ageConfirmed: false
  })

  const steps = [
    EnhancedWelcomeScreen,
    EnhancedCountryStep,
    EnhancedUsernameStep,
    EnhancedAvatarStep,
    EnhancedInterestStep,
    EnhancedAgeConfirmationStep
  ]

  const handleNext = (data) => {
    setUserData(prev => ({ ...prev, ...data }))
    if (currentStep === steps.length - 1) {
      completeOnboarding({ ...userData, ...data })
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSkip = () => {
    const defaultData = {
      username: `user_${Date.now()}`,
      avatar: 'ðŸ»',
      interests: ['General Wellness']
    }
    completeOnboarding({ ...userData, ...defaultData })
  }

  const completeOnboarding = (finalData) => {
    if (!user) return
    
    saveUserCountry(finalData.country || 'US')
    localStorage.setItem(`space4u_user_${user.id}`, JSON.stringify(finalData))
    localStorage.setItem(`space4u_onboarding_complete_${user.id}`, 'true')
    setShowCompletion(true)
  }

  const handleFinishOnboarding = () => {
    onComplete()
  }

  if (showCompletion) {
    return <OnboardingComplete userData={userData} onFinish={handleFinishOnboarding} />
  }

  const CurrentStepComponent = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
            <CurrentStepComponent
              data={userData}
              onNext={handleNext}
              onBack={currentStep > 0 ? handleBack : null}
              onSkip={currentStep > 0 && currentStep < 4 ? handleSkip : null}
              step={currentStep}
              totalSteps={steps.length - 1}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default EnhancedOnboardingFlow

