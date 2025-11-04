import { useState, useEffect } from 'react'
import { useSupabaseAuth } from '../../contexts/AuthContext'
import WelcomeScreen from './WelcomeScreen'
import CountryStep from './CountryStep'
import UsernameStep from './UsernameStep'
import AvatarStep from './AvatarStep'
import InterestStep from './InterestStep'
import AgeConfirmationStep from './AgeConfirmationStep'
import { saveUserCountry } from '../../data/countryData'

function OnboardingFlow({ onComplete }) {
  const { user } = useSupabaseAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState({
    country: 'US',
    username: '',
    avatar: '',
    interests: [],
    ageConfirmed: false
  })

  const steps = [
    WelcomeScreen,
    CountryStep,
    UsernameStep,
    AvatarStep,
    InterestStep,
    AgeConfirmationStep
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
      avatar: '',
      interests: ['General Wellness']
    }
    completeOnboarding({ ...userData, ...defaultData })
  }

  const completeOnboarding = (finalData) => {
    if (!user) return
    
    saveUserCountry(finalData.country || 'US')
    localStorage.setItem(`space4u_user_${user.id}`, JSON.stringify(finalData))
    localStorage.setItem(`space4u_onboarding_complete_${user.id}`, 'true')
    onComplete()
  }

  const CurrentStepComponent = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-3xl shadow-2xl overflow-hidden">
        <CurrentStepComponent
          data={userData}
          onNext={handleNext}
          onBack={currentStep > 0 ? handleBack : null}
          onSkip={currentStep > 0 && currentStep < 4 ? handleSkip : null}
          step={currentStep}
          totalSteps={steps.length - 1}
        />
      </div>
    </div>
  )
}

export default OnboardingFlow
